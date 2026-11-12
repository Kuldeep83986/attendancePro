const express = require('express');
const router = express.Router();
const {
  getPendingRegistrations,
  approveUser,
  rejectUser,
  getAllEmployees,
  getAllAttendance,
  getDashboardStats,
  correctAttendance,
  finalizeAttendanceDay,
  getSettings,
  updateSettings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pending', protect, authorize('admin'), getPendingRegistrations);
router.put('/approve/:id', protect, authorize('admin'), approveUser);
router.put('/reject/:id', protect, authorize('admin'), rejectUser);
router.get('/employees', protect, authorize('admin'), getAllEmployees);
router.get('/attendance', protect, authorize('admin'), getAllAttendance);
router.post('/attendance/finalize-day', protect, authorize('admin'), finalizeAttendanceDay);
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.put('/attendance/:id/correct', protect, authorize('admin'), correctAttendance);
router.get('/settings', protect, authorize('admin'), getSettings);
router.put('/settings', protect, authorize('admin'), updateSettings);

module.exports = router;

