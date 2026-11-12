import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, LogOut } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-600">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Handle pending or rejected employee accounts
  if (user.role === 'employee' && user.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-amber-50 border border-amber-200">
            {user.status === 'rejected' ? (
              <ShieldAlert className="w-8 h-8 text-rose-600" />
            ) : (
              <Clock className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {user.status === 'rejected' ? 'Registration Rejected' : 'Approval Pending'}
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {user.status === 'rejected'
              ? 'Your employee registration request was rejected by store administration. Please contact your manager.'
              : 'Your employee registration has been submitted and is awaiting administrator approval. Once approved, you will be able to punch in and record your attendance.'}
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 mb-6 border border-slate-100">
            <p><strong>Employee:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> <span className="capitalize font-semibold text-amber-700">{user.status}</span></p>
          </div>
          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

