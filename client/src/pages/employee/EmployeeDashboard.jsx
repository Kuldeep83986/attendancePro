import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import CameraCapture from '../../components/CameraCapture';
import StatusBadge from '../../components/StatusBadge';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Camera,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Camera modal state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [punchType, setPunchType] = useState('in');
  const [submittingPunch, setSubmittingPunch] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Photo viewer modal
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic greeting based on current hour in IST
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/my?page=1&limit=30'),
      ]);
      setTodayData(todayRes.data);
      setHistoryRecords(historyRes.data?.records || []);
    } catch (err) {
      console.error('Fetch employee dashboard data failed:', err);
      setFeedback({
        type: 'error',
        message: 'Unable to refresh attendance status. Please reload.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openCameraForPunch = (type) => {
    setPunchType(type);
    setCameraOpen(true);
    setFeedback({ type: '', message: '' });
  };

  const handlePhotoCaptured = async (blob) => {
    const isPunchIn = punchType === 'in';
    const endpoint = isPunchIn ? '/attendance/punch-in' : '/attendance/punch-out';

    try {
      setSubmittingPunch(true);
      setFeedback({ type: '', message: '' });

      const formData = new FormData();
      formData.append('photo', blob, `punch_${punchType}_${Date.now()}.jpg`);

      await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFeedback({
        type: 'success',
        message: isPunchIn
          ? '✓ Punch-In recorded successfully! Live camera verification complete.'
          : '✓ Punch-Out recorded successfully! Your shift has been finalized.',
      });

      await fetchDashboardData();
    } catch (err) {
      console.error('Punch action failed:', err);
      const msg = err.response?.data?.message || `Failed to record punch-${punchType}. Please try again.`;
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSubmittingPunch(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Compute stats from personal history records
  const presentDays = historyRecords.filter((r) => r.status === 'present').length;
  const halfDays = historyRecords.filter((r) => r.status === 'half-day').length;
  const absentDays = historyRecords.filter((r) => r.status === 'absent').length;
  const totalMinutes = historyRecords.reduce((acc, curr) => acc + (curr.workingMinutes || 0), 0);
  const totalHoursWorked = (totalMinutes / 60).toFixed(1);

  const attendance = todayData?.attendance;
  const hasPunchedIn = !!attendance?.punchIn;
  const hasPunchedOut = !!attendance?.punchOut;
  const isComplete = attendance?.isComplete;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* 1. Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Employee Portal</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-mono text-slate-500 font-semibold">{user?.employeeId || 'Staff'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's your attendance overview for today.
          </p>
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center gap-3 self-start sm:self-center px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block leading-none">
              IST • Asia/Kolkata
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400 leading-none mt-1 block">
              {currentTime.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
          <button
            onClick={fetchDashboardData}
            title="Refresh attendance"
            disabled={loading}
            className="ml-2 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications / Toast Banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-fade-in-up ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {/* 2. Today's Attendance Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Today's Attendance Status
            </h2>
          </div>
          {attendance ? (
            <StatusBadge status={attendance.status} />
          ) : (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Not Punched In
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-blue-600" /> Punch In
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 font-mono">
                {hasPunchedIn ? formatTime(attendance.punchIn) : '--:--'}
              </p>
              {attendance?.punchInPhoto && (
                <button
                  type="button"
                  onClick={() => setSelectedPhoto({ url: attendance.punchInPhoto, label: "Today's Punch-In Snap" })}
                  className="mt-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> View Photo
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5 text-emerald-600" /> Punch Out
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 font-mono">
                {hasPunchedOut ? formatTime(attendance.punchOut) : '--:--'}
              </p>
              {attendance?.punchOutPhoto && (
                <button
                  type="button"
                  onClick={() => setSelectedPhoto({ url: attendance.punchOutPhoto, label: "Today's Punch-Out Snap" })}
                  className="mt-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> View Photo
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Working Hours
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {attendance?.workingMinutes ? (
                  `${Math.floor(attendance.workingMinutes / 60)}h ${attendance.workingMinutes % 60}m`
                ) : hasPunchedIn && !hasPunchedOut ? (
                  <span className="text-xs text-blue-600 font-semibold italic">In Progress</span>
                ) : (
                  '0h 0m'
                )}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Server computed</span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold uppercase text-blue-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Current Shift
              </span>
              <p className="text-sm font-extrabold text-blue-950 mt-1 font-mono">
                7:00 AM – 4:00 PM
              </p>
              <span className="text-[11px] text-blue-700 mt-1 block">0 min break deduction</span>
            </div>
          </div>

          {/* 3. Punch-in / Punch-out Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Punch In Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                !hasPunchedIn
                  ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/90 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Camera className="w-5 h-5" />
                </div>
                {!hasPunchedIn && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    Shift Pending
                  </span>
                )}
                {hasPunchedIn && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ✓ Recorded
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">Start Your Shift</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Capture a live store photo to mark your attendance.
              </p>

              <button
                type="button"
                onClick={() => openCameraForPunch('in')}
                disabled={hasPunchedIn || submittingPunch}
                className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                {hasPunchedIn ? 'Punch-In Completed' : 'Punch In Now'}
              </button>
            </div>

            {/* Punch Out Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                hasPunchedIn && !hasPunchedOut
                  ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-emerald-200/90 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Camera className="w-5 h-5" />
                </div>
                {hasPunchedIn && !hasPunchedOut && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Ready to Complete
                  </span>
                )}
                {hasPunchedOut && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ✓ Shift Ended
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">End Your Shift</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Capture a live store photo to complete your attendance.
              </p>

              <button
                type="button"
                onClick={() => openCameraForPunch('out')}
                disabled={!hasPunchedIn || hasPunchedOut || submittingPunch}
                className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                {hasPunchedOut
                  ? 'Punch-Out Completed'
                  : !hasPunchedIn
                  ? 'Punch In First'
                  : 'Punch Out Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Present Days</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{presentDays}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">≥ 9 hours worked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Half Days</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{halfDays}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">4 to &lt;9 hours</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Absent Days</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">{absentDays}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">&lt; 4 hours</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Total Working Hours</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalHoursWorked}h</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">Past records total</span>
        </div>
      </div>

      {/* 5. Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Attendance Records</h3>
            <p className="text-[11px] text-slate-500">Your verified store attendance history</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Loading records...</span>
          </div>
        ) : historyRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No past attendance records found. Your shifts will appear here once recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Punch In</th>
                  <th className="px-6 py-3">Punch Out</th>
                  <th className="px-6 py-3">Working Hours</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Verified Photos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyRecords.slice(0, 10).map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {formatDate(r.workDate)}
                      <span className="block text-[10px] font-mono text-slate-400 font-normal">{r.workDate}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      {formatTime(r.punchIn)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      {formatTime(r.punchOut)}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {r.workingMinutes ? `${Math.floor(r.workingMinutes / 60)}h ${r.workingMinutes % 60}m` : '--'}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.punchInPhoto ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPhoto({ url: r.punchInPhoto, label: `Punch-In Snap (${r.workDate})` })}
                            className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all shrink-0"
                            title="View In Photo"
                          >
                            <img src={r.punchInPhoto} alt="In" className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300">--</span>
                        )}

                        {r.punchOutPhoto && (
                          <button
                            type="button"
                            onClick={() => setSelectedPhoto({ url: r.punchOutPhoto, label: `Punch-Out Snap (${r.workDate})` })}
                            className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                            title="View Out Photo"
                          >
                            <img src={r.punchOutPhoto} alt="Out" className="w-full h-full object-cover" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handlePhotoCaptured}
        title={punchType === 'in' ? 'Start Your Shift: Punch In' : 'End Your Shift: Punch Out'}
      />

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-800">{selectedPhoto.label}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt="Verification capture"
                className="max-h-80 w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
