/**
 * security.js
 * Centralized utility for strict input validation and sanitization.
 */

/**
 * Validates if the input matches our strict criteria.
 * - Must be a string.
 * - Must be between 2 and 100 characters.
 * - Must only contain alphanumeric characters, spaces, and safe punctuation (- _ ' .).
 * 
 * @param {string} input 
 * @returns {boolean} true if valid, false otherwise.
 */
export const isValidTopic = (input) => {
  if (typeof input !== 'string') return false;
  
  const trimmed = input.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;

  // Strict regex: allows letters, numbers, spaces, and safe punctuation (dashes, underscores, apostrophes, periods, and parentheses for wikipedia e.g. "React (software)").
  const safeRegex = /^[a-zA-Z0-9\s\-_'.()]*$/;
  return safeRegex.test(trimmed);
};

/**
 * Sanitizes the input string by explicitly stripping known dangerous characters,
 * even if the validation regex caught them (defense in depth).
 * 
 * @param {string} input 
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Basic XSS/SQL/Command injection character stripping
  // Removes <, >, ;, *, %, $, &, +, |, =
  return input
    .replace(/[<>;*%$&+|="]/g, '') 
    .trim();
};
