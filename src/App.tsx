/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { CustomersView } from './components/CustomersView';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Menu, X, Sparkles, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, theme, notifications } = useDashboard();
  
  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Unread alerts count
  const unreadAlerts = notifications.filter(n => !n.read).length;

  // CMD+K event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View routing switcher
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'customers':
        return <CustomersView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9] dark:bg-[#141618] text-gray-800 dark:text-gray-200 font-sans">
      
      {/* 1. DESKTOP VIEW SIDEBAR (hidden on mobile) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
      </div>

      {/* 2. MOBILE VIEW SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop slide click-closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-64 max-w-xs h-full bg-[#1A1D20] shadow-xl flex flex-col pt-4"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-[#24282C] text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              </div>

              {/* Sidebar Content Inside */}
              <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
                <Sidebar onOpenSearch={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE VIEWPORT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* RESPONSIVE TOP NAV BAR FOR MOBILE & QUICK HEADER DETAILS */}
        <header className="flex lg:hidden items-center justify-between px-5 py-4 bg-[#1A1D20] text-white border-b border-[#2D3135] shrink-0 leading-none">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl bg-transparent hover:bg-[#202428] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-amber-500 tracking-tight text-base">CF</span>
            <span className="text-[10px] tracking-widest text-gray-400 font-mono scale-95 uppercase font-bold">Fudge SaaS</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search link trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl hover:bg-[#202428] text-gray-400 cursor-pointer"
              title="Search dessert database"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block animate-pulse"></span>
            </button>

            {/* Notifications link trigger */}
            <button
              onClick={() => setCurrentView('notifications')}
              className="p-2 rounded-xl hover:bg-[#202428] text-gray-400 relative cursor-pointer"
              title="Alert logs"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-bounce"></span>
              )}
            </button>
          </div>
        </header>

        {/* VIEW SCROLLABLE CANVAS CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 scroll-smooth select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="max-w-7xl mx-auto pb-12"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. GLOBAL CMDK POPUP DISPATCHER */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <MainLayout />
    </DashboardProvider>
  );
}
