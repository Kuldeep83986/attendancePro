import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import {
  CalendarCheck,
  Filter,
  RefreshCw,
  Camera,
  Edit3,
  History,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LogIn,
  LogOut,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');

  // Modals state
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [correctionTarget, setCorrectionTarget] = useState(null);
  const [correctionForm, setCorrectionForm] = useState({
    field: 'status',
    newValue: 'present',
    reason: '',
  });
  const [correcting, setCorrecting] = useState(false);
  const [correctionError, setCorrectionError] = useState(null);
  const [auditTarget, setAuditTarget] = useState(null);

  const fetchAttendance = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      let query = `?page=${page}&limit=30`;
      if (dateFilter) query += `&date=${dateFilter}`;
      if (employeeIdFilter.trim()) query += `&employeeId=${employeeIdFilter.trim()}`;

      const { data } = await api.get(`/admin/attendance${query}`);
      setRecords(data.records || []);
      setPagination(data.pagination || { page: 1, limit: 30, total: 0, pages: 1 });
    } catch (err) {
      console.error('Fetch attendance error:', err);
      setError('Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(pagination.page);
  }, [pagination.page]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchAttendance(1);
  };

  const handleClearFilter = () => {
    setDateFilter('');
    setEmployeeIdFilter('');
    setTimeout(() => fetchAttendance(1), 0);
  };

  const openCorrectionModal = (record) => {
    setCorrectionTarget(record);
    setCorrectionForm({
      field: 'status',
      newValue: record.status || 'present',
      reason: '',
    });
    setCorrectionError(null);
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!correctionForm.reason.trim() || correctionForm.reason.trim().length < 5) {
      setCorrectionError('A justification reason is mandatory (minimum 5 characters).');
      return;
    }

    try {
      setCorrecting(true);
      setCorrectionError(null);

      const { data } = await api.put(
        `/admin/attendance/${correctionTarget._id}/correct`,
        {
          field: correctionForm.field,
          newValue: correctionForm.newValue,
          reason: correctionForm.reason.trim(),
        }
      );

      setRecords((prev) =>
        prev.map((r) => (r._id === correctionTarget._id ? data.attendance : r))
      );

      setCorrectionTarget(null);
    } catch (err) {
      console.error('Correction failed:', err);
      const msg = err.response?.data?.message || 'Failed to submit correction.';
      setCorrectionError(msg);
    } finally {
      setCorrecting(false);
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
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Attendance Master</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">Workforce Punch Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified camera timestamps, live store snapshots, and audit correction records.
          </p>
        </div>
        <button
          onClick={() => fetchAttendance(pagination.page)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleApplyFilter}
        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3 text-xs"
      >
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500"
        />

        <input
          type="text"
          placeholder="Employee ID (e.g. EMP-001)"
          value={employeeIdFilter}
          onChange={(e) => setEmployeeIdFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Filter Records
        </button>

        {(dateFilter || employeeIdFilter) && (
          <button
            type="button"
            onClick={handleClearFilter}
            className="text-xs text-slate-400 hover:text-slate-700 underline font-semibold ml-auto"
          >
            Clear Filters
          </button>
        )}
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading attendance records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Records Match Criteria</h3>
            <p className="text-xs text-slate-400 mt-0.5">Adjust filter settings to view more logs.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Staff Member</th>
                    <th className="px-5 py-3.5">Work Date</th>
                    <th className="px-5 py-3.5">Punch-In</th>
                    <th className="px-5 py-3.5">Punch-Out</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Photos</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => {
                    const empName = r.employee?.name || 'Staff Member';
                    const empId = r.employee?.employeeId || '--';
                    const hasCorrections = r.corrections && r.corrections.length > 0;

                    return (
                      <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{empName}</p>
                            <span className="font-mono text-[11px] text-blue-600 font-bold">{empId}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{formatDate(r.workDate)}</span>
                          <span className="block text-[10px] font-mono text-slate-400">{r.workDate}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-700">
                          <span className="flex items-center gap-1 font-medium">
                            <LogIn className="w-3.5 h-3.5 text-blue-600" /> {formatTime(r.punchIn)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-700">
                          <span className="flex items-center gap-1 font-medium">
                            <LogOut className="w-3.5 h-3.5 text-emerald-600" /> {formatTime(r.punchOut)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {r.workingMinutes ? `${Math.floor(r.workingMinutes / 60)}h ${r.workingMinutes % 60}m` : '--'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={r.status} size="sm" />
                          {!r.isComplete && r.punchIn && (
                            <span className="block mt-0.5 text-[10px] text-purple-700 font-bold">
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {r.punchInPhoto ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPhoto({
                                    url: r.punchInPhoto,
                                    label: `Punch-In Snap: ${empName} (${r.workDate})`,
                                  })
                                }
                                className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all shrink-0"
                                title="View In Photo"
                              >
                                <img src={r.punchInPhoto} alt="In" className="w-full h-full object-cover" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300 italic">No In</span>
                            )}

                            {r.punchOutPhoto ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPhoto({
                                    url: r.punchOutPhoto,
                                    label: `Punch-Out Snap: ${empName} (${r.workDate})`,
                                  })
                                }
                                className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                                title="View Out Photo"
                              >
                                <img src={r.punchOutPhoto} alt="Out" className="w-full h-full object-cover" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300 italic">No Out</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {hasCorrections && (
                              <button
                                type="button"
                                onClick={() => setAuditTarget(r)}
                                title="Inspect audit trail"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                              >
                                <History className="w-3 h-3 text-amber-600" />
                                {r.corrections.length}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => openCorrectionModal(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" /> Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                alt="Verification snap"
                className="max-h-80 w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Correction Modal */}
      {correctionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Adjust Attendance Record</h3>
                <p className="text-[11px] text-slate-500">
                  {correctionTarget.employee?.name} • {correctionTarget.workDate}
                </p>
              </div>
              <button
                onClick={() => setCorrectionTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="p-6 space-y-4 text-xs">
              {correctionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{correctionError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Field to Adjust
                </label>
                <select
                  value={correctionForm.field}
                  onChange={(e) => {
                    const f = e.target.value;
                    let defaultVal = 'present';
                    if (f === 'workingMinutes') defaultVal = '540';
                    if (f === 'punchIn' || f === 'punchOut') defaultVal = new Date().toISOString();
                    setCorrectionForm({ field: f, newValue: defaultVal, reason: correctionForm.reason });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                >
                  <option value="status">Attendance Status (present / half-day / absent)</option>
                  <option value="workingMinutes">Working Duration (in minutes)</option>
                  <option value="punchIn">Punch-In Timestamp (ISO)</option>
                  <option value="punchOut">Punch-Out Timestamp (ISO)</option>
                </select>
              </div>

              {correctionForm.field === 'status' ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    New Status
                  </label>
                  <select
                    value={correctionForm.newValue}
                    onChange={(e) =>
                      setCorrectionForm({ ...correctionForm, newValue: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  >
                    <option value="present">Present (Full Day)</option>
                    <option value="half-day">Half-Day</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    New Value
                  </label>
                  <input
                    type="text"
                    required
                    value={correctionForm.newValue}
                    onChange={(e) =>
                      setCorrectionForm({ ...correctionForm, newValue: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {correctionForm.field === 'workingMinutes'
                      ? '540 = 9 hrs (Present), 240 = 4 hrs (Half-Day)'
                      : 'Provide a valid ISO date timestamp'}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Justification / Reason (Mandatory for Audit Trail)
                </label>
                <textarea
                  required
                  rows={3}
                  value={correctionForm.reason}
                  onChange={(e) =>
                    setCorrectionForm({ ...correctionForm, reason: e.target.value })
                  }
                  placeholder="e.g. Employee verified on store floor duty by manager CCTV record..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCorrectionTarget(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={correcting}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {correcting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail Viewer Modal */}
      {auditTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Correction Audit History</h3>
              </div>
              <button
                onClick={() => setAuditTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
              {auditTarget.corrections?.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-slate-800">
                      Modified by {c.correctedBy?.name || 'Administrator'}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(c.correctedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Field: <strong className="font-mono text-blue-700">{c.field}</strong>
                  </p>
                  <p className="text-slate-600">
                    Old: <span className="line-through text-slate-400">{c.oldValue || 'none'}</span> ➔ New: <span className="font-bold text-emerald-700">{c.newValue}</span>
                  </p>
                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-900">Reason:</strong> {c.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
