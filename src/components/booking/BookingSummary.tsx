'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Calendar, User, ShieldCheck, Star, Sparkles } from 'lucide-react';

export interface BookingSummaryProps {
  sevaTitle?: string;
  sevaTitleTe?: string;
  sevaTitleHi?: string;
  sevaDesc?: string;
  sevaDescTe?: string;
  sevaDescHi?: string;
  dakshina?: number;
  selectedDate?: string;
  dayNumber?: number;
  nakshatra?: string;
  nakshatraTe?: string;
  dayTypeLabel?: string;
  specialSeva?: string | null;
  primaryName?: string;
  gotram?: string;
  familyCount?: number;
}

export function BookingSummaryCard({
  sevaTitle = 'Seva Not Selected',
  sevaTitleTe,
  sevaTitleHi,
  sevaDesc,
  sevaDescTe,
  sevaDescHi,
  dakshina = 0,
  selectedDate,
  dayNumber,
  nakshatra,
  nakshatraTe,
  dayTypeLabel,
  specialSeva,
  primaryName,
  gotram,
  familyCount = 0,
}: BookingSummaryProps) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const displayTitle = isTe ? (sevaTitleTe || sevaTitle) : isHi ? (sevaTitleHi || sevaTitle) : sevaTitle;
  const displayDesc = isTe ? (sevaDescTe || sevaDesc) : isHi ? (sevaDescHi || sevaDesc) : sevaDesc;
  const displayNakshatra = isTe ? (nakshatraTe || nakshatra) : nakshatra;

  return (
    <Card variant="gold-border" className="p-5 space-y-4 sticky top-24 bg-sacred-card shadow-gold-sm">
      <div className="border-b border-gold/25 pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold block font-cinzel">
            {isTe ? 'బుకింగ్ సారాంశం' : isHi ? 'बुकिंग सारांश' : 'Booking Summary'}
          </span>
          {dayTypeLabel && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gold/15 text-gold-light border border-gold/30 uppercase tracking-wider">
              {dayTypeLabel}
            </span>
          )}
        </div>
        <h4 className="font-cinzel text-base sm:text-lg font-bold text-gold-lighter mt-1 leading-snug">
          {displayTitle}
        </h4>
        {displayDesc && (
          <span className="text-[11px] text-ivory/70 font-sans block mt-1 leading-relaxed">
            {displayDesc}
          </span>
        )}
      </div>

      <div className="space-y-2.5 text-xs text-ivory/80 font-sans">
        {selectedDate && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <Calendar className="w-3.5 h-3.5 text-gold" /> {isTe ? 'తేదీ:' : isHi ? 'तिथि:' : 'Date:'}
            </span>
            <span className="font-semibold text-ivory text-right">
              {selectedDate} {dayNumber ? `(Day ${dayNumber})` : ''}
            </span>
          </div>
        )}

        {nakshatra && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <Star className="w-3.5 h-3.5 text-gold fill-gold/30" /> {isTe ? 'నక్షత్రం:' : isHi ? 'नक्षत्र:' : 'Nakshatram:'}
            </span>
            <span className="font-bold text-gold-lighter">{displayNakshatra}</span>
          </div>
        )}

        {specialSeva && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> {isTe ? 'విశేష సేవ:' : isHi ? 'विशेष सेवा:' : 'Special:'}
            </span>
            <span className="font-semibold text-gold-light text-right">{specialSeva}</span>
          </div>
        )}

        {primaryName && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gold-light">
              <User className="w-3.5 h-3.5 text-gold" /> {isTe ? 'భక్తుని పేరు:' : isHi ? 'भक्त का नाम:' : 'Devotee:'}
            </span>
            <span className="font-semibold text-ivory">{primaryName}</span>
          </div>
        )}

        {gotram && (
          <div className="flex items-center justify-between">
            <span className="text-gold-light">{isTe ? 'గోత్రం:' : isHi ? 'गोत्र:' : 'Gotram:'}</span>
            <span className="font-semibold text-ivory">{gotram}</span>
          </div>
        )}

        {familyCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gold-light">{isTe ? 'సంకల్ప నామాలు:' : isHi ? 'संकल्प नाम:' : 'Sankalpam Names:'}</span>
            <span className="font-semibold text-ivory">{familyCount + 1} {isTe ? 'నమోదయ్యాయి' : 'Registered'}</span>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="pt-3 border-t border-gold/20 space-y-2 text-xs">
        <div className="flex justify-between items-center text-sm font-bold text-gold-lighter">
          <span className="uppercase text-xs font-bold tracking-wider">
            {isTe ? 'దక్షిణ సమర్పణ:' : isHi ? 'दक्षिणा:' : 'Auspicious Dakshina:'}
          </span>
          <span className="font-cinzel text-xl text-gold font-black">{formatCurrency(dakshina)}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-burgundy-deep/90 border border-gold/25 flex items-center gap-2 text-[11px] text-ivory/75">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{isTe ? 'యజ్ఞ ప్రసాదం & డిజిటల్ రసీదు అందించబడును.' : 'Consecrated Prasadam & digital seva receipt included.'}</span>
      </div>
    </Card>
  );
}
