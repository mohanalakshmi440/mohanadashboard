/**
 * TypeScript type definitions for the Cream Fudge Premium Business Dashboard.
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number; // For margin calculations
  stock: number;
  maxStock: number;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  salesCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  avatarUrl: string;
  status: 'Active' | 'Inactive';
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineEvent {
  status: 'Pending' | 'Preparing' | 'Delivered' | 'Cancelled';
  label: string;
  description: string;
  timestamp: string;
  done: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Delivered' | 'Cancelled';
  createdAt: string;
  paymentMethod: 'Card' | 'Cash' | 'Online';
  timeline: OrderTimelineEvent[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'revenue' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsTrendItem {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

export interface BusinessSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  taxRate: number;
  theme: 'light' | 'dark';
  enableSoundAlerts: boolean;
  lowStockThreshold: number;
}
