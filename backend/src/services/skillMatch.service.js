// Predefined skill list — extend as needed
const SKILL_LIST = [
  'javascript', 'typescript', 'react', 'vue', 'angular', 'html', 'css', 'sass',
  'node.js', 'express', 'nestjs', 'python', 'django', 'flask', 'fastapi',
  'java', 'spring', 'kotlin', 'c++', 'c#', '.net', 'go', 'rust', 'php', 'laravel',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd',
  'git', 'linux', 'rest api', 'graphql', 'microservices',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'react native', 'flutter', 'swift', 'android',
];

/**
 * Normalize text for comparison.
 */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9.#+]/g, ' ').trim();
}

/**
 * Extract skills from resume text by matching against the predefined skill list.
 * Also merges any HF-extracted skills that appear in the skill list.
 */
function extractSkillsFromText(resumeText, hfSkills = []) {
  const normalizedText = normalize(resumeText);
  const hfNormalized = hfSkills.map(normalize);

  const found = SKILL_LIST.filter((skill) => {
    const normalizedSkill = normalize(skill);
    return normalizedText.includes(normalizedSkill) || hfNormalized.some((h) => h.includes(normalizedSkill));
  });

  return [...new Set(found)];
}

/**
 * Extract required skills from a job role / job description string.
 */
function extractRequiredSkills(jobRole) {
  const normalizedJob = normalize(jobRole);
  return SKILL_LIST.filter((skill) => normalizedJob.includes(normalize(skill)));
}

/**
 * Calculate match score and identify missing skills.
 */
function calculateMatchScore(resumeSkills, jobRole) {
  const required = extractRequiredSkills(jobRole);

  // If no skills detected in job description, fall back to all skills found in resume
  if (required.length === 0) {
    return {
      score: resumeSkills.length > 0 ? 50 : 0,
      matched_skills: resumeSkills,
      missing_skills: [],
      required_skills: [],
    };
  }

  const matched = required.filter((skill) => resumeSkills.includes(skill));
  const missing = required.filter((skill) => !resumeSkills.includes(skill));
  const score = Math.round((matched.length / required.length) * 100);

  return { score, matched_skills: matched, missing_skills: missing, required_skills: required };
}

module.exports = { extractSkillsFromText, calculateMatchScore, SKILL_LIST };
