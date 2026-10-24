import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FleetPricingSection } from './components/FleetPricingSection';
import { CoverageMapSection } from './components/CoverageMapSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals
import { BookingModal } from './components/BookingModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceiptModal } from './components/ReceiptModal';

import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Fast WhatsApp & Urgent Call Button on Mobile/Desktop */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-2.5">
        <a
          href="https://wa.me/971501234567?text=Hello%20AquaFlow,%20I%20need%20a%20water%20tanker%20right%20away."
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
          title="Direct WhatsApp Fleet Dispatch"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      <Header />
      
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <FleetPricingSection />
        <CoverageMapSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Modals & Dialogs */}
      <BookingModal />
      <OrderTrackingModal />
      <CustomerPortalModal />
      <AdminDashboard />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
