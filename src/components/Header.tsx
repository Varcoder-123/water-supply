import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, ShieldCheck, User, PhoneCall, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    setActiveModal, 
    orders, 
    startBooking,
    openTrackingForOrder
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if there is an active dispatched order for the current user or generally
  const activeOrder = orders.find(o => o.status === 'dispatched' || o.status === 'confirmed');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top emergency dispatch bar for high urgency */}
      <div className="bg-sky-950 text-sky-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium">24/7 Water Tanker Emergency Dispatch Hotline:</span>
            <a href="tel:+971501234567" className="font-bold text-white hover:text-sky-300 transition-colors">
              +971 50 123 4567
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-sky-200">
            <span>SS316 Food-Grade Certified Fleet</span>
            <span aria-hidden="true">·</span>
            <span>Same-Day 2-Hour Express Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-200 group-hover:bg-sky-700 transition-colors">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            AquaFlow<span className="text-sky-600">.</span>
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0">
            Water Services
          </a>
          <a href="#fleet" className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0">
            Tanker Fleet & Rates
          </a>
          <a href="#coverage" className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0">
            Coverage Zones
          </a>
          <a 
            href="#tracking" 
            onClick={(e) => {
              e.preventDefault();
              if (activeOrder) {
                openTrackingForOrder(activeOrder.id);
              } else if (orders.length > 0) {
                openTrackingForOrder(orders[0].id);
              } else {
                setActiveModal('track');
              }
            }}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Live Delivery Track</span>
            {activeOrder && (
              <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </a>
          <a href="#contact" className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0">
            Contact & Depot
          </a>
        </nav>

        {/* Zone 3: 1 primary action + discreet portal/admin triggers */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Customer Portal button */}
          <button
            onClick={() => setActiveModal('auth')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Customer Portal"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[110px] truncate">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Admin Dashboard button */}
          <button
            onClick={() => setActiveModal('admin')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Fleet Dispatch & Admin Control"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => startBooking()}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-all shadow-sky-600/20 whitespace-nowrap shrink-0"
          >
            Book Water Tanker
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Water Services
          </a>
          <a
            href="#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Tanker Fleet & Rates
          </a>
          <a
            href="#coverage"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Coverage Zones
          </a>
          <a
            href="#tracking"
            onClick={() => {
              setMobileMenuOpen(false);
              if (activeOrder) openTrackingForOrder(activeOrder.id);
              else setActiveModal('track');
            }}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Live Delivery Tracking
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Contact & Depot
          </a>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveModal('auth');
              }}
              className="text-xs font-semibold text-slate-700 py-1.5 px-3 bg-slate-100 rounded"
            >
              {currentUser ? `Account: ${currentUser.name}` : 'Customer Sign In'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveModal('admin');
              }}
              className="text-xs font-semibold text-sky-700 py-1.5 px-3 bg-sky-50 rounded"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
