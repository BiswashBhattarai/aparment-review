require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prismaClient');
const authRoutes = require('./routes/auth');
const apartmentRoutes = require('./routes/apartments');
const reviewRoutes = require('./routes/reviews');
const { registerLimiter } = require('./middleware/rateLimit');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', registerLimiter, authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/apartments', reviewRoutes); // POST /api/apartments/:id/reviews

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
