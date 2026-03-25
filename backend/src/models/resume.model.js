const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  resume_text: { type: String, required: true },
  extracted_skills: { type: [String], default: [] },
  job_role: { type: String, required: true },
  score: { type: Number, default: 0 },
  missing_skills: { type: [String], default: [] },
  matched_skills: { type: [String], default: [] },
  resume_quality_score: { type: Number, default: 0 },
  suggestions: { type: [String], default: [] },
  filename: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);
