import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-root-viewport" className="fixed top-6 right-6 z-100 flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-[#0C1222] border-gray-200 dark:border-blue-900/30';
          let iconColor = 'text-blue-500';
          let textColor = 'text-gray-900 dark:text-white';
          let Icon = Info;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20';
            iconColor = 'text-emerald-500';
            Icon = CheckCircle;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-500/20';
            iconColor = 'text-amber-500';
            Icon = AlertTriangle;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/20';
            iconColor = 'text-rose-500';
            Icon = XCircle;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${bgColor}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1">
                <p className={`text-xs font-medium leading-relaxed ${textColor}`}>{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg p-0.5 hover:bg-gray-100 dark:hover:bg-blue-900/25 transition-all cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
