const { extractTextFromPDF } = require('../services/pdf.service');
const { extractSkillsFromText: hfExtractSkills, classifyResumeCategories } = require('../services/huggingface.service');
const { extractSkillsFromText, calculateMatchScore } = require('../services/skillMatch.service');
const { analyzeResumeQuality } = require('../services/quality.service');
const Resume = require('../models/resume.model');
const logger = require('../utils/logger');

/**
 * POST /api/analyze
 * Accepts a PDF file + jobRole, returns full analysis.
 */
async function analyzeResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded.' });
    const jobRole = req.body.jobRole?.trim();
    if (!jobRole) return res.status(400).json({ error: 'jobRole is required.' });

    // 1. Extract text from PDF
    let resumeText;
    try {
      resumeText = await extractTextFromPDF(req.file.buffer);
    } catch (extractErr) {
      logger.error('PDF extraction failed', { error: extractErr.message, filename: req.file.originalname });
      return res.status(422).json({ error: extractErr.message });
    }
    if (!resumeText || resumeText.length < 20) {
      return res.status(422).json({ error: 'Could not extract text from PDF. Please ensure it is a text-based PDF, not a scanned image.' });
    }

    // 2. HF: extract skills + classify (run in parallel)
    const [hfSkills, categories] = await Promise.all([
      hfExtractSkills(resumeText),
      classifyResumeCategories(resumeText),
    ]);

    // 3. Skill matching
    const resumeSkills = extractSkillsFromText(resumeText, hfSkills);
    const { score, matched_skills, missing_skills } = calculateMatchScore(resumeSkills, jobRole);

    // 4. Quality analysis
    const { resume_quality_score, suggestions, word_count, sections_found } = analyzeResumeQuality(resumeText);

    // 5. Persist to MongoDB (best-effort — non-fatal if DB is down)
    let savedId = `local_${Date.now()}`;
    try {
      const saved = await Resume.create({
        resume_text: resumeText,
        extracted_skills: resumeSkills,
        job_role: jobRole,
        score,
        matched_skills,
        missing_skills,
        resume_quality_score,
        suggestions,
        filename: req.file.originalname,
      });
      savedId = saved._id;
      logger.info('Resume saved to DB', { id: savedId });
    } catch (dbErr) {
      logger.warn('DB save skipped', { error: dbErr.message });
    }

    logger.info('Resume analyzed', { score, job_role: jobRole });

    return res.json({
      id: savedId,
      score,
      matched_skills,
      missing_skills,
      extracted_skills: resumeSkills,
      categories,
      resume_quality_score,
      suggestions,
      word_count,
      sections_found,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/rank
 * Accepts multiple PDFs + jobRole, returns ranked list.
 */
async function rankResumes(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded.' });
    }
    const jobRole = req.body.jobRole?.trim();
    if (!jobRole) return res.status(400).json({ error: 'jobRole is required.' });

    const results = await Promise.all(
      req.files.map(async (file, idx) => {
        const resumeText = await extractTextFromPDF(file.buffer).catch((e) => {
          logger.warn(`Skipping ${file.originalname}: ${e.message}`);
          return null;
        });
        if (!resumeText || resumeText.length < 20) {
          return {
            id: `local_${Date.now()}_${idx}`,
            filename: file.originalname,
            score: 0,
            matched_skills: [],
            missing_skills: [],
            resume_quality_score: 0,
            suggestions: ['Could not extract text from this PDF. Ensure it is text-based, not scanned.'],
            error: 'PDF extraction failed',
          };
        }
        const [hfSkills] = await Promise.all([hfExtractSkills(resumeText)]);
        const resumeSkills = extractSkillsFromText(resumeText, hfSkills);
        const { score, matched_skills, missing_skills } = calculateMatchScore(resumeSkills, jobRole);
        const { resume_quality_score, suggestions } = analyzeResumeQuality(resumeText);

        // best-effort DB save
        let savedId = `local_${Date.now()}_${idx}`;
        try {
          const saved = await Resume.create({
            resume_text: resumeText,
            extracted_skills: resumeSkills,
            job_role: jobRole,
            score,
            matched_skills,
            missing_skills,
            resume_quality_score,
            suggestions,
            filename: file.originalname,
          });
          savedId = saved._id;
        } catch (dbErr) {
          logger.warn('DB save skipped for file', { file: file.originalname, error: dbErr.message });
        }

        return {
          id: savedId,
          filename: file.originalname,
          score,
          matched_skills,
          missing_skills,
          resume_quality_score,
          suggestions,
        };
      })
    );

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    return res.json({ job_role: jobRole, rankings: results });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/resumes
 * Returns all stored resumes (latest first).
 */
async function getResumes(req, res, next) {
  try {
    const resumes = await Resume.find({}, '-resume_text').sort({ created_at: -1 }).limit(50);
    return res.json(resumes);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/resumes/:id
 * Returns a single resume by ID.
 */
async function getResumeById(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });
    return res.json(resume);
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume, rankResumes, getResumes, getResumeById };
