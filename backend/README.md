# EVENTA Backend API

A production-grade, layered RESTful API for Eventa Event Services. Built with Node.js, Express, and raw PostgreSQL queries (no ORM) connecting to Neon PostgreSQL.

## Architecture

```text
Route -> Controller -> Service -> Repository -> PostgreSQL
```

- **Routes**: Define HTTP paths, methods, and attach rate-limiters.
- **Controllers**: Handle request unpacking, response formatting, and HTTP statuses.
- **Services**: Encapsulate business logic, calculations, and transactional operations.
- **Repositories**: Execute parameterized raw SQL queries via `pg.Pool`.
- **Database**: PostgreSQL / Neon PostgreSQL with migrations and seed scripts.

## Setup & Running

### 1. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your `DATABASE_URL` (Neon PostgreSQL connection string) and `PORT`:

```env
DATABASE_URL=postgresql://user:password@ep-sample.neon.tech/eventa?sslmode=require
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Run Migrations and Seeds

```bash
npm run db:migrate
npm run db:seed
```

### 3. Start the Server

```bash
# Development mode with file watch
npm run dev

# Production start
npm start
```

## API Endpoints

- `GET /api/v1/health` - API health check
- `GET /api/v1/services` - List active event services
- `GET /api/v1/services/:slug` - Get single service details
- `POST /api/v1/event-requests` - Submit a new multi-service event planning request
- `GET /api/v1/event-requests/:id` - Retrieve event request status and details
- `GET /api/v1/quotes/:id` - Retrieve detailed quotation
- `POST /api/v1/quotes/:id/accept` - Accept quote and automatically generate booking
- `POST /api/v1/quotes/:id/request-changes` - Request quotation modifications
- `GET /api/v1/bookings/:id` - Retrieve booking status, services, and payments
- `GET /api/v1/payments/:bookingId` - Retrieve payment summary and available options
- `POST /api/v1/payments/:bookingId/initiate` - Process / initiate payment
- `POST /api/v1/payment-assistance` - Submit payment assistance request
- `POST /api/v1/contact` - Submit general inquiry or contact message
