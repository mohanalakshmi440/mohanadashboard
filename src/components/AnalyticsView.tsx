import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Layers, 
  Calendar,
  Users,
  PieChart as PieIcon,
  ChefHat,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { INITIAL_ANALYTICS, CATEGORY_DATA } from '../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { orders, products, settings } = useDashboard();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Math on current orders to build real-time margins
  const activeOrders = orders.filter(o => o.status === 'Delivered');
  const liveRev = activeOrders.reduce((tot, o) => tot + o.totalAmount, 0);
  
  // Calculate relative cost of goods sold (COGS) based on product costPrice proportion
  const estimateCOGS = activeOrders.reduce((cogs, o) => {
    return cogs + o.items.reduce((itemCogs, item) => {
      // Find actual cost of the product
      const p = products.find(prod => prod.id === item.productId);
      const costPerUnit = p ? p.costPrice : item.price * 0.35; // fallback to 35% margin
      return itemCogs + (costPerUnit * item.quantity);
    }, 0);
  }, 0);

  const liveProfit = Math.max(0, liveRev - estimateCOGS);
  const liveMargin = liveRev > 0 ? (liveProfit / liveRev) * 100 : 66.4;

  // Let's create an updated analytics dataset that appends the live "May 28" orders calculations safely
  const updatedAnalytics = INITIAL_ANALYTICS.map(item => {
    if (item.date === 'May 28') {
      return {
        ...item,
        // Add live calculations together with baseline mock values
        revenue: parseFloat((item.revenue + liveRev).toFixed(2)),
        cost: parseFloat((item.cost + estimateCOGS).toFixed(2)),
        profit: parseFloat((item.profit + liveProfit).toFixed(2)),
        orders: item.orders + activeOrders.length
      };
    }
    return item;
  });

  // Category Pie Chart Cell Colors (Stripe/Linear style)
  const COLORS = ['#D97706', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

  return (
    <div className="space-y-6">
      {/* Top Controls Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Business Intelligence & Trends</h2>
          <p className="text-xs text-gray-400 mt-1">Deep analytics on dessert sales, item margins, category coverage, and operational efficiency.</p>
        </div>
        
        {/* Time Filter Tabs */}
        <div className="flex bg-gray-50 dark:bg-[#202428] rounded-xl p-1 border border-gray-100 dark:border-[#2D3135] self-start">
          {(['daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                timeRange === range 
                  ? 'bg-white dark:bg-[#1A1D20] text-amber-600 dark:text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* THREE BENTO CARDS COMPILING DYNAMIC OVERVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Gross Revenue Growth</span>
            <h4 className="text-lg font-display font-bold text-gray-950 dark:text-white mt-0.5">
              {settings.currency}{(updatedAnalytics.reduce((s, a) => s + a.revenue, 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h4>
            <p className="text-[10px] text-emerald-500 font-bold mt-0.5">🚀 +18.2% Compound Margin</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Avg Gross Profit Margins</span>
            <h4 className="text-lg font-display font-bold text-gray-950 dark:text-white mt-0.5">
              {liveMargin.toFixed(1)}%
            </h4>
            <p className="text-[10px] text-emerald-500 font-bold mt-0.5">Stable sweet ingredients costs</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1D20] p-5 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Average Ticket Invoice</span>
            <h4 className="text-lg font-display font-bold text-gray-950 dark:text-white mt-0.5">
              {settings.currency}{(updatedAnalytics.reduce((sum, a) => sum + a.revenue, 0) / updatedAnalytics.reduce((sum, a) => sum + a.orders, 0)).toFixed(2)}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Per-customer transactional values</p>
          </div>
        </div>
      </div>

      {/* CORE GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPHS A: REVENUE & COGS SPENT VS NET PROFIT */}
        <div className="bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white">Revenue vs Cost vs Profit margins</h3>
              <p className="text-[11px] text-gray-400">Detailed overview of ingredient overhead vs profit gains</p>
            </div>
            <span className="p-1 px-2 text-[10px] font-mono text-gray-400 uppercase bg-gray-50 dark:bg-[#202428] rounded border border-gray-100 dark:border-[#2D3135]">
              Cash metrics
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={updatedAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3135" className="hidden dark:block" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#F59E0B' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#D97706" color="#D97706" fill="#D97706" fillOpacity={0.15} name="Total sales" />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#EF4444" color="#EF4444" fill="#EF4444" fillOpacity={0.1} name="COGS overhead" />
                <Area type="monotone" dataKey="profit" stackId="3" stroke="#10B981" color="#10B981" fill="#10B981" fillOpacity={0.2} name="Net profits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPHS B: SALES AND ORDER VOLUMES */}
        <div className="bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white">Daily Order Count & Servings</h3>
              <p className="text-[11px] text-gray-400">Total processed tickets vs food quantities cooked</p>
            </div>
            <span className="p-1 px-2 text-[10px] font-mono text-gray-400 uppercase bg-gray-50 dark:bg-[#202428] rounded border border-gray-100 dark:border-[#2D3135]">
              Workload volumes
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={updatedAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3135" className="hidden dark:block" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="orders" fill="#D97706" radius={[4, 4, 0, 0]} name="Orders Processed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPHS C: DESSERT CATEGORY COVERAGE (PIE) */}
        <div className="bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white">Dessert Category Distribution</h3>
              <p className="text-[11px] text-gray-400">Percentage distribution of items customized by customers</p>
            </div>
            <PieIcon className="w-4 h-4 text-gray-400" />
          </div>

          <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-48 h-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Premium Legend Labels */}
            <div className="space-y-2 flex-1 w-full">
              {CATEGORY_DATA.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs border-b border-gray-100 dark:border-[#2D3135] pb-1.5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-600 dark:text-gray-300 font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRAPHS D: CLUB MEMBERSHIP GROWTH (LINE) */}
        <div className="bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-gray-950 dark:text-white">Active Club Registrations</h3>
              <p className="text-[11px] text-gray-400">Accumulated list of gourmet loyalty members weekly</p>
            </div>
            <Users className="w-4 h-4 text-gray-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={updatedAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3135" className="hidden dark:block" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} name="Enrolled Buyers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
