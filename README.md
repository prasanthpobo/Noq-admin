# NoQ Clinic Web Admin

Full-stack production-ready clinic administration dashboard — React + TypeScript + Tailwind frontend, Node.js + Express + MongoDB backend.

## Project Structure

```
noq-admin/
├── frontend/          # Vite + React 18 + TypeScript + Tailwind
└── server/            # Node.js + Express + MongoDB + JWT
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local `mongodb://localhost:27017` or Atlas)

### 2. Backend

```bash
cd server
cp .env.example .env       # Edit MONGO_URI + JWT_SECRET
npm install
npm run seed               # Seeds DB: clinic, 6 doctors, 8 patients
npm run dev                # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

### 4. Demo Login

| Email             | Password  | Role        |
|-------------------|-----------|-------------|
| admin@noq.health  | admin123  | Super admin |

---

## API Endpoints

Base: `http://localhost:5000/api`

| Method | Endpoint                      | Auth | Description          |
|--------|-------------------------------|------|----------------------|
| POST   | /auth/login                   | —    | Login → JWT token    |
| POST   | /auth/register                | —    | Register user        |
| GET    | /auth/me                      | JWT  | Current user         |
| GET    | /patients                     | JWT  | List patients        |
| POST   | /patients                     | JWT  | Create patient       |
| GET    | /patients/stats               | JWT  | Tag counts           |
| PUT    | /patients/:id                 | JWT  | Update patient       |
| DELETE | /patients/:id                 | JWT  | Delete patient       |
| GET    | /doctors                      | JWT  | List doctors         |
| POST   | /doctors                      | JWT  | Create doctor        |
| PUT    | /doctors/:id                  | JWT  | Update doctor        |
| DELETE | /doctors/:id                  | JWT  | Delete doctor        |
| GET    | /appointments                 | JWT  | List appointments    |
| POST   | /appointments                 | JWT  | Book appointment     |
| GET    | /appointments/stats           | JWT  | Dashboard stats      |
| PATCH  | /appointments/:id/status      | JWT  | Change status        |
| GET    | /tickets                      | JWT  | List tickets         |
| POST   | /tickets                      | JWT  | Create ticket        |
| POST   | /tickets/:id/messages         | JWT  | Add reply            |
| PATCH  | /tickets/:id/status           | JWT  | Change status        |

---

## Sample curl Tests

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@noq.health","password":"admin123"}'

# 2. Authenticated requests (replace TOKEN)
TOKEN="eyJ..."

# List patients
curl http://localhost:5000/api/patients -H "Authorization: Bearer $TOKEN"

# Create patient
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"firstName":"Arjun","lastName":"Mehta","gender":"M","age":40,"phone":"+91 99000 11111","tag":"new"}'

# Book appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"patient":"<PATIENT_ID>","doctor":"<DOCTOR_ID>","date":"2026-05-15T09:30:00Z","slot":"09:30 AM"}'

# Create support ticket
curl -X POST http://localhost:5000/api/tickets \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Login OTP not received","description":"New doctor cannot log in","category":"Technical","priority":"High"}'
```

---

## Tech Stack

| Layer     | Stack                                          |
|-----------|------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite 8, Tailwind v4      |
| Routing   | React Router v7                                |
| HTTP      | Axios                                          |
| Charts    | Recharts                                       |
| Icons     | React Icons (HeroIcons)                        |
| Backend   | Node.js, Express 5, MongoDB, Mongoose          |
| Auth      | JWT + bcryptjs                                 |

---

## Feature Status

| Page / Module        | Status              |
|----------------------|---------------------|
| Login + JWT auth     | ✅ Complete          |
| Dashboard            | ✅ Complete (charts) |
| Appointments/Tokens  | ✅ Complete          |
| Doctors (CRUD)       | ✅ Complete          |
| Patients (CRUD)      | ✅ Complete          |
| Support Tickets      | ✅ Complete          |
| Settings             | ✅ Complete          |
| Clinics              | 🔧 API ready, UI stub|
| Nurses / Front Desk  | 🔧 API ready, UI stub|
| Billing / Pharmacy   | 🔧 API ready, UI stub|
| Reports              | 🔧 API ready, UI stub|