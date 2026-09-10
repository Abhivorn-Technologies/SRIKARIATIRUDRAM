'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { QrCode, CreditCard, Landmark, Smartphone, Lock, Globe, ShieldCheck } from 'lucide-react';

export type PaymentMethodType = 'upi' | 'card' | 'debit_card' | 'netbanking' | 'international';

export function PaymentUI({
  amount,
  onPaymentSuccess,
  isProcessing = false,
}: {
  amount: number;
  onPaymentSuccess: (method: PaymentMethodType) => void;
  isProcessing?: boolean;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [upiOption, setUpiOption] = useState<'app' | 'qr'>('app');

  const methods = [
    {
      id: 'upi' as const,
      label: 'UPI (GPay / PhonePe / Paytm / BHIM)',
      desc: 'Instant zero-fee payment via mobile UPI apps or temple QR scanner',
      icon: Smartphone,
      badge: 'Most Popular',
    },
    {
      id: 'card' as const,
      label: 'Credit Card',
      desc: 'Visa, MasterCard, RuPay, Diners (256-bit SSL encrypted)',
      icon: CreditCard,
    },
    {
      id: 'debit_card' as const,
      label: 'Debit Card',
      desc: 'All major Indian bank debit cards',
      icon: CreditCard,
    },
    {
      id: 'netbanking' as const,
      label: 'Net Banking',
      desc: 'SBI, HDFC, ICICI, Axis, PNB and 50+ supported banks',
      icon: Landmark,
    },
    {
      id: 'international' as const,
      label: 'International Devotees (USA / Global Cards)',
      desc: 'For devotees residing in USA, Europe, Singapore, Australia & worldwide',
      icon: Globe,
      badge: 'Global Support',
    },
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSuccess(selectedMethod);
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      {/* Dakshina Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-burgundy-deep border border-gold/40 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-gold-light uppercase font-bold tracking-wider block">
            Total Auspicious Dakshina
          </span>
          <span className="font-cinzel text-2xl sm:text-3xl font-black text-gold">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/70 px-3 py-1.5 rounded-full border border-emerald-500/40 font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure Mock Gateway</span>
        </div>
      </div>

      {/* Methods Selection List */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-gold-lighter font-sans">
          Select Payment Method
        </label>
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMethod === m.id;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? 'bg-primary/50 border-gold shadow-gold-sm'
                  : 'bg-burgundy-deep/60 border-gold/20 hover:border-gold/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-gold bg-gold' : 'border-ivory/40'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-burgundy-deep" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Icon className="w-4 h-4 text-gold-light" />
                  <span className="text-sm font-bold text-ivory">{m.label}</span>
                  {m.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gold/20 text-gold-lighter border border-gold/30">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ivory/70 font-sans">{m.desc}</p>

                {/* Sub-options for UPI */}
                {isSelected && m.id === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-gold/20 space-y-3">
                    <div className="flex gap-4 text-xs font-semibold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="upi_sub"
                          checked={upiOption === 'app'}
                          onChange={() => setUpiOption('app')}
                          className="accent-[#D6A532]"
                        />
                        <span>Pay via UPI App / VPA</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="upi_sub"
                          checked={upiOption === 'qr'}
                          onChange={() => setUpiOption('qr')}
                          className="accent-[#D6A532]"
                        />
                        <span>Scan Temple QR</span>
                      </label>
                    </div>

                    {upiOption === 'qr' ? (
                      <div className="p-3 rounded-lg bg-burgundy-deep border border-gold/30 inline-block text-center">
                        <div className="w-32 h-32 bg-white rounded p-2 flex items-center justify-center mx-auto">
                          <QrCode className="w-28 h-28 text-black" />
                        </div>
                        <span className="text-[10px] text-gold-light block mt-1 font-mono">
                          UPI ID: srikariatirudram@sbi
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-burgundy-deep/80 border border-gold/25 text-xs text-gold-light">
                        Enter your UPI ID or proceed to launch your device UPI application.
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-info for Card / Netbanking / International */}
                {isSelected && (m.id === 'card' || m.id === 'debit_card' || m.id === 'international') && (
                  <div className="mt-3 pt-3 border-t border-gold/20">
                    <div className="p-3 rounded-lg bg-burgundy-deep/80 border border-gold/25 text-xs text-ivory/80 space-y-1">
                      <p className="font-semibold text-gold-light">Demo Payment Gateway Integration</p>
                      <p className="text-[11px] text-ivory/70">
                        Clicking the button below simulates instant authorization. Real payment gateway APIs (Razorpay / Stripe) will be securely connected during backend deployment.
                      </p>
                    </div>
                  </div>
                )}

                {isSelected && m.id === 'netbanking' && (
                  <div className="mt-3 pt-3 border-t border-gold/20">
                    <div className="p-3 rounded-lg bg-burgundy-deep/80 border border-gold/25 text-xs text-ivory/80 space-y-1">
                      <p className="font-semibold text-gold-light">50+ Supported Banks Available</p>
                      <p className="text-[11px] text-ivory/70">
                        State Bank of India, HDFC Bank, ICICI Bank, Axis Bank, Kotak, Union Bank and all major scheduled banks.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isProcessing}
        className="w-full font-bold uppercase tracking-wider text-sm sm:text-base py-4 shadow-gold-lg"
      >
        Complete Offering ({formatCurrency(amount)})
      </Button>

      <div className="flex items-center justify-center gap-2 text-center text-[11px] text-ivory/60 font-sans">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Auspicious Dakshina towards Srikari Ati Rudra Mahayagnam. Digital receipt included.</span>
      </div>
    </form>
  );
}
