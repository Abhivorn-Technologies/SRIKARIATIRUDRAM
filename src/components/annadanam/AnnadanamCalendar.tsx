'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { annadanamTiers } from '@/data/annadanam';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Utensils, Heart, ShieldCheck, CheckCircle } from 'lucide-react';

export function AnnadanamSection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('annadanam');

  const [selectedTier, setSelectedTier] = useState('full_day');
  const [selectedDate, setSelectedDate] = useState('2026-11-25');
  const [sponsorName, setSponsorName] = useState('');
  const [inMemoryOf, setInMemoryOf] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeTierObj = annadanamTiers.find((t) => t.id === selectedTier) || annadanamTiers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {annadanamTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sacred-card border-gold shadow-gold-md scale-105'
                  : 'bg-burgundy-deep/70 border-gold/25 hover:border-gold/50'
              }`}
            >
              <div className="space-y-3">
                {tier.badge && (
                  <Badge variant="gold" size="sm">
                    {tier.badge}
                  </Badge>
                )}
                <h3 className="font-cinzel text-base font-bold text-gold-lighter">
                  {isTe ? tier.titleTe : tier.title}
                </h3>
                <p className="text-xs text-ivory/75 font-sans leading-relaxed">
                  {isTe ? tier.descTe : tier.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gold/20">
                <span className="text-[10px] text-ivory/60 uppercase block">Contribution</span>
                <span className="font-cinzel text-xl font-black text-gold">
                  {formatCurrency(tier.amount)}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-1">
                  Feeds ~{tier.meals.toLocaleString()} Devotees
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sponsorship Form Box */}
      <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
        <h3 className="font-cinzel text-xl md:text-2xl font-bold text-gold-lighter border-b border-gold/30 pb-3">
          Sponsor {isTe ? activeTierObj.titleTe : activeTierObj.title} ({formatCurrency(activeTierObj.amount)})
        </h3>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-cinzel text-xl font-bold text-emerald-200">
              Annadanam Sponsorship Registered!
            </h4>
            <p className="text-sm text-ivory/80 font-sans max-w-md mx-auto">
              May Annapoorna Devi bless you with endless health and prosperity. Digital receipt sent to your phone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sponsor Name / Family Gotram"
                placeholder="e.g. Sri K. Satyanarayana & Family"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
              />
              <Input
                label="In Memory Of / On Occasion Of (Optional)"
                placeholder="e.g. Birthday / Late Parents Memory"
                value={inMemoryOf}
                onChange={(e) => setInMemoryOf(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Select Auspicious Yajna Date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Input
                type="tel"
                label="WhatsApp Number for Receipt"
                placeholder="10-digit mobile"
                required
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold uppercase tracking-wider py-4 mt-4"
            >
              <Utensils className="w-4 h-4 mr-2" />
              Sponsor Annadanam ({formatCurrency(activeTierObj.amount)})
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
