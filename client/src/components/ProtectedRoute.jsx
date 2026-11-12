import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, LogOut, Store, ShieldCheck } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Verifying session security...</span>
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 text-center animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
            {user.status === 'rejected' ? (
              <ShieldAlert className="w-7 h-7 text-rose-600" />
            ) : (
              <Clock className="w-7 h-7 text-amber-600" />
            )}
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1.5">
            {user.status === 'rejected' ? 'Registration Rejected' : 'Approval Pending'}
          </h2>

          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {user.status === 'rejected'
              ? 'Your employee registration request was rejected by store administration. Please consult with the store manager.'
              : 'Your employee profile has been registered and is awaiting administrator authorization. Once approved, you can punch in and view your shift records.'}
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 mb-6 border border-slate-100 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Employee:</span>
              <strong className="text-slate-800">{user.name}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-slate-700">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="capitalize font-bold text-amber-700">{user.status}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
