import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Order, OrderItem } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock, 
  Coffee, 
  XCircle, 
  ArrowRight,
  User,
  CreditCard,
  Building,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    products, 
    customers, 
    settings, 
    createOrder, 
    updateOrderStatus 
  } = useDashboard();

  // Active filter state
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Preparing' | 'Delivered' | 'Cancelled'>('All');

  // Search filter matching name or ID
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for focus drawer/timeline tracking detail
  const [focusedOrder, setFocusedOrder] = useState<Order | null>(null);

  // New Order Modal States
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Card');
  const [creatorCart, setCreatorCart] = useState<Array<{productId: string, quantity: number}>>([]);

  // Matching orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CART HANDLERS FOR CREATING ORDER
  const updateCartQty = (productId: string, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    if (quantity <= 0) {
      setCreatorCart(prev => prev.filter(item => item.productId !== productId));
      return;
    }

    // Caps unit selection to actual stock constraint
    const cappedQty = Math.min(quantity, prod.stock);

    setCreatorCart(prev => {
      const exists = prev.find(item => item.productId === productId);
      if (exists) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: cappedQty } : item);
      } else {
        return [...prev, { productId, quantity: cappedQty }];
      }
    });
  };

  const getCartProductQty = (productId: string) => {
    const item = creatorCart.find(c => c.productId === productId);
    return item ? item.quantity : 0;
  };

  // Cart total sum previews
  const cartSubtotal = creatorCart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const cartTax = parseFloat((cartSubtotal * (settings.taxRate / 100)).toFixed(2));
  const cartTotal = parseFloat((cartSubtotal + cartTax).toFixed(2));

  // Submit authorized order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerEmail) {
      alert('Please select a loyalty customer profile.');
      return;
    }
    if (creatorCart.length === 0) {
      alert('Please add at least one dessert item to the ticket.');
      return;
    }

    createOrder(selectedCustomerEmail, creatorCart, paymentMethod);
    setIsCreatorOpen(false);
    setCreatorCart([]);
    setSelectedCustomerEmail('');
  };

  // Clear focused order synchronization if order list updates from behind
  const syncFocusedOrder = focusedOrder ? orders.find(o => o.id === focusedOrder.id) || null : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#0C1222] p-6 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-950 dark:text-white">Active Store Workload</h2>
          <p className="text-xs text-gray-400 mt-1">Submit tickets, monitor kitchen cooking timelines and direct handover processes.</p>
        </div>

        <button
          onClick={() => {
            // Pre-select first customer
            const activeC = customers.filter(c => c.status === 'Active');
            if (activeC.length === 0) {
              alert('Please create at least one Active customer in the Customers view before placing an order!');
              return;
            }
            setSelectedCustomerEmail(activeC[0].email);
            setCreatorCart([]);
            setIsCreatorOpen(true);
          }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Sweet Ticket
        </button>
      </div>

      {/* FILTER & TIMELINE TABS */}
      <div className="bg-white dark:bg-[#0C1222] p-4 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, clients, tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1E2B48] rounded-xl text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex bg-gray-50 dark:bg-[#131D33] rounded-xl p-1 border border-gray-100 dark:border-[#1C273E] overflow-x-auto self-stretch md:self-auto shrink-0 max-w-full">
          {(['All', 'Pending', 'Preparing', 'Delivered', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status 
                  ? 'bg-white dark:bg-[#0C1222] text-blue-500 dark:text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT SPLIT WINDOWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE ORDERS feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#0C1222] rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium overflow-hidden divide-y divide-gray-100 dark:divide-[#16223B]">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) => {
                const isSelected = syncFocusedOrder?.id === ord.id;
                
                return (
                  <div 
                    key={ord.id}
                    onClick={() => setFocusedOrder(ord)}
                    className={`p-5 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-blue-500/5 dark:bg-blue-950/20 border-l-4 border-blue-500/40' 
                        : 'hover:bg-gray-50/40 dark:hover:bg-[#131D33]/40 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-950 dark:text-white text-sm">
                          {ord.id}
                        </span>
                        
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          ord.status === 'Pending' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : ord.status === 'Preparing' 
                              ? 'bg-teal-500/10 text-teal-500 animate-pulse' 
                              : ord.status === 'Delivered' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <img 
                          src={ord.customerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'} 
                          alt={ord.customerName}
                          className="w-6 h-6 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{ord.customerName}</span>
                      </div>

                      {/* Items previews */}
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans max-w-[340px] truncate">
                        {ord.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right space-y-1.5 self-stretch sm:self-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                      <span className="font-mono font-bold text-gray-950 dark:text-white text-base">
                        {settings.currency}{ord.totalAmount.toFixed(2)}
                      </span>
                      
                      <div className="flex gap-1">
                        {ord.status === 'Pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateOrderStatus(ord.id, 'Preparing'); }}
                              className="text-[10px] font-bold px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                            >
                              Dispatch to Kitchen
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateOrderStatus(ord.id, 'Cancelled'); }}
                              className="text-[10px] font-bold px-2 py-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all cursor-pointer"
                              title="Cancel Ticket"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {ord.status === 'Preparing' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateOrderStatus(ord.id, 'Delivered'); }}
                            className="text-[10px] font-bold px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
                          >
                            Mark Handed Over
                          </button>
                        )}
                        {ord.status === 'Delivered' && (
                          <span className="text-[10px] text-gray-400 font-semibold italic bg-gray-100 dark:bg-gray-800/40 px-2 py-1 rounded">Enjoyed! 🎉</span>
                        )}
                        {ord.status === 'Cancelled' && (
                          <span className="text-[10px] text-rose-500 font-semibold bg-rose-500/5 px-2 py-1 rounded">Refunded 🚫</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                No custom order tickets placed.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED TRACKER TIMELINE */}
        <div className="space-y-4">
          {syncFocusedOrder ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#0C1222] p-5 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium space-y-5"
            >
              {/* Timeline Header */}
              <div className="border-b border-gray-100 dark:border-[#1C273E] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">Live Tracker UI</span>
                  <h3 className="text-base font-display font-bold text-gray-950 dark:text-white mt-1.5">{syncFocusedOrder.id} timeline</h3>
                </div>
                
                <button
                  onClick={() => setFocusedOrder(null)}
                  className="p-1 hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Invoice Breakdown */}
              <div className="space-y-2 bg-gray-50/50 dark:bg-[#131D33]/40 p-3 rounded-xl border border-gray-100 dark:border-[#1C273E]">
                {syncFocusedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600 dark:text-gray-400">{it.name} (x{it.quantity})</span>
                    <span className="font-mono text-gray-900 dark:text-white">{settings.currency}{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-100 dark:border-[#1C273E] pt-2 flex justify-between text-xs font-bold text-gray-950 dark:text-white">
                  <span>Grand Total</span>
                  <span className="font-mono">{settings.currency}{syncFocusedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* TIMELINE TRACKING UI */}
              <div className="relative pl-6 border-l border-gray-100 dark:border-[#1E2B48] py-1.5 space-y-6">
                {syncFocusedOrder.status === 'Cancelled' ? (
                  // Display simple cancelled timeline
                  <div className="relative select-none">
                    <span className="absolute -left-[30px] top-0 bg-rose-600 text-white p-1 rounded-full border-4 border-white dark:border-[#0C1222]">
                      <XCircle className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs font-bold text-rose-500">Order cancelled</h4>
                    <p className="text-[10px] text-gray-400 mt-1">This order was aborted by operations and refunded.</p>
                  </div>
                ) : (
                  // Display standard production timeline
                  syncFocusedOrder.timeline
                    .filter(event => event.status !== 'Cancelled')
                    .map((tle, i) => {
                      const Icon = tle.status === 'Pending' 
                        ? CheckCircle2 
                        : tle.status === 'Preparing' 
                          ? Coffee 
                          : textOnlyStatusIcon(tle.status);

                      function textOnlyStatusIcon(st: string) {
                        return CheckCircle2;
                      }

                      return (
                        <div key={i} className="relative select-none">
                          {/* Dot Badge indicator */}
                          <span className={`absolute -left-[30px] top-0 p-1 rounded-full border-4 ${
                            tle.done 
                              ? 'bg-emerald-600 text-white border-white dark:border-[#0C1222]' 
                              : 'bg-gray-100 text-gray-300 border-white dark:border-[#0C1222]'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>

                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className={`text-xs font-bold ${tle.done ? 'text-gray-900 dark:text-white' : 'text-gray-400 font-medium'}`}>
                              {tle.label}
                            </h4>
                            {tle.done && (
                              <span className="text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {tle.timestamp}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-[10px] ${tle.done ? 'text-gray-400 dark:text-gray-500' : 'text-gray-300 dark:text-gray-600'} mt-1`}>
                            {tle.description}
                          </p>
                        </div>
                      );
                    })
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50/50 dark:bg-[#0C1222]/40 p-12 text-center text-gray-400 rounded-2xl border border-dashed border-gray-200 dark:border-[#1C273E]">
              Select any sweet order ticket to observe its live tracker timeline details.
            </div>
          )}
        </div>
      </div>

      {/* NEW ORDER / CREATOR OVERLAY MODAL */}
      <AnimatePresence>
        {isCreatorOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0C1222] border border-gray-100 dark:border-[#1C273E] w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 dark:border-[#1C273E] flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">New active ticket</h3>
                <button
                  onClick={() => setIsCreatorOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Split Content */}
              <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* LEFT HALF SEARCH PRODUCTS CARD MATRIX */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 border-r border-gray-100 dark:border-[#1C273E]">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 block mb-2.5">Add fudge & waffles</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((p) => {
                      const cartQty = getCartProductQty(p.id);
                      
                      return (
                        <div 
                          key={p.id}
                          className={`p-3.5 rounded-xl border flex gap-3 items-center justify-between ${
                            cartQty > 0 
                              ? 'bg-blue-500/5 border-amber-500/30' 
                              : 'bg-gray-50/50 dark:bg-[#131D33]/40 border-gray-150 dark:border-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={p.imageUrl} 
                              alt={p.name} 
                              className="w-12 h-12 rounded-lg object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h5 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{p.name}</h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">{settings.currency}{p.price.toFixed(2)}</p>
                              <span className={`text-[9px] font-bold ${p.stock === 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {p.stock} on hand
                              </span>
                            </div>
                          </div>

                          {/* Cart Quantity controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {cartQty > 0 && (
                              <button
                                type="button"
                                onClick={() => updateCartQty(p.id, cartQty - 1)}
                                className="w-6 h-6 rounded-full bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-600 dark:text-white font-bold flex items-center justify-center text-xs active:scale-90 select-none cursor-pointer"
                              >
                                -
                              </button>
                            )}

                            {cartQty > 0 ? (
                              <span className="font-bold text-xs w-4 text-center">{cartQty}</span>
                            ) : (
                              <button
                                type="button"
                                disabled={p.stock === 0}
                                onClick={() => updateCartQty(p.id, 1)}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold px-2 py-1 text-[10px] rounded active:scale-95 transition-all select-none cursor-pointer"
                              >
                                Add
                              </button>
                            )}

                            {cartQty > 0 && (
                              <button
                                type="button"
                                onClick={() => updateCartQty(p.id, cartQty + 1)}
                                className="w-6 h-6 rounded-full bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-600 dark:text-white font-bold flex items-center justify-center text-xs active:scale-90 select-none cursor-pointer"
                              >
                                +
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT HALF INVOICE SUMMARY */}
                <div className="w-full md:w-80 bg-gray-50/55 dark:bg-[#0C1222] p-5 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 border-gray-100 dark:border-[#1C273E]">
                  <div className="space-y-4">
                    {/* Select Customer */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assign Active Customer</label>
                      <select
                        required
                        value={selectedCustomerEmail}
                        onChange={(e) => setSelectedCustomerEmail(e.target.value)}
                        className="w-full text-xs p-3 bg-white dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Choose Member --</option>
                        {customers
                          .filter(c => c.status === 'Active')
                          .map(c => (
                            <option key={c.email} value={c.email}>{c.name} ({c.email})</option>
                          ))
                        }
                      </select>
                    </div>

                    {/* Select Payment Method */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Payment Method</label>
                      <div className="grid grid-cols-3 bg-white dark:bg-[#131D33] rounded-xl p-1 border border-gray-200 dark:border-[#1C273E]">
                        {(['Card', 'Cash', 'Online'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                              paymentMethod === method 
                                ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                                : 'text-gray-400 hover:text-gray-800'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-[#1C273E]">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ticket Invoice Cart</span>
                      
                      {creatorCart.length > 0 ? (
                        <div className="space-y-2 max-h-36 overflow-y-auto">
                          {creatorCart.map((item) => {
                            const p = products.find(prod => prod.id === item.productId);
                            if (!p) return null;
                            return (
                              <div key={item.productId} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 dark:text-gray-300 truncate font-semibold w-11/12">{p.name} (x{item.quantity})</span>
                                <span className="font-mono text-gray-900 dark:text-white font-bold">{settings.currency}{(p.price * item.quantity).toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Add products from left matrix...</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing footer summary details */}
                  <div className="pt-4 border-t border-gray-100 dark:border-[#1C273E] mt-6 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Subtotal</span>
                      <span className="font-mono text-gray-500 font-semibold">{settings.currency}{cartSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Sales Tax ({settings.taxRate}%)</span>
                      <span className="font-mono text-gray-500 font-semibold">{settings.currency}{cartTax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold border-t border-gray-100 dark:border-[#1C273E] pt-2">
                      <span className="text-gray-900 dark:text-white">Amount Due</span>
                      <span className="font-mono text-blue-500 dark:text-blue-400">{settings.currency}{cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Buttons block */}
                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsCreatorOpen(false)}
                        className="flex-1 text-xs py-3 border border-gray-200 dark:border-[#1C273E] hover:bg-gray-100 dark:hover:bg-[#131D33] text-gray-400 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        disabled={creatorCart.length === 0 || !selectedCustomerEmail}
                        className="flex-1 text-xs py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 hover:disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                      >
                        Print Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
