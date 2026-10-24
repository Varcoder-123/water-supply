import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2, Droplets, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeModal, setActiveModal, orders, receiptOrderId } = useApp();

  if (activeModal !== 'receipt' || !receiptOrderId) return null;

  const order = orders.find(o => o.id === receiptOrderId) || orders[0];
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Action bar (hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Official Tax Invoice & Delivery Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 space-y-6 text-slate-800 bg-white">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-sky-700 font-extrabold text-2xl tracking-tight">
                <Droplets className="w-6 h-6 text-sky-600" />
                <span>AquaFlow Water Supply</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Commercial Bulk Water Tankers & Certified Potable Logistics LLC
              </p>
              <p className="text-xs text-slate-500">
                Central Depot: Al Quoz Industrial Area 3, Street 14, Plot 92
              </p>
              <p className="text-xs text-slate-500 font-mono">
                TRN / Tax ID: 100482910300003 · 24/7 Hotline: +971 50 123 4567
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                INVOICE NUMBER
              </div>
              <div className="text-lg font-extrabold font-mono text-slate-900">
                INV-{order.id}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Date: {order.deliveryDate}
              </div>
              <div className="text-xs font-semibold font-mono text-emerald-700 mt-1">
                {order.paymentStatus === 'paid' ? '● PAYMENT SETTLED' : '● DUE ON DELIVERY'}
              </div>
            </div>
          </div>

          {/* Billed To & Delivery Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Billed To (Customer):
              </div>
              <div className="font-semibold text-slate-800 text-sm">{order.customerName}</div>
              <div className="text-slate-600">{order.customerPhone}</div>
              <div className="text-slate-600">{order.customerEmail}</div>
            </div>

            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Delivery Site & Dispatch:
              </div>
              <div className="text-slate-800 font-medium">{order.deliveryAddress.street}</div>
              <div className="text-slate-600">{order.deliveryAddress.area}, {order.deliveryAddress.city}</div>
              <div className="text-slate-500 font-mono">
                Tanker: {order.tankerPlate || 'DXB-WTR-5042'} · Driver: {order.driverName || 'Rashid Khan'}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Item & Specification</th>
                  <th className="py-2.5 px-4 text-center">Volume</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-900">{order.serviceName}</div>
                    <div className="text-[11px] text-slate-500">
                      Tanker Capacity: {order.capacityName} · Certified SS316 food-grade tank
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {order.gallons.toLocaleString()} Gal
                  </td>
                  <td className="py-3 px-4 text-center">
                    {order.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-bold">
                    ${order.baseAmount}
                  </td>
                </tr>

                {order.zoneFee > 0 && (
                  <tr>
                    <td className="py-2 px-4 font-sans text-slate-600">
                      Zone Delivery Logistics Fee ({order.deliveryAddress.zone.toUpperCase()})
                    </td>
                    <td className="py-2 px-4 text-center text-slate-400">-</td>
                    <td className="py-2 px-4 text-center text-slate-400">1</td>
                    <td className="py-2 px-4 text-right">${order.zoneFee}</td>
                  </tr>
                )}

                {order.hoseExtensionFee > 0 && (
                  <tr>
                    <td className="py-2 px-4 font-sans text-slate-600">
                      Extended Hose Run ({order.hoseExtensionMeters}m with booster pump)
                    </td>
                    <td className="py-2 px-4 text-center text-slate-400">-</td>
                    <td className="py-2 px-4 text-center text-slate-400">1</td>
                    <td className="py-2 px-4 text-right">${order.hoseExtensionFee}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Total */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-600 font-mono">
                <span>Subtotal:</span>
                <span>${order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono">
                <span>VAT (5% Included):</span>
                <span>${(order.totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-300 pt-2 font-mono">
                <span>Total Paid / Due:</span>
                <span className="text-sky-700">${order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer note & Quality Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Water quality certified compliant with Municipal Health & Hygiene Standards. Microbiological test: Passed.
              </span>
            </div>
            <div className="font-mono text-slate-400">
              Ref: {order.paymentTransactionId || 'TXN-COD-PENDING'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
