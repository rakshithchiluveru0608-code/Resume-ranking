const express = require('express');
const multer = require('multer');
const { analyzeResume, rankResumes, getResumes, getResumeById } = require('../controllers/resume.controller');

const router = express.Router();

// Store files in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf' ||
                  file.mimetype === 'application/octet-stream' ||
                  file.originalname.toLowerCase().endsWith('.pdf');
    if (isPDF) cb(null, true);
    else cb(new Error('Only PDF files are accepted.'));
  },
});

// Single resume analysis
router.post('/analyze', upload.single('resume'), analyzeResume);

// Multi-resume ranking (bonus)
router.post('/rank', upload.array('resumes', 20), rankResumes);

// Retrieve stored resumes
router.get('/resumes', getResumes);
router.get('/resumes/:id', getResumeById);

module.exports = router;
