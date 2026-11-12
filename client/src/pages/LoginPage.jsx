import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Camera,
  CheckCircle2,
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const user = await login(formData.email.trim(), formData.password);

      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please verify your email and password.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Column: Brand Showcase (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Attendance<span className="text-blue-400">Pro</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Commercial Supermarket Portal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
            Secure, Camera-Verified Staff Attendance
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sign in to start your shift, verify your live photo, and track your daily working hours with server-engineered accuracy.
          </p>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 font-medium">Standard Shift Hours:</span>
              <strong className="text-white font-mono">07:00 AM – 04:00 PM</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 font-medium">Shift Timezone:</span>
              <strong className="text-emerald-400">Asia/Kolkata (IST)</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 font-medium">Verification Mode:</span>
              <strong className="text-blue-400 flex items-center gap-1">
                <Camera className="w-3 h-3" /> Live Camera Only
              </strong>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} AttendancePro • Commercial Store Edition
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50/50">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Enter your credentials to access the employee or admin portal
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-xs leading-relaxed animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@supermarket.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New store employee?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
