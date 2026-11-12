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
  Store,
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Camera modal state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [punchType, setPunchType] = useState('in'); // 'in' or 'out'
  const [submittingPunch, setSubmittingPunch] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's status
  const fetchTodayStatus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/attendance/today');
      setTodayData(data);
    } catch (err) {
      console.error('Fetch today attendance failed:', err);
      setFeedback({
        type: 'error',
        message: 'Unable to load today attendance status. Please refresh.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
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

      const { data } = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFeedback({
        type: 'success',
        message: isPunchIn
          ? '✓ Punch-In recorded successfully! Have a productive shift.'
          : '✓ Punch-Out recorded successfully! Attendance finalized for today.',
      });

      // Reload today's status
      await fetchTodayStatus();
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

  const attendance = todayData?.attendance;
  const hasPunchedIn = !!attendance?.punchIn;
  const hasPunchedOut = !!attendance?.punchOut;
  const isComplete = attendance?.isComplete;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Welcome / Profile Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
              {user?.name?.charAt(0) || 'E'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{user?.name}</h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  {user?.employeeId || 'Staff Member'}
                </span>
                <span>• Supermarket Floor Staff</span>
              </p>
            </div>
          </div>
          <button
            onClick={fetchTodayStatus}
            title="Refresh status"
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* Live Digital Clock Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Current Time (IST)</span>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-emerald-400">
              {currentTime.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Fixed Shift</span>
            <p className="text-sm font-bold text-slate-200">7:00 AM – 4:00 PM</p>
            <span className="text-[11px] text-slate-400">Asia/Kolkata</span>
          </div>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {feedback.message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Today Attendance Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden mb-6">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">
              Today's Attendance Status
            </span>
          </div>
          {attendance ? (
            <StatusBadge status={attendance.status} />
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Not Punched In
            </span>
          )}
        </div>

        <div className="p-6">
          {/* Times Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-blue-600" /> Punch-In
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {hasPunchedIn ? formatTime(attendance.punchIn) : '--:--'}
              </p>
              {attendance?.punchInPhoto && (
                <a
                  href={attendance.punchInPhoto}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  <Camera className="w-3 h-3" /> View In Photo
                </a>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5 text-emerald-600" /> Punch-Out
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {hasPunchedOut ? formatTime(attendance.punchOut) : '--:--'}
              </p>
              {attendance?.punchOutPhoto && (
                <a
                  href={attendance.punchOutPhoto}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  <Camera className="w-3 h-3" /> View Out Photo
                </a>
              )}
            </div>
          </div>

          {/* Working Hours Info Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-900">Total Working Duration</span>
              <p className="text-lg font-extrabold text-blue-950 mt-0.5">
                {attendance?.workingMinutes ? (
                  <>
                    {Math.floor(attendance.workingMinutes / 60)} hrs{' '}
                    {attendance.workingMinutes % 60} mins
                  </>
                ) : hasPunchedIn && !hasPunchedOut ? (
                  <span className="text-xs font-medium text-blue-700 italic">
                    Shift in progress (computed on punch-out)
                  </span>
                ) : (
                  '0 hrs 0 mins'
                )}
              </p>
            </div>
            {isComplete && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                Finalized
              </span>
            )}
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-3">
            {!hasPunchedIn && (
              <button
                type="button"
                onClick={() => openCameraForPunch('in')}
                disabled={submittingPunch}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3 text-base transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                Punch In (Live Camera Required)
              </button>
            )}

            {hasPunchedIn && !hasPunchedOut && (
              <button
                type="button"
                onClick={() => openCameraForPunch('out')}
                disabled={submittingPunch}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-3 text-base transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                Punch Out (Live Camera Required)
              </button>
            )}

            {hasPunchedIn && hasPunchedOut && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-950">Shift Completed for Today</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your punch-in and punch-out records have been finalized by the system.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 border border-slate-200">
        <p className="font-semibold text-slate-800 mb-1">Supermarket Attendance Rules:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-500">
          <li>Full Day (Present): ≥ 9 hours worked.</li>
          <li>Half Day: 4 to below 9 hours worked.</li>
          <li>Absent: Below 4 hours worked.</li>
          <li>All timestamps are recorded from the server clock at the moment of camera verification.</li>
        </ul>
      </div>

      {/* Live Camera Modal */}
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handlePhotoCaptured}
        title={punchType === 'in' ? 'Camera Verification: Punch In' : 'Camera Verification: Punch Out'}
      />
    </div>
  );
};

export default EmployeeDashboard;

