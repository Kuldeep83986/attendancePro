import React from 'react';

const StatusBadge = ({ status, size = 'default' }) => {
  const normalized = (status || '').toLowerCase();

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs';

  switch (normalized) {
    case 'present':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Present
        </span>
      );
    case 'half-day':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Half-Day
        </span>
      );
    case 'absent':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Absent
        </span>
      );
    case 'approved':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rejected
        </span>
      );
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          Pending
        </span>
      );
    case 'incomplete':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Incomplete
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          {status || 'Unknown'}
        </span>
      );
  }
};

export default StatusBadge;
