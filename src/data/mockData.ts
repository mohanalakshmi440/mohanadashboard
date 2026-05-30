import { Product, Customer, Order, Notification, AnalyticsTrendItem, CategoryDistribution, BusinessSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'Belgian Chocolate Fudge Scoop',
    category: 'Ice Cream',
    price: 6.99,
    costPrice: 2.10,
    stock: 45,
    maxStock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 1420
  },
  {
    id: 'PRD-002',
    name: 'Cookie Fudge Special Shake',
    category: 'Milkshakes',
    price: 8.50,
    costPrice: 2.80,
    stock: 8,
    maxStock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
    status: 'Low Stock',
    salesCount: 980
  },
  {
    id: 'PRD-003',
    name: 'Decadent Lava Fudge Brownie',
    category: 'Cakes & Brownies',
    price: 7.25,
    costPrice: 2.50,
    stock: 22,
    maxStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 1120
  },
  {
    id: 'PRD-004',
    name: 'Hot Caramel Belgian Waffle',
    category: 'Waffles & Crepes',
    price: 9.99,
    costPrice: 3.20,
    stock: 18,
    maxStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 840
  },
  {
    id: 'PRD-005',
    name: 'Double Cheesy Jalapeño Fries',
    category: 'Snacks & Sides',
    price: 7.99,
    costPrice: 1.90,
    stock: 35,
    maxStock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 650
  },
  {
    id: 'PRD-006',
    name: 'Classic Crispy Fries',
    category: 'Snacks & Sides',
    price: 5.50,
    costPrice: 1.20,
    stock: 0,
    maxStock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
    status: 'Out of Stock',
    salesCount: 512
  },
  {
    id: 'PRD-007',
    name: 'Velvet Pink Strawberry Shake',
    category: 'Milkshakes',
    price: 8.25,
    costPrice: 2.65,
    stock: 32,
    maxStock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1553787499-6f9133860275?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 740
  },
  {
    id: 'PRD-008',
    name: 'Cream Fudge Signature Sundae',
    category: 'Ice Cream',
    price: 11.50,
    costPrice: 4.10,
    stock: 15,
    maxStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1501443712940-a136012d5830?auto=format&fit=crop&q=80&w=400',
    status: 'In Stock',
    salesCount: 1650
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CST-402',
    name: 'Amara Sterling',
    email: 'amara.sterling@outlook.com',
    phone: '+1 (555) 432-8822',
    ordersCount: 45,
    totalSpent: 485.50,
    lastOrderDate: '2026-05-28',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    status: 'Active'
  },
  {
    id: 'CST-711',
    name: 'Liam Henderson',
    email: 'liam.henderson@gmail.com',
    phone: '+1 (555) 901-2244',
    ordersCount: 32,
    totalSpent: 320.25,
    lastOrderDate: '2026-05-27',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    status: 'Active'
  },
  {
    id: 'CST-928',
    name: 'Chloe Devereaux',
    email: 'chloe.dev@me.com',
    phone: '+1 (555) 302-9911',
    ordersCount: 18,
    totalSpent: 215.40,
    lastOrderDate: '2026-05-26',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    status: 'Active'
  },
  {
    id: 'CST-109',
    name: 'Marcus Brody',
    email: 'marcus.brody@yahoo.com',
    phone: '+1 (555) 234-5566',
    ordersCount: 29,
    totalSpent: 304.80,
    lastOrderDate: '2026-05-25',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    status: 'Active'
  },
  {
    id: 'CST-334',
    name: 'Sophia Valentine',
    email: 'sophia.v@glowmedia.com',
    phone: '+1 (555) 881-2309',
    ordersCount: 8,
    totalSpent: 84.50,
    lastOrderDate: '2026-05-18',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    status: 'Active'
  },
  {
    id: 'CST-505',
    name: 'Julian Vance',
    email: 'julian.vance@gmail.com',
    phone: '+1 (555) 123-4567',
    ordersCount: 0,
    totalSpent: 0.00,
    lastOrderDate: 'N/A',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    status: 'Inactive'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5012',
    customerName: 'Amara Sterling',
    customerEmail: 'amara.sterling@outlook.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    items: [
      { productId: 'PRD-008', name: 'Cream Fudge Signature Sundae', price: 11.50, quantity: 2 },
      { productId: 'PRD-003', name: 'Decadent Lava Fudge Brownie', price: 7.25, quantity: 1 }
    ],
    totalAmount: 30.25,
    status: 'Preparing',
    createdAt: '2026-05-28T08:15:00Z',
    paymentMethod: 'Card',
    timeline: [
      { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: '08:15 AM', done: true },
      { status: 'Preparing', label: 'In Kitchen', description: 'Desserts are being crafted by fudge masters.', timestamp: '08:20 AM', done: true },
      { status: 'Delivered', label: 'Out for Delivery / Ready', description: 'Assigned to courier or ready for pickup.', timestamp: 'Muted', done: false },
      { status: 'Cancelled', label: 'Order Cancelled', description: 'This order has been aborted', timestamp: 'Muted', done: false }
    ]
  },
  {
    id: 'ORD-5011',
    customerName: 'Liam Henderson',
    customerEmail: 'liam.henderson@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    items: [
      { productId: 'PRD-002', name: 'Cookie Fudge Special Shake', price: 8.50, quantity: 1 },
      { productId: 'PRD-005', name: 'Double Cheesy Jalapeño Fries', price: 7.99, quantity: 1 }
    ],
    totalAmount: 16.49,
    status: 'Pending',
    createdAt: '2026-05-28T08:35:00Z',
    paymentMethod: 'Online',
    timeline: [
      { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: '08:35 AM', done: true },
      { status: 'Preparing', label: 'In Kitchen', description: 'Desserts are being crafted by fudge masters.', timestamp: 'Pending', done: false },
      { status: 'Delivered', label: 'Out for Delivery / Ready', description: 'Assigned to courier or ready for pickup.', timestamp: 'Pending', done: false },
      { status: 'Cancelled', label: 'Order Cancelled', description: 'This order has been aborted', timestamp: 'Pending', done: false }
    ]
  },
  {
    id: 'ORD-5010',
    customerName: 'Chloe Devereaux',
    customerEmail: 'chloe.dev@me.com',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    items: [
      { productId: 'PRD-004', name: 'Hot Caramel Belgian Waffle', price: 9.99, quantity: 1 },
      { productId: 'PRD-007', name: 'Velvet Pink Strawberry Shake', price: 8.25, quantity: 1 }
    ],
    totalAmount: 18.24,
    status: 'Delivered',
    createdAt: '2026-05-27T14:20:00Z',
    paymentMethod: 'Card',
    timeline: [
      { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: '02:20 PM', done: true },
      { status: 'Preparing', label: 'In Kitchen', description: 'Desserts are being crafted by fudge masters.', timestamp: '02:25 PM', done: true },
      { status: 'Delivered', label: 'Completed', description: 'Delivered and enjoyed by customer.', timestamp: '02:44 PM', done: true },
      { status: 'Cancelled', label: 'Order Cancelled', description: 'This order has been aborted', timestamp: 'Muted', done: false }
    ]
  },
  {
    id: 'ORD-5009',
    customerName: 'Marcus Brody',
    customerEmail: 'marcus.brody@yahoo.com',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    items: [
      { productId: 'PRD-001', name: 'Belgian Chocolate Fudge Scoop', price: 6.99, quantity: 3 }
    ],
    totalAmount: 20.97,
    status: 'Delivered',
    createdAt: '2026-05-27T19:40:00Z',
    paymentMethod: 'Cash',
    timeline: [
      { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: '07:40 PM', done: true },
      { status: 'Preparing', label: 'In Kitchen', description: 'Desserts are being crafted by fudge masters.', timestamp: '07:45 PM', done: true },
      { status: 'Delivered', label: 'Completed', description: 'Delivered and enjoyed by customer.', timestamp: '08:02 PM', done: true },
      { status: 'Cancelled', label: 'Order Cancelled', description: 'This order has been aborted', timestamp: 'Muted', done: false }
    ]
  },
  {
    id: 'ORD-5008',
    customerName: 'Amara Sterling',
    customerEmail: 'amara.sterling@outlook.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    items: [
      { productId: 'PRD-003', name: 'Decadent Lava Fudge Brownie', price: 7.25, quantity: 2 },
      { productId: 'PRD-008', name: 'Cream Fudge Signature Sundae', price: 11.50, quantity: 1 }
    ],
    totalAmount: 26.00,
    status: 'Cancelled',
    createdAt: '2026-05-26T11:10:00Z',
    paymentMethod: 'Online',
    timeline: [
      { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: '11:10 AM', done: true },
      { status: 'Preparing', label: 'Aborted', description: 'Cancelled due to out of stock vanilla topping.', timestamp: '11:15 AM', done: true },
      { status: 'Delivered', label: 'Completed', description: 'Assigned to courier or ready for pickup.', timestamp: 'Muted', done: false },
      { status: 'Cancelled', label: 'Cancelled Order', description: 'This order was aborted and refunded.', timestamp: '11:16 AM', done: true }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Low Stock warning',
    message: 'Cookie Fudge Special Shake is running extremely low in stock (8 remaining). Prep another batch soon.',
    type: 'stock',
    read: false,
    createdAt: '2026-05-28T08:10:00Z'
  },
  {
    id: 'NOT-002',
    title: 'New High Value Order',
    message: 'Amara Sterling placed active order ORD-5012 for $30.25.',
    type: 'order',
    read: false,
    createdAt: '2026-05-28T08:15:00Z'
  },
  {
    id: 'NOT-003',
    title: 'Out of Stock Alert',
    message: 'Classic Crispy Fries is completely Sold Out. Inventory requires updates.',
    type: 'stock',
    read: true,
    createdAt: '2026-05-28T04:20:00Z'
  },
  {
    id: 'NOT-004',
    title: 'Daily sales Milestone',
    message: 'SaaS Revenue surpassed $4,000 for this week! High efficiency metrics.',
    type: 'revenue',
    read: true,
    createdAt: '2026-05-27T21:00:00Z'
  }
];

