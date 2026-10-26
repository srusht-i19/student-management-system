# Rollbook - Student Management System

A full-stack CRUD app: **Next.js 14** (App Router, Tailwind) frontend, **NestJS 10** REST API, **MySQL 8** via TypeORM, JWT login.

- Public landing page, login page, and a protected admin dashboard
- Create, view, search, update and delete students
- DTO validation on the server, matching validation in the browser forms
- Loading, empty and error states on every screen

## Project structure

```
student-management-system/
  backend/            NestJS API (port 4000)
    src/auth/         login, JWT guard
    src/students/     entity, DTOs, service, controller
    src/config/       database config
    postman/          exported Postman collection
  frontend/           Next.js app (port 3000)
    app/              pages: /, /login, /dashboard, /dashboard/students/new, .../[id]/edit
    components/       Navbar, Footer, Button, Input, StudentForm, StudentTable, ConfirmModal, ToastProvider
    lib/api.ts        axios instance + all API calls + JWT interceptor
    types/student.ts
  docs/screenshots/   put your 3-4 README screenshots here
```

## Prerequisites

Node.js 20 LTS, MySQL 8.x (local or Docker), Git, Postman or Thunder Client.

## Setup

### 1. Database

```sql
CREATE DATABASE student_db;
```

Or with Docker:

```bash
docker run --name sms-mysql -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=student_db -p 3306:3306 -d mysql:8
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # then edit DB_PASSWORD, JWT_SECRET, ADMIN_* values
npm install
npm run start:dev           # http://localhost:4000/api
```

The `students` table is created automatically on first start (`synchronize: true`).

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env` (defaults: `admin@school.com` / `Admin@123`).

## Environment variables

| File | Variable | Purpose |
|---|---|---|
| backend/.env | `PORT` | API port (4000) |
| | `FRONTEND_URL` | Allowed CORS origin (http://localhost:3000) |
| | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| | `JWT_SECRET` | Secret used to sign tokens |
| | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The single hard-coded admin login |
| frontend/.env.local | `NEXT_PUBLIC_API_URL` | API base URL (http://localhost:4000/api) |

Never commit real `.env` files. Only the `.env.example` files are committed.

## API

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT | 200 `{ accessToken, user }` |
| GET | `/api/students?search=&page=&limit=` | List students (search is optional; `page` enables pagination, total in `X-Total-Count` header) | 200 `[...]` |
| GET | `/api/students/:id` | One student | 200 `{ student }` |
| POST | `/api/students` | Create | 201 `{ student }` |
| PUT | `/api/students/:id` | Update (full or partial) | 200 `{ student }` |
| DELETE | `/api/students/:id` | Delete | 200 `{ message }` |

All `/api/students` routes need the header `Authorization: Bearer <token>`.
Errors: `400` validation, `401` no/invalid token, `404` student not found, `409` duplicate email.

### Validation rules

first_name / last_name 2-50 chars; email valid and unique; phone optional, exactly 10 digits; date_of_birth valid ISO date and at least 16 years old; year integer 1-4; gender Male/Female/Other; status Active/Inactive.

## Postman

Import `backend/postman/student-management-system.postman_collection.json`. Run **Login** first - its test script stores the token in a collection variable, and the other requests use it.

## Screenshots

Add 3-4 screenshots to `docs/screenshots/` (landing, login, dashboard, add student) and link them here:

```md
![Landing](docs/screenshots/landing.png)
```

## Production notes

`synchronize: true` is for development only. In production, disable it and use TypeORM **migrations** so schema changes are versioned and safe.

## How the pieces fit together (for your demo)

1. **Login**: the browser POSTs email + password to `/api/auth/login`. `AuthService` compares them with `.env`, signs a 1-day JWT and returns it. The frontend stores it in `localStorage`.
2. **Every request after that**: the axios interceptor in `lib/api.ts` adds `Authorization: Bearer <token>`. `JwtGuard` verifies it; a bad token gives 401 and the interceptor sends the user back to `/login`.
3. **Protecting pages**: `app/dashboard/layout.tsx` checks for a token before rendering anything under `/dashboard`.
4. **Validation**: `class-validator` decorators in `create-student.dto.ts` run through the global `ValidationPipe` in `main.ts`. `StudentForm.tsx` repeats the same rules for instant feedback.
5. **Database**: `Student` entity -> TypeORM -> MySQL `students` table. `StudentsService` holds the logic (search, duplicate-email check, 404s); the controller only routes.

## Suggested 5-day plan and commits

| Day | Do | Example commit |
|---|---|---|
| 1 | Set up repo, run both apps, connect MySQL | `chore: scaffold backend and frontend` |
| 2 | Student entity, DTOs, CRUD | `feat: add student CRUD endpoints` |
| 3 | Auth + guard, Postman collection, landing page | `feat: add JWT login and guard` |
| 4 | Login page, dashboard list, search, delete modal | `feat: dashboard with search and delete` |
| 5 | Add/Edit forms, README, screenshots, demo | `docs: finish README with screenshots` |

## Bonus ideas

Server-side pagination UI (the API already supports `page`/`limit`), users table with bcrypt, Swagger, Docker Compose, Jest tests for `StudentsService`, CSV export.
