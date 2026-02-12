const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  console.log('Seeding...');
  await prisma.review.deleteMany();
  await prisma.apartment.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash('password123', 10);

  // create some users
  const users = [];
  users.push(await prisma.user.create({ data: { email: 'alice@uiowa.edu', username: 'alice', password_hash: pw, is_verified: true, is_student: true } }));
  users.push(await prisma.user.create({ data: { email: 'bob@gmail.com', username: 'bob', password_hash: pw, is_verified: true, is_student: false } }));

  const aptData = [
    { name: 'Iowa City Lofts', address: '123 College St, Iowa City, IA', latitude: 41.6611, longitude: -91.5302, rent_min: 700, rent_max: 1200, bedrooms: 2, bathrooms: 1.5, distance_to_campus: 0.6, utilities_included: ['internet'], pet_policy: 'cats_only', parking_available: true, parking_type: 'lot', furnished: false, lease_length_options: ['9-month','12-month'] },
    { name: 'Near Main St Apartments', address: '5 Main St, Iowa City, IA', latitude: 41.662, longitude: -91.53, rent_min: 900, rent_max: 1500, bedrooms: 1, bathrooms: 1, distance_to_campus: 0.3, utilities_included: ['water','internet'], pet_policy: 'no_pets', parking_available: false, parking_type: 'none', furnished: true, lease_length_options: ['9-month','12-month'] },
    { name: 'Quiet Courts', address: '88 Quiet Ln, Iowa City, IA', latitude: 41.66, longitude: -91.535, rent_min: 600, rent_max: 900, bedrooms: 3, bathrooms: 2, distance_to_campus: 1.5, utilities_included: [], pet_policy: 'all_pets', parking_available: true, parking_type: 'garage', furnished: false, lease_length_options: ['12-month'] }
  ];

  const apartments = [];
  for (const d of aptData) {
    apartments.push(await prisma.apartment.create({ data: d }));
  }

  // create sample reviews
  await prisma.review.create({ data: {
    apartmentId: apartments[0].id,
    userId: users[0].id,
    overall_rating: 4,
    noise_rating: 3,
    maintenance_rating: 4,
    management_rating: 4,
    value_rating: 4,
    written_review: 'Nice place close to campus. Friendly management and decent pricing for the area. 50+ chars to satisfy validation.',
    is_verified_student: true
  }});

  console.log('Seeding finished');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
