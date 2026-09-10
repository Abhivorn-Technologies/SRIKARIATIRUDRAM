'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { donationCauses, donationPresets } from '@/data/annadanam';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShieldCheck, CheckCircle } from 'lucide-react';

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) setAmount(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto font-sans">
      {/* Causes Selection */}
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

      {/* Preset Amounts */}
      <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
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
            />
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-cinzel text-xl font-bold text-emerald-200">
              Contribution Received with Deep Gratitude!
            </h4>
            <p className="text-sm text-ivory/80 max-w-md mx-auto">
              May the divine grace of Lord Parameshwara enrich your life. Digital donation receipt is generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gold/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Donor Name"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
              <Input
                type="tel"
                label="Mobile Number for Receipt"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Input
                type="email"
                label="Email Address (Optional)"
                placeholder="To receive digital donation receipt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold uppercase tracking-wider py-4 mt-2"
            >
              <Heart className="w-4 h-4 mr-2" />
              {t('donateNow')} ({formatCurrency(amount)})
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
