import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  ShoppingBag, 
  DollarSign, 
  Cpu, 
  Clock, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearAllNotifications 
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'All' | 'order' | 'stock' | 'revenue'>('All');

  // Filtering
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    return n.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'stock': return <AlertTriangle className="w-4 h-4 text-blue-400" />;
      case 'order': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'revenue': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      default: return <Cpu className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'stock': return 'bg-blue-500/10 border-amber-500/20';
      case 'order': return 'bg-blue-500/10 border-blue-500/20';
      case 'revenue': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#0C1222] p-6 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-950 dark:text-white">Operations Notifier Alertboard</h2>
          <p className="text-xs text-gray-400 mt-1">Audit active low-stock triggers, payment confirmations, and system configurations.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={markAllNotificationsRead}
            disabled={notifications.every(n => n.read)}
            className="flex items-center gap-1.5 bg-gray-55 dark:bg-[#131D33] hover:bg-gray-100 dark:hover:bg-[#1E2B48] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#1C273E] text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-40 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-gray-500" />
            Mark All Read
          </button>

          <button
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/10 text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-40 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            Clear Alerts Log
          </button>
        </div>
      </div>

      {/* TABS FILTERS GRID */}
      <div className="bg-white dark:bg-[#0C1222] p-3 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium flex justify-start overflow-x-auto max-w-full">
        <div className="flex bg-gray-50 dark:bg-[#131D33] rounded-xl p-1 border border-gray-100 dark:border-[#1C273E]">
          {(['All', 'order', 'stock', 'revenue'] as const).map((tab) => {
            const count = notifications.filter(n => {
              if (tab === 'All') return true;
              return n.type === tab;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-[#0C1222] text-blue-500 dark:text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'All' ? 'All Alerts' : `${tab} logs`}
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-gray-150 dark:bg-gray-800 text-gray-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTIFICATIONS TIMELINE LIST */}
      <div className="bg-white dark:bg-[#0C1222] rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-[#16223B]">
          {filteredNotifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {filteredNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 transition-all flex items-center justify-between gap-4 border-l-4 ${
                    n.read 
                      ? 'border-transparent bg-transparent opacity-80' 
                      : 'border-blue-500/40 bg-blue-500/5 dark:bg-blue-950/15'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Circle Pill */}
                    <span className={`p-2 rounded-xl mt-0.5 shrink-0 border ${getBg(n.type)}`}>
                      {getIcon(n.type)}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <p className={`text-sm ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-950 dark:text-white font-bold'}`}>
                          {n.title}
                        </p>
                        
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400">{n.message}</p>
                      
                      <p className="text-[10px] font-mono font-medium text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  |  UTC Date: {n.createdAt.split('T')[0]}
                      </p>
                    </div>
                  </div>

                  {/* Actions right */}
                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="text-[10px] font-bold text-blue-500 hover:text-amber-700 bg-blue-500/10 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      Clear alert
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
              All clean! No operational notifications in this log filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
