# Iowa City Student Apartment Review

This repository is a starter full-stack project for an Iowa City student apartment review platform ("Yelp for student apartments"). It includes a backend API (Express + Prisma + PostgreSQL) and a minimal Next.js frontend scaffold.

Contents
- `src/` — Express backend source
- `prisma/` — Prisma schema and seed script
- `frontend/` — Next.js frontend (minimal UI for search, auth, apartment detail)

Overview
- Backend: Node.js, Express, Prisma ORM, PostgreSQL
- Auth: email verification (verification token logged or sent via SMTP if configured) and JWT sessions
- Search: `/api/apartments` with filters, pagination (20/page), and sorting
- Reviews: POST/GET reviews with validation, one-review-per-user-per-apartment, weekly limit, and moderation flagging

Important: This project is a scaffold and intended as a starting point. The email sender currently logs verification URLs to the console unless SMTP/SendGrid variables are configured.

Quick start — Backend

1. Copy `.env.example` to `.env` and fill values (Postgres `DATABASE_URL`, `JWT_SECRET`, etc.).

2. Install dependencies and generate Prisma client:

```bash
cd /Users/a1/Desktop/Coding/Yelp-for-aparments/aparment-review
npm install
npx prisma generate
```

3. Run migrations and seed sample data (requires a PostgreSQL database reachable via `DATABASE_URL`):

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Start the backend in development mode:

```bash
npm run dev
```

The backend listens on `http://localhost:4000` by default. Health check: `GET /health`.

Backend: key endpoints

- Authentication
	- `POST /api/auth/register` — { email, password, username? } (rate-limited)
	- `POST /api/auth/verify-email` — { token }
	- `POST /api/auth/login` — { email, password } → { token }

- Apartments
	- `GET /api/apartments` — filters via query params: `page` (default 1), `max_rent`, `min_bedrooms`, `pet_friendly=true`, `parking=true`, `furnished=true`, `max_distance`, `sort` (e.g. `price_asc`, `price_desc`, `newest`)
	- `GET /api/apartments/:id` — get apartment details + aggregated review summary

- Reviews
	- `GET /api/apartments/:apartmentId/reviews` — paginated list (newest first)
	- `POST /api/apartments/:apartmentId/reviews` — authenticated users only (JWT) — ratings, written_review (min 50 chars), anonymous option, moderation rules applied

Notes on security and behavior
- Passwords are hashed with `bcrypt`.
- JWT tokens are signed with `JWT_SECRET` and returned on login. For production consider httpOnly cookies rather than localStorage.
- Rate limiting: registration endpoint has IP-based rate limiter. Review posting enforces:
	- One review per apartment per user
	- Max 5 reviews per user per week
	- Reviews are flagged as `pending` if a user posts >=3 reviews in the last hour

Seeding
- `prisma/seed.js` creates sample users (including `@uiowa.edu` student), apartments, and at least one review for local testing.

Quick start — Frontend (Next.js)

1. Install frontend dependencies and run dev server:

```bash
cd frontend
npm install
npm run dev
```

2. The Next.js app runs on `http://localhost:3000` by default and expects the API at `http://localhost:4000/api`.
	 - To override the API base, set `NEXT_PUBLIC_API_BASE` in the frontend environment before starting.

Frontend features included (minimal):
- Home/Search page (`/`) — simple filters (max rent, pet-friendly, furnished)
- Apartment detail (`/apartment/[id]`) — shows apartment info and reviews
- Auth pages: `/login`, `/register` (store JWT in localStorage for demo)

Frontend notes & next steps
- The frontend is intentionally minimal and unstyled (simple CSS). Next steps you may want:
	- Add "Write a Review" form and UI to post reviews (requires verified JWT-authenticated user)
	- Add map view (Leaflet/Mapbox) and marker color-coding by rating
	- Use secure cookie-based auth and CSRF protection for production
	- Replace console-logged email verification with SendGrid/SMTP templates

Environment variables

Backend (`.env` example):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/apartments?schema=public
JWT_SECRET=change_this_to_a_strong_secret
EMAIL_FROM="noreply@example.com"
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Frontend (optional):

```
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

Running both locally — summary

1. Start a Postgres instance and set `DATABASE_URL`.
2. In project root, install and prepare backend:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

3. Start frontend in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`, and the backend API at `http://localhost:4000`.

Contributing & next items
- Add frontend review submission UI (Write a Review), review moderation admin, map integration, photo uploads (S3/Cloudinary), analytics/insights endpoints, and tests.

If you'd like, I can now add the review submission form on the apartment page, harden auth (httpOnly cookies), or add the map view — tell me which and I'll implement it next.
