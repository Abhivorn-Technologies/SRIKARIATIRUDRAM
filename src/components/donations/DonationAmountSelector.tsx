'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { donationCauses, donationPresets } from '@/data/annadanam';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { PaymentUI, PaymentMethodType } from '@/components/booking/PaymentUI';
import { Heart, ShieldCheck, CheckCircle, ArrowLeft, Printer, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DonationSection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('donations');

  const [selectedCause, setSelectedCause] = useState('general');
  const [amount, setAmount] = useState<number>(2516);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Flow Step: 1 = Details & Cause, 2 = Razorpay Payment, 3 = Confirmation Receipt
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmed Receipt Details
  const [confirmedDonation, setConfirmedDonation] = useState<{
    donationId: string;
    donorName: string;
    phone: string;
    email: string;
    amount: number;
    causeTitle: string;
    transactionId: string;
    date: string;
  } | null>(null);

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) setAmount(num);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !phone.trim() || amount <= 0) return;
    setStep(2);
  };

  const handlePaymentSuccess = async (method: PaymentMethodType, transactionId?: string) => {
    setIsProcessing(true);
    const rand = Math.floor(100000 + Math.random() * 900000);
    const donationId = `SAR-DON-${rand}`;
    const txId = transactionId || `TXN${Date.now().toString().slice(-8)}`;

    const causeObj = donationCauses.find((c) => c.id === selectedCause) || donationCauses[0];
    const causeTitle = isTe ? causeObj.titleTe : causeObj.title;

    try {
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: donorName.trim(),
          mobile: phone.trim(),
          email: email.trim() || undefined,
          amount,
          purpose: causeTitle,
          transaction_id: txId,
        }),
      });
    } catch (err) {
      console.error('Failed to save donation to database:', err);
    }

    setConfirmedDonation({
      donationId,
      donorName: donorName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      amount,
      causeTitle,
      transactionId: txId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });

    setIsProcessing(false);
    setStep(3);

    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F2C14E', '#D6A532', '#FAF4E6', '#8B1E2D'],
      });
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto font-sans">
      {/* Causes Selection (Step 1) */}
      {step === 1 && (
        <div className="space-y-4">
          <label className="block font-cinzel text-base md:text-lg font-bold text-gold-lighter text-center">
            {t('purpose')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {donationCauses.map((cause) => {
              const isSelected = selectedCause === cause.id;
              return (
                <div
                  key={cause.id}
                  onClick={() => setSelectedCause(cause.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-primary/50 border-gold shadow-gold-sm'
                      : 'bg-burgundy-deep/70 border-gold/20 hover:border-gold/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-burgundy-deep flex items-center justify-center text-gold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-gold-light">
                    {isTe ? cause.titleTe : cause.title}
                  </h4>
                  <p className="text-xs text-ivory/70 leading-relaxed">
                    {isTe ? cause.descTe : cause.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
        {step === 1 && (
          <>
            <div className="space-y-3">
              <label className="block font-cinzel text-base font-bold text-gold-lighter">
                {t('selectAmount')}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {donationPresets.map((val) => {
                  const isSelected = amount === val && !customAmount;
                  return (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handlePreset(val)}
                      className={`py-3 rounded-lg font-cinzel font-bold text-sm border transition-all ${
                        isSelected
                          ? 'bg-gold text-burgundy-deep border-gold shadow-gold-sm'
                          : 'bg-burgundy-deep text-ivory border-gold/25 hover:border-gold/50'
                      }`}
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <Input
                  type="number"
                  placeholder="Or enter custom amount in ₹"
                  value={customAmount}
                  onChange={handleCustom}
                  className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A]"
                />
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 border-t border-gold/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Donor Name"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ramakrishna Rao"
                  className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A]"
                />
                <Input
                  type="tel"
                  label="Mobile Number for Receipt"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A]"
                />
              </div>

              <div>
                <Input
                  type="email"
                  label="Email Address (Optional)"
                  placeholder="To receive digital donation receipt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A]"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full font-bold uppercase tracking-wider py-4 mt-2"
              >
                <Heart className="w-4 h-4 mr-2" />
                {t('donateNow')} ({formatCurrency(amount)})
              </Button>
            </form>
          </>
        )}

        {/* Step 2: Razorpay Payment Gateway UI */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gold/20 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-gold uppercase font-bold tracking-wider">Sacred Contribution</span>
                <h3 className="font-cinzel text-xl font-bold text-gold-lighter">
                  Complete Your Offering via Razorpay
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs text-gold-light hover:text-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Edit
              </Button>
            </div>

            <PaymentUI
              amount={amount}
              devoteeName={donorName}
              devoteePhone={phone}
              devoteeEmail={email}
              onPaymentSuccess={handlePaymentSuccess}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Step 3: Confirmation Receipt */}
        {step === 3 && confirmedDonation && (
          <div className="space-y-6 text-center">
            <div className="p-8 space-y-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-ivory">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-cinzel text-2xl font-black text-emerald-200 uppercase tracking-wide">
                  Sacred Donation Received & Blessed!
                </h4>
                <p className="text-xs text-emerald-300 font-mono">
                  DONATION ID: {confirmedDonation.donationId}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-burgundy-deep/80 border border-gold/30 text-left max-w-md mx-auto space-y-2 text-xs font-sans">
                <div className="flex justify-between border-b border-gold/20 pb-1.5">
                  <span className="text-ivory/70">Donor Name:</span>
                  <span className="font-bold text-gold-lighter">{confirmedDonation.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-gold/20 pb-1.5">
                  <span className="text-ivory/70">Mobile Number:</span>
                  <span className="font-medium text-ivory">{confirmedDonation.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gold/20 pb-1.5">
                  <span className="text-ivory/70">Donation Cause:</span>
                  <span className="font-medium text-gold-light">{confirmedDonation.causeTitle}</span>
                </div>
                <div className="flex justify-between border-b border-gold/20 pb-1.5">
                  <span className="text-ivory/70">Transaction Ref:</span>
                  <span className="font-mono text-ivory">{confirmedDonation.transactionId}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ivory/70 font-bold">Total Amount:</span>
                  <span className="font-cinzel text-base font-black text-gold">
                    {formatCurrency(confirmedDonation.amount)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ivory/80 max-w-md mx-auto leading-relaxed">
                May the divine blessings of Sri Parvathi Parameshwara enrich your family with health, longevity, and prosperity.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  leftIcon={<Printer className="w-4 h-4" />}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  Print Receipt
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setStep(1);
                    setConfirmedDonation(null);
                  }}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  Make Another Contribution
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
