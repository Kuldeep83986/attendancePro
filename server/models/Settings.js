const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    shiftStart: {
      type: String,
      default: '07:00',
    },
    shiftEnd: {
      type: String,
      default: '16:00',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    breakDeduction: {
      type: Number,
      default: 0,
    },
    presentThreshold: {
      type: Number,
      default: 540, // 9 hours in minutes
    },
    halfDayThreshold: {
      type: Number,
      default: 240, // 4 hours in minutes
    },
  },
  { timestamps: true }
);

// Get the singleton settings document, create with defaults if none exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);

