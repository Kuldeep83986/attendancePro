import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Camera,
  ShieldCheck,
  Clock,
  ArrowRight,
  Store,
  CheckCircle2,
  Lock,
  History,
  Sparkles,
  Users,
  LogIn,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-slate-950 text-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-dot-pattern-dark pointer-events-none opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Supermarket Workforce Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            The Modern Attendance Standard <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              for Store Teams.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Empower cashiers and floor staff to log shifts in seconds with live photo verification, atomic server time, and effortless manager oversight.
          </p>

          {/* CTA Buttons (Exact requested text) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all text-sm group"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all text-sm group"
                >
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-sm"
                >
                  Employee Login
                </Link>
              </>
            )}
          </div>

          {/* Product Preview Section (Linear/Stripe style UI mockup) */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xs">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 text-left">
                {/* Browser-like window header */}
                <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    {/* <span className="ml-2 text-[11px] font-mono text-slate-400">attendancepro.app/dashboard</span> */}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                    LIVE SHIFT • ASIA/KOLKATA
                  </span>
                </div>

                {/* Mockup Body Content */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/95">
                  {/* Left Column: Live Shift Card */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">TODAY'S SHIFT</span>
                      <StatusBadge status="present" size="sm" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-mono text-white">09h 12m</p>
                      <span className="text-[11px] text-slate-400">Shift: 7:00 AM – 4:00 PM</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                      <span>Punch-In: <strong>07:02 AM</strong></span>
                      <span>Punch-Out: <strong>04:14 PM</strong></span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-900/50 flex items-center gap-2 text-[11px] text-blue-300">
                      <Camera className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Live camera verified at entrance</span>
                    </div>
                  </div>

                  {/* Middle Column: Summary Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Present Rate</span>
                      <p className="text-xl font-bold text-emerald-400 mt-1">96.8%</p>
                      <span className="text-[10px] text-slate-400">Store Floor Team</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Half-Day</span>
                      <p className="text-xl font-bold text-amber-400 mt-1">4h - 9h</p>
                      <span className="text-[10px] text-slate-400">Auto Bracket</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Break Deduct</span>
                      <p className="text-xl font-bold text-slate-200 mt-1">0 Mins</p>
                      <span className="text-[10px] text-slate-400">Standard Rule</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Audit Trail</span>
                      <p className="text-xl font-bold text-indigo-400 mt-1">100%</p>
                      <span className="text-[10px] text-slate-400">Immutable logs</span>
                    </div>
                  </div>

                  {/* Right Column: Real-Time Verification Flow */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Store Biometric Logic</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Mandatory live MediaDevices camera capture. Device clocks bypassed using atomic server time.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Active Staff</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> All Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Commercial Reliability</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered Specifically for Single Supermarkets
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Eliminate complex legacy hardware. Cashiers and floor staff mark attendance in seconds with guaranteed audit precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Live Camera Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every punch-in and punch-out strictly requires a live camera snap via the browser MediaDevices API. Gallery uploads are disabled to eliminate buddy punching.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cloudinary secure image storage</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Server-Engineered Timestamps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Device clocks cannot be modified. Timestamps and duration calculations occur solely on the server in Asia/Kolkata timezone with fixed 7 AM – 4 PM shifts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Day (≥9h), Half-Day (4–9h), Absent (&lt;4h)</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Audit-Governed Admin Controls</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New employees require store manager approval before accessing attendance. When records are corrected, an immutable audit trail records the admin, reason, and prior values.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full audit history log preserved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">STORE OPERATION BENEFITS</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Built for Supermarket Cashiers, Floor Staff & Store Managers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Supermarket employees often work long floor shifts and need a dead-simple mobile interface. AttendancePro delivers instant 1-tap punch actions backed by robust enterprise governance.
              </p>

              <div className="mt-6 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Zero Hardware Hassle:</strong> Runs directly in the browser on staff phones or store tablets.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Auto Day Finalization:</strong> Unpunched employees automatically marked Absent after the 4 PM shift ends.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Incomplete Record Detection:</strong> Flagged for review if an employee forgets to punch out, without guessing punch-out times.
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Rules Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Official Supermarket Shift Rulebook</h4>
                  <p className="text-[11px] text-slate-500">Automated calculation engine</p>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Fixed Shift
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Daily Operating Window</span>
                  <span className="font-bold text-slate-900 font-mono">07:00 AM – 04:00 PM (IST)</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <span className="text-emerald-800">Present (Full Day)</span>
                  <span className="font-bold text-emerald-700 font-mono">≥ 9 hours (540 mins)</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                  <span className="text-amber-800">Half-Day Status</span>
                  <span className="font-bold text-amber-700 font-mono">4h to &lt;9h (240–539 mins)</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                  <span className="text-rose-800">Absent Status</span>
                  <span className="font-bold text-rose-700 font-mono">&lt; 4 hours or Unpunched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to streamline supermarket staff attendance?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Experience reliable camera punch actions and clear administration today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all text-xs"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-xs"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
