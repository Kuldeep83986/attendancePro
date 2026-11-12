import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  CalendarCheck,
  Check,
  ArrowRight,
  TrendingUp,
  Camera,
  LogIn,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Settings,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, attendanceRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/attendance?page=1&limit=8'),
      ]);
      setStats(statsRes.data);
      setRecentRecords(attendanceRes.data?.records || []);
    } catch (err) {
      console.error('Fetch dashboard data failed:', err);
      setFeedback({ type: 'error', message: 'Failed to load dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFinalizeDay = async () => {
    if (
      !window.confirm(
        "Finalize today's attendance? Unpunched employees will be marked Absent and any unclosed punch-ins will be flagged for review."
      )
    ) {
      return;
    }

    try {
      setFinalizing(true);
      setFeedback(null);
      const { data } = await api.post('/admin/attendance/finalize-day', { force: true });
      setFeedback({
        type: 'success',
        message: `Day finalized successfully: ${data.absentMarked} marked absent, ${data.incompleteReviewed} unclosed punch-outs reviewed.`,
      });
      await fetchDashboardData();
    } catch (err) {
      console.error('Finalize day failed:', err);
      const msg = err.response?.data?.message || 'Failed to finalize attendance day.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setFinalizing(false);
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
      month: 'short',
      day: 'numeric',
    });
  };

  // Compute breakdown percentages for Attendance Overview Bar
  const totalEmp = stats?.totalEmployees || 0;
  const presentCount = stats?.today?.present || 0;
  const halfDayCount = stats?.today?.halfDay || 0;
  const absentCount = stats?.today?.absent || 0;
  const incompleteCount = stats?.today?.incomplete || 0;
  const notPunchedCount = stats?.today?.notPunchedIn || 0;

  const presentPct = totalEmp > 0 ? ((presentCount / totalEmp) * 100).toFixed(0) : 0;
  const halfDayPct = totalEmp > 0 ? ((halfDayCount / totalEmp) * 100).toFixed(0) : 0;
  const absentPct = totalEmp > 0 ? ((absentCount / totalEmp) * 100).toFixed(0) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Supermarket Workforce Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {getGreeting()}, Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor your team's attendance and daily workforce activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh
          </button>

          <button
            onClick={handleFinalizeDay}
            disabled={finalizing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            {finalizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Finalize Day Attendance
          </button>
        </div>
      </div>

      {feedback && (
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

      {/* 2. 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Employees</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalEmployees ?? '--'}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active approved floor staff</span>
        </div>

        {/* Present Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Present Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats?.today?.present ?? '--'}</p>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">≥ 9 hours ({presentPct}% of staff)</span>
        </div>

        {/* Half-Day Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Half-Day Today</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats?.today?.halfDay ?? '--'}</p>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">4 to &lt;9 hours</span>
        </div>

        {/* Absent Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Absent Today</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600">{stats?.today?.absent ?? '--'}</p>
          <span className="text-[11px] text-rose-700 mt-1 block font-medium">&lt; 4 hours or unpunched</span>
        </div>
      </div>

      {/* 3. Attendance Overview Visual Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Attendance Distribution Overview</h3>
            <p className="text-xs text-slate-500">Real-time status breakdown for date: <strong>{stats?.today?.date || 'Today'}</strong></p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present ({presentCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Half-Day ({halfDayCount})
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Absent ({absentCount})
            </span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Incomplete ({incompleteCount})
            </span>
          </div>
        </div>

        {/* Visual Multi-Segment Distribution Bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {totalEmp > 0 ? (
            <>
              <div style={{ width: `${(presentCount / totalEmp) * 100}%` }} className="bg-emerald-500 transition-all"></div>
              <div style={{ width: `${(halfDayCount / totalEmp) * 100}%` }} className="bg-amber-500 transition-all"></div>
              <div style={{ width: `${(absentCount / totalEmp) * 100}%` }} className="bg-rose-500 transition-all"></div>
              <div style={{ width: `${(incompleteCount / totalEmp) * 100}%` }} className="bg-indigo-500 transition-all"></div>
              <div style={{ width: `${(notPunchedCount / totalEmp) * 100}%` }} className="bg-slate-300 transition-all"></div>
            </>
          ) : (
            <div className="w-full bg-slate-200"></div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
          <span>Shift Window: 7:00 AM – 4:00 PM (Asia/Kolkata)</span>
          <span>{notPunchedCount} staff yet to punch in today</span>
        </div>
      </div>

      {/* 4. Recent Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Workforce Punches</h3>
            <p className="text-xs text-slate-500">Latest employee attendance logs</p>
          </div>
          <Link
            to="/admin/attendance"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Records <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Loading recent logs...</span>
          </div>
        ) : recentRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No attendance records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Employee ID</th>
                  <th className="px-6 py-3">Punch In</th>
                  <th className="px-6 py-3">Punch Out</th>
                  <th className="px-6 py-3">Working Hours</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-[11px]">
                          {r.employee?.name?.charAt(0) || 'E'}
                        </div>
                        <span className="font-bold text-slate-900">{r.employee?.name || 'Staff Member'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-blue-600">
                      {r.employee?.employeeId || '--'}
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
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to="/admin/attendance"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/approvals"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Registration Requests</h4>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats?.pendingApprovals ?? 0} staff awaiting authorization
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/employees"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">Store Staff Directory</h4>
            </div>
            <p className="text-xs text-slate-500 mt-1">View phone numbers and IDs</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/settings"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Shift & Rule Settings</h4>
            </div>
            <p className="text-xs text-slate-500 mt-1">Shift window & duration brackets</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
