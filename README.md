# Alexandria Unburnt v2.0

Fully functioning book commerce website. Browse a curated catalogue, manage your cart, and place orders. Admins can manage books, users, and messages through protected dashboards.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 + React Router 7 + Bootstrap 5 |
| Backend | Express 5 + MySQL 2 + JWT + bcrypt |
| Database | MySQL 8.0 |
| Containerization | Docker Compose |

## Quick Start

### 1. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env → change JWT_SECRET to a random string
```

### 2. Launch

```bash
docker compose up -d --build
```

### 3. Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8800 |

### 4. Rebuild database (if schema changed)

```bash
docker compose down -v
docker compose up -d --build
```

> `-v` destroys the MySQL data volume. The database is recreated from `AlexandriaUnburnt.sql`.

## Test Accounts

The seed database includes three users. Passwords are stored as bcrypt hashes — the plaintext below is what you type in the login form.

| Email | Password | Role | Notes |
|-------|----------|------|-------|
| `celiafer@gmail.com` | `12345678!!` | admin | superadmin — full access to UsersAdmin |
| `fervela@email.com` | `12345678!!` | client | Browse, cart, checkout |
| `ana@mail.com` | `123450987` | client | Browse, cart, checkout |