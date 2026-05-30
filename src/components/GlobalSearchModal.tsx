import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, X, Dessert, Users, ShoppingBag, FolderHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { products, customers, orders, setCurrentView } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal starts
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Support ESC closing hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Search filter datasets
  const matchedProducts = searchTerm
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const matchedCustomers = searchTerm
    ? customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const matchedOrders = searchTerm
    ? orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const hasResults = matchedProducts.length > 0 || matchedCustomers.length > 0 || matchedOrders.length > 0;

  // Navigation handlers
  const handleResultClick = (viewId: string) => {
    setCurrentView(viewId);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          className="bg-white dark:bg-[#0C1222] border border-gray-100 dark:border-[#1C273E] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-gray-100 dark:border-[#1C273E] flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
            />
            
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results Lists */}
          <div className="p-4 max-h-[420px] overflow-y-auto space-y-4">
            {searchTerm ? (
              hasResults ? (
                <div className="space-y-4">
                  
                  {/* Products Matches */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Gourmet Products ({matchedProducts.length})</h4>
                      {matchedProducts.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => handleResultClick('products')}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#131D33] rounded-xl cursor-pointer transition-colors text-xs font-semibold"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-gray-900 dark:text-white font-bold">{p.name}</p>
                              <p className="text-[10px] text-gray-400">{p.category}</p>
                            </div>
                          </div>
                          <span className="font-mono text-blue-500">${p.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customers Matches */}
                  {matchedCustomers.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-[#1C273E]">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Members Registered ({matchedCustomers.length})</h4>
                      {matchedCustomers.map(c => (
                        <div 
                          key={c.id}
                          onClick={() => handleResultClick('customers')}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#131D33] rounded-xl cursor-pointer transition-colors text-xs font-semibold"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-gray-900 dark:text-white font-bold">{c.name}</p>
                              <p className="text-[10px] text-gray-400">{c.email}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">{c.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Orders Matches */}
                  {matchedOrders.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-[#1C273E]">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Invoice Tickets ({matchedOrders.length})</h4>
                      {matchedOrders.map(o => (
                        <div 
                          key={o.id}
                          onClick={() => handleResultClick('orders')}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#131D33] rounded-xl cursor-pointer transition-colors text-xs font-semibold"
                        >
                          <div>
                            <p className="text-gray-900 dark:text-white font-bold">{o.id}</p>
                            <p className="text-[10px] text-gray-400">Placed by {o.customerName}</p>
                          </div>
                          <span className="font-mono text-gray-950 dark:text-white font-bold">${o.totalAmount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No matching products, customers, or tickets found.
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs space-y-1.5">
                <FolderHeart className="w-10 h-10 text-blue-400/20 mx-auto" />
                <p>Type above to execute instant search queries.</p>
                <p className="text-[10px] text-gray-500 font-mono">E.g., "Fudge", "Amara", "ORD-"</p>
              </div>
            )}
          </div>
          
          {/* Footer Shortcuts */}
          <div className="p-3 bg-gray-50 dark:bg-[#090E1A] border-t border-gray-100 dark:border-[#1C273E] text-[10px] text-gray-400 font-mono flex gap-4 justify-between items-center px-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white dark:bg-[#0C1222] text-[9px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#1C273E]">↵</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white dark:bg-[#0C1222] text-[9px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#1C273E]">esc</kbd>
              to close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
