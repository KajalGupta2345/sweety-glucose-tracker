# Sweety – Blood Glucose Tracker

A small web app where a diabetes patient records up to 4 blood glucose readings a day
and views daily, month-to-date and previous-month reports.

**Stack:** Node.js + Express, PostgreSQL, React (Vite), JWT auth, bcrypt, Jest.

## Features

- Sign up and log in (passwords hashed with bcrypt, JWT sessions)
- Add, view, edit and delete readings (4 slots: Morning (fasting), After breakfast, After lunch, After dinner)
- Validation with clear messages (required, 40-600 whole number, one per slot per day, max 4 per day, no future dates)
- Reports: Daily (with each reading and its slot), Month-to-date, Previous month
- Each user only sees their own readings

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (with `psql` available)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/KajalGupta2345/sweety-glucose-tracker.git
cd sweety-glucose-tracker
cd server && npm install
cd ../client && npm install
```

### 2. Database

```bash
psql -U postgres -c "CREATE DATABASE sweety;"
psql -U postgres -d sweety -f server/schema.sql
```

### 3. Environment variables

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and set your PostgreSQL password and a JWT secret.

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 5000) |
| `DATABASE_URL` | e.g. `postgresql://postgres:your_password@localhost:5432/sweety` |
| `JWT_SECRET` | Any long random string |

### 4. Seed demo data

```bash
cd server
npm run seed
```

Creates a demo user with about 60 days of sample readings:

- Email: `demo@sweety.com`
- Password: `demo1234`

## Running

Server (http://localhost:5000):

```bash
cd server
npm run dev
```

Client (http://localhost:5173), in a second terminal:

```bash
cd client
npm run dev
```

The client proxies `/api` requests to the server (see `client/vite.config.js`).

## Tests

```bash
cd server
npm test
```

Tests cover the reading validation rules and the report date-range logic
(including January, leap-year and non-leap-year February).

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/readings?date=YYYY-MM-DD` | List my readings (date optional) |
| POST | `/api/readings` | Add a reading |
| PUT | `/api/readings/:id` | Edit a reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/reports?date=YYYY-MM-DD` | Daily, month-to-date and previous-month reports |

## Notes

### Assumptions

- "Monthly" report means the whole calendar month before the selected date's month.
- Dates are treated as plain calendar dates (no time zones); "future" is checked against the server's local date.
- With only 4 slots and one reading per slot per day, the "max 4 per day" rule is also covered by the duplicate-slot rule. Both checks are kept so each gives its own message.
- Average is rounded to 1 decimal place.
- Passwords must be at least 6 characters.

### What I would improve with more time

- (write your own points, for example: pagination on GET /readings, charts with Recharts, frontend tests with React Testing Library, API integration tests, Docker compose, rate limiting on login, refresh tokens)