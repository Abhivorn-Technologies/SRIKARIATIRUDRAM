'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { initiateRazorpayPayment } from '@/lib/razorpayClient';
import { QrCode, CreditCard, Landmark, Smartphone, Lock, Globe, ShieldCheck, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

export type PaymentMethodType = 'upi' | 'card' | 'debit_card' | 'netbanking' | 'international';

export function PaymentUI({
  amount,
  bookingId,
  devoteeName,
  devoteePhone,
  devoteeEmail,
  onPaymentSuccess,
  isProcessing = false,
}: {
  amount: number;
  bookingId?: string;
  devoteeName?: string;
  devoteePhone?: string;
  devoteeEmail?: string;
  onPaymentSuccess: (method: PaymentMethodType, transactionId?: string) => void;
  isProcessing?: boolean;
}) {
  const [templeUpiId, setTempleUpiId] = useState('srikariatirudram@upi');
  const [paymentMode, setPaymentMode] = useState<'embedded_qr' | 'razorpay_gateway'>('embedded_qr');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.temple_upi_id) {
          setTempleUpiId(json.data.temple_upi_id);
        }
      })
      .catch((err) => console.error('Failed to load temple upi id', err));
  }, []);

  const upiPaymentUrl = `upi://pay?pa=${templeUpiId}&pn=Srikari%20Ati%20Rudra%20Mahayagnam&am=${amount}&cu=INR&tn=Sacred%20Seva%20Dakshina`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPaymentUrl)}&color=4A0009&bgcolor=FFF8E8`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(templeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmUpiPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTxnId = utrNumber.trim() || `UPI_PAY_${Date.now()}`;
    onPaymentSuccess('upi', finalTxnId);
  };

  const handleRazorpayPay = async () => {
    setErrorMessage(null);
    try {
      setLoading(true);
      await initiateRazorpayPayment({
        amount,
        recordId: bookingId,
        type: 'booking',
        title: 'Srikari Ati Rudram Seva Booking',
        description: 'Sacred Seva Offering Dakshina',
        prefill: {
          name: devoteeName || '',
          contact: devoteePhone || '',
          email: devoteeEmail || '',
        },
        onSuccess: (result) => {
          setLoading(false);
          onPaymentSuccess('card', result.transactionId);
        },
        onError: (err) => {
          setLoading(false);
          if (err.includes('closed by user')) {
            setErrorMessage('Payment window was closed before completion. You can re-launch checkout below or switch to the Direct Temple QR tab.');
          } else {
            setErrorMessage(err);
          }
        },
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Payment initiation failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dakshina Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-burgundy-deep border border-gold/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-gold-light uppercase font-bold tracking-wider block">
            Total Auspicious Dakshina Amount
          </span>
          <span className="font-cinzel text-2xl sm:text-3xl font-black text-gold">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>256-bit Encrypted Temple Portal</span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex rounded-xl bg-[#1A0004] p-1.5 border border-gold/30">
        <button
          type="button"
          onClick={() => {
            setPaymentMode('embedded_qr');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-cinzel font-bold transition-all flex items-center justify-center gap-2 ${
            paymentMode === 'embedded_qr'
              ? 'bg-gold text-maroon shadow-md'
              : 'text-ivory/70 hover:text-gold hover:bg-white/5'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Direct Temple QR & UPI Apps</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPaymentMode('razorpay_gateway');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-cinzel font-bold transition-all flex items-center justify-center gap-2 ${
            paymentMode === 'razorpay_gateway'
              ? 'bg-gold text-maroon shadow-md'
              : 'text-ivory/70 hover:text-gold hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Razorpay Popup (Cards / NetBanking)</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MODE 1: DIRECT EMBEDDED TEMPLE QR & MOBILE UPI APPS */}
      {paymentMode === 'embedded_qr' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#230206] border border-gold/40 space-y-6 text-center shadow-lg">
            <div className="space-y-1">
              <span className="text-[11px] font-cinzel font-bold text-gold uppercase tracking-widest block">
                Scan & Pay Auspicious Dakshina
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-ivory">
                Official Temple UPI QR Scanner
              </h3>
              <p className="text-xs text-ivory/70">
                Scan using any UPI app (GPay, PhonePe, Paytm, BHIM) or tap a button below
              </p>
            </div>

            {/* Embedded QR Scanner Image */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-[#FAF4E6] rounded-2xl border-4 border-gold shadow-2xl inline-block relative group">
                <img
                  src={qrCodeImageUrl}
                  alt="Temple Sacred UPI QR Code"
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                />
                <div className="mt-1 text-[10px] font-bold text-[#4A0009] tracking-wider uppercase">
                  Srikari Ati Rudram Mahayagnam
                </div>
              </div>

              {/* Copy UPI ID */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs text-ivory/70">UPI ID:</span>
                <code className="font-mono text-xs font-bold text-gold bg-[#150002] px-2.5 py-1 rounded border border-gold/30">
                  {templeUpiId}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded-lg bg-gold/15 text-gold hover:bg-gold/30 border border-gold/40 transition-colors text-xs flex items-center gap-1"
                  title="Copy Temple UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Launch Mobile Apps (UPI Deep Links) */}
            <div className="pt-2 space-y-2 border-t border-gold/20">
              <span className="text-[11px] font-semibold text-ivory/70 block">
                Direct Pay via Mobile UPI App:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={upiPaymentUrl}
                  className="p-2.5 rounded-xl bg-[#1A0004] border border-gold/30 text-ivory text-xs font-bold hover:bg-gold/20 hover:border-gold transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-gold" />
                  <span>Google Pay</span>
                </a>
                <a
                  href={upiPaymentUrl}
                  className="p-2.5 rounded-xl bg-[#1A0004] border border-gold/30 text-ivory text-xs font-bold hover:bg-gold/20 hover:border-gold transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>PhonePe</span>
                </a>
                <a
                  href={upiPaymentUrl}
                  className="p-2.5 rounded-xl bg-[#1A0004] border border-gold/30 text-ivory text-xs font-bold hover:bg-gold/20 hover:border-gold transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Paytm UPI</span>
                </a>
                <a
                  href={upiPaymentUrl}
                  className="p-2.5 rounded-xl bg-[#1A0004] border border-gold/30 text-ivory text-xs font-bold hover:bg-gold/20 hover:border-gold transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BHIM UPI</span>
                </a>
              </div>
            </div>
          </div>

          {/* Confirm Payment Submission Form */}
          <form onSubmit={handleConfirmUpiPayment} className="p-5 rounded-2xl bg-[#230206] border border-gold/30 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ivory block font-cinzel">
                Enter 12-Digit UPI Transaction / UTR No (Optional):
              </label>
              <Input
                placeholder="e.g. 425109847120 or Reference No."
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="bg-[#150002] border-gold/30 text-ivory text-xs h-10 font-mono"
              />
              <p className="text-[11px] text-ivory/50">
                Found in your GPay / PhonePe payment receipt statement.
              </p>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isProcessing}
              className="w-full font-bold uppercase tracking-wider text-sm py-4 shadow-gold-lg"
            >
              Confirm Sacred Payment & Get Receipt ({formatCurrency(amount)})
            </Button>
          </form>
        </div>
      )}

      {/* MODE 2: RAZORPAY POPUP GATEWAY */}
      {paymentMode === 'razorpay_gateway' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#1A0004] border border-gold/30 space-y-2">
            <h4 className="text-xs font-bold text-gold font-cinzel uppercase tracking-wider">
              Razorpay Popup Checkout
            </h4>
            <p className="text-xs text-ivory/70">
              Pay securely using Debit/Credit Cards (Visa, MasterCard, RuPay), Net Banking (SBI, HDFC, ICICI), or International Cards.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleRazorpayPay}
            variant="gold"
            size="lg"
            isLoading={loading || isProcessing}
            className="w-full font-bold uppercase tracking-wider text-sm py-4 shadow-gold-lg"
          >
            {loading ? 'Opening Razorpay Window...' : `Launch Razorpay Checkout (${formatCurrency(amount)})`}
          </Button>
        </div>
      )}
    </div>
  );
}

