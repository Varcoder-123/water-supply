import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building,
  ShieldCheck
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addEnquiry } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [serviceOfInterest, setServiceOfInterest] = useState('Drinking Water SS316');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addEnquiry({
      name,
      email,
      phone,
      subject: subject || 'Water Tanker Supply Inquiry',
      serviceOfInterest,
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-2">
            Direct Communications & Fleet Depots
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Contact Dispatch & Request Custom Bulk Quotes
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Need an urgent same-day tanker, recurring commercial supply contract, or municipal lab water certification report? Contact our 24/7 operations room or visit our central depot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Send an Enquiry or Commercial Request
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our fleet manager responds within 15 minutes during operating hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Enquiry Submitted Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Your request has been routed to our dispatch supervisor. We will contact you via phone or email shortly with availability and pricing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tariq Al-Mansoor"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service Requirement
                    </label>
                    <select
                      value={serviceOfInterest}
                      onChange={(e) => setServiceOfInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    >
                      <option value="Drinking Water SS316">Drinking Water (Sweet Water SS316)</option>
                      <option value="Swimming Pool Water">Swimming Pool Bulk Delivery</option>
                      <option value="Construction Site Water">Construction & Concrete Curing</option>
                      <option value="Commercial Contract">Commercial Facility Recurring Contract</option>
                      <option value="Other">Custom Fleet Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Quotation for 10,000 Gallons site delivery"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Delivery Address, Tank Details or Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify delivery location, access road width, estimated volume, and preferred delivery schedule..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Tanker Enquiry</span>
                </button>
              </form>
            )}

          </div>

          {/* Column 2: Direct Contact Channels & Operating Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Hotlines Card */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Direct Dispatch Channels
              </h3>

              <div className="space-y-3">
                <a
                  href="tel:+971501234567"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">24/7 Emergency Dispatch Hotline</div>
                    <div className="text-sm font-bold font-mono text-slate-900 group-hover:text-sky-700">
                      +971 50 123 4567
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/971501234567?text=Hello%20AquaFlow,%20I%20would%20like%20to%20order%20a%20water%20tanker"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Instant WhatsApp Booking</div>
                    <div className="text-sm font-bold text-emerald-800">
                      Chat with Fleet Supervisor
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:orders@aquaflowsupply.com"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Corporate & Invoicing Email</div>
                    <div className="text-sm font-bold font-mono text-slate-900 group-hover:text-sky-700">
                      orders@aquaflowsupply.com
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Operating Hours & Physical Depot Address */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Operating Hours & Central Depot
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Fleet Operations & Tanker Dispatch</div>
                    <div className="text-emerald-700 font-semibold font-mono">24 Hours a Day · 7 Days a Week · 365 Days a Year</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Customer Support & Billing Desk</div>
                    <div>Mon – Sat: 06:00 AM – 10:00 PM · Sun: 08:00 AM – 08:00 PM</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Main Fleet Depot & Filling Station</div>
                    <div>Plot 92, Street 14, Al Quoz Industrial Area 3, Dubai, UAE</div>
                    <div className="text-slate-400 text-[11px]">Secondary Hubs in Jebel Ali & Al Awir</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
