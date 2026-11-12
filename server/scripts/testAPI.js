/**
 * AttendancePro Backend API Test Suite
 * Tests all endpoints without Cloudinary (photo tests are skipped as we use demo credentials).
 * Run: node scripts/testAPI.js
 */
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Settings = require('../models/Settings');

const BASE = 'http://localhost:5000/api';
let adminToken = '';
let employeeToken = '';
let employeeUserId = '';
let attendanceId = '';
let testsPassed = 0;
let testsFailed = 0;

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function assert(testName, condition, details) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`  ✗ ${testName} — ${details || 'FAILED'}`);
    testsFailed++;
  }
}

async function run() {
  console.log('=== AttendancePro Backend API Tests ===\n');

  // Reset database to ensure completely idempotent test execution
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Attendance.deleteMany({});
  await Settings.deleteMany({});
  await mongoose.disconnect();

  // --- Health Check ---
  console.log('1. Health Check');
  const health = await request('GET', '/health');
  assert('GET /api/health returns 200', health.status === 200);
  assert('Health has status ok', health.body.status === 'ok');

  // --- Admin Setup ---
  console.log('\n2. Admin Setup');
  const setupBad = await request('POST', '/auth/setup-admin', {
    name: 'Admin', email: 'admin@test.com', phone: '1111111111',
    password: 'Admin@123', setupKey: 'wrong_key',
  });
  assert('Reject invalid setup key', setupBad.status === 403);

  const setup = await request('POST', '/auth/setup-admin', {
    name: 'Admin', email: 'admin@test.com', phone: '1111111111',
    password: 'Admin@123', setupKey: 'AttendancePro_Setup_2026',
  });
  assert('Create admin with valid key', setup.status === 201);
  assert('Admin role is admin', setup.body.user && setup.body.user.role === 'admin');

  const setupDup = await request('POST', '/auth/setup-admin', {
    name: 'Admin2', email: 'admin2@test.com', phone: '2222222222',
    password: 'Admin@123', setupKey: 'AttendancePro_Setup_2026',
  });
  assert('Reject duplicate admin creation', setupDup.status === 400);

  // --- Admin Login ---
  console.log('\n3. Admin Login');
  const adminLogin = await request('POST', '/auth/login', {
    email: 'admin@test.com', password: 'Admin@123',
  });
  assert('Admin login succeeds', adminLogin.status === 200);
  assert('Admin gets token', !!adminLogin.body.token);
  assert('Admin role confirmed', adminLogin.body.user.role === 'admin');
  adminToken = adminLogin.body.token;

  // --- Admin /me ---
  console.log('\n4. Auth /me');
  const me = await request('GET', '/auth/me', null, adminToken);
  assert('GET /me returns admin profile', me.status === 200 && me.body.user.role === 'admin');

  const meNoToken = await request('GET', '/auth/me');
  assert('GET /me without token returns 401', meNoToken.status === 401);

  // --- Employee Registration ---
  console.log('\n5. Employee Registration');
  const regMissing = await request('POST', '/auth/register', {
    name: '', email: 'bad', phone: '', password: '123',
  });
  assert('Reject invalid registration', regMissing.status === 400);

  const reg = await request('POST', '/auth/register', {
    name: 'John Doe', email: 'john@test.com', phone: '9876543210', password: 'John@123',
  });
  assert('Employee registration succeeds', reg.status === 201);
  assert('Registration message says pending', reg.body.message.includes('approval'));

  const regDup = await request('POST', '/auth/register', {
    name: 'John Doe', email: 'john@test.com', phone: '9876543210', password: 'John@123',
  });
  assert('Reject duplicate email registration', regDup.status === 400);

  // --- Pending Employee Login ---
  console.log('\n6. Pending Employee Login');
  const pendingLogin = await request('POST', '/auth/login', {
    email: 'john@test.com', password: 'John@123',
  });
  assert('Pending employee gets 403', pendingLogin.status === 403);
  assert('Message says pending', pendingLogin.body.message.includes('pending'));

  // --- Admin Approval Flow ---
  console.log('\n7. Admin Approval');
  const pending = await request('GET', '/admin/pending', null, adminToken);
  assert('Get pending registrations', pending.status === 200);
  assert('Has 1 pending user', pending.body.users.length === 1);
  employeeUserId = pending.body.users[0]._id;

  const approve = await request('PUT', `/admin/approve/${employeeUserId}`, null, adminToken);
  assert('Approve employee', approve.status === 200);
  assert('Employee gets employeeId', !!approve.body.user.employeeId);
  assert('Status is approved', approve.body.user.status === 'approved');

  const approveAgain = await request('PUT', `/admin/approve/${employeeUserId}`, null, adminToken);
  assert('Reject re-approval', approveAgain.status === 400);

  // --- Register and Reject another employee ---
  console.log('\n8. Employee Rejection');
  await request('POST', '/auth/register', {
    name: 'Jane Doe', email: 'jane@test.com', phone: '9876543211', password: 'Jane@123',
  });
  const pending2 = await request('GET', '/admin/pending', null, adminToken);
  const janeId = pending2.body.users[0]._id;
  const reject = await request('PUT', `/admin/reject/${janeId}`, null, adminToken);
  assert('Reject employee', reject.status === 200);
  assert('Status is rejected', reject.body.user.status === 'rejected');

  const rejectedLogin = await request('POST', '/auth/login', {
    email: 'jane@test.com', password: 'Jane@123',
  });
  assert('Rejected employee gets 403', rejectedLogin.status === 403);

  // --- Approved Employee Login ---
  console.log('\n9. Approved Employee Login');
  const empLogin = await request('POST', '/auth/login', {
    email: 'john@test.com', password: 'John@123',
  });
  assert('Approved employee login succeeds', empLogin.status === 200);
  assert('Employee gets token', !!empLogin.body.token);
  assert('Employee role confirmed', empLogin.body.user.role === 'employee');
  employeeToken = empLogin.body.token;

  // --- Employee Today Status (no punch yet) ---
  console.log('\n10. Employee Today Status');
  const todayBefore = await request('GET', '/attendance/today', null, employeeToken);
  assert('Today status returns 200', todayBefore.status === 200);
  assert('No attendance record yet', todayBefore.body.attendance === null);

  // --- Punch-In (without photo — should fail since Cloudinary is demo) ---
  console.log('\n11. Punch-In Validation');
  // JSON-based punch-in should fail because no file
  const punchNoPhoto = await request('POST', '/attendance/punch-in', {}, employeeToken);
  assert('Punch-in without photo rejected', punchNoPhoto.status === 400);

  // --- Employee My Attendance ---
  console.log('\n12. Employee Attendance History');
  const myAtt = await request('GET', '/attendance/my', null, employeeToken);
  assert('Get my attendance returns 200', myAtt.status === 200);
  assert('Has records array', Array.isArray(myAtt.body.records));
  assert('Has pagination', !!myAtt.body.pagination);

  // --- Punch-Out without punch-in ---
  console.log('\n13. Punch-Out Validation');
  const punchOutNoPunchIn = await request('POST', '/attendance/punch-out', {}, employeeToken);
  assert('Punch-out without punch-in rejected', punchOutNoPunchIn.status === 400);

  // --- Admin Dashboard ---
  console.log('\n14. Admin Dashboard Stats');
  const dashboard = await request('GET', '/admin/dashboard', null, adminToken);
  assert('Dashboard returns 200', dashboard.status === 200);
  assert('Has totalEmployees', typeof dashboard.body.totalEmployees === 'number');
  assert('Has today stats', !!dashboard.body.today);
  assert('Has present count', typeof dashboard.body.today.present === 'number');

  // --- Admin Get All Employees ---
  console.log('\n15. Admin Get All Employees');
  const allEmp = await request('GET', '/admin/employees', null, adminToken);
  assert('Get employees returns 200', allEmp.status === 200);
  assert('Has employees array', Array.isArray(allEmp.body.employees));
  assert('Has at least 2 employees', allEmp.body.employees.length >= 2);

  // --- Admin Get All Attendance ---
  console.log('\n16. Admin Get All Attendance');
  const allAtt = await request('GET', '/admin/attendance', null, adminToken);
  assert('Get all attendance returns 200', allAtt.status === 200);
  assert('Has records array', Array.isArray(allAtt.body.records));

  // --- Role-Based Access Control ---
  console.log('\n17. Role-Based Access Control');
  const empDashboard = await request('GET', '/admin/dashboard', null, employeeToken);
  assert('Employee cannot access admin dashboard', empDashboard.status === 403);

  const empPending = await request('GET', '/admin/pending', null, employeeToken);
  assert('Employee cannot see pending registrations', empPending.status === 403);

  const noTokenAdmin = await request('GET', '/admin/dashboard');
  assert('No token cannot access admin routes', noTokenAdmin.status === 401);

  // --- Invalid Login ---
  console.log('\n18. Invalid Login Attempts');
  const badPass = await request('POST', '/auth/login', {
    email: 'admin@test.com', password: 'wrong',
  });
  assert('Wrong password returns 401', badPass.status === 401);

  const badEmail = await request('POST', '/auth/login', {
    email: 'nobody@test.com', password: 'test',
  });
  assert('Non-existent email returns 401', badEmail.status === 401);

  // --- Attendance Service Logic Tests ---
  console.log('\n19. Attendance Service Logic (Unit)');
  const {
    getTodayDateIST,
    getCurrentTimeIST,
    isShiftEnded,
    calculateWorkingMinutes,
    determineStatus,
  } = require('../services/attendanceService');

  const todayIST = getTodayDateIST();
  assert('getTodayDateIST returns YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(todayIST));

  const timeIST = getCurrentTimeIST();
  assert('getCurrentTimeIST returns hour and minute', typeof timeIST.hour === 'number' && typeof timeIST.minute === 'number');
  assert('getCurrentTimeIST returns timeString HH:MM', /^\d{2}:\d{2}$/.test(timeIST.timeString));

  assert('isShiftEnded works for 00:00 (past)', isShiftEnded('00:00') === true);
  assert('isShiftEnded works for 23:59 (future)', isShiftEnded('23:59') === false);

  const mins1 = calculateWorkingMinutes(
    new Date('2026-11-12T07:00:00+05:30'),
    new Date('2026-11-12T16:00:00+05:30')
  );
  assert('9-hour shift = 540 minutes', mins1 === 540);

  const mins2 = calculateWorkingMinutes(
    new Date('2026-11-12T07:00:00+05:30'),
    new Date('2026-11-12T12:00:00+05:30')
  );
  assert('5-hour shift = 300 minutes', mins2 === 300);

  const settings = { presentThreshold: 540, halfDayThreshold: 240, breakDeduction: 0 };
  assert('540 min → present', determineStatus(540, settings) === 'present');
  assert('600 min → present', determineStatus(600, settings) === 'present');
  assert('300 min → half-day', determineStatus(300, settings) === 'half-day');
  assert('240 min → half-day', determineStatus(240, settings) === 'half-day');
  assert('239 min → absent', determineStatus(239, settings) === 'absent');
  assert('0 min → absent', determineStatus(0, settings) === 'absent');

  // --- Admin Settings API ---
  console.log('\n20. Admin Settings');
  const getSet = await request('GET', '/admin/settings', null, adminToken);
  assert('Get settings returns 200', getSet.status === 200);
  assert('Default shiftStart is 07:00', getSet.body.settings.shiftStart === '07:00');
  assert('Default shiftEnd is 16:00', getSet.body.settings.shiftEnd === '16:00');
  assert('Default timezone is Asia/Kolkata', getSet.body.settings.timezone === 'Asia/Kolkata');
  assert('Default breakDeduction is 0', getSet.body.settings.breakDeduction === 0);

  const putSet = await request('PUT', '/admin/settings', { breakDeduction: 0, presentThreshold: 540 }, adminToken);
  assert('Update settings returns 200', putSet.status === 200);

  // --- Finalize Attendance Day API ---
  console.log('\n21. Finalize Attendance Day');
  const finalizeRes = await request('POST', '/admin/attendance/finalize-day', { force: true }, adminToken);
  assert('Finalize day with force:true succeeds', finalizeRes.status === 200);
  assert('Finalize response has absentMarked', typeof finalizeRes.body.absentMarked === 'number');

  // Verify that an absent record was created for approved employees who had no punch
  const checkAtt = await request('GET', '/admin/attendance', null, adminToken);
  const absentRecord = checkAtt.body.records.find((r) => r.status === 'absent');
  assert('Absent record created for unpunched employee', !!absentRecord);

  // --- 404 Handler ---
  console.log('\n22. 404 Handler');
  const notFound = await request('GET', '/nonexistent');
  assert('Unknown route returns 404', notFound.status === 404);

  // --- Summary ---
  console.log('\n=============================');
  console.log(`Total: ${testsPassed + testsFailed} | Passed: ${testsPassed} | Failed: ${testsFailed}`);
  console.log('=============================\n');

  if (testsFailed > 0) {
    console.log('⚠ Some tests failed. Review the output above.');
  } else {
    console.log('✅ All tests passed!');
  }
}

run().catch(console.error);

