import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  CalendarCheck,
  Check,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Fetch dashboard stats failed:', err);
      setActionFeedback({ type: 'error', message: 'Failed to load dashboard statistics.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFinalizeDay = async () => {
    if (!window.confirm("Finalize today's attendance? Unpunched employees will be marked Absent and any unclosed punch-ins will be flagged for review.")) {
      return;
    }

    try {
      setFinalizing(true);
      setActionFeedback(null);
      const { data } = await api.post('/admin/attendance/finalize-day', { force: true });
      setActionFeedback({
        type: 'success',
        message: `Day finalized successfully: ${data.absentMarked} marked absent, ${data.incompleteReviewed} incomplete punch-outs reviewed.`,
      });
      await fetchStats();
    } catch (err) {
      console.error('Finalize day failed:', err);
      const msg = err.response?.data?.message || 'Failed to finalize attendance day.';
      setActionFeedback({ type: 'error', message: msg });
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Attendance Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time supermarket employee attendance status for <strong>{stats?.today?.date || 'Today'}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleFinalizeDay}
            disabled={finalizing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
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

      {actionFeedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Employees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Staff</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalEmployees ?? '--'}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active supermarket employees</span>
        </div>

        {/* Present Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Day (Present)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats?.today?.present ?? '--'}</p>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">≥ 9 Hours worked</span>
        </div>

        {/* Half Day Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Half-Day</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats?.today?.halfDay ?? '--'}</p>
          <span className="text-[11px] text-amber-600 mt-1 block font-medium">4 to &lt; 9 Hours worked</span>
        </div>

        {/* Absent Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Absent</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600">{stats?.today?.absent ?? '--'}</p>
          <span className="text-[11px] text-rose-600 mt-1 block font-medium">&lt; 4 Hours worked</span>
        </div>
      </div>

      {/* Secondary Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Registration Requests Alert */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Registrations</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.pendingApprovals ?? 0}</p>
            <span className="text-[11px] text-slate-400">Awaiting your approval</span>
          </div>
          <Link
            to="/admin/approvals"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Incomplete Punch-Outs Alert */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Incomplete Punch-Outs</span>
            <p className="text-2xl font-bold text-purple-900 mt-1">{stats?.today?.incomplete ?? 0}</p>
            <span className="text-[11px] text-purple-600">Punched in without punch out</span>
          </div>
          <Link
            to="/admin/attendance"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors inline-flex items-center gap-1"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Not Punched In Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Not Yet Punched In</span>
            <p className="text-2xl font-bold text-slate-700 mt-1">{stats?.today?.notPunchedIn ?? 0}</p>
            <span className="text-[11px] text-slate-400">Shift: 7:00 AM – 4:00 PM</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/attendance"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all group"
          >
            <CalendarCheck className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <h4 className="font-semibold text-slate-900 text-sm">Attendance Records & Photos</h4>
            <p className="text-xs text-slate-500 mt-1">Review live employee snaps and adjust records with audit reasons.</p>
          </Link>

          <Link
            to="/admin/approvals"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 transition-all group"
          >
            <ShieldAlert className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
            <h4 className="font-semibold text-slate-900 text-sm">Approve New Employees</h4>
            <p className="text-xs text-slate-500 mt-1">Approve cashier and floor staff registrations and assign IDs.</p>
          </Link>

          <Link
            to="/admin/employees"
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all group"
          >
            <Users className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-105 transition-transform" />
            <h4 className="font-semibold text-slate-900 text-sm">Staff Directory</h4>
            <p className="text-xs text-slate-500 mt-1">View list of all supermarket employees and contact info.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

