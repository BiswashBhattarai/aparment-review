const express = require('express');
const prisma = require('../prismaClient');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get reviews for apartment (paginated)
router.get('/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const pageSize = 10;
  const offset = (page -1) * pageSize;

  const reviews = await prisma.review.findMany({
    where: { apartmentId },
    orderBy: { created_at: 'desc' },
    take: pageSize,
    skip: offset,
    include: { user: { select: { id: true, username: true, is_student: true } } }
  });
  res.json({ data: reviews });
});

// Post a review
router.post('/:apartmentId', authenticate, async (req, res) => {
  const { apartmentId } = req.params;
  const user = req.user;
  const { overall_rating, noise_rating, maintenance_rating, management_rating, value_rating, written_review, display_as_anonymous } = req.body;

  // Basic validation
  if (!written_review || written_review.length < 50) return res.status(400).json({ error: 'Review must be at least 50 characters' });
  const ratings = [overall_rating, noise_rating, maintenance_rating, management_rating, value_rating];
  if (ratings.some(r => typeof r !== 'number' || r < 1 || r > 5)) return res.status(400).json({ error: 'Ratings must be integers 1-5' });

  // One review per user per apartment
  const existing = await prisma.review.findFirst({ where: { apartmentId, userId: user.id } });
  if (existing) return res.status(400).json({ error: 'You already reviewed this apartment' });

  // Weekly limit: max 5 reviews per user per 7 days
  const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000);
  const recentCount = await prisma.review.count({ where: { userId: user.id, created_at: { gte: oneWeekAgo } } });
  if (recentCount >= 5) return res.status(429).json({ error: 'Weekly review limit reached' });

  // Check burst posting: >3 reviews in last hour => moderation
  const oneHourAgo = new Date(Date.now() - 60*60*1000);
  const lastHour = await prisma.review.count({ where: { userId: user.id, created_at: { gte: oneHourAgo } } });
  const moderation_flag = lastHour >= 3 ? 'pending' : 'none';

  const review = await prisma.review.create({ data: {
    apartmentId,
    userId: user.id,
    overall_rating,
    noise_rating,
    maintenance_rating,
    management_rating,
    value_rating,
    written_review,
    display_as_anonymous: !!display_as_anonymous,
    is_verified_student: !!user.is_student,
    moderation_flag
  }});

  // update user counters
  await prisma.user.update({ where: { id: user.id }, data: { last_review_at: new Date(), review_count: { increment: 1 } } });

  res.json({ message: 'Review submitted', review });
});

module.exports = router;
