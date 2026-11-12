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
} from 'lucide-react';

const EmployeeHistory = () => {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected photo for modal
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
      setError('Failed to load attendance history. Please try again.');
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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance History</h1>
          <p className="text-xs text-slate-500 mt-1">Review your daily punch-in, punch-out, and verified working duration.</p>
        </div>
        <button
          onClick={() => fetchHistory(pagination.page)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm">Loading attendance records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Attendance Records Found</h3>
            <p className="text-xs text-slate-400 mt-1">Your past attendance will appear here once you punch in.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Work Date</th>
                    <th className="px-6 py-4">Punch-In</th>
                    <th className="px-6 py-4">Punch-Out</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatDate(r.workDate)}
                        <span className="block text-xs font-mono text-slate-400">{r.workDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800 flex items-center gap-1.5">
                          <LogIn className="w-3.5 h-3.5 text-blue-600" />
                          {formatTime(r.punchIn)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800 flex items-center gap-1.5">
                          <LogOut className="w-3.5 h-3.5 text-emerald-600" />
                          {formatTime(r.punchOut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {r.workingMinutes ? (
                          `${Math.floor(r.workingMinutes / 60)}h ${r.workingMinutes % 60}m`
                        ) : (
                          <span className="text-xs text-slate-400 font-normal">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {r.punchInPhoto ? (
                            <button
                              type="button"
                              onClick={() => setSelectedPhoto({ url: r.punchInPhoto, label: `Punch-In: ${r.workDate}` })}
                              className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all shrink-0"
                              title="View Punch-In Photo"
                            >
                              <img src={r.punchInPhoto} alt="Punch In" className="w-full h-full object-cover" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">None</span>
                          )}

                          {r.punchOutPhoto && (
                            <button
                              type="button"
                              onClick={() => setSelectedPhoto({ url: r.punchOutPhoto, label: `Punch-Out: ${r.workDate}` })}
                              className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                              title="View Punch-Out Photo"
                            >
                              <img src={r.punchOutPhoto} alt="Punch Out" className="w-full h-full object-cover" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {records.map((r) => (
                <div key={r._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{formatDate(r.workDate)}</p>
                      <span className="text-xs text-slate-400 font-mono">{r.workDate}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Punch-In</span>
                      <span className="font-semibold text-slate-800">{formatTime(r.punchIn)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Punch-Out</span>
                      <span className="font-semibold text-slate-800">{formatTime(r.punchOut)}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-bold text-slate-900">
                        {r.workingMinutes
                          ? `${Math.floor(r.workingMinutes / 60)}h ${r.workingMinutes % 60}m`
                          : '--'}
                      </span>
                    </div>
                  </div>

                  {(r.punchInPhoto || r.punchOutPhoto) && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">Verified Photos:</span>
                      {r.punchInPhoto && (
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto({ url: r.punchInPhoto, label: `Punch In (${r.workDate})` })}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium"
                        >
                          <Camera className="w-3 h-3" /> In Snap
                        </button>
                      )}
                      {r.punchOutPhoto && (
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto({ url: r.punchOutPhoto, label: `Punch Out (${r.workDate})` })}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-medium"
                        >
                          <Camera className="w-3 h-3" /> Out Snap
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} records)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-800">{selectedPhoto.label}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt="Verification capture"
                className="max-h-96 w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;

