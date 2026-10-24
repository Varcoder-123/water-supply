import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Droplet, 
  Clock, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { WaterServiceType, TankerCapacityId } from '../types';

export const Hero: React.FC = () => {
  const { startBooking, setActiveModal, openTrackingForOrder, orders } = useApp();
  
  const [quickService, setQuickService] = useState<WaterServiceType>('drinking-water');
  const [quickCapacity, setQuickCapacity] = useState<TankerCapacityId>('2500');

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    startBooking(quickService, quickCapacity);
  };

  const activeOrder = orders.find(o => o.status === 'dispatched' || o.status === 'confirmed');

  return (
    <section id="home" className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top 2-Column Split: Headline + Cinematic Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Column 1: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust kicker without pills */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 tracking-wide uppercase">
              <span>Municipal Lab Approved</span>
              <span aria-hidden="true">·</span>
              <span>SS316 Food Grade</span>
              <span aria-hidden="true">·</span>
              <span>24/7 Rush Dispatch</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
              Pure Water Tanker Supply & On-Demand Bulk Delivery
            </h1>

            {/* Concrete value proposition */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Certified food-grade stainless steel fleet delivering crystal-clear potable drinking water, luxury swimming pool fills, and construction curing water. Scheduled delivery slots or guaranteed 2-hour emergency dispatch.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => startBooking()}
                className="px-6 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Book Water Tanker</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (activeOrder) openTrackingForOrder(activeOrder.id);
                  else setActiveModal('track');
                }}
                className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Live Tanker Tracking</span>
              </button>

              <a
                href="https://wa.me/971501234567?text=Hello%20AquaFlow,%20I%20need%20an%20urgent%20water%20tanker%20quote"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>WhatsApp Urgent</span>
              </a>
            </div>

            {/* Trust bullet markers without pill enclosures */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Zero-touch sealed discharge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Hose reach up to 60 meters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Online cards & cash on delivery</span>
              </div>
            </div>

          </div>

          {/* Column 2: Cinematic Hero Asset with Scrim & Delivery Tag */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/60 bg-slate-900 aspect-[16/10] sm:aspect-[16/11]">
              <img
                src="/src/assets/images/hero_water_tanker_fleet_1792833259225.jpg"
                alt="AquaFlow stainless steel water tanker fleet ready for dispatch"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              {/* Overlay card with real-time operational status */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center justify-between text-xs text-sky-300 mb-1">
                  <span className="font-semibold uppercase tracking-wider">Fleet Operational Status</span>
                  <span className="font-mono text-emerald-400">● 14 Tankers In Service</span>
                </div>
                <p className="text-xs text-slate-200">
                  Ready for immediate deployment across Zone 1 (Metro), Zone 2 (Suburbs), and Zone 3 (Industrial).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Tanker Selector Strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-12">
          <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            <div className="lg:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Water Service Requirement
              </label>
              <select
                value={quickService}
                onChange={(e) => setQuickService(e.target.value as WaterServiceType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="drinking-water">Drinking / Sweet Water (SS316 Certified)</option>
                <option value="swimming-pool">Swimming Pool Fresh Bulk Water</option>
                <option value="construction">Construction & Civil Curing Water</option>
                <option value="commercial-emergency">Commercial & 24/7 Emergency Supply</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanker Capacity
              </label>
              <select
                value={quickCapacity}
                onChange={(e) => setQuickCapacity(e.target.value as TankerCapacityId)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="1000">1,000 Gallons (~3,800L) - $75</option>
                <option value="2500">2,500 Gallons (~9,500L) - $140</option>
                <option value="5000">5,000 Gallons (~19,000L) - $240</option>
                <option value="10000">10,000 Gallons (~38,000L) - Quote</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Delivery Schedule
              </label>
              <div className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-700">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">Same-Day / Choose Slot</span>
              </div>
            </div>

            <div className="lg:col-span-2 pt-2 sm:pt-0">
              <label className="hidden lg:block text-xs font-bold text-transparent mb-1.5">
                Action
              </label>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Configure & Book
              </button>
            </div>

          </form>
        </div>

        {/* 4-Column Proof & KPI Metric Strip (Full-width row below hero) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              12,450,000+
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Gallons Pure Water Delivered
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              45 mins
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Average Metro Dispatch Time
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Food-Grade SS316 Inspected Tanks
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              24 / 7 / 365
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Emergency Fleet Readiness
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
