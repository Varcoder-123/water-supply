import React from 'react';
import { useApp } from '../context/AppContext';
import { TankerCapacityId } from '../types';
import { Truck, Check, Sparkles, ArrowRight, Gauge, Info } from 'lucide-react';

export const FleetPricingSection: React.FC = () => {
  const { capacities, startBooking } = useApp();

  return (
    <section id="fleet" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-2">
            Transparent Capacity & Fleet Rates
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Water Tanker Sizes, Capacities & Rates
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            All our tankers are certified food-grade stainless steel with high-pressure booster pumps and sanitary couplings. Choose between fixed-rate standard deliveries or custom volume quotes for major sites.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capacities.map((cap) => {
            const isPopular = cap.id === '2500';

            return (
              <div 
                key={cap.id}
                className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isPopular 
                    ? 'bg-white border-sky-400 ring-2 ring-sky-500/20 shadow-md' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Popular recommendation kicker (unboxed, clean typography) */}
                {isPopular && (
                  <div className="px-5 pt-4 text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Most Requested for Residential Villas</span>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Title & Volume */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {cap.name}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-500 font-mono mb-4">
                    {cap.volumeGallons.toLocaleString()} Gallons · {cap.volumeLitres.toLocaleString()} Litres
                  </div>

                  {/* Price display: Fixed vs Quote */}
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    {cap.isQuoteOnly ? (
                      <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          Custom Quote
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Volume discount & site-distance basis
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                            ${cap.basePrice}
                          </span>
                          <span className="text-xs text-slate-500">/ trip (Zone 1)</span>
                        </div>
                        <div className="text-xs text-emerald-600 font-medium mt-1">
                          Fixed price · No hidden surge fees
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ideal For */}
                  <div className="mb-5">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Best Application:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cap.idealFor}
                    </p>
                  </div>

                  {/* Tanker Specs */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Gauge className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{cap.pumpRate}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{cap.axleType}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{cap.hoseLengthIncluded}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{cap.tankMaterial}</span>
                    </div>
                  </div>

                </div>

                {/* Card CTA */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => startBooking(undefined, cap.id)}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPopular
                        ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm shadow-sky-600/20'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cap.isQuoteOnly ? 'Request Quote' : 'Book Tanker'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Pricing notice info note */}
        <div className="mt-8 rounded-xl bg-sky-50 border border-sky-100 p-4 flex items-start gap-3 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Transparent Zone Pricing Policy:</span>
            <p className="text-sky-800">
              Base rates include standard delivery within Zone 1 (Metro Core). Zone 2 (Suburban) includes a standard +$15 logistics dispatch fee; Zone 3 (Outer Industrial) has a +$35 surcharge. Extended hose runs up to 60 meters with booster pumps are available at checkout.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
