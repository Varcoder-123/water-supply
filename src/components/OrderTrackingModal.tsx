import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Truck, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Search,
  ShieldCheck,
  Droplet
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    orders, 
    trackingOrderId, 
    setTrackingOrderId,
    openReceiptForOrder
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackingOrderId || '');

  if (activeModal !== 'track') return null;

  // Selected or looked-up order
  const activeOrder = orders.find(
    o => o.id.toLowerCase() === (trackingOrderId || searchQuery).toLowerCase().trim()
  ) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toLowerCase() === searchQuery.toLowerCase().trim());
    if (found) {
      setTrackingOrderId(found.id);
    }
  };

  const statusSteps: { key: OrderStatus; label: string; time?: string }[] = [
    { key: 'pending', label: 'Order Confirmed' },
    { key: 'confirmed', label: 'Tanker Assigned' },
    { key: 'dispatched', label: 'En Route to Site' },
    { key: 'arrived', label: 'Pumping & Delivery' },
    { key: 'completed', label: 'Delivered & Certified' },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'dispatched': return 2;
      case 'arrived': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Live Water Tanker Telematics & Dispatch
              </h2>
              <div className="text-xs text-slate-400">
                Real-time route tracking, arrival countdown, and driver contact
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

        {/* Search bar & Order selector */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. AQ-8492)"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Quick select other orders */}
          <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto justify-end">
            <span>Recent orders:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setTrackingOrderId(o.id);
                  setSearchQuery(o.id);
                }}
                className={`px-2 py-1 rounded font-mono text-xs font-semibold cursor-pointer transition-colors ${
                  activeOrder?.id === o.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {o.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {activeOrder ? (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Top Order Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-sky-50 border border-sky-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-800">
                  <span className="font-bold">ORDER #{activeOrder.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeOrder.deliveryDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase font-semibold">{activeOrder.deliverySlot.replace('-', ' ')}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeOrder.capacityName} ({activeOrder.gallons.toLocaleString()} Gallons)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeOrder.serviceName}
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Payment Status</div>
                  <div className="text-xs font-bold font-mono">
                    {activeOrder.paymentStatus === 'paid' ? (
                      <span className="text-emerald-700">● PAID ONLINE (${activeOrder.totalAmount})</span>
                    ) : (
                      <span className="text-amber-700">● CASH ON ARRIVAL (${activeOrder.totalAmount})</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openReceiptForOrder(activeOrder.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>View Tax Invoice</span>
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Fulfillment Timeline
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {statusSteps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  
                  return (
                    <div 
                      key={step.key}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider">
                          Step 0{idx + 1}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isCurrent && <Truck className="w-3.5 h-3.5 text-white animate-bounce" />}
                      </div>
                      <div className="text-xs font-bold leading-tight">
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Route Map & Telematics */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900">
              
              {/* Map Canvas / Visualizer */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                {/* SVG Route Visualization */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Road Network Lines */}
                  <path d="M 50 180 Q 200 120 400 160 T 750 140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 120 40 Q 250 140 380 220" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                  
                  {/* Active Tanker Dispatched Route Line */}
                  <path 
                    d="M 100 180 C 220 160, 320 130, 480 145 C 550 150, 620 190, 700 160" 
                    fill="none" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="4" 
                    strokeDasharray="6 4"
                  />
                  
                  {/* Water Depot Origin Point */}
                  <circle cx="100" cy="180" r="7" fill="#0284c7" />
                  <text x="70" y="210" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Central Water Depot</text>

                  {/* Customer Destination Pin */}
                  <circle cx="700" cy="160" r="8" fill="#10b981" />
                  <text x="640" y="195" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Your Delivery Address</text>

                  {/* Animated Tanker Position */}
                  <g transform="translate(480, 145)">
                    <circle cx="0" cy="0" r="18" fill="rgba(2, 132, 199, 0.25)" className="animate-ping" />
                    <circle cx="0" cy="0" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  </g>
                </svg>

                {/* Live ETA Overlay Card */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-3.5 text-white max-w-xs shadow-lg">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live GPS Telematics Active</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-white">
                    {activeOrder.status === 'completed'
                      ? 'Delivered'
                      : `${activeOrder.estimatedArrivalMinutes || 18} mins to arrival`}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Tanker speed: 48 km/h · Approaching Al Safa Junction
                  </div>
                </div>

                {/* Tanker Plate badge */}
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono">
                  Plate: <span className="text-white font-bold">{activeOrder.tankerPlate || 'DXB-WTR-5042'}</span>
                </div>
              </div>

              {/* Driver & Delivery Information Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-950 border border-sky-500/40 flex items-center justify-center font-bold text-sky-300">
                    RK
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Assigned Fleet Captain</div>
                    <div className="text-sm font-bold text-white">
                      {activeOrder.driverName || 'Rashid Khan (Fleet Captain)'}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {activeOrder.driverPhone || '+971 50 847 9922'}
                    </div>
                  </div>
                </div>

                {/* Driver Action buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${activeOrder.driverPhone || '+971508479922'}`}
                    className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>

                  <a
                    href={`https://wa.me/971508479922?text=Hello%20Driver,%20checking%20on%20tanker%20order%20${activeOrder.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

            {/* Address & Laboratory Testing Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Delivery Destination</span>
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {activeOrder.deliveryAddress.street}
                </div>
                <div className="text-xs text-slate-600">
                  {activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city}
                </div>
                {activeOrder.deliveryAddress.landmark && (
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Landmark:</span> {activeOrder.deliveryAddress.landmark}
                  </div>
                )}
                {activeOrder.deliveryAddress.tankLocationNotes && (
                  <div className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                    <span className="font-semibold text-slate-700">Access:</span> {activeOrder.deliveryAddress.tankLocationNotes}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Water Quality Batch Verification</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><span className="font-semibold text-slate-900">Lab Certification:</span> DM-WAT-9041 (Food & Safety Dept)</div>
                  <div><span className="font-semibold text-slate-900">TDS Purity Level:</span> 145 ppm (Optimal Sweet Water)</div>
                  <div><span className="font-semibold text-slate-900">pH Factor:</span> 7.4 Neutral</div>
                  <div><span className="font-semibold text-slate-900">Microbial Analysis:</span> 0.00 Coliform / E.coli Detected</div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800">No matching order found</h4>
            <p className="text-xs mt-1">Please check your Order Reference ID or choose from recent orders above.</p>
          </div>
        )}

      </div>
    </div>
  );
};
