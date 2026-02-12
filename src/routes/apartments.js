const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// GET /api/apartments
// supports filters: max_rent, min_bedrooms, pet_friendly (boolean), parking (boolean), max_distance, furnished (boolean)
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const pageSize = 20;
  const offset = (page -1) * pageSize;

  const where = {};
  if (req.query.max_rent) {
    where.rent_max = { lte: parseFloat(req.query.max_rent) };
  }
  if (req.query.min_bedrooms) {
    where.bedrooms = { gte: parseInt(req.query.min_bedrooms) };
  }
  if (req.query.pet_friendly === 'true') {
    where.pet_policy = { not: 'no_pets' };
  }
  if (req.query.parking === 'true') {
    where.parking_available = true;
  }
  if (req.query.furnished === 'true') {
    where.furnished = true;
  }
  if (req.query.max_distance) {
    where.distance_to_campus = { lte: parseFloat(req.query.max_distance) };
  }

  // sorting
  let orderBy = { created_at: 'desc' };
  const sort = req.query.sort;
  if (sort === 'price_asc') orderBy = { rent_max: 'asc' };
  if (sort === 'price_desc') orderBy = { rent_max: 'desc' };
  if (sort === 'newest') orderBy = { created_at: 'desc' };

  const [items, total] = await Promise.all([
    prisma.apartment.findMany({ where, orderBy, take: pageSize, skip: offset }),
    prisma.apartment.count({ where })
  ]);

  res.json({ data: items, meta: { page, pageSize, total } });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const apt = await prisma.apartment.findUnique({ where: { id } });
  if (!apt) return res.status(404).json({ error: 'Not found' });

  // compute aggregations
  const agg = await prisma.review.aggregate({
    _avg: { overall_rating: true, noise_rating: true, maintenance_rating: true, management_rating: true, value_rating: true },
    _count: { _all: true },
    where: { apartmentId: id }
  });

  res.json({ apartment: apt, reviews_summary: agg });
});

module.exports = router;
