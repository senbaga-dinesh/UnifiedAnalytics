import rateLimit from "express-rate-limit";

/**
 * 🚦 API Rate Limiter Middleware
 * ----------------------------------
 * This middleware prevents API abuse by limiting the number
 * of requests per client within a specific time window.
 *
 * Improvement:
 *   Instead of limiting by IP address (default behavior),
 *   we now limit by API Key using the `x-api-key` header.
 *
 *   → Each registered app (API key) gets its own request quota.
 *   → Prevents one noisy client from affecting others.
 */

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // ⏱️ 1-minute window
  max: 30, // 💥 Allow max 30 requests per API key per minute

  // ✅ Custom key generator: Use x-api-key instead of IP
  keyGenerator: (req) => {
    // Prefer API key if present; fallback to IP as backup
    return req.headers["x-api-key"] || req.ip;
  },

  message: {
    message: "Too many requests for this API key. Please try again later.",
  },

  standardHeaders: true, // Send RateLimit-* headers for transparency
  legacyHeaders: false, // Disable deprecated headers
});
