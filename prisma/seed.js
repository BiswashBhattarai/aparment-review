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
  users.push(await prisma.user.create({ data: { email: 'charlie@uiowa.edu', username: 'charlie', password_hash: pw, is_verified: true, is_student: true } }));
  users.push(await prisma.user.create({ data: { email: 'dana@uiowa.edu', username: 'dana', password_hash: pw, is_verified: true, is_student: true } }));

  const aptData = [
    {
      name: 'Iowa City Lofts',
      address: '123 College St, Iowa City, IA',
      latitude: 41.6611, longitude: -91.5302,
      rent_min: 700, rent_max: 1200, bedrooms: 2, bathrooms: 1.5,
      distance_to_campus: 0.6,
      utilities_included: ['internet'],
      pet_policy: 'cats_only',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'Near Main St Apartments',
      address: '5 Main St, Iowa City, IA',
      latitude: 41.662, longitude: -91.53,
      rent_min: 900, rent_max: 1500, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 0.3,
      utilities_included: ['water', 'internet'],
      pet_policy: 'no_pets',
      parking_available: false, parking_type: 'none',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'Quiet Courts',
      address: '88 Quiet Ln, Iowa City, IA',
      latitude: 41.66, longitude: -91.535,
      rent_min: 600, rent_max: 900, bedrooms: 3, bathrooms: 2,
      distance_to_campus: 1.5,
      utilities_included: [],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Hawkeye Court Apartments',
      address: '310 Melrose Ave, Iowa City, IA',
      latitude: 41.6574, longitude: -91.5524,
      rent_min: 750, rent_max: 1100, bedrooms: 2, bathrooms: 1,
      distance_to_campus: 0.8,
      utilities_included: ['water', 'trash'],
      pet_policy: 'no_pets',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'The Pentacrest Suites',
      address: '20 E Washington St, Iowa City, IA',
      latitude: 41.6601, longitude: -91.5318,
      rent_min: 1100, rent_max: 1800, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 0.1,
      utilities_included: ['water', 'electric', 'internet', 'trash'],
      pet_policy: 'no_pets',
      parking_available: false, parking_type: 'street',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'River Ridge Residences',
      address: '501 N Dubuque St, Iowa City, IA',
      latitude: 41.668, longitude: -91.528,
      rent_min: 850, rent_max: 1350, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.5,
      utilities_included: ['internet', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Coralville Commons',
      address: '900 2nd St, Coralville, IA',
      latitude: 41.6716, longitude: -91.5824,
      rent_min: 650, rent_max: 950, bedrooms: 2, bathrooms: 1,
      distance_to_campus: 2.8,
      utilities_included: ['water'],
      pet_policy: 'cats_only',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'The Burlington Flats',
      address: '432 E Burlington St, Iowa City, IA',
      latitude: 41.6558, longitude: -91.526,
      rent_min: 780, rent_max: 1250, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 0.7,
      utilities_included: ['water', 'internet'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'South Side Studios',
      address: '1200 S Gilbert St, Iowa City, IA',
      latitude: 41.6488, longitude: -91.528,
      rent_min: 550, rent_max: 800, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 1.2,
      utilities_included: ['trash'],
      pet_policy: 'no_pets',
      parking_available: true, parking_type: 'lot',
      furnished: true,
      lease_length_options: ['6-month', '12-month']
    },
    {
      name: 'Dodge Street Manor',
      address: '740 E Dodge St, Iowa City, IA',
      latitude: 41.6653, longitude: -91.5201,
      rent_min: 900, rent_max: 1400, bedrooms: 3, bathrooms: 2,
      distance_to_campus: 1.0,
      utilities_included: ['water', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Campus View Apartments',
      address: '15 W Benton St, Iowa City, IA',
      latitude: 41.6525, longitude: -91.533,
      rent_min: 670, rent_max: 1050, bedrooms: 2, bathrooms: 1,
      distance_to_campus: 0.9,
      utilities_included: ['internet'],
      pet_policy: 'cats_only',
      parking_available: false, parking_type: 'street',
      furnished: false,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'The Jefferson Building',
      address: '129 E Jefferson St, Iowa City, IA',
      latitude: 41.6612, longitude: -91.5298,
      rent_min: 1000, rent_max: 1700, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 0.2,
      utilities_included: ['water', 'electric', 'internet'],
      pet_policy: 'no_pets',
      parking_available: false, parking_type: 'street',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'Park Road Place',
      address: '215 Park Rd, Iowa City, IA',
      latitude: 41.6698, longitude: -91.5412,
      rent_min: 820, rent_max: 1300, bedrooms: 3, bathrooms: 2,
      distance_to_campus: 1.1,
      utilities_included: ['trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Muscatine Ave Flats',
      address: '622 Muscatine Ave, Iowa City, IA',
      latitude: 41.6633, longitude: -91.5158,
      rent_min: 700, rent_max: 1050, bedrooms: 2, bathrooms: 1,
      distance_to_campus: 1.3,
      utilities_included: ['water', 'internet'],
      pet_policy: 'cats_only',
      parking_available: true, parking_type: 'lot',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Summit Street Suites',
      address: '411 Summit St, Iowa City, IA',
      latitude: 41.6645, longitude: -91.5255,
      rent_min: 950, rent_max: 1600, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.4,
      utilities_included: ['water', 'trash', 'internet'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    // --- Luxury / High-End ---
    {
      name: 'The Hive',
      address: '328 E Washington St, Iowa City, IA',
      latitude: 41.6603, longitude: -91.5278,
      rent_min: 1400, rent_max: 2400, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.2,
      utilities_included: ['water', 'electric', 'internet', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'Rise at Riverfront Crossing',
      address: '225 E Prentiss St, Iowa City, IA',
      latitude: 41.6538, longitude: -91.5305,
      rent_min: 1300, rent_max: 2200, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.6,
      utilities_included: ['water', 'internet', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: false,
      lease_length_options: ['12-month']
    },
    {
      name: 'Replay Iowa City',
      address: '180 N Linn St, Iowa City, IA',
      latitude: 41.6625, longitude: -91.5338,
      rent_min: 1500, rent_max: 2600, bedrooms: 1, bathrooms: 1,
      distance_to_campus: 0.3,
      utilities_included: ['water', 'electric', 'internet', 'trash'],
      pet_policy: 'cats_only',
      parking_available: true, parking_type: 'garage',
      furnished: true,
      lease_length_options: ['9-month', '12-month']
    },
    {
      name: 'Catalyst at Iowa City',
      address: '310 S Dubuque St, Iowa City, IA',
      latitude: 41.6577, longitude: -91.5317,
      rent_min: 1600, rent_max: 2800, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.4,
      utilities_included: ['water', 'electric', 'internet', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: true,
      lease_length_options: ['12-month']
    },
    {
      name: 'The Oasis on Iowa Ave',
      address: '505 Iowa Ave, Iowa City, IA',
      latitude: 41.6591, longitude: -91.5348,
      rent_min: 1200, rent_max: 2100, bedrooms: 2, bathrooms: 2,
      distance_to_campus: 0.3,
      utilities_included: ['water', 'internet', 'trash'],
      pet_policy: 'all_pets',
      parking_available: true, parking_type: 'garage',
      furnished: false,
      lease_length_options: ['9-month', '12-month']
    },
  ];

  const apartments = [];
  for (const d of aptData) {
    apartments.push(await prisma.apartment.create({ data: d }));
  }

  // create sample reviews
  await prisma.review.create({ data: {
    apartmentId: apartments[0].id,
    userId: users[0].id,
    overall_rating: 4, noise_rating: 3, maintenance_rating: 4,
    management_rating: 4, value_rating: 4,
    written_review: 'Nice place close to campus. Friendly management and decent pricing for the area. Great spot for students.',
    is_verified_student: true
  }});

  await prisma.review.create({ data: {
    apartmentId: apartments[1].id,
    userId: users[1].id,
    overall_rating: 3, noise_rating: 2, maintenance_rating: 3,
    management_rating: 3, value_rating: 3,
    written_review: 'Very central location right on Main St. Can be noisy on weekends but utilities being included saves a lot of hassle.',
    is_verified_student: false
  }});

  await prisma.review.create({ data: {
    apartmentId: apartments[4].id,
    userId: users[2].id,
    overall_rating: 5, noise_rating: 5, maintenance_rating: 5,
    management_rating: 5, value_rating: 4,
    written_review: 'Steps from campus and everything is included in rent. Worth every penny if you want zero hassle as a student.',
    is_verified_student: true
  }});

  await prisma.review.create({ data: {
    apartmentId: apartments[7].id,
    userId: users[3].id,
    overall_rating: 4, noise_rating: 4, maintenance_rating: 3,
    management_rating: 4, value_rating: 5,
    written_review: 'Great value for the location. Pet friendly and management responds quickly to maintenance requests. Would recommend.',
    is_verified_student: true
  }});

  await prisma.review.create({ data: {
    apartmentId: apartments[11].id,
    userId: users[0].id,
    overall_rating: 5, noise_rating: 4, maintenance_rating: 5,
    management_rating: 5, value_rating: 4,
    written_review: 'Beautiful building right downtown. All utilities included makes budgeting super easy. A bit pricey but totally worth it.',
    is_verified_student: true
  }});

  console.log('Seeding finished');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
