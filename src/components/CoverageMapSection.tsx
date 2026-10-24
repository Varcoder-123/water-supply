import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_ZONES } from '../data/mockData';
import { MapPin, Navigation, Clock, ShieldCheck, Check, Truck } from 'lucide-react';

export const CoverageMapSection: React.FC = () => {
  const { startBooking } = useApp();
  const [selectedZoneId, setSelectedZoneId] = useState<'zone-1' | 'zone-2' | 'zone-3'>('zone-1');
  const [addressLookup, setAddressLookup] = useState('');
  const [detectedZone, setDetectedZone] = useState<string | null>(null);

  const selectedZone = SERVICE_ZONES.find(z => z.id === selectedZoneId) || SERVICE_ZONES[0];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = addressLookup.toLowerCase();
    if (query.includes('jumeirah') || query.includes('downtown') || query.includes('marina') || query.includes('safa')) {
      setSelectedZoneId('zone-1');
      setDetectedZone('Zone 1: Metro & Central Core (Included standard delivery rate)');
    } else if (query.includes('quoz') || query.includes('hills') || query.includes('arabian') || query.includes('silicon')) {
      setSelectedZoneId('zone-2');
      setDetectedZone('Zone 2: Suburban & Developing Communities (+$15 dispatch)');
    } else {
      setSelectedZoneId('zone-3');
      setDetectedZone('Zone 3: Outer Industrial & Remote Sites (+$35 dispatch)');
    }
  };

  return (
    <section id="coverage" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-2">
            Regional Fleet Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Delivery Zones & Guaranteed Time Windows
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Our central depots are strategically positioned near major highway arteries to ensure prompt tanker dispatch. We serve metropolitan residences, luxury coastal villas, and heavy industrial job sites.
          </p>
        </div>

        {/* 2-Column Layout: Interactive Coverage Map + Zone Information & Checker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Graphic Vector Map */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 text-white overflow-hidden relative shadow-xl">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <Navigation className="w-4 h-4" />
                <span>ACTIVE FLEET COVERAGE MAP</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">● 3 Filling Depots Online</span>
            </div>

            {/* Stylized SVG Map */}
            <div className="relative h-72 sm:h-80 w-full rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                {/* Coastal Line & Water */}
                <path d="M 0 50 Q 150 120 280 90 T 600 130 L 600 0 L 0 0 Z" fill="#082f49" opacity="0.6" />
                <text x="30" y="40" fill="#38bdf8" fontSize="11" fontFamily="sans-serif">Arabian Gulf / Coastal Waterway</text>

                {/* Concentric Zone Boundaries */}
                {/* Zone 3 Ring */}
                <ellipse cx="280" cy="200" rx="250" ry="120" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" fill="rgba(51, 65, 85, 0.1)" />
                <text x="440" y="300" fill="#64748b" fontSize="10" fontFamily="sans-serif">ZONE 3 (Outer Industrial)</text>

                {/* Zone 2 Ring */}
                <ellipse cx="270" cy="190" rx="170" ry="85" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" fill="rgba(2, 132, 199, 0.08)" />
                <text x="340" y="240" fill="#38bdf8" fontSize="10" fontFamily="sans-serif">ZONE 2 (Suburban)</text>

                {/* Zone 1 Core */}
                <ellipse cx="250" cy="170" rx="95" ry="50" stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.15)" />
                <text x="210" y="175" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ZONE 1 (Core)</text>

                {/* Depot 1: Central SS316 Hub */}
                <g transform="translate(240, 160)">
                  <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                  <circle cx="0" cy="0" r="12" fill="#38bdf8" opacity="0.3" className="animate-ping" />
                </g>

                {/* Depot 2: Al Quoz Logistics Hub */}
                <g transform="translate(190, 210)">
                  <circle cx="0" cy="0" r="5" fill="#0284c7" />
                </g>

                {/* Depot 3: Jebel Ali Industrial Tanker Depot */}
                <g transform="translate(420, 230)">
                  <circle cx="0" cy="0" r="5" fill="#f59e0b" />
                </g>

              </svg>

              {/* Legend overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700 text-[11px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="text-slate-200">Zone 1: Metro & Downtown (1-2 Hours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                  <span className="text-slate-200">Zone 2: Suburbs & Villas (2-3 Hours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  <span className="text-slate-200">Zone 3: Remote Sites & Civil (3-5 Hours)</span>
                </div>
              </div>
            </div>

            {/* Quick Address Checker */}
            <form onSubmit={handleLookup} className="mt-5 pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Check Delivery Zone for Your Area or Villa:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addressLookup}
                  onChange={(e) => setAddressLookup(e.target.value)}
                  placeholder="e.g. Jumeirah, Al Quoz, Palm, Dubai Hills..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  Verify Zone
                </button>
              </div>

              {detectedZone && (
                <div className="mt-3 p-2.5 rounded-lg bg-sky-950 border border-sky-800 text-xs text-sky-200 font-mono">
                  {detectedZone}
                </div>
              )}
            </form>

          </div>

          {/* Zone Selector & Specifications */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Zone Selector buttons */}
            <div className="grid grid-cols-3 gap-2">
              {SERVICE_ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedZoneId === z.id
                      ? 'bg-sky-50 border-sky-600 text-sky-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{z.id.replace('-', ' ')}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {z.deliverySurcharge === 0 ? 'Free dispatch' : `+$${z.deliverySurcharge}`}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Zone Card Details */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedZone.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedZone.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Dispatch Window:</span>
                  <span className="font-bold font-mono text-slate-900">{selectedZone.standardEtaHours}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Rush 2-Hour Service:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedZone.rushAvailable ? '✓ Available 24/7' : 'Scheduled only'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>GPS telematics tracking provided on every active tanker</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>Access for single-axle, tandem, and semi-trailer vehicles</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>Zero-spill quick camlock coupling connections</span>
                </div>
              </div>

              <button
                onClick={() => startBooking()}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Book Tanker for This Zone
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
