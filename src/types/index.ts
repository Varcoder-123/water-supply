export type WaterServiceType = 
  | 'drinking-water'
  | 'swimming-pool'
  | 'construction'
  | 'commercial-emergency';

export type TankerCapacityId = '1000' | '2500' | '5000' | '10000';

export interface TankerCapacityOption {
  id: TankerCapacityId;
  name: string;
  volumeGallons: number;
  volumeLitres: number;
  basePrice: number; // in USD (or local equivalent)
  isQuoteOnly?: boolean;
  idealFor: string;
  pumpRate: string;
  hoseLengthIncluded: string;
  axleType: string;
  tankMaterial: string;
}

export type DeliverySlot = 
  | 'asap-emergency' // Rush 2-3 hours
  | 'morning' // 08:00 - 12:00
  | 'afternoon' // 12:00 - 16:00
  | 'evening' // 16:00 - 20:00
  | 'night'; // 20:00 - 24:00

export type PaymentMethod = 'card' | 'cod';

export type PaymentStatus = 'paid' | 'pending' | 'cod-pending' | 'refunded';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'arrived'
  | 'completed'
  | 'cancelled';

export interface DeliveryAddress {
  street: string;
  area: string;
  city: string;
  zone: 'zone-1' | 'zone-2' | 'zone-3';
  landmark?: string;
  tankLocationNotes?: string;
}

export interface BookingOrder {
  id: string; // e.g. "AQ-9421"
  serviceType: WaterServiceType;
  serviceName: string;
  capacityId: TankerCapacityId;
  capacityName: string;
  gallons: number;
  quantity: number;
  pricingType: 'fixed' | 'quote';
  baseAmount: number;
  zoneFee: number;
  hoseExtensionFee: number;
  totalAmount: number;
  isQuoteApproved?: boolean;
  
  // Delivery info
  deliveryAddress: DeliveryAddress;
  deliveryDate: string;
  deliverySlot: DeliverySlot;
  hoseExtensionMeters: number;
  
  // Customer
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  userId?: string;

  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paidAt?: string;
  
  // Fulfillment & Status
  status: OrderStatus;
  driverName?: string;
  driverPhone?: string;
  tankerPlate?: string;
  currentCoordinates?: { lat: number; lng: number };
  estimatedArrivalMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  savedAddresses: DeliveryAddress[];
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  serviceOfInterest: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface ServiceZoneInfo {
  id: 'zone-1' | 'zone-2' | 'zone-3';
  name: string;
  description: string;
  deliverySurcharge: number;
  standardEtaHours: string;
  rushAvailable: boolean;
}

export interface ClientConfigChecklistItem {
  id: string;
  category: 'Legal & Company' | 'Payment Gateway' | 'Communications' | 'Fleet & IoT' | 'Quality Lab';
  title: string;
  description: string;
  status: 'pending_client' | 'configured' | 'action_required';
  requiredField: string;
  notes: string;
}
