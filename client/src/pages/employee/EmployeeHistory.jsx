import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import {
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Camera,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
} from 'lucide-react';

const EmployeeHistory = () => {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/attendance/my?page=${page}&limit=15`);
      setRecords(data.records || []);
      setPagination(data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
    } catch (err) {
      console.error('Fetch history failed:', err);
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(pagination.page);
  }, [pagination.page]);

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Attendance Log</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">My Shift History</h1>
          <p className="text-xs text-slate-500 mt-1">Review your historical punch timestamps and verified photos.</p>
        </div>
        <button
          onClick={() => fetchHistory(pagination.page)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Records Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading your records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Attendance Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">Your past shifts will appear here once you punch in.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Work Date</th>
                    <th className="px-6 py-3.5">Punch-In</th>
                    <th className="px-6 py-3.5">Punch-Out</th>
                    <th className="px-6 py-3.5">Working Duration</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatDate(r.workDate)}
                        <span className="block text-[10px] font-mono text-slate-400 font-normal">{r.workDate}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <LogIn className="w-3.5 h-3.5 text-blue-600" />
                          {formatTime(r.punchIn)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <LogOut className="w-3.5 h-3.5 text-emerald-600" />
                          {formatTime(r.punchOut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {r.workingMinutes ? (
                          `${Math.floor(r.workingMinutes / 60)}h ${r.workingMinutes % 60}m`
                        ) : (
                          <span className="text-slate-400 font-normal">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="px-6 py-4">
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

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} records)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

export default EmployeeHistory;
