const express = require('express');
const router = express.Router();
const {
  punchIn,
  punchOut,
  getMyAttendance,
  getTodayStatus,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload');

router.post('/punch-in', protect, authorize('employee'), uploadPhoto, punchIn);
router.post('/punch-out', protect, authorize('employee'), uploadPhoto, punchOut);
router.get('/my', protect, authorize('employee'), getMyAttendance);
router.get('/today', protect, authorize('employee'), getTodayStatus);

module.exports = router;

