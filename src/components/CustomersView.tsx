import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Customer } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Edit, 
  X, 
  UserCheck, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, settings } = useDashboard();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const testAvatars = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  ];

  // Search/Filter matching logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || cust.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Handle open add modal
  const openAddModal = () => {
    setName('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setAvatarIndex(Math.floor(Math.random() * testAvatars.length));
    setIsAddModalOpen(true);
  };

  // Handle open edit modal
  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setStatus(customer.status);
    // Find index of existing avatar or default
    const idx = testAvatars.indexOf(customer.avatarUrl);
    setAvatarIndex(idx !== -1 ? idx : 0);
  };

  // Submit Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out Name and Email.');
      return;
    }

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name,
        email,
        phone,
        status,
        avatarUrl: testAvatars[avatarIndex]
      });
      setEditingCustomer(null);
    } else {
      addCustomer({
        name,
        email,
        phone,
        avatarUrl: testAvatars[avatarIndex]
      });
      setIsAddModalOpen(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (customers.length === 0) {
      alert('No customers to export.');
      return;
    }
    const headers = ['Customer ID', 'Full Name', 'Email Address', 'Phone Number', 'Orders Count', 'Total Spent', 'Last Order Date', 'Member Status'];
    const rows = customers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      c.ordersCount,
      c.totalSpent.toFixed(2),
      c.lastOrderDate,
      c.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CreamFudge_Customers_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#0C1222] p-6 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-950 dark:text-white">Customer Database</h2>
          <p className="text-xs text-gray-400 mt-1">Audit customer loyalty records, transaction histories, and manage subscriber details.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#16223B] hover:bg-gray-100 dark:hover:bg-[#1C273E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#1C273E] text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-400" />
            Export CSV
          </button>
          
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-[#0C1222] p-4 rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1E2B48] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          <div className="grid grid-cols-3 bg-gray-50 dark:bg-[#131D33] rounded-xl p-1 border border-gray-100 dark:border-[#1C273E] flex-1 md:flex-initial">
            {(['All', 'Active', 'Inactive'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => { setStatusFilter(filter); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === filter 
                    ? 'bg-white dark:bg-[#0C1222] text-blue-500 dark:text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOMERS LISTING TABLE */}
      <div className="bg-white dark:bg-[#0C1222] rounded-2xl border border-gray-100 dark:border-[#1C273E] shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1C273E] text-gray-400 text-xs font-semibold">
                <th className="py-3 px-5">Loyalty Member</th>
                <th className="py-3 px-5">Contact Info</th>
                <th className="py-3 px-5 text-center">Orders Claimed</th>
                <th className="py-3 px-5 text-right">Sum spent</th>
                <th className="py-3 px-5">Last Active Visit</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#16223B]">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-[#131D33]/50 transition-colors text-xs">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatarUrl} 
                          alt={customer.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-gray-100 dark:border-[#1C273E]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{customer.name}</p>
                          <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">
                            {customer.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-medium text-gray-700 dark:text-gray-300">{customer.email}</p>
                      <p className="text-[10px] text-gray-400">{customer.phone}</p>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-gray-800 dark:text-gray-200">
                      {customer.ordersCount} servings
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-gray-950 dark:text-white">
                      {settings.currency}{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-gray-500 dark:text-gray-400">
                      {customer.lastOrderDate}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        customer.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-gray-300/10 text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-[#16223B] rounded-lg transition-colors cursor-pointer"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${customer.name}? This resets their invoice metrics.`)) {
                              deleteCustomer(customer.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-[#16223B] rounded-lg transition-colors cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                    No customers found matching search details.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-[#1C273E] bg-gray-50/50 dark:bg-[#0C1222]">
            <span className="text-xs text-gray-400 font-medium">
              Showing page <strong className="text-gray-900 dark:text-white">{currentPage}</strong> of {totalPages}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-1.5 border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16223B] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1.5 border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16223B] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT DIALOG (MODAL OVERLAY) */}
      <AnimatePresence>
        {(isAddModalOpen || editingCustomer !== null) && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0C1222] border border-gray-100 dark:border-[#1C273E] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 dark:border-[#1C273E] flex items-center justify-between">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  {editingCustomer ? 'Modify Customer Profile' : 'Register New Customer'}
                </h3>
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name..."
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com..."
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000..."
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Avatar Selection</label>
                    <div className="flex gap-2 items-center h-[42px] px-2 bg-gray-50 dark:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] rounded-xl">
                      <img 
                        src={testAvatars[avatarIndex]} 
                        alt="Preview" 
                        className="w-7 h-7 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setAvatarIndex((prev) => (prev + 1) % testAvatars.length)}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-500 cursor-pointer"
                      >
                        Next Face
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 border-t border-gray-100 dark:border-[#1C273E] pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }}
                    className="flex-1 text-xs py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#131D33] border border-gray-200 dark:border-[#1C273E] text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-xs py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
