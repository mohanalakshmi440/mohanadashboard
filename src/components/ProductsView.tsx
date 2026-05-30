import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Product } from '../types';
import { 
  Dessert, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Filter, 
  RotateCcw,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useDashboard();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ice Cream');
  const [price, setPrice] = useState('5.00');
  const [costPrice, setCostPrice] = useState('1.50');
  const [stock, setStock] = useState('20');
  const [maxStock, setMaxStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('');

  // Categories list
  const categories = ['Ice Cream', 'Milkshakes', 'Cakes & Brownies', 'Waffles & Crepes', 'Snacks & Sides'];

  // Default images lookup by category
  const defaultCategoryImages: Record<string, string> = {
    'Ice Cream': 'https://images.unsplash.com/photo-1501443712940-a136012d5830?auto=format&fit=crop&q=80&w=400',
    'Milkshakes': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
    'Cakes & Brownies': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    'Waffles & Crepes': 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400',
    'Snacks & Sides': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=400'
  };

  // Filter products logic
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || prod.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'In Stock') matchesStock = prod.stock > settings.lowStockThreshold;
    else if (stockFilter === 'Low Stock') matchesStock = prod.stock <= settings.lowStockThreshold && prod.stock > 0;
    else if (stockFilter === 'Out of Stock') matchesStock = prod.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle opening additions modal
  const openAddModal = () => {
    setName('');
    setCategory('Ice Cream');
    setPrice('5.99');
    setCostPrice('1.80');
    setStock('30');
    setMaxStock('100');
    setImageUrl('');
    setIsAddModalOpen(true);
  };

  // Handle opening editor modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setCostPrice(product.costPrice.toString());
    setStock(product.stock.toString());
    setMaxStock(product.maxStock.toString());
    setImageUrl(product.imageUrl);
  };

  // Submit Save Product
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || parseFloat(price) <= 0 || parseInt(stock) < 0) {
      alert('Please enter a valid product name, positive price and non-negative stock.');
      return;
    }

    const finalImage = imageUrl.trim() || defaultCategoryImages[category] || defaultCategoryImages['Ice Cream'];

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        category,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock),
        maxStock: parseInt(maxStock),
        imageUrl: finalImage
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name,
        category,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock),
        maxStock: parseInt(maxStock),
        imageUrl: finalImage
      });
      setIsAddModalOpen(false);
    }
  };

  // Dedicated Restock Button Helper
  const handleQuickRestock = (product: Product, amount: number) => {
    const currentStock = product.stock;
    const nextStock = Math.min(product.maxStock, currentStock + amount);
    updateProduct({
      ...product,
      stock: nextStock
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1A1D20] p-6 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-950 dark:text-white">Candy & Dessert Inventory</h2>
          <p className="text-xs text-gray-400 mt-1">Manage physical dessert stock, change pricing variables, and add custom fast-foods items.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Gourmet Product
        </button>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="bg-white dark:bg-[#1A1D20] p-4 rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2C3034] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
            />
          </div>

          <div className="flex bg-gray-50 dark:bg-[#202428] rounded-xl p-1 border border-gray-100 dark:border-[#2D3135] overflow-x-auto self-stretch md:self-auto shrink-0 max-w-full">
            {(['All', ...categories] as string[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat 
                    ? 'bg-white dark:bg-[#1A1D20] text-amber-600 dark:text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Alerts Quick Ribbons */}
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100 dark:border-[#23272A] overflow-x-auto">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-2">Stock Level:</span>
          {(['All', 'In Stock', 'Low Stock', 'Out of Stock'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setStockFilter(lvl)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg capitalize border cursor-pointer ${
                stockFilter === lvl 
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' 
                  : 'bg-transparent text-gray-400 border-gray-100 dark:border-[#23272A] hover:bg-gray-50 dark:hover:bg-[#202428]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS VISUAL bento DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const currentStockPercent = Math.min(100, Math.round((p.stock / p.maxStock) * 100));
            // Profit margin helper
            const marginAmount = p.price - p.costPrice;
            const marginPercent = ((marginAmount / p.price) * 100).toFixed(0);

            return (
              <motion.div
                key={p.id}
                layout
                className="bg-white dark:bg-[#1A1D20] rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium overflow-hidden group flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900 leading-none">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {p.category}
                  </span>

                  {/* Stock Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-1 rounded-md shadow ${
                    p.status === 'In Stock' 
                      ? 'bg-emerald-600 text-white' 
                      : p.status === 'Low Stock' 
                        ? 'bg-amber-500 text-white animate-pulse' 
                        : 'bg-rose-600 text-white'
                  }`}>
                    {p.status}
                  </span>

                  {/* Overlay Claims count */}
                  <span className="absolute bottom-2.5 left-2.5 bg-[#FFF7ED]/90 dark:bg-[#1A1D20]/90 backdrop-blur-md text-amber-700 dark:text-amber-500 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/10">
                    {p.salesCount.toLocaleString()} serves claimed
                  </span>
                </div>

                {/* Info and Pricing */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 leading-snug">{p.name}</h4>
                      <p className="font-mono font-bold text-gray-900 dark:text-white shrink-0">
                        {settings.currency}{p.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Cost / Profit Margin Ribbon */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>Refill cost: {settings.currency}{p.costPrice.toFixed(2)}</span>
                      <span className="text-emerald-500 font-bold">{marginPercent}% profit gain</span>
                    </div>
                  </div>

                  {/* Stock Volume Visual Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400 font-bold font-mono">Stock: {p.stock} / {p.maxStock}</span>
                      <span className="text-gray-400 font-medium">{currentStockPercent}% capacity</span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-150 dark:bg-gray-800 rounded-full overflow-hidden leading-none">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          p.stock === 0 
                            ? 'bg-rose-600 w-0' 
                            : p.stock <= settings.lowStockThreshold 
                              ? 'bg-amber-500' 
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                        }`}
                        style={{ width: `${currentStockPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* RESTOCK / DISPATCH ACTIONS BAR */}
                  <div className="border-t border-gray-100 dark:border-[#23272A] pt-3 flex items-center justify-between gap-1">
                    {/* Add Stock buttons */}
                    <div className="flex gap-1 items-center">
                      <button
                        onClick={() => handleQuickRestock(p, 5)}
                        disabled={p.stock >= p.maxStock}
                        className="text-[9px] font-bold px-2 py-1 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 border border-amber-500/10 rounded disabled:opacity-40 transition-all cursor-pointer"
                      >
                        +5 Stock
                      </button>
                      <button
                        onClick={() => handleQuickRestock(p, 20)}
                        disabled={p.stock >= p.maxStock}
                        className="text-[9px] font-bold px-2 py-1 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 border border-amber-500/10 rounded disabled:opacity-40 transition-all cursor-pointer"
                      >
                        +20
                      </button>
                    </div>

                    {/* Standard Card Options */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1 border border-gray-100 dark:border-[#23272A] hover:bg-gray-50 dark:hover:bg-[#202428] rounded-xl text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${p.name} from gourmet dessert selection?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1 border border-gray-100 dark:border-[#23272A] hover:bg-gray-50 dark:hover:bg-[#202428] rounded-xl text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400 bg-white dark:bg-[#1A1D20] rounded-2xl border border-gray-100 dark:border-[#2D3135] shadow-premium">
            <Dessert className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
            No dessert products in this category query.
          </div>
        )}
      </div>

      {/* CRUD DIALOG OVERLAY */}
      <AnimatePresence>
        {(isAddModalOpen || editingProduct !== null) && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1A1D20] border border-gray-100 dark:border-[#2D3135] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 dark:border-[#2D3135] flex items-center justify-between">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  {editingProduct ? 'Modify Gourmet Dessert' : 'Create Dessert Product'}
                </h3>
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Dessert Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Mint Fudge Crunch Melt..."
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pricing Unit ({settings.currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price..."
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">COGS Cost ({settings.currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="Cost..."
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Starting On Hand</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Stock..."
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Max Stock Limiter</label>
                    <input
                      type="number"
                      required
                      value={maxStock}
                      onChange={(e) => setMaxStock(e.target.value)}
                      placeholder="Max..."
                      className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Unsplash Photo link (Optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Pasted image URL, or leave blank to auto-select beautiful CDN placeholder"
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
                  />
                  {!imageUrl && (
                    <span className="text-[10px] text-amber-500 font-semibold block mt-1">
                      ✨ Leave empty to auto-assign a delicious {category} HD image!
                    </span>
                  )}
                </div>

                {/* Submit Panel */}
                <div className="flex gap-2 border-t border-gray-100 dark:border-[#2D3135] pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                    className="flex-1 text-xs py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#202428] border border-gray-200 dark:border-[#2D3135] text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-xs py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-lg shadow-amber-600/10 cursor-pointer"
                  >
                    Save Dessert
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
