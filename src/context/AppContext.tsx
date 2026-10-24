import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BookingOrder, 
  TankerCapacityOption, 
  ContactEnquiry, 
  CustomerUser, 
  WaterServiceType, 
  TankerCapacityId,
  OrderStatus,
  PaymentStatus
} from '../types';
import { 
  INITIAL_CAPACITIES, 
  INITIAL_ORDERS, 
  INITIAL_ENQUIRIES, 
  INITIAL_CUSTOMERS 
} from '../data/mockData';

interface AppContextType {
  orders: BookingOrder[];
  addOrder: (order: Omit<BookingOrder, 'id' | 'createdAt' | 'updatedAt'>) => BookingOrder;
  updateOrder: (id: string, updates: Partial<BookingOrder>) => void;
  deleteOrder: (id: string) => void;
  
  capacities: TankerCapacityOption[];
  updateCapacityPrice: (id: TankerCapacityId, price: number, isQuoteOnly: boolean) => void;
  
  enquiries: ContactEnquiry[];
  addEnquiry: (enquiry: { name: string; email: string; phone: string; subject: string; serviceOfInterest: string; message: string }) => void;
  updateEnquiryStatus: (id: string, status: 'new' | 'in-progress' | 'resolved') => void;
  
  currentUser: CustomerUser | null;
  setCurrentUser: (user: CustomerUser | null) => void;
  customers: CustomerUser[];
  loginCustomer: (email: string) => boolean;
  registerCustomer: (name: string, email: string, phone: string, address?: string) => CustomerUser;
  
  activeModal: 'book' | 'track' | 'auth' | 'admin' | 'receipt' | null;
  setActiveModal: (modal: 'book' | 'track' | 'auth' | 'admin' | 'receipt' | null) => void;
  
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  openTrackingForOrder: (id: string) => void;
  
  receiptOrderId: string | null;
  setReceiptOrderId: (id: string | null) => void;
  openReceiptForOrder: (id: string) => void;
  
  selectedServiceForBooking: WaterServiceType;
  setSelectedServiceForBooking: (service: WaterServiceType) => void;
  selectedCapacityForBooking: TankerCapacityId;
  setSelectedCapacityForBooking: (capacity: TankerCapacityId) => void;
  
  startBooking: (service?: WaterServiceType, capacity?: TankerCapacityId) => void;
  
  toast: string | null;
  showToast: (msg: string) => void;
  
  currency: string;
  setCurrency: (c: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization
  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    const saved = localStorage.getItem('aquaflow_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [capacities, setCapacities] = useState<TankerCapacityOption[]>(() => {
    const saved = localStorage.getItem('aquaflow_capacities');
    return saved ? JSON.parse(saved) : INITIAL_CAPACITIES;
  });

  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(() => {
    const saved = localStorage.getItem('aquaflow_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('aquaflow_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('aquaflow_current_user');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS[0]; // Logged in as Tariq by default for immediate testing
  });

  const [activeModal, setActiveModal] = useState<'book' | 'track' | 'auth' | 'admin' | 'receipt' | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('AQ-8492');
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<WaterServiceType>('drinking-water');
  const [selectedCapacityForBooking, setSelectedCapacityForBooking] = useState<TankerCapacityId>('2500');
  const [toast, setToast] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('USD');

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('aquaflow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aquaflow_capacities', JSON.stringify(capacities));
  }, [capacities]);

  useEffect(() => {
    localStorage.setItem('aquaflow_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('aquaflow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aquaflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aquaflow_current_user');
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addOrder = (orderData: Omit<BookingOrder, 'id' | 'createdAt' | 'updatedAt'>): BookingOrder => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `AQ-${randomSuffix}`;
    const now = new Date().toISOString();
    
    const newOrder: BookingOrder = {
      ...orderData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    setOrders(prev => [newOrder, ...prev]);
    showToast(`Order ${newId} placed successfully!`);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<BookingOrder>) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));
    showToast(`Order ${id} updated.`);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast(`Order ${id} removed.`);
  };

  const updateCapacityPrice = (id: TankerCapacityId, price: number, isQuoteOnly: boolean) => {
    setCapacities(prev => prev.map(cap => {
      if (cap.id === id) {
        return { ...cap, basePrice: price, isQuoteOnly };
      }
      return cap;
    }));
    showToast('Fleet capacity & pricing updated successfully.');
  };

  const addEnquiry = (enquiryData: { name: string; email: string; phone: string; subject: string; serviceOfInterest: string; message: string }) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newEnquiry: ContactEnquiry = {
      ...enquiryData,
      id: `ENQ-${randomSuffix}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    showToast('Enquiry received! Our fleet manager will contact you promptly.');
  };

  const updateEnquiryStatus = (id: string, status: 'new' | 'in-progress' | 'resolved') => {
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === id) {
        return { ...enq, status };
      }
      return enq;
    }));
    showToast(`Enquiry ${id} marked as ${status}.`);
  };

  const loginCustomer = (email: string): boolean => {
    const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`);
      return true;
    }
    return false;
  };

  const registerCustomer = (name: string, email: string, phone: string, initialAddress?: string): CustomerUser => {
    const newCust: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      savedAddresses: initialAddress ? [
        {
          street: initialAddress,
          area: 'General Delivery Area',
          city: 'Dubai',
          zone: 'zone-1',
          landmark: '',
        }
      ] : [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers(prev => [...prev, newCust]);
    setCurrentUser(newCust);
    showToast(`Account created for ${name}!`);
    return newCust;
  };

  const openTrackingForOrder = (id: string) => {
    setTrackingOrderId(id);
    setActiveModal('track');
  };

  const openReceiptForOrder = (id: string) => {
    setReceiptOrderId(id);
    setActiveModal('receipt');
  };

  const startBooking = (service?: WaterServiceType, capacity?: TankerCapacityId) => {
    if (service) setSelectedServiceForBooking(service);
    if (capacity) setSelectedCapacityForBooking(capacity);
    setActiveModal('book');
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        capacities,
        updateCapacityPrice,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        currentUser,
        setCurrentUser,
        customers,
        loginCustomer,
        registerCustomer,
        activeModal,
        setActiveModal,
        trackingOrderId,
        setTrackingOrderId,
        openTrackingForOrder,
        receiptOrderId,
        setReceiptOrderId,
        openReceiptForOrder,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        selectedCapacityForBooking,
        setSelectedCapacityForBooking,
        startBooking,
        toast,
        showToast,
        currency,
        setCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
