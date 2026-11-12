import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Settings,
  Clock,
  Shield,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    shiftStart: '07:00',
    shiftEnd: '16:00',
    timezone: 'Asia/Kolkata',
    breakDeduction: 0,
    presentThreshold: 540,
    halfDayThreshold: 240,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const { data } = await api.get('/admin/settings');
      if (data.settings) {
        setSettings({
          shiftStart: data.settings.shiftStart || '07:00',
          shiftEnd: data.settings.shiftEnd || '16:00',
          timezone: data.settings.timezone || 'Asia/Kolkata',
          breakDeduction: data.settings.breakDeduction || 0,
          presentThreshold: data.settings.presentThreshold || 540,
          halfDayThreshold: data.settings.halfDayThreshold || 240,
        });
      }
    } catch (err) {
      console.error('Fetch settings failed:', err);
      setFeedback({ type: 'error', message: 'Failed to load system settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      await api.put('/admin/settings', settings);
      setFeedback({ type: 'success', message: '✓ Store shift rules and thresholds saved successfully.' });
    } catch (err) {
      console.error('Save settings failed:', err);
      const msg = err.response?.data?.message || 'Failed to update settings.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Store Rules Configuration</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">Shift Window & Calculation Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure operating shift hours, duration brackets, and timezone settings.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-fade-in-up ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-medium">Loading rules...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" /> Supermarket Operating Shift Hours
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Store floor staff and cashiers are scheduled within this standard daily window.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Shift Start Time
              </label>
              <input
                type="time"
                name="shiftStart"
                value={settings.shiftStart}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">Standard: 07:00 AM</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Shift End Time
              </label>
              <input
                type="time"
                name="shiftEnd"
                value={settings.shiftEnd}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">Standard: 04:00 PM (16:00)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Operational Timezone
              </label>
              <input
                type="text"
                disabled
                value={settings.timezone}
                className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs sm:text-sm cursor-not-allowed font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Fixed to Asia/Kolkata (IST)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Break Deduction (Minutes)
              </label>
              <input
                type="number"
                min="0"
                name="breakDeduction"
                value={settings.breakDeduction}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Rule: 0 minutes subtracted</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-600" /> Attendance Calculation Thresholds
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Defines working duration brackets for automatic status determination.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Present (Full-Day) Threshold (Minutes)
                </label>
                <input
                  type="number"
                  min="60"
                  name="presentThreshold"
                  value={settings.presentThreshold}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  540 minutes = 9 working hours
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Half-Day Threshold (Minutes)
                </label>
                <input
                  type="number"
                  min="30"
                  name="halfDayThreshold"
                  value={settings.halfDayThreshold}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                  240 minutes = 4 working hours
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
