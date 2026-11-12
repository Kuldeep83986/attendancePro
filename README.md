# AttendancePro — Supermarket Employee Attendance Management System

**AttendancePro Version 1.0** is a simple, robust employee attendance management system specifically designed for a single supermarket.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React icons (100% JSX, Context API authentication)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer, Cloudinary
- **Database**: 3 Collections (`Users`, `Attendances`, `Settings`) with compound unique indexing

---

## 🚀 How to Run the Complete Application

### 1. Start Backend Server
```bash
cd server
npm install
npm run seed     # Seeds default store manager admin account
npm run dev      # Runs Express API on http://localhost:5000
```

### 2. Start Frontend Client (in a second terminal)
```bash
cd client
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔑 Default Credentials

- **Admin Account (Store Manager)**:
  - **Email**: `admin@attendancepro.com`
  - **Password**: `Admin@123`
- **Employee Registration**:
  - Staff can self-register at `/register`
  - Admin approves requests in `/admin/approvals` and assigns auto-incrementing Employee IDs (`EMP-001`, `EMP-002`, etc.)

---

## 📋 Attendance Rules & Workflow

1. **Shift Schedule**:
   - Fixed Shift: **7:00 AM – 4:00 PM** (`Asia/Kolkata` IST)
   - Break Deduction: **0 minutes**
2. **Attendance Brackets**:
   - **≥ 9 hours (540 mins)**: `Present` (Full Day)
   - **4 to < 9 hours (240–539 mins)**: `Half-day`
   - **< 4 hours (< 240 mins)**: `Absent`
   - **Unpunched Shift**: Automatically flagged as `Absent` after 4:00 PM when finalized by admin.
   - **Incomplete Punch-Out**: Flagged as `Incomplete` for admin review without fabricating punch-out times.
3. **Mandatory Live Camera Verification**:
   - Both punch-in and punch-out require live photo capture via the browser MediaDevices API.
   - Gallery file uploads are strictly disabled to prevent buddy punching and photo spoofing.
   - Photos are securely stored on Cloudinary via the backend.
4. **Audit Governance**:
   - Admins can adjust records with a mandatory justification reason.
   - Immutable audit trail records `correctedBy`, `field`, `oldValue`, `newValue`, `reason`, and `timestamp`.

---

## 🧪 Testing

```bash
# Run backend test suite (73 tests covering auth, RBAC, rules, and APIs)
cd server
npm test

# Run full attendance cycle flow tests (multipart upload & audit logs)
npm run test:flow
```
