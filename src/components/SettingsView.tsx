import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  Settings2, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Percent, 
  Trash2, 
  ChevronRight,
  Database,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  const { settings, saveSettings, theme, toggleTheme } = useDashboard();

  // Form local state
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone);
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress);
  const [currency, setCurrency] = useState(settings.currency);
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold.toString());
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(settings.enableSoundAlerts);

  // Handle Save
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || parseFloat(taxRate) < 0 || parseInt(lowStockThreshold) < 0) {
      alert('Please enter a valid business Name, non-negative tax rate and non-negative stock threshold.');
      return;
    }

    saveSettings({
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      currency,
      taxRate: parseFloat(taxRate),
      lowStockThreshold: parseInt(lowStockThreshold),
      enableSoundAlerts,
      theme
    });
  };

  const handleFactoryReset = () => {
    if (confirm('Acknowledge Reset: This clears all live orders, custom products, and restores factory original defaults. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-950 dark:text-white">HQ Settings Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Configure global pricing variables, system details and persistent themes.</p>
        </div>
      </div>

      {/* CORE FIELDS SET */}
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: GENERAL SETTINGS */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium space-y-6">
          <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            General Dessert Shop Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="E.g. Cream Fudge HQ..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">HQ Hotline</label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="HQ Hotline..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Administration Mailbox</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="mail@fudge.com..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Street Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Corporate HQ address..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-[#23272A]">
            <Percent className="w-4 h-4 text-amber-500" />
            Pricing Variables & Operational Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Invoice Sign symbol</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="¥">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Standard Tax Rate %</label>
              <input
                type="number"
                step="0.1"
                required
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="8.5%..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Low-Stock Alert bounds</label>
              <input
                type="number"
                required
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                placeholder="10 units..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-100 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-start pt-4 border-t border-gray-100 dark:border-[#23272A]">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-600/10 cursor-pointer"
            >
              Save Configuration Settings
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREFERENCES & RESET OPERATIONS */}
        <div className="space-y-6">
          {/* Quick theme toggler widget */}
          <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">UI Preference</h3>
            
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-600 dark:text-gray-300">Set persistent Dark aspect</span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-all ${theme === 'dark' ? 'bg-amber-600' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Sound alert simulation */}
            <div className="flex items-center justify-between text-xs font-semibold border-t border-gray-100 dark:border-[#23272A] pt-3">
              <span className="text-gray-600 dark:text-gray-300">Enable Sound alerts</span>
              <button
                type="button"
                onClick={() => setEnableSoundAlerts(!enableSoundAlerts)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${enableSoundAlerts ? 'bg-amber-600' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${enableSoundAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {/* Database Actions */}
          <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono text-red-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Destructive Operations
            </h3>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Clear your browser local-cache to dump user sessions, remove added customers, custom dessert flavors and fall back to baseline mock states.
            </p>

            <button
              type="button"
              onClick={handleFactoryReset}
              className="w-full flex items-center justify-center gap-1.5 py-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/15 font-bold rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Factory Reset Database
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
