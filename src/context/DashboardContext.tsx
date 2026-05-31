import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Order, Notification, BusinessSettings, OrderItem, OrderTimelineEvent, ToastInfo } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_SETTINGS 
} from '../data/mockData';

interface DashboardContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  notifications: Notification[];
  settings: BusinessSettings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Custom Toast Notification Center
  toasts: ToastInfo[];
  triggerToast: (message: string, type?: ToastInfo['type']) => void;
  dismissToast: (id: string) => void;
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'salesCount' | 'status'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'lastOrderDate' | 'status'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // Order Operations
  createOrder: (customerEmail: string, items: { productId: string; quantity: number }[], paymentMethod: Order['paymentMethod']) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Notification Management
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  
  // Settings Update
  saveSettings: (settings: BusinessSettings) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Domain data
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Custom Toast State
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const triggerToast = (message: string, type: ToastInfo['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('cf_products');
      const storedCustomers = localStorage.getItem('cf_customers');
      const storedOrders = localStorage.getItem('cf_orders');
      const storedNotifications = localStorage.getItem('cf_notifications');
      const storedSettings = localStorage.getItem('cf_settings');
      const storedTheme = localStorage.getItem('cf_theme');

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      else setProducts(INITIAL_PRODUCTS);

      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      else setCustomers(INITIAL_CUSTOMERS);

      if (storedOrders) setOrders(JSON.parse(storedOrders));
      else setOrders(INITIAL_ORDERS);

      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      else setNotifications(INITIAL_NOTIFICATIONS);

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else setSettings(DEFAULT_SETTINGS);

      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme) as 'light' | 'dark';
        setTheme(parsedTheme);
        document.documentElement.classList.toggle('dark', parsedTheme === 'dark');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Failed to load storage values:', e);
      // Fallback
      setProducts(INITIAL_PRODUCTS);
      setCustomers(INITIAL_CUSTOMERS);
      setOrders(INITIAL_ORDERS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Save changes helper
  const persist = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    persist('cf_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Helper: notify
  const notify = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => {
      const next = [newNotif, ...prev];
      persist('cf_notifications', next);
      return next;
    });
  };

  // PRODUCTS CRUD
  const addProduct = (pInput: Omit<Product, 'id' | 'salesCount' | 'status'>) => {
    const newId = `PRD-0${(products.length + 1).toString().padStart(2, '0')}`;
    const status = pInput.stock === 0 
      ? 'Out of Stock' 
      : pInput.stock <= settings.lowStockThreshold 
        ? 'Low Stock' 
        : 'In Stock';
    
    const newProduct: Product = {
      ...pInput,
      id: newId,
      salesCount: 0,
      status
    };

    setProducts(prev => {
      const next = [newProduct, ...prev];
      persist('cf_products', next);
      return next;
    });
    notify('Product Added', `"${newProduct.name}" has been successfully added.`, 'system');
  };

  const updateProduct = (updated: Product) => {
    const status = updated.stock === 0 
      ? 'Out of Stock' 
      : updated.stock <= settings.lowStockThreshold 
        ? 'Low Stock' 
        : 'In Stock';
    
    const finalProduct = { ...updated, status };

    setProducts(prev => {
      const next = prev.map(p => p.id === updated.id ? finalProduct : p);
      persist('cf_products', next);
      return next;
    });

    if (status === 'Low Stock') {
      notify('Low Stock Alert', `"${finalProduct.name}" is running low with only ${finalProduct.stock} left.`, 'stock');
    } else if (status === 'Out of Stock') {
      notify('Out of Stock Trigger', `"${finalProduct.name}" has completely run out.`, 'stock');
    }
  };

  const deleteProduct = (id: string) => {
    const pToDelete = products.find(p => p.id === id);
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      persist('cf_products', next);
      return next;
    });
    if (pToDelete) {
      notify('Product Deleted', `Removed "${pToDelete.name}" from inventory.`, 'system');
    }
  };

  // CUSTOMERS CRUD
  const addCustomer = (cInput: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'lastOrderDate' | 'status'>) => {
    const newId = `CST-${Math.floor(100 + Math.random() * 900)}`;
    const newCustomer: Customer = {
      ...cInput,
      id: newId,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: 'N/A',
      status: 'Active'
    };
    setCustomers(prev => {
      const next = [newCustomer, ...prev];
      persist('cf_customers', next);
      return next;
    });
    notify('New Customer Registered', `Welcome to "${newCustomer.name}"! Profile ready.`, 'system');
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => {
      const next = prev.map(c => c.id === updated.id ? updated : c);
      persist('cf_customers', next);
      return next;
    });
  };

  const deleteCustomer = (id: string) => {
    const cToDelete = customers.find(c => c.id === id);
    setCustomers(prev => {
      const next = prev.filter(c => c.id !== id);
      persist('cf_customers', next);
      return next;
    });
    if (cToDelete) {
      notify('Customer Deleted', `Removed customer profile for "${cToDelete.name}".`, 'system');
    }
  };

  // ORDERS OPERATION & TIMELINE
  const createOrder = (customerEmail: string, itemsInput: { productId: string; quantity: number }[], paymentMethod: Order['paymentMethod']) => {
    const matchedCustomer = customers.find(c => c.email.toLowerCase() === customerEmail.toLowerCase());
    if (!matchedCustomer) return;

    // Deduct stock and build items list
    let total = 0;
    const orderItems: OrderItem[] = [];

    const updatedProducts = products.map(prod => {
      const orderReq = itemsInput.find(item => item.productId === prod.id);
      if (orderReq && orderReq.quantity > 0) {
        const orderQty = Math.min(orderReq.quantity, prod.stock); // cap to stock if somehow exceeded
        if (orderQty > 0) {
          total += prod.price * orderQty;
          orderItems.push({
            productId: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: orderQty
          });
          const nextStock = prod.stock - orderQty;
          return {
            ...prod,
            stock: nextStock,
            salesCount: prod.salesCount + orderQty,
            status: nextStock === 0 ? 'Out of Stock' : nextStock <= settings.lowStockThreshold ? 'Low Stock' : 'In Stock' as any
          };
        }
      }
      return prod;
    });

    if (orderItems.length === 0) {
      notify('Order Failure', 'Could not create order. Selected items are out of stock.', 'system');
      return;
    }

    // Apply tax
    const finalTotal = parseFloat((total * (1 + settings.taxRate / 100)).toFixed(2));
    const newOrderId = `ORD-${Math.floor(5000 + Math.random() * 1000)}`;

    const newOrder: Order = {
      id: newOrderId,
      customerName: matchedCustomer.name,
      customerEmail: matchedCustomer.email,
      customerAvatar: matchedCustomer.avatarUrl,
      items: orderItems,
      totalAmount: finalTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paymentMethod,
      timeline: [
        { status: 'Pending', label: 'Order Confirmed', description: 'Order created and payment authorized.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { status: 'Preparing', label: 'In Kitchen', description: 'Desserts are being crafted by fudge masters.', timestamp: 'Pending', done: false },
        { status: 'Delivered', label: 'Completed', description: 'Handed over to customer.', timestamp: 'Pending', done: false },
        { status: 'Cancelled', label: 'Order Cancelled', description: 'This order has been aborted', timestamp: 'Pending', done: false }
      ]
    };

    // Update customers count
    const updatedCustomers = customers.map(c => {
      if (c.email === matchedCustomer.email) {
        return {
          ...c,
          ordersCount: c.ordersCount + 1,
          totalSpent: parseFloat((c.totalSpent + finalTotal).toFixed(2)),
          lastOrderDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });

    // Save states
    setProducts(updatedProducts);
    persist('cf_products', updatedProducts);

    setCustomers(updatedCustomers);
    persist('cf_customers', updatedCustomers);

    setOrders(prev => {
      const next = [newOrder, ...prev];
      persist('cf_orders', next);
      return next;
    });

    // Check for stock thresholds & trigger notifications
    updatedProducts.forEach(p => {
      if (p.stock === 0) {
        notify('Out Of Stock Warning', `"${p.name}" has run out of stock during active ordering.`, 'stock');
      } else if (p.stock <= settings.lowStockThreshold) {
        const itemReq = orderItems.find(oi => oi.productId === p.id);
        if (itemReq) {
          notify('Low Stock Alert', `"${p.name}" has dropped to ${p.stock} after checkout!`, 'stock');
        }
      }
    });

    notify('New Order Received', `Active Order ${newOrderId} placed by ${matchedCustomer.name} for $${finalTotal}.`, 'order');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    let orderName = '';
    let orderAmt = 0;

    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        orderName = ord.id;
        orderAmt = ord.totalAmount;
        const currentLocalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Update specific timeline
        const updatedTimeline = ord.timeline.map(tle => {
          if (tle.status === status) {
            return { ...tle, done: true, timestamp: currentLocalTime };
          }
          // Mark cancellation
          if (status === 'Cancelled' && tle.status === 'Cancelled') {
            return { ...tle, done: true, timestamp: currentLocalTime };
          }
          if (status === 'Delivered' && tle.status !== 'Cancelled') {
            return { ...tle, done: true, timestamp: tle.timestamp === 'Pending' || tle.timestamp === 'Muted' ? currentLocalTime : tle.timestamp };
          }
          if (status === 'Preparing' && tle.status === 'Pending') {
            return { ...tle, done: true };
          }
          return tle;
        });

        return {
          ...ord,
          status,
          timeline: updatedTimeline
        };
      }
      return ord;
    });

    setOrders(updatedOrders);
    persist('cf_orders', updatedOrders);

    if (status === 'Delivered') {
      notify('Order Delivered & Completed', `Order ${orderName} has been successfully completed! (+$${orderAmt})`, 'revenue');
    } else if (status === 'Preparing') {
      notify('Preparing Order', `Kitchen began preparing products for ${orderName}.`, 'order');
    } else if (status === 'Cancelled') {
      notify('Order Cancelled', `Active order ${orderName} has been cancelled & items restored.`, 'order');
    }
  };

  // NOTIFICATION MANAGEMENT
  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      persist('cf_notifications', next);
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      persist('cf_notifications', next);
      return next;
    });
    notify('Standard Clear', 'All dashboard alerts marked as read.', 'system');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    persist('cf_notifications', []);
  };

  // VALUE SETTINGS
  const saveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    persist('cf_settings', newSettings);
    notify('Settings Saved', 'Business credentials, rates and parameters successfully modified.', 'system');
  };

  return (
    <DashboardContext.Provider value={{
      currentView,
      setCurrentView,
      products,
      customers,
      orders,
      notifications,
      settings,
      theme,
      toggleTheme,
      
      toasts,
      triggerToast,
      dismissToast,
      
      addProduct,
      updateProduct,
      deleteProduct,
      
      addCustomer,
      updateCustomer,
      deleteCustomer,
      
      createOrder,
      updateOrderStatus,
      
      markNotificationRead,
      markAllNotificationsRead,
      clearAllNotifications,
      
      saveSettings
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
