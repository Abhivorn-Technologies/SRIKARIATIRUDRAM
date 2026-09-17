'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  PROGRAMME_28_DAYS,
  ProgrammeDayOption,
  getNakshatraBookingOptions,
  NakshatraBookingInfo,
  ApplicableSevaOption,
} from '@/data/nakshatras';
import { bookingService } from '@/services/booking.service';
import { getSevaLockInfo } from '@/services/specialSevaBooking.service';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Star,
  Search,
  Flame,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';

import { useDevoteeAuth } from '@/context/DevoteeAuthContext';

export default function SelectNakshatraAndSevaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const { session, isLoading } = useDevoteeAuth();

  useEffect(() => {
    if (!isLoading && !session?.phone) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : `/${locale}/book-seva/date`;
      router.push(`/${locale}/account/login?mode=signup&redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [session, isLoading, locale, router]);

  const dayParam = searchParams.get('day');
  const nakshatraParam = searchParams.get('nakshatra');
  const dateParam = searchParams.get('date');
  const sevaParam = searchParams.get('seva');

  // Search/Filter state for 28 programme days
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Day Number (1 to 28)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    if (dayParam) {
      const parsed = parseInt(dayParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 28) return parsed;
    }
    if (nakshatraParam) {
      const clean = nakshatraParam.toLowerCase().replace(/[^a-z]/g, '');
      if (clean.includes('28') || clean.includes('concluding')) return 28;
      const match = PROGRAMME_28_DAYS.find(
        (d) => d.nameEn.toLowerCase().replace(/[^a-z]/g, '') === clean
      );
      if (match) return match.dayNumber;
    }
    if (dateParam) {
      const match = PROGRAMME_28_DAYS.find(
        (d) => d.date.toLowerCase() === dateParam.toLowerCase() || String(d.dayNumber) === dateParam
      );
      if (match) return match.dayNumber;
    }
    const draft = bookingService.getActiveDraft();
    if (draft.dayNumber && draft.dayNumber >= 1 && draft.dayNumber <= 28) {
      return draft.dayNumber;
    }
    return 1; // Default to Day 1 Rohini
  });

  // Lock day selection state (locked by default when booking a day so user cannot select other days)
  const [isDayLocked, setIsDayLocked] = useState<boolean>(true);

  const [dbAssignedSevas, setDbAssignedSevas] = useState<ApplicableSevaOption[]>([]);

  // Fetch live assigned sevas from API for selectedDayNumber
  useEffect(() => {
    async function loadAssignedSevas() {
      try {
        const res = await fetch('/api/schedule');
        const json = await res.json();
        if (json.success && json.data) {
          const dayMatch = json.data.find((d: any) => d.day_number === selectedDayNumber);
          if (dayMatch && dayMatch.assigned_sevas && dayMatch.assigned_sevas.length > 0) {
            const formatted: ApplicableSevaOption[] = dayMatch.assigned_sevas
              .filter((sa: any) => sa && sa.status !== 'HIDDEN' && (sa.amount > 0 || sa.price > 0))
              .map((sa: any) => ({
                id: sa.seva_id,
                slug: sa.slug || sa.seva_id,
                title: sa.title,
                titleTe: sa.title_te || sa.title,
                titleHi: sa.title,
                price: sa.amount,
                description: sa.short_desc || `Sacred Seva offering for Day ${selectedDayNumber}.`,
                descriptionTe: sa.short_desc_te || `విశేష సేవ`,
                descriptionHi: sa.short_desc || `विशेष सेवा`,
                isSpecial: sa.category !== 'homam',
                availableSlots: sa.available_slots,
                status: sa.status
              }));
            setDbAssignedSevas(formatted);
          }
        }
      } catch (e) {
        console.warn('Failed to load dynamic day sevas:', e);
      }
    }
    loadAssignedSevas();
  }, [selectedDayNumber]);

  // Auto-resolve Day, Date, Rasi, DayType, Programme Highlights and Available Sevas
  const bookingOptions: NakshatraBookingInfo = useMemo(() => {
    const opts = getNakshatraBookingOptions(selectedDayNumber);
    if (dbAssignedSevas && dbAssignedSevas.length > 0) {
      return {
        ...opts,
        availableSevas: [...dbAssignedSevas].sort((a, b) => a.price - b.price)
      };
    }
    return {
      ...opts,
      availableSevas: [...opts.availableSevas].sort((a, b) => a.price - b.price)
    };
  }, [selectedDayNumber, dbAssignedSevas]);

  // Selected Seva option within available sevas
  const [selectedSeva, setSelectedSeva] = useState<ApplicableSevaOption>(() => {
    const draft = bookingService.getActiveDraft();
    const opts = getNakshatraBookingOptions(selectedDayNumber);

    if (sevaParam) {
      const match = opts.availableSevas.find(
        (s) => s.slug.toLowerCase() === sevaParam.toLowerCase() || s.id.toLowerCase() === sevaParam.toLowerCase()
      );
      if (match) return match;
    }

    if (draft.sevaSlug || draft.sevaId) {
      const match = opts.availableSevas.find(
        (s) => s.slug === draft.sevaSlug || s.id === draft.sevaId
      );
      if (match) return match;
    }

    return opts.availableSevas[0];
  });

  const sevaLockInfo = useMemo(() => {
    return getSevaLockInfo(selectedSeva?.id || selectedSeva?.slug || selectedSeva?.title);
  }, [selectedSeva]);

  // Lock selectedDayNumber if Seva is locked to specific day(s)
  useEffect(() => {
    if (sevaLockInfo && !sevaLockInfo.allowedDays.includes(selectedDayNumber)) {
      setSelectedDayNumber(sevaLockInfo.defaultDay);
    }
  }, [sevaLockInfo, selectedDayNumber]);

  // When selectedDayNumber or bookingOptions change, ensure selectedSeva is valid
  useEffect(() => {
    const stillValid = bookingOptions.availableSevas.find((s) => s.id === selectedSeva.id || s.slug === selectedSeva.slug);
    if (!stillValid && bookingOptions.availableSevas.length > 0) {
      const paramMatch = sevaParam ? bookingOptions.availableSevas.find(s => s.slug.toLowerCase() === sevaParam.toLowerCase() || s.id.toLowerCase() === sevaParam.toLowerCase()) : null;
      setSelectedSeva(paramMatch || bookingOptions.availableSevas[0]);
    }
  }, [selectedDayNumber, bookingOptions.availableSevas, selectedSeva.id, selectedSeva.slug, sevaParam]);

  // Filtered Programme Days list (28 days)
  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) return PROGRAMME_28_DAYS;
    const q = searchQuery.toLowerCase().trim();
    return PROGRAMME_28_DAYS.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameTe.toLowerCase().includes(q) ||
        (d.nameHi && d.nameHi.toLowerCase().includes(q)) ||
        String(d.dayNumber).includes(q) ||
        `day ${d.dayNumber}`.includes(q) ||
        d.dayTypeLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectDay = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    const opts = getNakshatraBookingOptions(dayNum);
    const chosenSeva = opts.availableSevas.find((s) => s.id === selectedSeva.id) || opts.availableSevas[0];

    const newUrl = `/${locale}/book-seva/date?day=${dayNum}&nakshatra=${encodeURIComponent(opts.nakshatra)}&seva=${chosenSeva.slug}`;
    router.replace(newUrl, { scroll: false });

    bookingService.saveActiveDraft({
      nakshatra: opts.nakshatra,
      janmaNakshatra: opts.nakshatra,
      dayNumber: opts.dayNumber,
      selectedDate: opts.date,
      rasi: opts.rasi,
      dayType: opts.dayType,
      specialProgramme: opts.specialSeva || undefined,
      sevaId: chosenSeva.id,
      sevaSlug: chosenSeva.slug,
      sevaName: chosenSeva.title,
      amount: chosenSeva.price,
    });
  };

  const handleSelectSevaOption = (seva: ApplicableSevaOption) => {
    setSelectedSeva(seva);
    bookingService.saveActiveDraft({
      sevaId: seva.id,
      sevaSlug: seva.slug,
      sevaName: seva.title,
      amount: seva.price,
      nakshatra: bookingOptions.nakshatra,
      janmaNakshatra: bookingOptions.nakshatra,
      dayNumber: bookingOptions.dayNumber,
      selectedDate: bookingOptions.date,
      rasi: bookingOptions.rasi,
      dayType: bookingOptions.dayType,
      specialProgramme: bookingOptions.specialSeva || undefined,
    });
  };

  const handleContinue = () => {
    bookingService.saveActiveDraft({
      sevaId: selectedSeva.id,
      sevaSlug: selectedSeva.slug,
      sevaName: selectedSeva.title,
      amount: selectedSeva.price,
      nakshatra: bookingOptions.nakshatra,
      janmaNakshatra: bookingOptions.nakshatra,
      dayNumber: bookingOptions.dayNumber,
      selectedDate: bookingOptions.date,
      rasi: bookingOptions.rasi,
      dayType: bookingOptions.dayType,
      specialProgramme: bookingOptions.specialSeva || undefined,
    });
    router.push(`/${locale}/book-seva/details`);
  };

  const isVisesha = bookingOptions.dayType === 'VISESHA';
  const isKalyanam = bookingOptions.dayType === 'KALYANAM';
  const isConcluding = bookingOptions.dayType === 'CONCLUDING';

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>
              {isTe
                ? '← 28 రోజుల షెడ్యూల్‌కు తిరిగి వెళ్ళు'
                : isHi
                ? '← 28-दिवसीय कार्यक्रम पर वापस जाएं'
                : '← Back to 28-Day Schedule'}
            </span>
          </Link>
        </div>

        {/* Progress Stepper */}
        <BookingStepper currentStep={1} />

        {/* SELECT JANMA NAKSHATRA (ALL 28 PROGRAMME DAYS) */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F2C14E]">
                <Star className="w-5 h-5 fill-[#F2C14E]/20" />
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                  {isTe ? 'జన్మ నక్షత్రం / యజ్ఞ దినాన్ని ఎంచుకోండి' : isHi ? 'जन्म नक्षत्र / महायज्ञ दिवस चुनें' : 'SELECT YOUR JANMA NAKSHATRA / PROGRAMME DAY'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
                {isTe
                  ? 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞం 28 రోజుల పవిత్ర కార్యక్రమంలో మీ జన్మ నక్షత్ర దినాన్ని ఎంచుకోండి (25 నవంబర్ – 22 డిసెంబర్ 2026).'
                  : isHi
                  ? '28 दिवसीय महायज्ञ (25 नवम्बर – 22 दिसम्बर 2026) में अपने जन्म नक्षत्र दिवस का चयन करें।'
                  : 'Select your birth star or auspicious programme day from the 28-Day Mahayagnam schedule (25 November – 22 December 2026).'}
              </p>
            </div>

            {/* Star Search Bar */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6A532]/60" />
              <input
                type="text"
                placeholder={isTe ? 'నక్షత్రం లేదా రోజు వెతకండి...' : isHi ? 'नक्षत्र या दिवस खोजें...' : 'Search Nakshatra / Day...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1F0205] border border-[#D6A532]/30 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#FFF8E8] placeholder:text-[#FFF8E8]/40 focus:outline-none focus:border-[#F2C14E]"
              />
            </div>
          </div>

          {/* Active Selected Day Indicator Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#5A0714] via-[#4A0A14] to-[#35030A] border border-[#F2C14E] flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center font-bold font-mono text-xs shadow shrink-0">
                {selectedDayNumber}
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#E8C76A] block">
                  {isTe ? 'సక్రియ దినం & నక్షత్రం' : 'ACTIVE PROGRAMME DAY & NAKSHATRA'}
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-black text-[#FAF4E6]">
                  DAY {bookingOptions.dayNumber} — {bookingOptions.nakshatra} ({bookingOptions.date})
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDayLocked(!isDayLocked)}
              className={`text-[11px] font-sans font-bold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isDayLocked
                  ? 'bg-[#F2C14E]/15 border-[#F2C14E]/60 text-[#F2C14E] hover:bg-[#F2C14E]/25'
                  : 'bg-[#5A0714] border-[#D6A532]/60 text-[#FAF4E6] hover:bg-[#8B1E2D]'
              }`}
            >
              {isDayLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>{isTe ? '✓ దినం స్థిరీకరించబడింది (అన్‌లాక్ చేయడానికి క్లిక్ చేయండి)' : '✓ DAY NAKSHATRA LOCKED (Click to Unlock)'}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-[#E8C76A]" />
                  <span>{isTe ? 'అన్‌లాక్ చేయబడింది (ఇతర రోజు ఎంచుకోవచ్చు)' : 'UNLOCKED (Click to Lock)'}</span>
                </>
              )}
            </button>
          </div>

          {/* 28 Programme Days Grid (Zero clipping, natural flow) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {filteredDays.map((d) => {
              const isSelected = selectedDayNumber === d.dayNumber;
              const isConcludingCard = d.dayNumber === 28;
              const isDisabled = isDayLocked && !isSelected;

              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelectDay(d.dayNumber)}
                  className={`group relative flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all duration-200 select-none min-h-[110px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#5A0714] to-[#3B040B] border-[#F2C14E] shadow-[0_0_18px_rgba(214,165,50,0.5)] ring-2 ring-[#D6A532] scale-[1.03]'
                      : isDisabled
                      ? 'bg-[#1F0205]/40 border-[#D6A532]/10 opacity-30 cursor-not-allowed pointer-events-none'
                      : isConcludingCard
                      ? 'bg-[#3A040B]/90 border-[#F2C14E]/40 hover:border-[#F2C14E] hover:bg-[#4A0714] cursor-pointer'
                      : 'bg-[#230206]/90 border-[#D6A532]/25 hover:border-[#D6A532]/60 hover:bg-[#35030A] cursor-pointer'
                  }`}
                >
                  {/* Top Badge: Day Number */}
                  <span
                    className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#F2C14E] text-[#280509]'
                        : isDisabled
                        ? 'bg-[#5A0714]/30 text-[#E8C76A]/40'
                        : isConcludingCard
                        ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/50'
                        : d.isSpecial
                        ? 'bg-[#8B1E2D] text-[#FAF4E6]'
                        : 'bg-[#5A0714]/60 text-[#E8C76A]/90'
                    }`}
                  >
                    DAY {d.dayNumber}
                  </span>

                  {/* Star Name */}
                  <div className="my-1 space-y-0.5">
                    <span
                      className={`font-cinzel text-xs sm:text-sm font-black block leading-tight ${
                        isSelected ? 'text-[#F2C14E]' : isDisabled ? 'text-[#FAF4E6]/40' : 'text-[#FAF4E6]'
                      }`}
                    >
                      {d.nameEn}
                    </span>
                    <span className={`font-sans text-[10px] font-medium block ${isDisabled ? 'text-[#E8C76A]/30' : 'text-[#E8C76A]/80'}`}>
                      {isTe ? d.nameTe : isHi ? (d.nameHi || d.nameEn) : d.nameTe}
                    </span>
                  </div>

                  {/* Rasi Label */}
                  <span
                    className={`text-[9px] font-sans truncate max-w-full px-1 ${
                      isSelected ? 'text-[#FAF4E6] font-semibold' : isDisabled ? 'text-[#FFF8E8]/30' : 'text-[#FFF8E8]/60'
                    }`}
                  >
                    {d.rasi}
                  </span>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Locked indicator when disabled */}
                  {isDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1F0205]/20 rounded-xl">
                      <Lock className="w-3.5 h-3.5 text-[#D6A532]/40" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* CORRESPONDING DAY & REGULAR / VISESHA / CONCLUDING IDENTIFICATION BANNER */}
        <div
          className={`rounded-2xl border-2 p-6 sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4 transition-all ${
            isConcluding
              ? 'bg-gradient-to-r from-[#5A0714] via-[#6B0B19] to-[#3B040B] border-[#F2C14E]'
              : isVisesha
              ? 'bg-gradient-to-r from-[#500812] via-[#660B18] to-[#3B040B] border-[#F2C14E]'
              : isKalyanam
              ? 'bg-gradient-to-r from-[#4A0A14] via-[#5C0A19] to-[#35030A] border-[#E8C76A]'
              : 'bg-gradient-to-r from-[#4A0A14] via-[#5A0714] to-[#35030A] border-[#D6A532]/60'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6A532]/25 pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant="gold"
                  size="sm"
                  className="font-cinzel uppercase font-bold tracking-widest px-2.5 py-0.5"
                >
                  {isTe
                    ? bookingOptions.dayTypeLabelTe
                    : isHi
                    ? bookingOptions.dayTypeLabelHi
                    : bookingOptions.dayTypeLabel}
                </Badge>
                {isConcluding && (
                  <span className="flex items-center gap-1 text-[11px] text-[#F2C14E] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isTe ? 'మహా పూర్ణాహుతి & కళ్యాణం' : 'Maha Purnahuti & Kalyanam'}
                  </span>
                )}
                {isVisesha && (
                  <span className="flex items-center gap-1 text-[11px] text-[#F2C14E] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isTe ? 'విశేష హోమం సహితం' : 'Special Homam Included'}
                  </span>
                )}
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532]">
                {bookingOptions.nakshatra} — Day {bookingOptions.dayNumber}
              </h2>
            </div>

            <div className="text-left md:text-right space-y-1">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'మహాయజ్ఞ తేదీ & రాశి' : isHi ? 'महायज्ञ तिथि एवं राशि' : 'MAHAYAGNAM DATE & RASI'}
              </span>
              <div className="font-cinzel text-base sm:text-lg font-bold text-[#FAF4E6] flex items-center md:justify-end gap-2">
                <CalendarIcon className="w-4 h-4 text-[#F2C14E]" />
                <span>{bookingOptions.date} ({bookingOptions.dayOfWeek})</span>
              </div>
              <span className="text-xs text-[#F2C14E] font-sans font-semibold block">
                {isTe ? `రాశి: ${bookingOptions.rasiTe}` : `Rasi: ${bookingOptions.rasi}`}
              </span>
            </div>
          </div>

          {/* Day 28 Special Concluding Programme Box */}
          {isConcluding && bookingOptions.programmeHighlights && (
            <div className="p-4 rounded-xl bg-[#230206]/90 border border-[#F2C14E]/50 space-y-2.5">
              <div className="flex items-center gap-2 text-[#F2C14E] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#F2C14E]" />
                <span>Grand Concluding Day Programme Schedule:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAF4E6]/90 font-sans">
                {bookingOptions.programmeHighlights.map((prog, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                    <span>{prog}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visesha / Special Homam Details Notice for days 1-27 */}
          {!isConcluding && bookingOptions.specialSeva && (
            <div className="p-3.5 rounded-xl bg-[#230206]/80 border border-[#F2C14E]/40 flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#F2C14E] shrink-0" />
              <p className="text-xs sm:text-sm text-[#FFF8E8]/90 font-sans">
                <strong className="text-[#F2C14E] font-cinzel">
                  {isTe ? bookingOptions.specialSevaTe : bookingOptions.specialSeva}
                </strong>
                {' — '}
                {isTe
                  ? 'ఈ పవిత్ర దినాన సంపూర్ణ నక్షత్ర శాంతితో పాటు విశేష హోమ పూజలు సమర్పించబడతాయి.'
                  : 'Special auspicious remedial homam is consecrated alongside Nakshatra Shanthi on this day.'}
              </p>
            </div>
          )}
        </div>

        {/* SHOW AVAILABLE SEVAS CARDS */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-[#F2C14E]">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                {isTe ? 'లభ్యమయ్యే సేవలు' : isHi ? 'उपलब्ध सेवाएँ' : 'SELECT YOUR SEVA FOR THIS DAY'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
              {isConcluding
                ? (isTe
                    ? 'ముగింపు దినమున నిర్వహించే శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణ సేవను ఎంచుకోండి.'
                    : 'Grand concluding day offers the sacred Sri Parvathi–Parameswara Maha Shanti Kalyanam Seva.')
                : (isTe
                    ? 'మీరు ఎంచుకున్న జన్మ నక్షత్ర దినమున నిర్వహించే సేవను ఎంచుకోండి.'
                    : 'Select the Seva you wish to sponsor for this Nakshatra Day.')}
            </p>
          </div>

          {/* Sevas Options Grid */}
          <div
            className={`grid gap-4 sm:gap-5 ${
              bookingOptions.availableSevas.length === 1
                ? 'grid-cols-1 max-w-xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {bookingOptions.availableSevas.map((seva) => {
              const isSelected = selectedSeva.id === seva.id;

              return (
                <div
                  key={seva.id}
                  onClick={() => handleSelectSevaOption(seva)}
                  className={`group relative rounded-2xl p-5 sm:p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#5A0714] to-[#38040B] border-[#F2C14E] shadow-[0_0_25px_rgba(214,165,50,0.5)] ring-2 ring-[#D6A532] scale-[1.02]'
                      : 'bg-[#230206]/95 border-[#D6A532]/30 hover:border-[#D6A532]/70 hover:bg-[#35030A]'
                  }`}
                >
                  {/* Top Header & Tag */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      {seva.tag ? (
                        <span className="text-[10px] uppercase font-sans font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F2C14E] text-[#280509]">
                          {isTe ? (seva.tagTe || seva.tag) : seva.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-[#5A0714] text-[#E8C76A]/90">
                          {isTe ? 'నక్షత్ర సేవ' : 'Nakshatra Seva'}
                        </span>
                      )}

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shrink-0 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-cinzel text-lg sm:text-xl font-black text-[#FAF4E6] group-hover:text-[#F2C14E] transition-colors leading-snug">
                        {isTe ? seva.titleTe : isHi ? seva.titleHi : seva.title}
                      </h3>
                      <p className="text-xs text-[#FFF8E8]/75 font-sans mt-1.5 leading-relaxed">
                        {isTe ? seva.descriptionTe : isHi ? seva.descriptionHi : seva.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Selection Indicator */}
                  <div className="pt-4 mt-4 border-t border-[#D6A532]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                        {isTe ? 'విరాళం' : 'Contribution'}
                      </span>
                      <span className="font-cinzel text-xl sm:text-2xl font-black text-[#F2C14E]">
                        {formatCurrency(seva.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSevaOption(seva);
                      }}
                      className={`text-xs font-cinzel font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                        isSelected
                          ? 'bg-[#F2C14E] text-[#280509]'
                          : 'border border-[#D6A532]/50 text-[#FAF4E6] group-hover:bg-[#5A0714]'
                      }`}
                    >
                      {isSelected ? (isTe ? 'ఎంచుకున్నారు ✓' : 'Selected ✓') : (isTe ? 'ఎంచుకోండి' : 'Select')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary & Continue Button */}
          <div className="pt-4 border-t border-[#D6A532]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'ఎంచుకున్న సేవ & మొత్తం' : 'SELECTED SEVA & CONTRIBUTION'}
              </span>
              <div className="font-cinzel text-sm sm:text-base font-bold text-[#FAF4E6] flex items-center gap-2">
                <span>{selectedSeva.title}</span>
                <span className="text-[#F2C14E] font-black font-cinzel">({formatCurrency(selectedSeva.price)})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer"
            >
              <span>{isTe ? 'సంకల్ప వివరాల నమోదుకు కొనసాగండి' : isHi ? 'संकल्प विवरण की ओर बढ़ें' : 'CONTINUE TO SANKALPAM DETAILS'}</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
