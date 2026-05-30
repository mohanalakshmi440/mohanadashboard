import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Activity, 
  Plus, 
  Percent, 
  Dessert, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { INITIAL_ANALYTICS } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    products, 
    customers, 
    orders, 
    notifications, 
    settings, 
    setCurrentView, 
    createOrder, 
    updateOrderStatus 
  } = useDashboard();

  // Selected KPI Card for sub-trend display
  const [selectedKPI, setSelectedKPI] = useState<string>('revenue');

  // Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  const totalOrdersCount = orders.length;
  
  // Total units sold
  const totalUnitsSold = nonCancelledOrders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;

  // Best Selling Product
  const bestSellingProduct = [...products].sort((a, b) => b.salesCount - a.salesCount)[0];

  // Live alert stats
  const lowStockItems = products.filter(p => p.stock <= settings.lowStockThreshold && p.stock > 0);
  const outOfStockItems = products.filter(p => p.stock === 0);

  // Quick simulation trigger
  const handleSimulateSalesRush = () => {
    if (customers.length === 0 || products.length === 0) return;
    
    // Pick average customer
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    // Pick 1-2 random products that have stock
    const activeProducts = products.filter(p => p.stock > 0);
    if (activeProducts.length === 0) {
      alert('All products are completely out of stock! Refill them in the Products view first.');
      return;
    }

    const itemsToOrderLevel1 = activeProducts[Math.floor(Math.random() * activeProducts.length)];
    const items = [{ productId: itemsToOrderLevel1.id, quantity: Math.floor(Math.random() * 2) + 1 }];
    
    // Possibly add another
    if (Math.random() > 0.5 && activeProducts.length > 1) {
      const remainingP = activeProducts.filter(p => p.id !== itemsToOrderLevel1.id);
      items.push({ productId: remainingP[0].id, quantity: 1 });
    }

    const paymentMethods: Array<'Card' | 'Cash' | 'Online'> = ['Card', 'Cash', 'Online'];
    const pMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    createOrder(randomCustomer.email, items, pMethod);
  };

  // KPI metadata
  const kpis = [
    {
      id: 'revenue',
      label: 'Gross Revenue',
      value: `${settings.currency}${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      percentage: '+15.4%',
      trendUp: true,
      subtext: 'vs last week status',
      trendData: [
        { name: 'Mon', val: totalRevenue * 0.4 },
        { name: 'Tue', val: totalRevenue * 0.55 },
        { name: 'Wed', val: totalRevenue * 0.7 },
        { name: 'Thu', val: totalRevenue * 0.8 },
        { name: 'Fri', val: totalRevenue * 0.9 },
        { name: 'Sat', val: totalRevenue * 0.95 },
        { name: 'Sun', val: totalRevenue }
      ]
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: totalOrdersCount.toString(),
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600',
      percentage: '+8.2%',
      trendUp: true,
      subtext: 'Live incoming orders',
      trendData: [
        { name: 'Mon', val: Math.round(totalOrdersCount * 0.5) },
        { name: 'Tue', val: Math.round(totalOrdersCount * 0.62) },
        { name: 'Wed', val: Math.round(totalOrdersCount * 0.7) },
        { name: 'Thu', val: Math.round(totalOrdersCount * 0.82) },
        { name: 'Fri', val: Math.round(totalOrdersCount * 0.9) },
        { name: 'Sat', val: Math.round(totalOrdersCount * 0.95) },
        { name: 'Sun', val: totalOrdersCount }
      ]
    },
    {
      id: 'sales',
      label: 'Servings Sold',
      value: totalUnitsSold.toLocaleString(),
      icon: Dessert,
      color: 'from-yellow-500 to-yellow-600',
      percentage: '+12.1%',
      trendUp: true,
      subtext: 'Dessert units claimed',
      trendData: [
        { name: 'Mon', val: Math.round(totalUnitsSold * 0.4) },
        { name: 'Tue', val: Math.round(totalUnitsSold * 0.6) },
        { name: 'Wed', val: Math.round(totalUnitsSold * 0.72) },
        { name: 'Thu', val: Math.round(totalUnitsSold * 0.8) },
        { name: 'Fri', val: Math.round(totalUnitsSold * 0.88) },
        { name: 'Sat', val: Math.round(totalUnitsSold * 0.92) },
        { name: 'Sun', val: totalUnitsSold }
      ]
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: activeCustomersCount.toString(),
      icon: Users,
      color: 'from-rose-500 to-rose-600',
      percentage: '+5.4',
      trendUp: true,
      subtext: 'Enrolled club users',
      trendData: [
        { name: 'Mon', val: Math.round(activeCustomersCount * 0.7) },
        { name: 'Tue', val: Math.round(activeCustomersCount * 0.8) },
        { name: 'Wed', val: Math.round(activeCustomersCount * 0.85) },
        { name: 'Thu', val: Math.round(activeCustomersCount * 0.9) },
        { name: 'Fri', val: Math.round(activeCustomersCount * 0.95) },
        { name: 'Sat', val: Math.round(activeCustomersCount * 0.98) },
        { name: 'Sun', val: activeCustomersCount }
      ]
    }
  ];

  const selectedKPIMeta = kpis.find(k => k.id === selectedKPI) || kpis[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold font-mono tracking-wider bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> LIVE TERMINAL
            </span>
            <span className="text-gray-400 text-xs">UTC: 2026-05-28</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Sweet Operations Hub</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your gourmet dessert parameters, track real-time kitchen workloads, and inspect gross analytics.
          </p>
        </div>
        
        {/* Quick Simulation Button Bar */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleSimulateSalesRush}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg shadow-amber-600/10 transition-all active:scale-95 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            Simulate Lunch Rush Order
          </button>
          
          <button
            onClick={() => setCurrentView('orders')}
            className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#24282C] border border-gray-200 dark:border-[#2D3135] hover:bg-gray-100 dark:hover:bg-[#2D3135] text-gray-700 dark:text-gray-300 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Order
          </button>
        </div>
      </div>

      {/* KPI BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isSelected = selectedKPI === kpi.id;
          
          return (
            <motion.div
              key={kpi.id}
              onClick={() => setSelectedKPI(kpi.id)}
              whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-500/30' 
                  : 'bg-white dark:bg-[#1A1D20] border-gray-100 dark:border-[#2D3135]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{kpi.label}</span>
                <span className={`p-2 rounded-xl bg-gradient-to-tr ${kpi.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white leading-none">
                  {kpi.value}
                </h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-xs font-bold ${kpi.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.percentage}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{kpi.subtext}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHART SECTION: INTERACTIVE SUB-TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white capitalize">
                {selectedKPIMeta.label} Week trend
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Focus graph on dynamic tracking variables</p>
            </div>
            
            <span className="text-xs font-bold font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-500/10">
              Live updates
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedKPIMeta.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKPI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'Inter, sans-serif'
                  }} 
                  labelClassName="font-bold text-amber-400"
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#D97706" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorKPI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDE BENTO: QUICK STATUS & BEST PRODUCT */}
        <div className="flex flex-col gap-4">
          {/* Best Product */}
          <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Best Selling Product</span>
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                MVP Item
              </span>
            </div>

            {bestSellingProduct ? (
              <div className="flex items-center gap-4 my-2">
                <img 
                  src={bestSellingProduct.imageUrl} 
                  alt={bestSellingProduct.name} 
                  className="w-16 h-16 rounded-xl object-cover shadow border border-gray-100 dark:border-[#2D3135]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{bestSellingProduct.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{bestSellingProduct.category}</p>
                  <p className="text-xs font-mono font-bold text-amber-500 mt-1">
                    {bestSellingProduct.salesCount} claims
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No product found.</p>
            )}

            <div className="border-t border-gray-100 dark:border-[#2D3135] pt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">Inventory Status</span>
              {bestSellingProduct && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  bestSellingProduct.stock === 0 
                    ? 'bg-rose-500/10 text-rose-500' 
                    : bestSellingProduct.stock <= settings.lowStockThreshold 
                      ? 'bg-amber-500/10 text-amber-500 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {bestSellingProduct.stock} left in stock
                </span>
              )}
            </div>
          </div>

          {/* Critical Warnings Panel */}
          <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium flex-1">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 block">Inventory & Alerts Alertboard</h4>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <span className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Out of Stock Items
                </span>
                <span className="text-xs font-mono font-bold text-rose-500">{outOfStockItems.length}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <span className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Low Stock Items
                </span>
                <span className="text-xs font-mono font-bold text-amber-500">{lowStockItems.length}</span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('products')}
              className="w-full flex items-center justify-center gap-1 mt-4 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
            >
              Examine Inventory <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE & WORKFLOW TRACKING */}
      <div className="bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
        <div className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-3 mb-6">
          <div>
            <h3 className="text-base font-display font-bold text-gray-900 dark:text-white">Active Store Workload</h3>
            <p className="text-xs text-gray-400 mt-0.5">Instantly dispatch and move dessert orders through cooking timelines</p>
          </div>
          
          <button 
            onClick={() => setCurrentView('orders')}
            className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors self-start"
          >
            Go to Orders Manager →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#2D3135] text-gray-400 text-xs font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Dessert Products</th>
                <th className="py-3 px-4">Invoice Total</th>
                <th className="py-3 px-4">Status Status</th>
                <th className="py-3 px-4 text-right">Progress Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#24282C]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-[#202428]/50 transition-colors text-xs">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={order.customerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'} 
                        alt={order.customerName} 
                        className="w-7 h-7 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{order.customerName}</p>
                        <p className="text-[10px] text-gray-400 leading-tight">{order.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px] truncate scrollbar-none text-gray-600 dark:text-gray-300">
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-white">
                    {settings.currency}{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'Pending' 
                        ? 'bg-amber-500/10 text-amber-500' 
                        : order.status === 'Preparing' 
                          ? 'bg-blue-500/10 text-blue-500 animate-pulse' 
                          : order.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                      >
                        Start Batch
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                      >
                        Hand Over
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="text-gray-400 text-[10px] font-medium font-mono">Completed 👌</span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="text-rose-500 text-[10px] font-medium font-mono">Aborted 🚫</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
