/**
 * Get today's date string in Asia/Kolkata timezone (YYYY-MM-DD format)
 * @returns {string} Date string like "2026-11-12"
 */
const getTodayDateIST = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

/**
 * Get current time in Asia/Kolkata timezone
 * @returns {object} { hour, minute, timeString }
 */
const getCurrentTimeIST = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = parseInt(parts.find((p) => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute').value, 10);
  return {
    hour,
    minute,
    timeString: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  };
};

/**
 * Check if the shift has ended for today based on shiftEnd time (e.g. "16:00")
 * @param {string} shiftEnd 
 * @returns {boolean}
 */
const isShiftEnded = (shiftEnd = '16:00') => {
  const { hour, minute } = getCurrentTimeIST();
  const [endHour, endMinute] = shiftEnd.split(':').map(Number);
  return hour > endHour || (hour === endHour && minute >= endMinute);
};

/**
 * Calculate working minutes between punch-in and punch-out
 * @param {Date} punchIn - Punch-in timestamp
 * @param {Date} punchOut - Punch-out timestamp
 * @returns {number} Working minutes (rounded down)
 */
const calculateWorkingMinutes = (punchIn, punchOut) => {
  const diffMs = new Date(punchOut) - new Date(punchIn);
  return Math.floor(diffMs / 60000);
};

/**
 * Determine attendance status based on working minutes and settings thresholds
 * @param {number} workingMinutes - Total working minutes
 * @param {object} settings - Settings document with presentThreshold, halfDayThreshold, breakDeduction
 * @returns {string} 'present', 'half-day', or 'absent'
 */
const determineStatus = (workingMinutes, settings) => {
  const effectiveMinutes = workingMinutes - (settings.breakDeduction || 0);

  if (effectiveMinutes >= settings.presentThreshold) {
    return 'present';
  } else if (effectiveMinutes >= settings.halfDayThreshold) {
    return 'half-day';
  } else {
    return 'absent';
  }
};

module.exports = {
  getTodayDateIST,
  getCurrentTimeIST,
  isShiftEnded,
  calculateWorkingMinutes,
  determineStatus,
};
