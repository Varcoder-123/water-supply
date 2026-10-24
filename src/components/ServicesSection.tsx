import React from 'react';
import { useApp } from '../context/AppContext';
import { WaterServiceType } from '../types';
import { Check, ArrowRight, ShieldCheck, Waves, Building2, Flame } from 'lucide-react';

interface ServiceItem {
  type: WaterServiceType;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  specs: string[];
  recommendedTankers: string;
}

const SERVICES: ServiceItem[] = [
  {
    type: 'drinking-water',
    index: '01',
    title: 'Drinking & Potable Sweet Water',
    subtitle: 'SS316 Stainless Steel Food-Grade Delivery',
    description: 'Ultra-hygienic reverse osmosis (RO) sweet water certified under strict municipal drinking water safety standards. Perfect for villa underground and rooftop water tanks, domestic kitchens, and residential estates.',
    imageSrc: '/src/assets/images/service_drinking_water_1792833258947.jpg',
    specs: [
      'TDS Range: 120 – 180 ppm (Ideal taste & mineral balance)',
      'pH Balance: 7.2 – 7.6 neutral tested',
      'Food-grade 316L stainless steel sanitized tankers',
      'Zero contamination sealed discharge hose coupling',
    ],
    recommendedTankers: '1,000 Gallons & 2,500 Gallons'
  },
  {
    type: 'swimming-pool',
    index: '02',
    title: 'Swimming Pool Bulk Water',
    subtitle: 'Crystal Clear Azure Water for Fast Filling',
    description: 'High-flow delivery of pristine, clear freshwater engineered specifically for swimming pool initial fillings, seasonal top-ups, and balance tanks. Protects pool pumps and prevents staining of plaster or tiles.',
    imageSrc: '/src/assets/images/service_swimming_pool_1792833259994.jpg',
    specs: [
      'Low turbidity (<0.5 NTU) sparkling clarity',
      'Gentle mineral profile safe for all liners & tile grout',
      'High-pressure pump fills standard 15x30ft pools in hours',
      'Eliminates municipal line pressure drop & penalties',
    ],
    recommendedTankers: '2,500 Gallons & 5,000 Gallons'
  },
  {
    type: 'construction',
    index: '03',
    title: 'Construction & Civil Curing Water',
    subtitle: 'Heavy Duty Site Logistics & Dust Suppression',
    description: 'High-volume raw and treated water tankers for concrete curing, compaction, road drilling, soil stabilization, and environmental dust suppression on commercial building and infrastructure sites.',
    imageSrc: '/src/assets/images/service_construction_water_1792833259877.jpg',
    specs: [
      'Continuous multi-tanker site rotation available',
      'High-pressure water cannon & spray bar equipped tankers',
      'Flexible site discharge into bladders, frac tanks, or pits',
      'Scheduled 24-hour night delivery for site access windows',
    ],
    recommendedTankers: '5,000 Gallons & 10,000 Gallons'
  },
  {
    type: 'commercial-emergency',
    index: '04',
    title: 'Commercial & Emergency Backup Supply',
    subtitle: 'Rapid Contingency for Hotels, Hospitals & Events',
    description: 'Priority rapid response water supply during municipal line maintenance, pipe bursts, or high-occupancy corporate events. Dedicated emergency hotline with 2-hour dispatch guarantee.',
    imageSrc: '/src/assets/images/hero_water_tanker_fleet_1792833259225.jpg',
    specs: [
      'Priority 2-hour rapid emergency dispatch protocol',
      'Temporary booster pump kits for multi-story buildings',
      'Sanitary water supply for outdoor festivals & banquets',
      'Standby tanker leasing available with dedicated driver',
    ],
    recommendedTankers: '5,000 Gallons & 10,000 Gallons'
  }
];

export const ServicesSection: React.FC = () => {
  const { startBooking } = useApp();

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-2">
            Targeted Water Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Specialized Water Tanker Services for Every Demand
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            From certified food-grade stainless tankers for residential drinking reservoirs to heavy-duty multi-axle fleets for civil projects, every delivery is handled with calibrated hygiene and rapid dispatch.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {SERVICES.map((service) => (
            <div 
              key={service.type}
              className="group rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:shadow-sky-100"
            >
              <div>
                {/* Image slot */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={service.imageSrc}
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                  
                  {/* Human editorial numbering */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs px-2.5 py-1 rounded">
                    {service.index}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-medium text-sky-300 tracking-wide">
                      {service.subtitle}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6">
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Technical Specifications */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-200">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Water & Logistics Specifications:
                    </div>
                    {service.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Tankers metadata */}
                  <div className="text-xs text-slate-500 py-2">
                    <span className="font-semibold text-slate-700">Recommended Capacity:</span> {service.recommendedTankers}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => startBooking(service.type)}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-slate-800 group-hover:text-white bg-white group-hover:bg-sky-600 border border-slate-300 group-hover:border-sky-600 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Book {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
