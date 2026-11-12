import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Store,
  Sparkles,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch pending registration requests count for badge
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { data } = await api.get('/admin/pending');
        setPendingCount(data.users?.length || 0);
      } catch (err) {
        // Silent fail for badge count
      }
    };
    fetchPendingCount();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/employees', label: 'Employees', icon: Users },
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/approvals', label: 'Registration Requests', icon: ShieldCheck, badge: pendingCount },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Admin Control Panel</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`w-full md:w-64 bg-slate-950 border-r border-slate-800/80 text-white shrink-0 flex flex-col justify-between ${
          mobileSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-900">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block">
              Store Management
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">Commercial Console</h2>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white leading-tight truncate">{user?.name || 'Store Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
