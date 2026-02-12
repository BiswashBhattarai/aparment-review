# Iowa City Student Apartment Review — Backend

This repository contains a starter backend for an apartment review platform (Iowa City student-focused). It includes:

- Express.js server
- Prisma schema for PostgreSQL
- Auth (email verification + JWT)
- Apartment search with filters and pagination
- Review posting with rate limiting and moderation flagging
- Seed script to create sample data

Quick start

1. Copy `.env.example` to `.env` and fill in values (DATABASE_URL, JWT_SECRET, etc).
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations (you need a PostgreSQL database pointed by DATABASE_URL):

```bash
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Run server:

```bash
npm run dev
```

Server will be available at http://localhost:4000 by default.

Next steps

- Add frontend (Next.js or React) that consumes the API
- Implement caching of aggregates, image uploads, map view, and insights pages
- Wire a real email provider (SendGrid) or SMTP in `.env`
- Harden security headers, CSRF tokens, and tests
