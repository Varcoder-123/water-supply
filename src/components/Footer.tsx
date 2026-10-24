import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveModal, startBooking } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Droplets className="w-5 h-5" />
              </div>
              <span>AquaFlow<span className="text-sky-500">.</span></span>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed">
              Leading on-demand bulk water tanker logistics. Certified SS316 food-grade stainless fleet serving residential drinking tanks, swimming pools, commercial facilities, and construction sites with 24/7 emergency dispatch.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div>Municipal Health Food & Safety Dept Registration #DM-WAT-9041</div>
              <div>Commercial Trade License #849201 · TRN #100482910300003</div>
            </div>
          </div>

          {/* Quick Water Services */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Water Services
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Drinking Sweet Water SS316
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Swimming Pool Bulk Delivery
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Construction Site Curing Water
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Commercial & 24/7 Emergency
                </a>
              </li>
            </ul>
          </div>

          {/* Tanker Fleet Volumes */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Tanker Fleet
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => startBooking(undefined, '1000')} 
                  className="hover:text-white transition-colors text-left"
                >
                  1,000 Gallons Compact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startBooking(undefined, '2500')} 
                  className="hover:text-white transition-colors text-left"
                >
                  2,500 Gallons Residential
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startBooking(undefined, '5000')} 
                  className="hover:text-white transition-colors text-left"
                >
                  5,000 Gallons Commercial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startBooking(undefined, '10000')} 
                  className="hover:text-white transition-colors text-left"
                >
                  10,000 Gallons Super Tanker
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Controls */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Portals & Operations
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveModal('track')}
                  className="hover:text-white transition-colors"
                >
                  Live Delivery Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('auth')}
                  className="hover:text-white transition-colors"
                >
                  Customer Account Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('admin')}
                  className="hover:text-sky-400 transition-colors font-medium"
                >
                  Admin & Fleet Console
                </button>
              </li>
              <li>
                <a href="tel:+971501234567" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Emergency Line: +971 50 123 4567
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet Bottom Legal Line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} AquaFlow Water Supply LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400">Terms of Water Delivery</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400">Water Quality Standards (WHO & DM)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
