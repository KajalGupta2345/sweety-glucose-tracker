# Sweety – Blood Glucose Tracker

A small web app where a diabetes patient records up to 4 blood glucose readings a day
and views daily, month-to-date and previous-month reports.

**Stack:** Node.js + Express, PostgreSQL, React (Vite), JWT auth, bcrypt, Jest, Vitest + React Testing Library.

## Features

**Required**

- Sign up and log in (passwords hashed with bcrypt, JWT sessions)
- Add, view, edit and delete readings with 4 slots: Morning (fasting), After breakfast, After lunch, After dinner
- Validation with clear messages in the UI:
  - value is required
  - value must be a whole number between 40 and 600
  - only one reading per slot per day
  - maximum 4 readings per day
  - date cannot be in the future
- Reports (highest, lowest, average rounded to 1 decimal, and count; friendly empty state when there is no data):
  - Daily (also lists each reading with its slot)
  - Month-to-date (1st of the month to the selected date)
  - Previous month (the whole previous month)
- Each user only sees their own readings

**Bonus (done)**

- Pagination on `GET /api/readings` (`?page=1&limit=20`) and an "All readings" history with Previous / Next buttons
- Frontend tests with React Testing Library for the reading form

## Project structure

```
server/   Express API, PostgreSQL schema, seed script, Jest tests
client/   React app (Vite), Vitest + React Testing Library tests
```

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer (with `psql` available in your terminal)

## Installation

```bash
git clone https://github.com/KajalGupta2345/sweety-glucose-tracker.git
cd sweety-glucose-tracker

cd server
npm install

cd ../client
npm install
```

## Database setup

Create the database and the tables:

```bash
psql -U postgres -c "CREATE DATABASE sweety;"
psql -U postgres -d sweety -f server/schema.sql
```

## Environment variables

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

(On Windows PowerShell: `Copy-Item server/.env.example server/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | Port for the API (default `5000`) |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://postgres:your_password@localhost:5432/sweety` |
| `JWT_SECRET` | Any long random string used to sign login tokens |

## Seed demo data

```bash
cd server
npm run seed
```

This creates a demo user with about 60 days of sample readings (2 to 4 per day):

- Email: `demo@sweety.com`
- Password: `demo1234`

Running the seed again deletes and recreates the demo user.

## Running the app

Start the server (http://localhost:5000):

```bash
cd server
npm run dev
```

Start the client in a second terminal (http://localhost:5173):

```bash
cd client
npm run dev
```

The client proxies `/api` requests to the server (see `client/vite.config.js`), so both must be running.
You can check the API and database connection at http://localhost:5000/health.

## Running the tests

Server (Jest):

```bash
cd server
npm test
```

Covers the reading validation rules, pagination parsing and the report date-range logic
(including January, leap-year February and non-leap-year February).

Client (Vitest + React Testing Library):

```bash
cd client
npm test
```

Covers the reading form: slots are shown, a new reading is submitted, API errors are displayed, and edit mode is pre-filled.

## API overview

All endpoints except signup and login need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register with name, email and password |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/readings?date=YYYY-MM-DD&page=1&limit=20` | List my readings. `date` is optional. Returns `pagination` with page, limit, total and totalPages |
| POST | `/api/readings` | Add a reading `{ date, slot, value }` |
| PUT | `/api/readings/:id` | Edit a reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/reports?date=YYYY-MM-DD` | Daily, month-to-date and previous-month reports |

Slot values: `morning`, `after_breakfast`, `after_lunch`, `after_dinner`.

## Notes

### Assumptions

- "Monthly" means the whole calendar month before the month of the selected date
  (for example, selected date 15 Oct 2026 gives 1 Sep to 30 Sep 2026).
- Dates are plain calendar dates without time zones. "Future" is checked against the server's local date.
- With only 4 slots and one reading per slot per day, the "maximum 4 readings per day" rule is also covered
  by the duplicate-slot rule. I kept both checks so each shows its own message.
- The one-reading-per-slot rule is enforced both in the API and by a unique constraint in the database.
- The average is rounded to 1 decimal place.
- Passwords must be at least 6 characters.
- Pagination defaults to 20 items per page, with a maximum of 100.

### What I would improve with more time

- Add API integration tests (with a separate test database) for the routes, not only for the helper functions.
- Add a line chart of readings over the month (for example with Recharts).
- Add Docker Compose to start PostgreSQL and the app with one command.
- Improve security: rate limiting on login, a shorter token lifetime with refresh tokens, and HTTP-only cookies instead of localStorage.
- Add database migrations instead of a single schema file.
- Handle time zones properly for the "date cannot be in the future" check.
- Improve the UI and accessibility, and show loading states.