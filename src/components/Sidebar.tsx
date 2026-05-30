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
  const { currentView, setCurrentView, notifications, theme, toggleTheme } = useDashboard();
  
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
    <aside className="w-64 bg-[#1A1D20] text-gray-300 h-screen sticky top-0 flex flex-col border-r border-[#2D3135] shrink-0 justify-between">
      {/* Header / Brand */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-[#2D3135]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <span className="font-display font-bold text-white text-xl">CF</span>
          </div>
          <div>
            <h1 className="font-display text-white font-bold leading-tight tracking-tight text-lg">CREAM FUDGE</h1>
            <p className="text-[10px] text-amber-500 tracking-widest font-bold font-mono">PREMIUM SAAS</p>
          </div>
        </div>

        {/* Global Search Hotkey Bar */}
        <div className="px-4 py-3">
          <button 
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between text-xs bg-[#24282C] hover:bg-[#2D3135] text-gray-400 py-2.5 px-3 rounded-lg border border-[#2D3135] hover:border-gray-600 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Search dessert hub...
            </span>
            <kbd className="bg-[#1A1D20] text-[10px] px-1.5 py-0.5 rounded border border-[#2D3135] font-mono font-bold">⌘K</kbd>
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive 
                    ? 'text-white bg-[#D97706]/10 text-amber-500 font-semibold' 
                    : 'text-gray-400 hover:text-white hover:bg-[#202428]'
                }`}
              >
                {/* Active Indicator on side */}
                {isActive && (
                  <motion.div 
                    layoutId="activeSideIndicator"
                    className="absolute left-0 w-1 h-5 rounded-r bg-[#D97706]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-500' : 'text-gray-400'}`} />
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
      <div className="p-4 border-t border-[#2D3135] space-y-3 bg-[#131618]">
        {/* Quick Theme Toggle */}
        <div className="flex items-center justify-between text-xs px-2 py-1 bg-[#1A1D20] rounded-lg border border-[#2D3135]">
          <span className="text-gray-400 font-medium">Theme Mode</span>
          <button 
            onClick={toggleTheme}
            className="px-2.5 py-1 text-[11px] rounded bg-[#2D3135] hover:bg-amber-600 hover:text-white transition-all text-amber-500 font-bold capitalize"
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
                className="w-10 h-10 rounded-lg border border-[#2D3135] object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#131618] rounded-full"></span>
            </div>
            <div>
              <p className="text-xs text-white font-semibold leading-tight">Mona Fudge</p>
              <p className="text-[10px] text-gray-500 font-mono">Owner & Director</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => alert('Logout is handled by local storage. Press Settings to customize your experience.')}
            className="p-2 hover:bg-[#202428] rounded-lg text-gray-400 hover:text-white transition-all"
            title="SaaS Settings"
          >
            <LogOut className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </aside>
  );
};
