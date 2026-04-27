/**
 * logger.js
 * Client-side logging utility to track anomalies, errors, and rate limits.
 * Ready to be connected to a remote observability platform (e.g. Sentry/Datadog).
 */

const getISOTime = () => new Date().toISOString();

export const logger = {
  info: (message, metadata = {}) => {
    console.info(`[INFO | ${getISOTime()}] ${message}`, metadata);
  },
  
  warn: (message, metadata = {}) => {
    console.warn(`[WARN | ${getISOTime()}] ${message}`, metadata);
  },
  
  error: (message, error = null) => {
    console.error(`[ERROR | ${getISOTime()}] ${message}`, error ? { error } : {});
  },
  
  logApiError: (endpoint, error) => {
    logger.error(`API Request Failed on [${endpoint}]`, error);
  },

  logSuspiciousActivity: (reason, metadata = {}) => {
    // Explicit security flagging
    logger.warn(`SECURITY ANOMALY: ${reason}`, metadata);
  }
};
