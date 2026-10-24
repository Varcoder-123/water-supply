import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LayoutDashboard, 
  Truck, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Edit3, 
  Save, 
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { OrderStatus, PaymentStatus, TankerCapacityId } from '../types';
import { CLIENT_CONFIG_CHECKLIST } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    orders, 
    updateOrder, 
    deleteOrder,
    capacities, 
    updateCapacityPrice,
    customers, 
    enquiries, 
    updateEnquiryStatus,
    openTrackingForOrder,
    openReceiptForOrder
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'pricing' | 'customers' | 'enquiries' | 'checklist'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // Pricing edit state
  const [editingCapacityId, setEditingCapacityId] = useState<TankerCapacityId | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editIsQuote, setEditIsQuote] = useState<boolean>(false);

  if (activeModal !== 'admin') return null;

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
  const totalGallons = orders.reduce((sum, o) => sum + o.gallons, 0);
  const activeDeliveries = orders.filter(o => o.status === 'dispatched' || o.status === 'confirmed').length;
  const pendingEnquiries = enquiries.filter(e => e.status !== 'resolved').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handleStartEditPricing = (cap: typeof capacities[0]) => {
    setEditingCapacityId(cap.id);
    setEditPrice(cap.basePrice);
    setEditIsQuote(!!cap.isQuoteOnly);
  };

  const handleSavePricing = (capId: TankerCapacityId) => {
    updateCapacityPrice(capId, editPrice, editIsQuote);
    setEditingCapacityId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  AquaFlow Fleet Dispatch & Management Console
                </h2>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded font-mono">
                  ADMIN PORTAL
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Live tanker operations, customer records, dynamic rates, and system requirements
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

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Settled Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">From online payments</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Active Deliveries</div>
            <div className="text-2xl font-extrabold text-sky-600 font-mono mt-1">
              {activeDeliveries} Tankers
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Dispatched & en-route</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Volume Dispatched</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {totalGallons.toLocaleString()} Gal
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pure drinking & bulk</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Open Enquiries</div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">
              {pendingEnquiries} Pending
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Commercial & quotes</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'orders'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Tanker Bookings ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'pricing'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Fleet Rates & Tanker Specs
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'customers'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Directory ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'enquiries'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Enquiries Inbox ({enquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Client Setup Audit ({CLIENT_CONFIG_CHECKLIST.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {['all', 'confirmed', 'dispatched', 'completed'].map(f => (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                          orderFilter === f
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Showing {filteredOrders.length} bookings
                </div>
              </div>

              {/* Orders Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer & Phone</th>
                        <th className="py-3 px-4">Service & Tanker</th>
                        <th className="py-3 px-4">Delivery Site</th>
                        <th className="py-3 px-4">Amount & Payment</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-slate-900">{order.id}</div>
                            <div className="text-[11px] text-slate-500">{order.deliveryDate}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{order.deliverySlot.replace('-', ' ')}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{order.customerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{order.capacityName}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{order.serviceName}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-slate-800 max-w-[180px] truncate">{order.deliveryAddress.street}</div>
                            <div className="text-[11px] text-slate-500 font-mono uppercase">{order.deliveryAddress.zone}</div>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-slate-900">${order.totalAmount}</div>
                            <div>
                              <button
                                onClick={() => {
                                  const nextStatus: PaymentStatus = order.paymentStatus === 'paid' ? 'cod-pending' : 'paid';
                                  updateOrder(order.id, { paymentStatus: nextStatus });
                                }}
                                className={`text-[10px] font-bold uppercase cursor-pointer hover:underline ${
                                  order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                                }`}
                              >
                                {order.paymentStatus}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                              className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="arrived">Arrived/Pumping</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setActiveModal(null);
                                  openTrackingForOrder(order.id);
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded transition-colors cursor-pointer"
                                title="Open Live Telematics Tracker"
                              >
                                Track
                              </button>
                              <button
                                onClick={() => {
                                  setActiveModal(null);
                                  openReceiptForOrder(order.id);
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                title="View Tax Invoice Receipt"
                              >
                                Invoice
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRICING & FLEET MANAGER */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Dynamic Capacity Rates & Fixed vs Quote Management
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Adjust base rates in real-time. Changes immediately update customer quotes and the checkout calculation matrix.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capacities.map(cap => {
                  const isEditing = editingCapacityId === cap.id;

                  return (
                    <div key={cap.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{cap.name}</h4>
                          <span className="text-xs font-mono text-slate-500">
                            {cap.volumeGallons.toLocaleString()} Gallons ({cap.volumeLitres.toLocaleString()} Litres)
                          </span>
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => handleStartEditPricing(cap)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Rate"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSavePricing(cap.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Base Price ($ USD / trip in Zone 1)
                            </label>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded font-mono"
                            />
                          </div>

                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editIsQuote}
                              onChange={(e) => setEditIsQuote(e.target.checked)}
                              className="text-sky-600 rounded"
                            />
                            <span>Require Custom Quote (Quote Only Mode)</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500">Pricing Mode:</span>
                          <span className="font-mono font-extrabold text-lg text-slate-900">
                            {cap.isQuoteOnly ? 'Custom Quote Only' : `$${cap.basePrice}`}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                        <div><span className="font-semibold text-slate-700">Pump:</span> {cap.pumpRate}</div>
                        <div><span className="font-semibold text-slate-700">Hose:</span> {cap.hoseLengthIncluded}</div>
                        <div><span className="font-semibold text-slate-700">Material:</span> {cap.tankMaterial}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Registered Customer Accounts & Commercial Clients
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Track customer contact profiles, commercial company affiliations, and saved site addresses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map(cust => {
                  const customerOrderCount = orders.filter(
                    o => o.userId === cust.id || o.customerEmail.toLowerCase() === cust.email.toLowerCase()
                  ).length;

                  return (
                    <div key={cust.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{cust.name}</h4>
                          {cust.company && (
                            <div className="text-xs font-semibold text-sky-700">{cust.company}</div>
                          )}
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{cust.email} · {cust.phone}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono rounded">
                          {customerOrderCount} Orders
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="text-xs font-semibold text-slate-700">
                          Saved Site Locations ({cust.savedAddresses.length}):
                        </div>
                        {cust.savedAddresses.map((addr, idx) => (
                          <div key={idx} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                            <div className="font-medium text-slate-800">{addr.street}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Zone: {addr.zone.toUpperCase()} · Area: {addr.area}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Customer Enquiries & Custom Quotation Requests
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Review direct inquiries received via the contact portal and WhatsApp routing.
                </p>
              </div>

              <div className="space-y-3">
                {enquiries.map(enq => (
                  <div key={enq.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">#{enq.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-900 text-sm">{enq.subject}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          From: <span className="font-medium text-slate-700">{enq.name}</span> ({enq.email} · {enq.phone})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Status:</span>
                        <select
                          value={enq.status}
                          onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as 'new' | 'in-progress' | 'resolved')}
                          className="text-xs px-2.5 py-1 rounded border border-slate-300 font-semibold"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
                      "{enq.message}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Service Requested: <strong className="text-slate-800">{enq.serviceOfInterest}</strong></span>
                      <a
                        href={`mailto:${enq.email}?subject=RE: ${enq.subject}`}
                        className="text-sky-600 font-semibold hover:underline"
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MANDATORY CLIENT CONFIGURATION AUDIT CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Production Go-Live Audit & Client Detail Requirements
                    </h3>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      In accordance with our strict delivery specifications: All real credentials, business entities, and hardware APIs must be confirmed by the client prior to production launch. Below is the explicit inventory of required integrations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {CLIENT_CONFIG_CHECKLIST.map(item => (
                  <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting Client Credentials</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5">
                      <div className="font-mono text-slate-700">
                        <strong className="text-slate-900">Required Environment / API Fields:</strong> {item.requiredField}
                      </div>
                      <div className="text-slate-500 italic">
                        <strong className="text-slate-700 not-italic">Current Prototype State:</strong> {item.notes}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
