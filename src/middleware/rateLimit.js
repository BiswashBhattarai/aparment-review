const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 registration attempts per IP per window
  message: { error: 'Too many accounts created from this IP, please try later.' }
});

module.exports = { registerLimiter };
