const Attendance = require('../models/Attendance');
const Settings = require('../models/Settings');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const {
  getTodayDateIST,
  calculateWorkingMinutes,
  determineStatus,
} = require('../services/attendanceService');

// @desc    Punch in for today
// @route   POST /api/attendance/punch-in
// @access  Private (Employee)
const punchIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const workDate = getTodayDateIST();

    // Check for existing record today
    const existingRecord = await Attendance.findOne({ employee: employeeId, workDate });
    if (existingRecord) {
      return res.status(400).json({ message: 'You have already punched in today' });
    }

    // Require photo
    if (!req.file) {
      return res.status(400).json({ message: 'Photo capture is required for punch-in' });
    }

    // Upload photo to Cloudinary
    const photoUrl = await uploadToCloudinary(req.file.buffer, 'attendancepro/punch-in');

    // Create attendance record with server timestamp
    const attendance = await Attendance.create({
      employee: employeeId,
      workDate,
      punchIn: new Date(),
      punchInPhoto: photoUrl,
    });

    res.status(201).json({
      message: 'Punch-in recorded successfully',
      attendance,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already punched in today' });
    }
    console.error('Punch-in error:', error);
    res.status(500).json({ message: 'Server error during punch-in' });
  }
};

// @desc    Punch out for today
// @route   POST /api/attendance/punch-out
// @access  Private (Employee)
const punchOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const workDate = getTodayDateIST();

    // Find today's record
    const attendance = await Attendance.findOne({ employee: employeeId, workDate });

    if (!attendance) {
      return res.status(400).json({ message: 'You have not punched in today' });
    }

    if (!attendance.punchIn) {
      return res.status(400).json({ message: 'No punch-in record found for today' });
    }

    if (attendance.punchOut) {
      return res.status(400).json({ message: 'You have already punched out today' });
    }

    if (attendance.isComplete) {
      return res.status(400).json({ message: 'Attendance for today is already finalized' });
    }

    // Require photo
    if (!req.file) {
      return res.status(400).json({ message: 'Photo capture is required for punch-out' });
    }

    // Upload photo to Cloudinary
    const photoUrl = await uploadToCloudinary(req.file.buffer, 'attendancepro/punch-out');

    // Calculate working minutes using server timestamp
    const punchOutTime = new Date();
    const settings = await Settings.getSettings();
    const workingMinutes = calculateWorkingMinutes(attendance.punchIn, punchOutTime);
    const status = determineStatus(workingMinutes, settings);

    // Update attendance record
    attendance.punchOut = punchOutTime;
    attendance.punchOutPhoto = photoUrl;
    attendance.workingMinutes = workingMinutes;
    attendance.status = status;
    attendance.isComplete = true;

    await attendance.save();

    res.json({
      message: 'Punch-out recorded successfully',
      attendance,
    });
  } catch (error) {
    console.error('Punch-out error:', error);
    res.status(500).json({ message: 'Server error during punch-out' });
  }
};

// @desc    Get employee's attendance history
// @route   GET /api/attendance/my
// @access  Private (Employee)
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find({ employee: employeeId })
        .sort({ workDate: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments({ employee: employeeId }),
    ]);

    res.json({
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};

// @desc    Get employee's today attendance status
// @route   GET /api/attendance/today
// @access  Private (Employee)
const getTodayStatus = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const workDate = getTodayDateIST();

    const attendance = await Attendance.findOne({ employee: employeeId, workDate });

    res.json({
      attendance: attendance || null,
      workDate,
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ message: 'Server error fetching today status' });
  }
};

module.exports = { punchIn, punchOut, getMyAttendance, getTodayStatus };

