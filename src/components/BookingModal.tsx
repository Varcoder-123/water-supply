import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  WaterServiceType, 
  TankerCapacityId, 
  DeliverySlot, 
  PaymentMethod,
  BookingOrder
} from '../types';
import { 
  X, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { PaymentGatewayModal } from './PaymentGatewayModal';

export const BookingModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    capacities, 
    addOrder, 
    currentUser, 
    registerCustomer,
    selectedServiceForBooking,
    selectedCapacityForBooking,
    openTrackingForOrder,
    openReceiptForOrder
  } = useApp();

  // Booking form state
  const [serviceType, setServiceType] = useState<WaterServiceType>(selectedServiceForBooking || 'drinking-water');
  const [capacityId, setCapacityId] = useState<TankerCapacityId>(selectedCapacityForBooking || '2500');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Delivery details
  const [street, setStreet] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [city, setCity] = useState<string>('Dubai');
  const [zone, setZone] = useState<'zone-1' | 'zone-2' | 'zone-3'>('zone-1');
  const [landmark, setLandmark] = useState<string>('');
  const [tankNotes, setTankNotes] = useState<string>('');
  const [hoseLength, setHoseLength] = useState<number>(25); // 25, 40, or 60m
  
  // Schedule
  const [deliveryDate, setDeliveryDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>('asap-emergency');
  
  // Customer details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [saveAddressToAccount, setSaveAddressToAccount] = useState<boolean>(true);

  // Gateway modal state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [pendingOrderForPayment, setPendingOrderForPayment] = useState<BookingOrder | null>(null);

  // Sync initial state when modal opens
  useEffect(() => {
    if (activeModal === 'book') {
      if (selectedServiceForBooking) setServiceType(selectedServiceForBooking);
      if (selectedCapacityForBooking) setCapacityId(selectedCapacityForBooking);
      
      if (currentUser) {
        setCustomerName(currentUser.name);
        setCustomerPhone(currentUser.phone);
        setCustomerEmail(currentUser.email);
        
        if (currentUser.savedAddresses.length > 0) {
          const addr = currentUser.savedAddresses[0];
          setStreet(addr.street);
          setArea(addr.area);
          setCity(addr.city);
          setZone(addr.zone);
          setLandmark(addr.landmark || '');
          setTankNotes(addr.tankLocationNotes || '');
        }
      }
    }
  }, [activeModal, selectedServiceForBooking, selectedCapacityForBooking, currentUser]);

  if (activeModal !== 'book') return null;

  const currentCapacity = capacities.find(c => c.id === capacityId) || capacities[1];
  const isQuote = currentCapacity.isQuoteOnly;

  // Pricing calculation
  const baseRate = currentCapacity.basePrice * quantity;
  const zoneFee = zone === 'zone-1' ? 0 : zone === 'zone-2' ? 15 : 35;
  const hoseFee = hoseLength === 25 ? 0 : hoseLength === 40 ? 15 : 30;
  const totalAmount = baseRate + zoneFee + hoseFee;

  const getServiceName = (st: WaterServiceType) => {
    switch (st) {
      case 'drinking-water': return 'Potable Drinking Water (Sweet Water SS316)';
      case 'swimming-pool': return 'Swimming Pool Bulk Fresh Water';
      case 'construction': return 'Construction & Civil Curing Water';
      case 'commercial-emergency': return 'Commercial & Emergency Backup Water';
    }
  };

  const handleApplySavedAddress = (addrIndex: number) => {
    if (!currentUser || !currentUser.savedAddresses[addrIndex]) return;
    const a = currentUser.savedAddresses[addrIndex];
    setStreet(a.street);
    setArea(a.area);
    setCity(a.city);
    setZone(a.zone);
    setLandmark(a.landmark || '');
    setTankNotes(a.tankLocationNotes || '');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure customer account exists
    let effectiveUserId = currentUser?.id;
    if (!currentUser && customerEmail) {
      const created = registerCustomer(customerName, customerEmail, customerPhone, street);
      effectiveUserId = created.id;
    }

    const orderPayload: Omit<BookingOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceType,
      serviceName: getServiceName(serviceType),
      capacityId,
      capacityName: currentCapacity.name,
      gallons: currentCapacity.volumeGallons * quantity,
      quantity,
      pricingType: isQuote ? 'quote' : 'fixed',
      baseAmount: baseRate,
      zoneFee,
      hoseExtensionFee: hoseFee,
      totalAmount,
      isQuoteApproved: !isQuote,
      deliveryAddress: {
        street,
        area: area || 'Downtown',
        city: city || 'Dubai',
        zone,
        landmark,
        tankLocationNotes: tankNotes,
      },
      deliveryDate,
      deliverySlot,
      hoseExtensionMeters: hoseLength,
      customerName,
      customerPhone,
      customerEmail,
      userId: effectiveUserId,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'pending' : 'cod-pending',
      status: 'confirmed',
      driverName: 'Rashid Khan (Fleet Captain)',
      driverPhone: '+971 50 847 9922',
      tankerPlate: 'DXB-WTR-5042',
      estimatedArrivalMinutes: deliverySlot === 'asap-emergency' ? 35 : 120,
    };

    if (paymentMethod === 'card' && !isQuote) {
      // Temporarily create order and open card payment gateway
      const created = addOrder(orderPayload);
      setPendingOrderForPayment(created);
      setIsGatewayOpen(true);
    } else {
      // COD or Quote order
      const created = addOrder({
        ...orderPayload,
        paymentStatus: 'cod-pending',
      });
      setActiveModal(null);
      openTrackingForOrder(created.id);
    }
  };

  const handleCardPaymentFinished = (txnId: string) => {
    setIsGatewayOpen(false);
    if (pendingOrderForPayment) {
      setActiveModal(null);
      openTrackingForOrder(pendingOrderForPayment.id);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          
          {/* Modal Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Water Tanker Reservation & Dispatch
                </h2>
                <div className="text-xs text-slate-400">
                  Select service, tanker capacity, delivery slot, and payment
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Step 1: Water Service & Tanker Capacity */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-sky-700 tracking-wider uppercase flex items-center gap-2">
                <span>01. Water Service & Tanker Capacity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 mb-1 block">Water Service Type</span>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as WaterServiceType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="drinking-water">Drinking / Sweet Water (SS316 Certified Potable)</option>
                    <option value="swimming-pool">Swimming Pool Bulk Fresh Water</option>
                    <option value="construction">Construction & Civil Curing Water</option>
                    <option value="commercial-emergency">Commercial & 24/7 Emergency Supply</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 mb-1 block">Tanker Volume / Capacity</span>
                  <select
                    value={capacityId}
                    onChange={(e) => setCapacityId(e.target.value as TankerCapacityId)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    {capacities.map(cap => (
                      <option key={cap.id} value={cap.id}>
                        {cap.name} ({cap.volumeGallons.toLocaleString()} Gallons) {cap.isQuoteOnly ? '- Custom Quote' : `- $${cap.basePrice}`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Quantity & Hose reach selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-700 mb-1 block">Number of Tankers</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value={1}>1 Tanker ({currentCapacity.volumeGallons.toLocaleString()} Gallons)</option>
                    <option value={2}>2 Tankers ({(currentCapacity.volumeGallons * 2).toLocaleString()} Gallons)</option>
                    <option value={3}>3 Tankers ({(currentCapacity.volumeGallons * 3).toLocaleString()} Gallons)</option>
                    <option value={5}>5 Tankers - Bulk ({(currentCapacity.volumeGallons * 5).toLocaleString()} Gallons)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700 mb-1 block">Hose Distance to Reservoir / Tank</span>
                  <select
                    value={hoseLength}
                    onChange={(e) => setHoseLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value={25}>Standard 25 Meters (Included - Most Driveways & Ground Tanks)</option>
                    <option value={40}>Extended 40 Meters (+$15 - Rear Gardens / Deep Plots)</option>
                    <option value={60}>High-Reach 60 Meters + Booster Pump (+$30 - Roof or Remote Tanks)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Scheduling & Slots */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-xs font-bold text-sky-700 tracking-wider uppercase flex items-center gap-2">
                <span>02. Delivery Date & Time Slot</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      required
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requested Time Window
                  </label>
                  <div className="relative">
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value as DeliverySlot)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    >
                      <option value="asap-emergency">⚡ Emergency Rush (Within 2 Hours Dispatch)</option>
                      <option value="morning">Morning Slot (08:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon Slot (12:00 PM - 04:00 PM)</option>
                      <option value="evening">Evening Slot (04:00 PM - 08:00 PM)</option>
                      <option value="night">Night / Off-Peak (08:00 PM - 12:00 AM)</option>
                    </select>
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Location & Tank Access Notes */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-sky-700 tracking-wider uppercase flex items-center gap-2">
                  <span>03. Delivery Address & Tank Placement</span>
                </div>
                {currentUser && currentUser.savedAddresses.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Saved:</span>
                    {currentUser.savedAddresses.map((_, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleApplySavedAddress(idx)}
                        className="text-xs font-semibold text-sky-600 hover:underline"
                      >
                        Address #{idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address / Villa / Site Number
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g., Villa 14, Street 18B, Al Safa 2"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coverage Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value as 'zone-1' | 'zone-2' | 'zone-3')}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="zone-1">Zone 1: Metro Core ($0 surcharge)</option>
                    <option value="zone-2">Zone 2: Suburbs (+$15)</option>
                    <option value="zone-3">Zone 3: Outer / Industrial (+$35)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Area / Community & Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Al Safa Park Gate 3"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tank Location / Connection Instructions
                  </label>
                  <input
                    type="text"
                    value={tankNotes}
                    onChange={(e) => setTankNotes(e.target.value)}
                    placeholder="e.g., Underground tank in garden, 2-inch quick coupler"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Customer Contact Info */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-xs font-bold text-sky-700 tracking-wider uppercase flex items-center gap-2">
                <span>04. Customer Account & Contact for Driver</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (For Driver Call)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email (For Official Tax Receipt)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="orders@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Payment Preference & Total Summary */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Select Payment Method
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                    <span>Pay Online (Card / Gateway)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pay on Tanker Delivery</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Base Tanker Rate:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {isQuote ? 'Subject to Quote' : `$${baseRate}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Zone Logistics:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {zoneFee === 0 ? 'Included ($0)' : `+$${zoneFee}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hose Extension:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {hoseFee === 0 ? 'Included ($0)' : `+$${hoseFee}`}
                  </span>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-slate-500 block">Total Payable:</span>
                  <span className="font-mono font-extrabold text-sky-700 text-lg">
                    {isQuote ? 'Quote Confirmation' : `$${totalAmount}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isQuote
                    ? 'Submit Tanker Booking for Immediate Quote'
                    : paymentMethod === 'card'
                    ? `Proceed to Secure Online Payment ($${totalAmount})`
                    : `Confirm Tanker Dispatch (Pay $${totalAmount} on Delivery)`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Payment Gateway Modal when Card is selected */}
      {pendingOrderForPayment && (
        <PaymentGatewayModal
          isOpen={isGatewayOpen}
          onClose={() => setIsGatewayOpen(false)}
          orderSummary={{
            orderId: pendingOrderForPayment.id,
            serviceName: pendingOrderForPayment.serviceName,
            capacityName: pendingOrderForPayment.capacityName,
            totalAmount: pendingOrderForPayment.totalAmount,
            customerName: pendingOrderForPayment.customerName,
            customerEmail: pendingOrderForPayment.customerEmail,
          }}
          onPaymentSuccess={handleCardPaymentFinished}
        />
      )}
    </>
  );
};
