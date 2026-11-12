import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  CalendarCheck,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/approvals', label: 'Registration Requests', icon: ShieldCheck },
    { to: '/admin/attendance', label: 'Attendance Records', icon: CalendarCheck },
    { to: '/admin/employees', label: 'All Employees', icon: Users },
    { to: '/admin/settings', label: 'Shift Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">Administration Portal</span>
          <h2 className="text-sm font-bold text-white mt-0.5">Supermarket Controls</h2>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

