import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/admin/employees');
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Fetch employees failed:', err);
      setError('Failed to load employee directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const query = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query) ||
      emp.employeeId?.toLowerCase().includes(query) ||
      emp.phone?.includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Store Directory</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">Staff & Cashier Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered supermarket floor personnel, cashiers, and assigned IDs.
          </p>
        </div>
        <button
          onClick={fetchEmployees}
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

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name, Employee ID (e.g. EMP-001), email, or phone number..."
          className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading store staff...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Employees Found</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchTerm ? 'No staff member matched your search query.' : 'No store employees registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Employee ID</th>
                  <th className="px-6 py-3.5">Staff Member</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Account Status</th>
                  <th className="px-6 py-3.5">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {emp.employeeId || <span className="text-slate-400 font-sans font-normal italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{emp.name}</p>
                          <span className="text-[11px] text-slate-400 capitalize">{emp.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-0.5 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emp.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(emp.createdAt).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployees;
