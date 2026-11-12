import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // userId being approved/rejected
  const [feedback, setFeedback] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const { data } = await api.get('/admin/pending');
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error('Fetch pending users failed:', err);
      setFeedback({ type: 'error', message: 'Failed to load registration requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (user) => {
    try {
      setActionLoading(user._id);
      setFeedback(null);
      const { data } = await api.put(`/admin/approve/${user._id}`);
      setFeedback({
        type: 'success',
        message: `✓ Approved ${user.name}! Assigned ID: ${data.user.employeeId}`,
      });
      // Remove from list
      setPendingUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      console.error('Approve failed:', err);
      const msg = err.response?.data?.message || `Failed to approve ${user.name}.`;
      setFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (user) => {
    if (!window.confirm(`Are you sure you want to reject ${user.name}'s registration?`)) {
      return;
    }

    try {
      setActionLoading(user._id);
      setFeedback(null);
      await api.put(`/admin/reject/${user._id}`);
      setFeedback({
        type: 'success',
        message: `✓ Rejected registration request for ${user.name}.`,
      });
      setPendingUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      console.error('Reject failed:', err);
      const msg = err.response?.data?.message || `Failed to reject ${user.name}.`;
      setFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Registration Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and approve supermarket floor staff and cashier accounts before they can punch in.
          </p>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm">Loading registration requests...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Pending Requests</h3>
            <p className="text-xs text-slate-400 mt-1">
              All employee registrations have been reviewed. New self-registrations will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingUsers.map((u) => {
              const isActioning = actionLoading === u._id;
              return (
                <div
                  key={u._id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{u.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                          Pending Approval
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {u.phone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" /> Requested:{' '}
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleReject(u)}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleApprove(u)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs shadow-emerald-600/20 transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isActioning ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve Staff
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;

