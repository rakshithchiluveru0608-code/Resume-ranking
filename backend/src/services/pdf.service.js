const pdfParse = require('pdf-parse');
const PDFParser = require('pdf2json');
const logger = require('../utils/logger');

/**
 * Extracts plain text from a PDF buffer.
 * Tries pdf-parse first, falls back to pdf2json.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function extractTextFromPDF(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Invalid or empty file buffer received.');
  }

  // Validate PDF magic bytes
  const header = buffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    throw new Error('Uploaded file is not a valid PDF (missing %PDF header).');
  }

  logger.info(`Parsing PDF buffer: ${buffer.length} bytes`);

  // --- Primary: pdf-parse ---
  try {
    const data = await pdfParse(buffer, { max: 0 });
    const text = data.text?.trim() || '';
    if (text.length > 10) {
      logger.info(`pdf-parse extracted ${text.length} chars`);
      return text;
    }
    logger.warn('pdf-parse returned empty text, trying fallback');
  } catch (err) {
    logger.warn('pdf-parse failed, trying fallback', { error: err.message });
  }

  // --- Fallback: pdf2json ---
  return extractWithPdf2json(buffer);
}

function extractWithPdf2json(buffer) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);

    const timeout = setTimeout(() => {
      reject(new Error('PDF parsing timed out after 15s'));
    }, 15000);

    parser.on('pdfParser_dataReady', () => {
      clearTimeout(timeout);
      try {
        const raw = parser.getRawTextContent();
        const text = raw
          .replace(/----------------Page \(\d+\) Break----------------/g, '\n')
          .replace(/\r\n/g, '\n')
          .trim();
        logger.info(`pdf2json extracted ${text.length} chars`);
        if (text.length === 0) {
          reject(new Error('PDF appears to contain no extractable text (may be image-based or scanned).'));
        } else {
          resolve(text);
        }
      } catch (e) {
        reject(new Error('Failed to read parsed PDF text: ' + e.message));
      }
    });

    parser.on('pdfParser_dataError', (err) => {
      clearTimeout(timeout);
      logger.error('pdf2json error', { error: err.parserError });
      reject(new Error('PDF parsing failed. Ensure the file is a valid, text-based PDF (not scanned/image).'));
    });

    parser.parseBuffer(buffer);
  });
}

module.exports = { extractTextFromPDF };
