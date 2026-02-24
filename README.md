# 🏢 IC Apartments — Apartment Review Platform for Iowa City Students

A full-stack web application where Iowa City students can discover, review, and rate student apartments. Find the perfect place near campus with honest reviews from real students.

**Live Demo:** Host locally at `http://localhost:3000`

---

## ✨ Features

### For Apartment Hunters
- 🗺️ **Interactive Map** — Browse apartments on an interactive OpenStreetMap, centered on Iowa City
- 🔍 **Advanced Search & Filters** — Filter by max rent, min bedrooms, pet-friendly, furnished, parking
- 📊 **Smart Sorting** — Sort by newest, lowest price, or highest price
- ⭐ **Star Ratings** — See overall apartment ratings and average scores for noise, maintenance, management, and value
- 💬 **Verified Reviews** — Read honest reviews from verified university students (identified with ✓ badge)

### For Reviewers
- ✍️ **Write Detailed Reviews** — Post reviews with a 50+ character minimum and rate 5 categories (overall, noise, maintenance, management, value)
- 👤 **Anonymous Option** — Post anonymously if you prefer privacy
- 🔐 **Student Verification** — Sign up with @uiowa.edu email for automatic verified student badge
- 📧 **Email Verification** — Confirm your email address before posting reviews

### For Developers
- 🛠️ **RESTful API** — Clean Express.js backend with Prisma ORM
- 🗄️ **PostgreSQL Database** — Persistent data with proper migrations
- 🔒 **Authentication** — JWT-based auth with email verification
- ⏱️ **Rate Limiting** — Prevent spam with IP-based registration limits and per-user review limits
- 📋 **Review Moderation** — Automatic flagging of suspicious posting patterns

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+ (local or remote)

### 1. Clone & Setup Backend

```bash
git clone <repo-url>
cd aparment-review
npm install
npx prisma generate
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your details:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/apartments?schema=public
JWT_SECRET=your-super-secret-key-change-me
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

This creates sample apartments, users, and reviews in your database.

### 4. Start Backend Server

```bash
npm run dev
```

Backend runs on `http://localhost:4000`

### 5. Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🏗️ Architecture

### Backend (`src/`)
- **`src/index.js`** — Express server and middleware setup
- **`src/routes/auth.js`** — User registration, email verification, login
- **`src/routes/apartments.js`** — Search, filter, sort apartments
- **`src/routes/reviews.js`** — Post and fetch apartment reviews
- **`src/middleware/auth.js`** — JWT authentication middleware
- **`src/middleware/rateLimit.js`** — IP-based rate limiting
- **`src/utils/email.js`** — Email verification token handling

### Frontend (`frontend/pages/`, `frontend/src/components/`)
- **Home/Search** (`pages/index.js`) — Main apartment search with filters, map, and results grid
- **Apartment Detail** (`pages/apartment/[id].js`) — Full apartment info, reviews, and write review form
- **Auth Pages** (`pages/login.js`, `pages/register.js`, `pages/verify-email.js`) — User authentication flow
- **Components** — Header (with logout), ApartmentCard, StarRating, ApartmentMap

### Database (`prisma/`)
- **User** — Stores email, password hash, student verification status, review count
- **Apartment** — Address, rent range, amenities, location coordinates
- **Review** — Written reviews, 5-point ratings, moderation flags

---

## 📚 API Reference

### Authentication
- `POST /api/auth/register` — Create account, sends verification email
- `POST /api/auth/verify-email` — Confirm email with token
- `POST /api/auth/login` — Return JWT token

### Apartments
- `GET /api/apartments` — Search with filters & sorting
  - Query params: `page`, `max_rent`, `min_bedrooms`, `pet_friendly`, `parking`, `furnished`, `sort` (newest|price_asc|price_desc)
- `GET /api/apartments/:id` — Get apartment details + review summary

### Reviews
- `GET /api/apartments/:id/reviews` — Paginated reviews (newest first)
- `POST /api/apartments/:id/reviews` — Post new review (authenticated, 50+ character minimum)

---

## 🔐 Authentication & Security

- **Passwords** hashed with bcrypt (10 rounds)
- **JWT tokens** signed with HS256, 7-day expiration
- **Email verification** required before posting reviews
- **Rate limiting** on registration (15 requests per IP per 15 minutes)
- **Review limits** — One review per apartment per user, max 5/week, flagged if 3+ posted in 1 hour
- **Student verification** — Automatic @uiowa.edu badge, no manual review required

### ⚠️ Security Notes
- JWT stored in localStorage (suitable for development; use httpOnly cookies in production)
- No CSRF protection (add express-session + CSRF tokens for production)
- Email sending logs to console (configure SMTP for production)

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** — HTTP server
- **Prisma ORM** — Database abstraction & migrations
- **PostgreSQL** — Relational database
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication
- **express-rate-limit** — Rate limiting middleware

### Frontend
- **Next.js 13** — React framework with SSR
- **React 18** — Component library
- **axios** — HTTP client
- **Leaflet** — Interactive maps
- **OpenStreetMap** — Free map tiles

---

## 📦 Known Limitations & Future Work

### Limitations
- Email verification logs to console (needs SMTP setup for real emails)
- No photo uploads (would need S3/Cloudinary integration)
- No admin moderation UI (flagged reviews are stored but not reviewed)
- No analytics dashboard (review insights, popular apartments)
- Map doesn't show review density heatmap

### Future Features
- 📸 Photo gallery for apartments
- 🔔 Notification system (reply to review, apartment updates)
- 📊 Analytics dashboard (high-rated neighborhoods, price trends)
- 💬 Review moderation admin panel
- 🗳️ Review voting (helpful/not helpful)
- 🎯 Advanced filters (proximity to campus, lease length, utilities included)

---

## 🧪 Testing

No automated tests included yet. To test locally:

1. Register a test account with `@uiowa.edu` email
2. Check console logs for email verification token
3. Verify email via `/verify-email?token=...`
4. Post reviews from different accounts
5. Try rate limits: register 11 times from same IP to hit rate limit

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Development

### Database Migrations
```bash
npx prisma migrate dev --name <migration_name>
```

### Reset Database (⚠️ deletes all data)
```bash
npx prisma migrate reset
node prisma/seed.js
```

### View Database
```bash
npx prisma studio
```

### Environment Variables Template
See `.env.example` — copy to `.env` and fill in your values.

---

## 🤝 Contributing

Contributions welcome! Areas for help:
- UI/UX improvements (dark mode, mobile optimization, accessibility)
- Additional filters (distance to campus, lease length)
- Admin dashboard for moderation
- Test suite (unit, integration, e2e)
- SMTP email configuration guide

---

## 📞 Support

For issues, open a GitHub issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Backend/frontend error logs

---

**Built with ❤️ for Iowa City students. Happy apartment hunting! 🏠**
