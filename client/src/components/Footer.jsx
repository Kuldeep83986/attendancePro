import React from 'react';
import { CalendarCheck, ShieldCheck, Camera, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <CalendarCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-tight">
                Attendance<span className="text-blue-400">Pro</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Smart Attendance. Simple Management.</p>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-400" /> Live Store Camera Verification
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Immutable Server Clock (IST)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Version 1.0 Supermarket SaaS
            </span>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} AttendancePro. Designed for commercial store teams.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