export const INITIAL_ANALYTICS: AnalyticsTrendItem[] = [
  { date: 'May 22', revenue: 420.50, cost: 160.20, profit: 260.30, orders: 18 },
  { date: 'May 23', revenue: 580.00, cost: 210.50, profit: 369.50, orders: 25 },
  { date: 'May 24', revenue: 490.75, cost: 180.30, profit: 310.45, orders: 22 },
  { date: 'May 25', revenue: 650.00, cost: 235.00, profit: 415.00, orders: 30 },
  { date: 'May 26', revenue: 780.20, cost: 280.90, profit: 499.30, orders: 37 },
  { date: 'May 27', revenue: 920.00, cost: 320.40, profit: 599.60, orders: 45 },
  { date: 'May 28', revenue: 1040.50, cost: 380.10, profit: 660.40, orders: 52 }
];

export const CATEGORY_DATA: CategoryDistribution[] = [
  { name: 'Ice Cream', value: 42, color: '#D97706' }, // Brand Orange
  { name: 'Milkshakes', value: 25, color: '#F59E0B' }, // Light Orange/Warning
  { name: 'Cakes & Brownies', value: 18, color: '#F97316' }, // Strong Orange
  { name: 'Waffles & Crepes', value: 10, color: '#FDBA74' }, // Soft Cream Orange
  { name: 'Snacks & Sides', value: 5, color: '#FED7AA' }  // Light Cream
];

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Cream Fudge Premium',
  businessEmail: 'headquarters@creamfudge.com',
  businessPhone: '+1 (555) 500-DESSERT',
  businessAddress: '742 Sweet Tooth Boulevard, Dessert Hills, CA 90210',
  currency: '$',
  taxRate: 8.5,
  theme: 'light',
  enableSoundAlerts: true,
  lowStockThreshold: 10
};
