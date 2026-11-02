import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, AlertTriangle, Info, Bell, X, ArrowRight } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeToasts, dismissToast, setCurrentTab } = useLibrary();

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {activeToasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
            case 'alert':
              return <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white shadow-lg shadow-emerald-500/10';
            case 'alert':
              return 'border-rose-200 bg-white shadow-lg shadow-rose-500/10';
            case 'warning':
              return 'border-amber-200 bg-white shadow-lg shadow-amber-500/10';
            default:
              return 'border-slate-200 bg-white shadow-lg shadow-slate-900/10';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${getBorder()} transition-all transform translate-y-0 opacity-100 duration-200 ease-out flex gap-3 items-start`}
            role="alert"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {toast.title}
                </h4>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {toast.message}
              </p>
              {toast.linkToTab && (
                <button
                  onClick={() => {
                    if (toast.linkToTab) setCurrentTab(toast.linkToTab);
                    dismissToast(toast.id);
                  }}
                  className="mt-2 text-xs font-bold text-[#0B192C] hover:text-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Lihat Detail <ArrowRight className="w-3 h-3 text-amber-500" />
                </button>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
