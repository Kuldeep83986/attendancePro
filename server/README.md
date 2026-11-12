# AttendancePro Backend — Version 1.0

AttendancePro is a simple, robust employee attendance management system built specifically for a single supermarket.

This backend is built on **Node.js**, **Express.js**, **MongoDB** (with Mongoose), **JWT** + **bcryptjs** for authentication/authorization, and **Cloudinary** for secure photo verification.

---

## 📋 Features & Rules Implemented

### 1. Shift & Timezone Rules
- **Fixed Shift**: 7:00 AM to 4:00 PM
- **Timezone**: `Asia/Kolkata` (IST)
- **Break Deduction**: 0 minutes
- **Server-Side Timestamps**: All timestamps are generated on the server using `new Date()` and localized with `Intl.DateTimeFormat` in `Asia/Kolkata`.

### 2. Working Hours & Status Calculations
- **Working Duration**: `(punchOut - punchIn)` in minutes.
- **≥ 9 hours (540 minutes)**: `present`
- **≥ 4 hours (240 minutes) to < 9 hours**: `half-day`
- **< 4 hours (240 minutes)**: `absent`
- **No punch-in**: Automatically marked `absent` when attendance day is finalized after shift ends.
- **Incomplete punch-out**: Marked `incomplete` with `status: absent` for admin review without inventing punch-out times.

### 3. Role-Based Access Control (RBAC)
- **Admin**:
  - Review & approve/reject employee registrations.
  - View dashboard statistics (total employees, today present, half-day, absent, incomplete, not punched in).
  - View all employee profiles and full attendance records.
  - View punch-in and punch-out live capture photos.
  - Correct attendance records with mandatory reason and preserved audit trail history.
  - Finalize daily attendance after shift ends.
  - View and update system shift & threshold settings.
- **Employee**:
  - Self-registration (requires admin approval before any attendance access).
  - Punch In with mandatory live camera capture (uploaded to Cloudinary via backend).
  - Punch Out with mandatory live camera capture.
  - View today's punch status and own historical attendance records (pagination supported).
  - Strictly blocked from seeing other employees' records or altering records manually.

---

## 🗄️ Database Architecture (3 Collections)

1. **Users** (`User.js`):
   - `name`, `email` (unique), `phone`, `password` (hashed with bcrypt, 10 rounds, `select: false`), `employeeId` (auto-formatted e.g. `EMP-001` on approval), `role` (`admin` | `employee`), `status` (`pending` | `approved` | `rejected`).
2. **Attendances** (`Attendance.js`):
   - `employee` (ref `User`), `workDate` (YYYY-MM-DD in IST), `punchIn` (timestamp), `punchInPhoto` (Cloudinary URL), `punchOut` (timestamp), `punchOutPhoto` (Cloudinary URL), `workingMinutes` (Number), `status` (`present` | `half-day` | `absent` | `pending`), `isComplete` (Boolean).
   - `corrections` (Audit trail array: `correctedBy`, `field`, `oldValue`, `newValue`, `reason`, `correctedAt`).
   - **Compound Unique Index**: `{ employee: 1, workDate: 1 }` ensures an employee can never have duplicate attendance records on the same day.
3. **Settings** (`Settings.js`):
   - `shiftStart` (default `07:00`), `shiftEnd` (default `16:00`), `timezone` (`Asia/Kolkata`), `breakDeduction` (default `0`), `presentThreshold` (`540`), `halfDayThreshold` (`240`).

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendancepro
JWT_SECRET=your_jwt_secret_here_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_SETUP_KEY=AttendancePro_Setup_2026
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Setup & Installation

```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies
npm install

# 3. Seed the default admin user (or use /api/auth/setup-admin)
npm run seed

# 4. Start development server
npm run dev

# 5. Start production server
npm start
```

---

## 🧪 Testing

The backend includes comprehensive automated test suites:

```bash
# Run comprehensive API integration tests (73 tests covering auth, RBAC, models, validations, settings, etc.)
npm test

# Run full attendance cycle flow tests (multipart file upload parsing, attendance calculations, duplicate checks, audit trail)
npm run test:flow
```

---

## 📡 Complete API Reference

Base URL: `http://localhost:5000/api`

### 1. Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health & timestamp check |

### 2. Authentication (`/api/auth`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/setup-admin` | Public (Requires Key) | `{ name, email, phone, password, setupKey }` | One-time secure admin creation |
| `POST` | `/register` | Public | `{ name, email, phone, password }` | Employee self-registration (status set to `pending`) |
| `POST` | `/login` | Public | `{ email, password }` | Login for admin and approved employees (returns JWT) |
| `GET` | `/me` | Authenticated | Header: `Bearer <token>` | Get profile of current logged-in user |

### 3. Employee Attendance (`/api/attendance`)
| Method | Endpoint | Access | Details | Description |
|---|---|---|---|---|
| `GET` | `/today` | Employee | Header: `Bearer <token>` | Fetch today's punch status and record |
| `POST` | `/punch-in` | Employee | `multipart/form-data` with field `photo` | Record punch-in timestamp and upload photo |
| `POST` | `/punch-out` | Employee | `multipart/form-data` with field `photo` | Record punch-out, calculate hours, determine status |
| `GET` | `/my` | Employee | Query: `?page=1&limit=30` | View own attendance history (sorted latest first) |

### 4. Admin Management (`/api/admin`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `GET` | `/dashboard` | Admin | - | Summary stats (total employees, present, half-day, absent, incomplete, not punched in) |
| `GET` | `/pending` | Admin | - | View pending employee registration requests |
| `PUT` | `/approve/:id` | Admin | Params: `id` | Approve employee registration & assign `employeeId` |
| `PUT` | `/reject/:id` | Admin | Params: `id` | Reject employee registration |
| `GET` | `/employees` | Admin | - | View all employees with status and details |
| `GET` | `/attendance` | Admin | Query: `?page=1&limit=50&date=YYYY-MM-DD&employeeId=EMP-001` | View attendance records with photos and employee details |
| `POST` | `/attendance/finalize-day` | Admin | `{ date?: "YYYY-MM-DD", force?: boolean }` | Finalize day: mark absent for unpunched employees after 4 PM |
| `PUT` | `/attendance/:id/correct` | Admin | `{ field: "status"\|"workingMinutes"\|"punchIn"\|"punchOut", newValue, reason }` | Correct attendance record & log audit trail entry |
| `GET` | `/settings` | Admin | - | Get shift hours and attendance threshold settings |
| `PUT` | `/settings` | Admin | `{ shiftStart, shiftEnd, breakDeduction, presentThreshold, halfDayThreshold }` | Update system settings |

---

## 📮 Postman Collection
Import `server/AttendancePro.postman_collection.json` directly into Postman to test all endpoints interactively.

