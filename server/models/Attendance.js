const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema(
  {
    correctedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    oldValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
    reason: {
      type: String,
      required: true,
    },
    correctedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workDate: {
      type: String,
      required: true,
    },
    punchIn: {
      type: Date,
    },
    punchInPhoto: {
      type: String,
    },
    punchOut: {
      type: Date,
    },
    punchOutPhoto: {
      type: String,
    },
    workingMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['present', 'half-day', 'absent', 'pending'],
      default: 'pending',
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    corrections: [correctionSchema],
  },
  { timestamps: true }
);

// Compound unique index: one record per employee per day
attendanceSchema.index({ employee: 1, workDate: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

