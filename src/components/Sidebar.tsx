import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Dessert, 
  ShoppingBag, 
  Bell, 
  Settings2, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSearch }) => {
  const { currentView, setCurrentView, notifications, theme, toggleTheme, triggerToast } = useDashboard();
  
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Dessert },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined 
    },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <aside className="w-64 bg-[#0C1222] text-gray-300 h-screen sticky top-0 flex flex-col border-r border-[#1C273E] shrink-0 justify-between">
      {/* Header / Brand */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-[#1C273E]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-950/40">
            <span className="font-display font-bold text-white text-xl">CF</span>
          </div>
          <div>
            <h1 className="font-display text-white font-bold leading-tight tracking-tight text-lg">CREAM FUDGE</h1>
            <p className="text-[10px] text-blue-400 tracking-widest font-bold font-mono">PREMIUM SAAS</p>
          </div>
        </div>

        {/* Global Search Hotkey Bar */}
        <div className="px-4 py-3">
          <button 
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between text-xs bg-[#16223B] hover:bg-[#1C273E] text-gray-400 py-2.5 px-3 rounded-lg border border-[#1C273E] hover:border-gray-600 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Search dessert hub...
            </span>
            <kbd className="bg-[#0C1222] text-[10px] px-1.5 py-0.5 rounded border border-[#1C273E] font-mono font-bold">⌘K</kbd>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive 
                    ? 'text-white bg-blue-500/10 dark:bg-blue-500/15 text-blue-500 dark:text-blue-400 font-semibold' 
                    : 'text-gray-400 hover:text-white dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-[#131D33]'
                }`}
              >
                {/* Active Indicator on side */}
                {isActive && (
                  <motion.div 
                    layoutId="activeSideIndicator"
                    className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/55"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  {item.label}
                </span>

                {item.badge !== undefined && (
                  <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Profile & Theme Settings */}
      <div className="p-4 border-t border-[#1C273E] space-y-3 bg-[#070A14]">
        {/* Quick Theme Toggle */}
        <div className="flex items-center justify-between text-xs px-2 py-1 bg-[#0C1222] rounded-lg border border-[#1C273E]">
          <span className="text-gray-400 font-medium">Theme Mode</span>
          <button 
            onClick={toggleTheme}
            className="px-2.5 py-1 text-[11px] rounded bg-[#1C273E] hover:bg-blue-600 hover:text-white transition-all text-blue-400 font-bold capitalize"
          >
            {theme}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Fudge HQ Administrator" 
                className="w-10 h-10 rounded-lg border border-[#1C273E] object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#070A14] rounded-full"></span>
            </div>
            <div>
              <p className="text-xs text-white font-semibold leading-tight">Mona Fudge</p>
              <p className="text-[10px] text-gray-500 font-mono">Owner & Director</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => triggerToast('Logout simulation: Data remains safe in local storage. Open Settings to customize.', 'info')}
            className="p-2 hover:bg-[#131D33] rounded-lg text-gray-400 hover:text-white transition-all"
            title="SaaS Settings"
          >
            <LogOut className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </aside>
  );
};
