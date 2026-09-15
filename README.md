# MC TITOE EVENTS AND DESIGNS — Luxury Event Staging & Production Platform

A full-stack web platform for luxury event planning, acoustic staging, Master of Ceremonies hosting, and production coordination.

## Project Structure

```text
.
├── backend/                  # Node.js + Express + Neon PostgreSQL API (Raw SQL, No ORM)
│   ├── database/
│   │   ├── migrations/       # Raw SQL migrations
│   │   ├── seeds/            # Initial service catalogue seeds
│   │   ├── migrate.js        # Migration runner
│   │   └── seed.js           # Seed runner
│   ├── src/
│   │   ├── config/           # Environment & database pool configuration
│   │   ├── constants/        # System status constants
│   │   ├── controllers/      # Express controllers
│   │   ├── db/               # PostgreSQL connection pool
│   │   ├── middleware/       # Rate limiting, error handling, 404 handler
│   │   ├── repositories/     # Layered parameterized raw SQL repositories
│   │   ├── routes/           # RESTful API route definitions
│   │   ├── services/         # Business logic and transaction orchestration
│   │   ├── utils/            # ApiResponse and ApiError helpers
│   │   ├── validators/       # Input validation schemas
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # HTTP server entry point
│   ├── .env.example
│   └── package.json
└── frontend/                 # React + Vite + React Router + Framer Motion (Port 5173)
    ├── src/
    │   ├── animations/       # Reusable Framer Motion variants
    │   ├── api/              # Centralized API client modules
    │   ├── components/       # Common, navigation, services, layout components
    │   ├── constants/        # Centralized branding and contact constants
    │   ├── layouts/          # Root navigation and footer layout
    │   ├── pages/            # 14 distinct frontend page views
    │   ├── styles/           # Design tokens, variables, responsive typography
    │   ├── App.jsx           # Client router
    │   └── main.jsx          # React DOM root
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── package.json
├── admin/                    # React + Vite + Lucide React Admin Dashboard (Port 5174)
    ├── src/
    │   ├── api/              # Admin API client modules
    │   ├── components/       # Sidebar, Topbar, Modals, StatCards, StatusBadges
    │   ├── pages/            # Services CRUD, Requests, Quotes, Bookings, Payments, Inquiries
    │   ├── styles/           # Modern executive operations styling
    │   ├── App.jsx           # Admin router
    │   └── main.jsx          # Mount root
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Quick Start

### 1. Database & Backend Setup

```bash
cd backend
cp .env.example .env
# Configure your DATABASE_URL in .env (Neon PostgreSQL or local instance)
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The API server runs at `http://localhost:5000/api/v1`.

### 2. Client Website Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The public client website opens at `http://localhost:5173`.

### 3. Admin Operations Console

```bash
cd admin
cp .env.example .env
npm install
npm run dev
```

The admin operations dashboard opens at `http://localhost:5174`.
