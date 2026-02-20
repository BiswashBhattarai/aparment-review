// Load environment variables from .env into process.env for local development
require('dotenv').config();

// Import Express framework
const express = require('express');

// CORS middleware to allow requests from the frontend (e.g. localhost:3000)
const cors = require('cors');

// Prisma client (database access)
const prisma = require('./prismaClient');

// Route modules
const authRoutes = require('./routes/auth');
const apartmentRoutes = require('./routes/apartments');
const reviewRoutes = require('./routes/reviews');

// Rate limiting middleware (applied to auth routes)
const { registerLimiter } = require('./middleware/rateLimit');

// Create the Express app
const app = express();

// Enable CORS for incoming requests. In production, restrict origins instead of allowing all.
app.use(cors());

// Parse incoming JSON payloads into req.body
app.use(express.json());

// Mount auth routes at /api/auth and apply the registerLimiter middleware there
// (registerLimiter protects against too many registration attempts per IP)
app.use('/api/auth', registerLimiter, authRoutes);

// Mount apartment routes for listing/search and apartment details
app.use('/api/apartments', apartmentRoutes);

// Mount review routes on the same base path; these provide endpoints like
// GET /api/apartments/:apartmentId/reviews and POST /api/apartments/:apartmentId/reviews
app.use('/api/apartments', reviewRoutes);

// Simple health check endpoint used by load balancers or to verify server is up
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Read port from environment or default to 4000
const port = process.env.PORT || 4000;

// Start the HTTP server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
