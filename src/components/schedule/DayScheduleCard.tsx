'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ScheduleDay } from '@/types/schedule';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Flame, Star, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export function ScheduleHero() {
  const t = useTranslations('schedule');
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep py-12 md:py-16 text-center space-y-4 max-w-5xl mx-auto px-4 sm:px-6 shadow-2xl">
      {/* Background Sacred Motif / Glow */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero.png')" }}
      />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <Badge
          variant="gold"
          size="md"
          className={`tracking-widest uppercase inline-flex items-center gap-1.5 px-4 py-1.5 shadow-gold-sm ${
            isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-light" />
          {t('heroBadge')}
        </Badge>
        
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-wide ${
            isTe ? 'font-telugu leading-[1.4] py-1' : isHi ? 'font-hindi leading-[1.4] py-1' : 'font-cinzel'
          }`}
        >
          {t('title')}
        </h1>
        
        <p
          className={`text-sm sm:text-base md:text-lg text-gold-lighter/95 font-semibold max-w-3xl mx-auto ${
            isTe ? 'font-telugu leading-[1.6]' : isHi ? 'font-hindi leading-[1.6]' : 'font-cinzel'
          }`}
        >
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}

export function DayScheduleCard({ day }: { day: ScheduleDay }) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const t = useTranslations('schedule');

  const paddedDay = String(day.dayNumber).padStart(2, '0');
  const isOpening = day.dayNumber === 1;
  const isConcluding = day.dayNumber === 28;
  const isSpecial = day.isSpecial;

  // Target booking URL with parameters (no hardcoded price in schedule)
  const bookingUrl = `/book-seva?day=${day.dayNumber}&nakshatra=${encodeURIComponent(
    day.nakshatra
  )}${day.sevaSlug ? `&seva=${day.sevaSlug}` : ''}`;

  const dateText = isTe ? day.dateTe : isHi ? (day.dateHi || day.date) : day.date;
  const nakshatraText = isTe
    ? `${day.nakshatraTe} నక్షత్రం`
    : isHi
    ? `${day.nakshatraHi || day.nakshatra} नक्षत्र`
    : `${day.nakshatra.toUpperCase()} NAKSHATRAM`;
  const rasiText = isTe ? day.rasiTe : isHi ? (day.rasiHi || day.rasi) : day.rasi;
  const programmeText = isTe ? day.programmeTe : isHi ? (day.programmeHi || day.programme) : day.programme;
  const eveningProgrammeText = isTe ? day.eveningProgrammeTe : isHi ? (day.eveningProgrammeHi || day.eveningProgramme) : day.eveningProgramme;

  return (
    <div
      className={`h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 relative group border overflow-hidden ${
        isConcluding
          ? 'bg-gradient-to-b from-[#38000A] via-[#240006] to-[#1A0004] border-[#D6A532] shadow-[0_4px_24px_rgba(214,165,50,0.25)] ring-1 ring-[#D6A532]/60'
          : isOpening
          ? 'bg-gradient-to-b from-[#340009] via-[#240006] to-[#1A0004] border-[#D6A532]/85 shadow-[0_4px_20px_rgba(214,165,50,0.2)] ring-1 ring-[#D6A532]/40'
          : isSpecial
          ? 'bg-gradient-to-b from-[#2F0008] via-[#230005] to-[#1A0004] border-[#D6A532]/60 shadow-[0_4px_18px_rgba(214,165,50,0.15)]'
          : 'bg-gradient-to-b from-[#2B0007]/95 via-[#200005]/95 to-[#170003]/95 border-[#D6A532]/35 hover:border-[#D6A532]/70 shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Top Details & Content */}
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Row 1: Header (DAY Badge + Special Badge (Left) | Date (Right)) */}
        <div className="flex items-center justify-between gap-2 border-b border-[#D6A532]/25 pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Day Badge */}
            <span
              className={`text-xs font-black tracking-widest text-[#F2C14E] uppercase bg-[#3D000A] px-2 py-0.5 rounded border border-[#D6A532]/40 shadow-xs ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
              }`}
            >
              {t('day')} {paddedDay}
            </span>

            {/* Special Day Badge */}
            {isConcluding ? (
              <span
                className={`text-[9px] sm:text-[10px] font-black text-[#2B0005] uppercase tracking-wider bg-gradient-to-r from-[#F2C14E] via-[#FFDF79] to-[#F2C14E] px-2 py-0.5 rounded shadow-xs whitespace-nowrap ${
                  isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                }`}
              >
                {isTe ? 'మహా ముగింపు' : isHi ? 'भव्य समापन दिवस' : 'GRAND CONCLUDING'}
              </span>
            ) : isOpening ? (
              <span
                className={`text-[9px] sm:text-[10px] font-black text-[#2B0005] uppercase tracking-wider bg-gradient-to-r from-[#F2C14E] to-[#D6A532] px-2 py-0.5 rounded shadow-xs whitespace-nowrap ${
                  isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                }`}
              >
                {isTe ? 'ప్రారంభ దినం' : isHi ? 'उद्घाटन दिवस' : 'OPENING DAY'}
              </span>
            ) : isSpecial ? (
              <span
                className={`text-[9px] sm:text-[10px] font-bold text-[#F2C14E] uppercase tracking-wider bg-[#D6A532]/15 px-1.5 py-0.5 rounded border border-[#D6A532]/30 whitespace-nowrap ${
                  isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                }`}
              >
                {isTe ? 'విశేషం' : isHi ? 'विशेष' : 'SPECIAL'}
              </span>
            ) : null}
          </div>

          {/* Date with Calendar icon */}
          <span
            className={`text-xs text-[#FAF4E6]/90 font-medium flex items-center gap-1 shrink-0 ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
            {dateText}
          </span>
        </div>

        {/* Row 2: Nakshatra Heading (Line 1) & Rashi (Line 2 below) */}
        <div className="w-full max-w-full min-w-0 pt-0.5 space-y-0.5">
          <div
            className={`flex items-center gap-1 text-sm sm:text-[15px] text-[#F2C14E] font-bold uppercase tracking-wider ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}
          >
            <span className="text-[#F2C14E] text-sm leading-none shrink-0">☆</span>
            <span className="break-words line-clamp-1">{nakshatraText}</span>
          </div>

          <p
            className={`text-[#FAF4E6]/70 text-xs font-medium pl-4 break-words ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}
          >
            ({rasiText})
          </p>
        </div>

        {/* Row 3: Main Programme Description */}
        <div className="flex-1 py-1">
          <p
            className={`text-xs text-[#FAF4E6]/90 leading-relaxed font-normal ${
              isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-sans'
            }`}
          >
            {programmeText}
          </p>
        </div>

        {/* Row 4: Evening Programme Divider & Text */}
        <div className="pt-2 border-t border-[#D6A532]/25">
          <p
            className={`text-xs text-[#F2C14E]/90 leading-relaxed italic ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}
          >
            {eveningProgrammeText}
          </p>
        </div>
      </div>

      {/* Bottom Section: Status + Action Row */}
      <div className="mt-3 space-y-2.5">
        {/* Row 5: Status Row & Pending Tickets Counter */}
        <div className="pt-2 border-t border-[#D6A532]/25 flex items-center justify-between gap-2">
          {(() => {
            const activeSevas = ((day as any).assigned_sevas || [])
              .filter((s: any) => s && s.status !== 'HIDDEN' && (s.amount > 0 || s.price > 0))
              .sort((a: any, b: any) => (a.amount || a.price || 0) - (b.amount || b.price || 0));
            const totalAvailable = activeSevas.reduce((sum: number, s: any) => sum + (s.available_slots || 0), 0);
            const hasSevas = activeSevas.length > 0;

            if (hasSevas && totalAvailable === 0) {
              return (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
                  {isTe ? 'పూర్తిగా బుక్ అయ్యాయి (SOLD OUT)' : 'SOLD OUT'}
                </span>
              );
            }

            if (hasSevas && totalAvailable <= 10) {
              return (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                  🔥 {isTe ? `కేవలం ${totalAvailable} టిక్కెట్లు మాత్రమే ఉన్నాయి!` : `Only ${totalAvailable} Slots Left!`}
                </span>
              );
            }

            return (
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                {hasSevas ? (isTe ? `${totalAvailable} టిక్కెట్లు అందుబాటులో ఉన్నాయి` : `🎟️ ${totalAvailable} Tickets Available`) : (isTe ? 'అందుబాటులో ఉంది' : isHi ? 'उपलब्ध' : 'AVAILABLE')}
              </span>
            );
          })()}
        </div>

        {/* Row 6: Action Row (VIEW DETAILS → on Left | 🪔 BOOK NOW on Right) */}
        <div className="pt-2 border-t border-[#D6A532]/25 flex items-center justify-between gap-1.5 min-w-0">
          {/* VIEW DETAILS */}
          <Link
            href={`/schedule/${day.dayNumber}`}
            className={`text-[11px] sm:text-xs font-bold text-[#F2C14E] hover:text-[#FAF4E6] flex items-center gap-1 group/link transition-colors py-1 shrink-0 ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}
          >
            <span className="truncate">{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
          </Link>

          {/* 🪔 BOOK NOW BUTTON */}
          <Link href={bookingUrl} className="shrink-0">
            <button
              type="button"
              className={`whitespace-nowrap inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#2B0005] font-black text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(214,165,50,0.4)] hover:shadow-[0_0_20px_rgba(214,165,50,0.7)] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
              }`}
            >
              <span className="text-xs leading-none">🪔</span>
              <span>{isTe ? 'బుక్ చేయండి' : isHi ? 'बुक करें' : 'BOOK NOW'}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
