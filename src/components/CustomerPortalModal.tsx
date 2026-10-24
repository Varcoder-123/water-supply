import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  MapPin, 
  Truck, 
  FileText, 
  Plus, 
  LogOut, 
  Check, 
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DeliveryAddress } from '../types';

export const CustomerPortalModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    currentUser, 
    setCurrentUser, 
    customers, 
    loginCustomer, 
    registerCustomer,
    orders,
    openTrackingForOrder,
    openReceiptForOrder,
    startBooking
  } = useApp();

  const [tab, setTab] = useState<'profile' | 'orders' | 'addresses'>('orders');
  
  // Auth state when not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // New address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newZone, setNewZone] = useState<'zone-1' | 'zone-2' | 'zone-3'>('zone-1');
  const [newNotes, setNewNotes] = useState('');

  if (activeModal !== 'auth') return null;

  // Filter orders for current user or show recent if guest
  const userOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.id || o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : orders.slice(0, 2);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginCustomer(emailInput);
    if (!success) {
      setLoginError('No account found with this email. You can register below in 10 seconds.');
    } else {
      setLoginError(null);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput || !phoneInput) return;
    registerCustomer(nameInput, emailInput, phoneInput, addressInput);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newStreet) return;
    
    const newAddr: DeliveryAddress = {
      street: newStreet,
      area: newArea || 'District',
      city: 'Dubai',
      zone: newZone,
      landmark: '',
      tankLocationNotes: newNotes,
    };

    const updated = {
      ...currentUser,
      savedAddresses: [...currentUser.savedAddresses, newAddr]
    };

    setCurrentUser(updated);
    setIsAddingAddress(false);
    setNewStreet('');
    setNewArea('');
    setNewNotes('');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {currentUser ? `Customer Account: ${currentUser.name}` : 'Customer Portal Access'}
              </h2>
              <div className="text-xs text-slate-400">
                Manage water bookings, track deliveries, and view invoices
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

        {/* Not Logged In State */}
        {!currentUser ? (
          <div className="p-6 max-w-md mx-auto">
            
            {/* Quick Demo Account Switcher */}
            <div className="mb-6 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900">
              <span className="font-bold block mb-1">Quick Demo Customer Accounts:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {customers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => loginCustomer(c.email)}
                    className="px-2.5 py-1.5 bg-white border border-sky-300 rounded text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    Login as {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Sign In to Your Account</h3>
                <p className="text-xs text-slate-600">Access your past deliveries, saved sites, and receipts.</p>
                
                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="tariq.mansoor@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                <div className="text-center pt-2 text-xs text-slate-600">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Register new customer profile
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Create Customer Account</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Delivery Address</label>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Villa or site address"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer mt-2"
                >
                  Create Account & Sign In
                </button>

                <div className="text-center pt-2 text-xs text-slate-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* Logged In Dashboard */
          <div>
            {/* Tabs */}
            <div className="border-b border-slate-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm font-semibold">
                <button
                  onClick={() => setTab('orders')}
                  className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                    tab === 'orders'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Tanker Deliveries ({userOrders.length})
                </button>
                <button
                  onClick={() => setTab('addresses')}
                  className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                    tab === 'addresses'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Saved Sites & Tanks ({currentUser.savedAddresses.length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    startBooking();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  Book Tanker
                </button>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-xs text-slate-500 hover:text-rose-600 transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {tab === 'orders' && (
                <div className="space-y-4">
                  {userOrders.length > 0 ? (
                    userOrders.map(order => (
                      <div 
                        key={order.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                            <span className="font-bold text-slate-800">#{order.id}</span>
                            <span aria-hidden="true">·</span>
                            <span>{order.deliveryDate}</span>
                            <span aria-hidden="true">·</span>
                            <span className="uppercase">{order.deliverySlot.replace('-', ' ')}</span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900">
                            {order.capacityName} ({order.gallons.toLocaleString()} Gal)
                          </h4>

                          <p className="text-xs text-slate-600 mt-0.5">
                            {order.deliveryAddress.street}, {order.deliveryAddress.area}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="font-semibold text-slate-700">
                              Status: <span className="uppercase text-sky-700 font-bold">{order.status}</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-slate-700">
                              Total: ${order.totalAmount} ({order.paymentStatus === 'paid' ? 'Paid' : 'COD'})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setActiveModal(null);
                              openTrackingForOrder(order.id);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveModal(null);
                              openReceiptForOrder(order.id);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveModal(null);
                              startBooking(order.serviceType, order.capacityId);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            Re-Order
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No water deliveries booked under this account yet.
                    </div>
                  )}
                </div>
              )}

              {tab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Saved delivery locations & tank specifications for fast 1-click tanker dispatch:
                    </span>
                    <button
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Site Address</span>
                    </button>
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">New Delivery Location</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="Street / Villa address"
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          required
                        />
                        <input
                          type="text"
                          value={newArea}
                          onChange={(e) => setNewArea(e.target.value)}
                          placeholder="Area / Neighborhood"
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          value={newZone}
                          onChange={(e) => setNewZone(e.target.value as 'zone-1' | 'zone-2' | 'zone-3')}
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="zone-1">Zone 1: Metro Core</option>
                          <option value="zone-2">Zone 2: Suburbs</option>
                          <option value="zone-3">Zone 3: Outer Industrial</option>
                        </select>
                        <input
                          type="text"
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          placeholder="Tank access notes (e.g., rear garden)"
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentUser.savedAddresses.map((addr, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Location #{idx + 1}</span>
                          <span className="font-mono text-[10px] text-sky-700 uppercase bg-sky-50 px-1.5 py-0.5 rounded">
                            {addr.zone}
                          </span>
                        </div>
                        <div className="text-slate-800 font-medium">{addr.street}</div>
                        <div className="text-slate-500">{addr.area}, {addr.city}</div>
                        {addr.tankLocationNotes && (
                          <div className="text-slate-500 pt-1 border-t border-slate-100 text-[11px]">
                            <span className="font-semibold text-slate-700">Notes:</span> {addr.tankLocationNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
