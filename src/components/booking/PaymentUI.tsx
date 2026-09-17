'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { initiateRazorpayPayment } from '@/lib/razorpayClient';
import { QrCode, CreditCard, Landmark, Smartphone, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            setErrorMessage('Payment window was closed before completion. Please click below to try again.');
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
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Bank Verification</span>
        </div>
      </div>

      {/* Supported Payment Methods Showcase */}
      <div className="p-5 rounded-2xl bg-[#230206] border border-gold/30 space-y-4">
        <div className="space-y-1">
          <span className="text-[11px] font-cinzel font-bold text-gold uppercase tracking-widest block">
            Automated Payment Gateway
          </span>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-ivory">
            Pay via Razorpay Secure Checkout
          </h3>
          <p className="text-xs text-ivory/70 font-sans">
            Instant automatic payment verification with official booking receipt generation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* UPI & QR Apps */}
          <div className="p-3 rounded-xl bg-[#1A0004] border border-gold/20 flex flex-col items-center justify-center text-center space-y-1.5">
            <QrCode className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold text-ivory">UPI QR & Apps</span>
            <span className="text-[10px] text-ivory/50">GPay, PhonePe, Paytm</span>
          </div>

          {/* Cards */}
          <div className="p-3 rounded-xl bg-[#1A0004] border border-gold/20 flex flex-col items-center justify-center text-center space-y-1.5">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-ivory">Cards</span>
            <span className="text-[10px] text-ivory/50">Visa, Master, RuPay</span>
          </div>

          {/* Netbanking */}
          <div className="p-3 rounded-xl bg-[#1A0004] border border-gold/20 flex flex-col items-center justify-center text-center space-y-1.5">
            <Landmark className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-ivory">NetBanking</span>
            <span className="text-[10px] text-ivory/50">All Major Banks</span>
          </div>

          {/* Verification */}
          <div className="p-3 rounded-xl bg-[#1A0004] border border-gold/20 flex flex-col items-center justify-center text-center space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-gold-light" />
            <span className="text-xs font-bold text-ivory">Instant Receipt</span>
            <span className="text-[10px] text-ivory/50">Verified Auto Approval</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Razorpay Action Button */}
      <Button
        type="button"
        onClick={handleRazorpayPay}
        variant="gold"
        size="lg"
        isLoading={loading || isProcessing}
        className="w-full font-bold uppercase tracking-wider text-sm sm:text-base py-4 shadow-gold-lg"
      >
        {loading ? 'Opening Razorpay Gateway...' : `Proceed to Pay ${formatCurrency(amount)}`}
      </Button>

      <div className="text-center">
        <p className="text-[11px] text-ivory/50 font-sans flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gold/70" />
          Payments are secured by Razorpay with end-to-end 256-bit encryption
        </p>
      </div>
    </div>
  );
}
