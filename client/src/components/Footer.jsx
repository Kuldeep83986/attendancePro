import React from 'react';
import { CalendarCheck, Shield, CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-base">
                Attendance<span className="text-emerald-400">Pro</span>
              </p>
              <p className="text-xs text-slate-400">Supermarket Employee Attendance Management System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Live Camera Photo Verification
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Server-Verified Shift Timestamps
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400" /> Single Supermarket v1.0
            </span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AttendancePro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

