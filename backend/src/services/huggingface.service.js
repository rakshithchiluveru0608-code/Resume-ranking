const axios = require('axios');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

// New HF router endpoint (replaces deprecated api-inference.huggingface.co)
const HF_ROUTER_BASE = 'https://router.huggingface.co/hf-inference/models';
const NER_MODEL = 'dslim/bert-base-NER';
const CLASSIFICATION_MODEL = 'facebook/bart-large-mnli';

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * POST to a HF router model with retry on 503 (model loading).
 */
async function callHFModel(model, payload, retries = 3) {
  const url = `${HF_ROUTER_BASE}/${model}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(url, payload, {
        headers: getHeaders(),
        timeout: 30000,
      });
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 503 && attempt < retries) {
        logger.warn(`HF model loading (503), retry ${attempt}/${retries} for ${model}`);
        await new Promise((r) => setTimeout(r, 5000 * attempt));
        continue;
      }
      throw new Error(
        `Hugging Face API error [${model}] (${status}): ${err.response?.data?.error || err.message}`
      );
    }
  }
}

/**
 * Extract named entities from resume text using NER.
 * Returns an array of skill-like strings (MISC entities with high confidence).
 */
async function extractSkillsFromText(text) {
  const cacheKey = `ner_${Buffer.from(text.slice(0, 200)).toString('base64')}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.info('NER result served from cache');
    return cached;
  }

  // Truncate to stay within token limits
  const truncated = text.slice(0, 1500);

  try {
    const result = await callHFModel(NER_MODEL, { inputs: truncated });
    const entities = Array.isArray(result) ? result : [];

    const skills = [
      ...new Set(
        entities
          .filter((e) => e.score > 0.6)
          .map((e) => e.word.replace(/^##/, '').trim())
          .filter((w) => w.length > 1)
      ),
    ];

    cache.set(cacheKey, skills);
    logger.info(`NER extracted ${skills.length} entities`);
    return skills;
  } catch (err) {
    logger.error('Skill extraction (NER) failed, continuing without HF skills', { error: err.message });
    return [];
  }
}

/**
 * Classify resume text into tech categories using zero-shot classification.
 * Returns top 3 category labels.
 */
async function classifyResumeCategories(text) {
  const cacheKey = `classify_${Buffer.from(text.slice(0, 200)).toString('base64')}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.info('Classification result served from cache');
    return cached;
  }

  const truncated = text.slice(0, 1000);
  const labels = [
    'frontend development',
    'backend development',
    'database',
    'devops',
    'machine learning',
    'mobile development',
  ];

  try {
    const result = await callHFModel(CLASSIFICATION_MODEL, {
      inputs: truncated,
      parameters: { candidate_labels: labels },
    });

    // result is an array of {label, score} objects sorted by score desc
    const categories = Array.isArray(result)
      ? result.slice(0, 3).map((r) => r.label)
      : (result.labels || []).slice(0, 3);

    cache.set(cacheKey, categories);
    logger.info(`Classification top categories: ${categories.join(', ')}`);
    return categories;
  } catch (err) {
    logger.error('Classification failed, continuing without categories', { error: err.message });
    return [];
  }
}

module.exports = { extractSkillsFromText, classifyResumeCategories };
