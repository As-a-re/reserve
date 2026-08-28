# ReserveCore Engine

A production-oriented high-concurrency booking backend implementing the NSP Backend Engineering Assessment.

## Requirements covered
- PostgreSQL transaction + `SELECT ... FOR UPDATE` resource locking.
- PostgreSQL GiST exclusion constraint as a database-level final guard against overlapping confirmed bookings.
- Exactly one successful booking under concurrent contention; conflicts return HTTP 409.
- Redis-backed idempotency locks and 24-hour cached responses.
- Redis sliding-window booking rate limiter: 10 requests/minute per IP/user.
- BullMQ notification queue with 30% simulated gateway failures, exponential backoff (2s, 4s, 8s), and failed-job/DLQ audit logging.
- JWT access tokens (15 minutes) and rotated refresh tokens in HTTP-only cookies.
- RBAC: system admin, facility manager, standard user; public registration creates standard users only.
- Docker Compose for PostgreSQL, Redis, API and worker.
- Swagger/OpenAPI at `/docs`.
- 50-request concurrency verification script.

## Run
```bash
docker compose up --build
```
API: http://localhost:5000, Swagger: http://localhost:5000/docs.

Optional RBAC seed users: `SEED_PASSWORD='your-password' node scripts/seed.js` (creates system admin and facility manager accounts; change the password before any real deployment).

## Concurrency proof
After services are running:
```bash
npm install
npm run concurrency:test
```
Expected: `created: 1`, `conflicts: 49`, then `PASS`.

## Architecture
`routes → controllers → services → repositories → PostgreSQL/Redis`, with BullMQ workers separated from HTTP request handling.
