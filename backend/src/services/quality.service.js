const SECTION_KEYWORDS = {
  skills: ['skills', 'technical skills', 'core competencies'],
  education: ['education', 'academic', 'degree', 'university', 'college'],
  experience: ['experience', 'work history', 'employment', 'professional experience'],
  projects: ['projects', 'personal projects', 'portfolio'],
  summary: ['summary', 'objective', 'profile', 'about me'],
};

/**
 * Analyze resume text quality and return a score out of 10 with suggestions.
 */
function analyzeResumeQuality(text) {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  let score = 0;
  const suggestions = [];

  // 1. Section presence (up to 5 points)
  const foundSections = [];
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      foundSections.push(section);
      score += 1;
    } else {
      suggestions.push(`Add a "${section}" section to improve resume structure.`);
    }
  }

  // 2. Resume length (up to 2 points)
  if (wordCount >= 300 && wordCount <= 800) {
    score += 2;
  } else if (wordCount >= 150) {
    score += 1;
    if (wordCount < 300) suggestions.push('Resume seems short. Aim for 300–800 words for best results.');
    if (wordCount > 800) suggestions.push('Resume is quite long. Consider trimming to under 800 words.');
  } else {
    suggestions.push('Resume is too short. Add more detail about your experience and skills.');
  }

  // 3. Keyword density (up to 2 points)
  const techKeywords = ['developed', 'built', 'designed', 'implemented', 'managed', 'led', 'created', 'optimized'];
  const keywordHits = techKeywords.filter((kw) => lower.includes(kw)).length;
  if (keywordHits >= 4) {
    score += 2;
  } else if (keywordHits >= 2) {
    score += 1;
    suggestions.push('Use more action verbs (e.g., "developed", "implemented", "optimized") to strengthen impact.');
  } else {
    suggestions.push('Add strong action verbs to describe your accomplishments.');
  }

  // 4. Contact info hint (1 point)
  const hasContact = /@/.test(text) || /\d{10}/.test(text.replace(/\s/g, ''));
  if (hasContact) {
    score += 1;
  } else {
    suggestions.push('Ensure your contact information (email/phone) is clearly visible.');
  }

  return {
    resume_quality_score: Math.min(score, 10),
    suggestions: suggestions.length ? suggestions : ['Resume looks well-structured. Keep it up!'],
    word_count: wordCount,
    sections_found: foundSections,
  };
}

module.exports = { analyzeResumeQuality };
