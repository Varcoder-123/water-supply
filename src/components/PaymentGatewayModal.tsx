import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  FileText
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: {
    orderId: string;
    serviceName: string;
    capacityName: string;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  orderSummary,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(orderSummary.customerName || 'Tariq Al-Mansoor');
  const [expiry, setExpiry] = useState('11/28');
  const [cvv, setCvv] = useState('883');
  
  // Step in gateway: 'card-details' -> 'processing' -> '3d-secure' -> 'success'
  const [step, setStep] = useState<'card-details' | 'processing' | '3d-secure' | 'success'>('card-details');
  const [otp, setOtp] = useState('482901');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedTxnId, setGeneratedTxnId] = useState<string>('');

  if (!isOpen) return null;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      setErrorMsg('Please complete all card details');
      return;
    }
    setErrorMsg(null);
    setStep('processing');

    setTimeout(() => {
      // Move to 3D-Secure bank challenge simulation
      setStep('3d-secure');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const txn = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
      setGeneratedTxnId(txn);
      setStep('success');
      onPaymentSuccess(txn);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with security lock */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold">Secure Local Payment Gateway</div>
              <div className="text-[10px] text-slate-400">256-bit SSL Encrypted & PCI-DSS Level 1</div>
            </div>
          </div>
          {step !== 'processing' && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Order amount bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Order:</span>
            <span className="text-xs font-mono font-bold text-slate-800 ml-1.5">{orderSummary.orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Amount Due:</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums ml-1.5">
              ${orderSummary.totalAmount}
            </span>
          </div>
        </div>

        {/* Body content based on state */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'card-details' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full name on card"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ${orderSummary.totalAmount}</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-500 pt-1">
                Supports Visa, Mastercard, Mada, and American Express with local settlement.
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-10 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-sky-600 animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900">Contacting Issuing Bank...</h4>
                <p className="text-xs text-slate-500 mt-1">Securing token and initializing 3D-Secure authentication</p>
              </div>
            </div>
          )}

          {step === '3d-secure' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-2">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <span className="font-bold">Verified by Visa / Mastercard Identity Check</span>
                <p className="mt-1 text-amber-800">
                  A verification code has been sent to the cardholder's registered mobile number ending in •••• 2931.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enter One-Time Security Passcode (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block text-center">
                  Simulation default OTP: 482901
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  Verify & Complete Payment
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900">Payment Confirmed!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your transaction has been approved and your water tanker has entered dispatch queue.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 text-left space-y-1">
                <div><span className="text-slate-400">Transaction ID:</span> {generatedTxnId}</div>
                <div><span className="text-slate-400">Order Reference:</span> {orderSummary.orderId}</div>
                <div><span className="text-slate-400">Amount Paid:</span> ${orderSummary.totalAmount}</div>
                <div><span className="text-slate-400">Status:</span> SETTLED (Authorized)</div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Done · View Order Tracking
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
