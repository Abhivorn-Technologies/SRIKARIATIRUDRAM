'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Seva } from '@/types/seva';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Flame, User, ShieldCheck, Star, MapPin } from 'lucide-react';

export function BookingSummaryCard({
  seva,
  selectedDate,
  dayNumber,
  nakshatra,
  primaryName,
  gotram,
  familyCount = 0,
}: {
  seva?: Seva;
  selectedDate?: string;
  dayNumber?: number;
  nakshatra?: string;
  primaryName?: string;
  gotram?: string;
  familyCount?: number;
}) {
  const locale = useLocale();
  const isTe = locale === 'te';

  const dakshina = seva ? seva.price : 0;

  return (
    <Card variant="gold-border" className="p-5 space-y-4 sticky top-24 bg-sacred-card">
      <div className="border-b border-gold/25 pb-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
          Booking Summary
        </span>
        <h4 className="font-cinzel text-lg font-bold text-gold-lighter mt-0.5">
          {seva ? (isTe ? seva.titleTe : seva.title) : 'Seva Not Selected'}
        </h4>
        {seva && (
          <span className="text-[11px] text-ivory/70 font-sans block mt-1">
            {isTe ? seva.shortDescTe : seva.shortDesc}
          </span>
        )}
      </div>

      <div className="space-y-2.5 text-xs text-ivory/80 font-sans">
        {selectedDate && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <Calendar className="w-3.5 h-3.5" /> Date:
            </span>
            <span className="font-semibold text-ivory text-right">
              {selectedDate} {dayNumber ? `(Day ${dayNumber})` : ''}
            </span>
          </div>
        )}

        {nakshatra && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <Star className="w-3.5 h-3.5" /> Nakshatram:
            </span>
            <span className="font-semibold text-gold-lighter">{nakshatra}</span>
          </div>
        )}

        {primaryName && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <User className="w-3.5 h-3.5" /> Devotee:
            </span>
            <span className="font-semibold text-ivory">{primaryName}</span>
          </div>
        )}

        {gotram && (
          <div className="flex items-center justify-between">
            <span className="text-gold-light">Gotram:</span>
            <span className="font-semibold text-ivory">{gotram}</span>
          </div>
        )}

        {familyCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gold-light">Sankalpam Names:</span>
            <span className="font-semibold text-ivory">{familyCount + 1} Registered</span>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="pt-3 border-t border-gold/20 space-y-2 text-xs">
        <div className="flex justify-between items-center text-sm font-bold text-gold-lighter">
          <span className="uppercase text-xs font-bold tracking-wider">Auspicious Dakshina:</span>
          <span className="font-cinzel text-xl text-gold font-black">{formatCurrency(dakshina)}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-burgundy-deep/90 border border-gold/25 flex items-center gap-2 text-[11px] text-ivory/75">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Consecrated Prasadam & digital seva receipt included.</span>
      </div>
    </Card>
  );
}
