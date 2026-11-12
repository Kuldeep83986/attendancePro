import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Camera,
  ShieldCheck,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Store className="w-4 h-4 text-emerald-400" />
            Designed Exclusively for Single Supermarket Operations
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Accurate, Camera-Verified <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300">
              Supermarket Staff Attendance
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate buddy punching and manual log errors. Mandatory live camera verification, server-computed 7 AM – 4 PM shift hours, and admin approval workflows.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all text-base"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all text-base"
                >
                  Staff Punch-In / Login <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-base"
                >
                  Employee Self-Registration
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Standard Shift</span>
              <p className="text-xl font-bold text-white mt-1">7:00 AM – 4:00 PM</p>
              <span className="text-[11px] text-emerald-400 font-medium">Asia/Kolkata (IST)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Full Day</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">≥ 9 Hours</p>
              <span className="text-[11px] text-slate-400 font-medium">Present status</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Half Day</span>
              <p className="text-xl font-bold text-amber-400 mt-1">4 to &lt;9 Hours</p>
              <span className="text-[11px] text-slate-400 font-medium">Automatic calculation</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Absent</span>
              <p className="text-xl font-bold text-rose-400 mt-1">&lt; 4 Hours</p>
              <span className="text-[11px] text-slate-400 font-medium">Or unpunched day</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">Built for Real Store Realities</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Simple for Cashiers & Floor Staff, <br />
            bulletproof for Supermarket Managers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Camera Capture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every punch-in and punch-out requires a live snap via the device camera. Gallery uploads and file choosers are strictly disabled to prevent spoofing.
            </p>
            <ul className="mt-5 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Browser MediaDevices API integration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Secure Cloudinary cloud image storage
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Server-Controlled Clock</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Device clocks cannot be manipulated. All punch times, durations, and status calculations are executed exclusively on the server in Asia/Kolkata timezone.
            </p>
            <ul className="mt-5 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Automated Present, Half-Day & Absent tagging
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Unpunched records flagged for review
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Admin Governance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              New employees cannot access attendance until explicitly approved. When adjustments are necessary, an unalterable audit log records the admin, reason, and previous values.
            </p>
            <ul className="mt-5 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Store manager approval gating
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Immutable correction history trail
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to punch in for today's shift?</h3>
            <p className="text-sm text-slate-400 mt-1">Supermarket store employees can access the mobile dashboard in one tap.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors text-sm"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

