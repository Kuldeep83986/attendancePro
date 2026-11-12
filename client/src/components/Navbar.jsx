import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  User,
  LogOut,
  LayoutDashboard,
  Clock,
  Users,
  ShieldCheck,
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isEmployee, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-lg tracking-tight text-white">Attendance</span>
                <span className="font-bold text-lg text-blue-400">Pro</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 hidden sm:block">
                Smart Attendance. Simple Management.
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
            {isAuthenticated ? (
              <>
                {isEmployee && (
                  <>
                    <Link
                      to="/employee/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/employee/dashboard')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" /> Today's Shift
                    </Link>
                    <Link
                      to="/employee/history"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/employee/history')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" /> My History
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/admin/dashboard')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <Link
                      to="/admin/attendance"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/admin/attendance')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" /> Attendance
                    </Link>
                    <Link
                      to="/admin/employees"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/admin/employees')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> Employees
                    </Link>
                    <Link
                      to="/admin/approvals"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/admin/approvals')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Requests
                    </Link>
                    <Link
                      to="/admin/settings"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive('/admin/settings')
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" /> Shift Rules
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/') ? 'bg-slate-700/80 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Overview
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/90 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-100 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5 font-medium">
                      {user?.employeeId ? `${user.employeeId} • ${user.role}` : user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all"
                >
                  Employee Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-6 space-y-2 animate-fade-in-up">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">
                    {user?.employeeId ? `${user.employeeId} (${user.role})` : user?.role}
                  </p>
                </div>
              </div>

              {isEmployee && (
                <div className="space-y-1">
                  <Link
                    to="/employee/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Clock className="w-4 h-4 text-blue-400" /> Today's Shift
                  </Link>
                  <Link
                    to="/employee/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <CalendarCheck className="w-4 h-4 text-blue-400" /> Attendance History
                  </Link>
                </div>
              )}

              {isAdmin && (
                <div className="space-y-1">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" /> Dashboard
                  </Link>
                  <Link
                    to="/admin/attendance"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <CalendarCheck className="w-4 h-4 text-blue-400" /> Attendance Records
                  </Link>
                  <Link
                    to="/admin/employees"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Users className="w-4 h-4 text-blue-400" /> Employees
                  </Link>
                  <Link
                    to="/admin/approvals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" /> Requests
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4 text-blue-400" /> Shift Rules
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-900/60"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700"
              >
                Employee Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
