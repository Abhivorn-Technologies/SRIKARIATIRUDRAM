'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { sevasList } from '@/data/sevas';
import { PROGRAMME_28_DAYS, ProgrammeDayOption } from '@/data/nakshatras';
import { specialSevaBookingService, getSevaLockInfo } from '@/services/specialSevaBooking.service';
import { SpecialSevaStepper } from '@/components/special-seva/SpecialSevaStepper';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Star,
  Search,
  Sparkles,
  Flame,
  Lock,
} from 'lucide-react';

import { useDevoteeAuth } from '@/context/DevoteeAuthContext';

export default function SpecialSevaDaySelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const { session, isLoading } = useDevoteeAuth();

  useEffect(() => {
    if (!isLoading && !session?.phone) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : `/${locale}/special-seva-booking/day`;
      router.push(`/${locale}/account/login?mode=signup&redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [session, isLoading, locale, router]);

  const sevaParam = searchParams.get('seva');
  const dayParam = searchParams.get('day');

  // Dynamic Sevas from DB
  const [allSevas, setAllSevas] = useState<any[]>(sevasList);
  const [isLoadingSevas, setIsLoadingSevas] = useState<boolean>(true);

  // Search/Filter state for 28 programme days
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Special Seva
  const [selectedSeva, setSelectedSeva] = useState<any>(() => {
    if (sevaParam) {
      const match = sevasList.find(
        (s) => s.slug.toLowerCase() === sevaParam.toLowerCase() || s.id.toLowerCase() === sevaParam.toLowerCase()
      );
      if (match) return match;
    }
    const draft = specialSevaBookingService.getActiveDraft();
    const match = sevasList.find((s) => s.slug === draft.sevaSlug || s.id === draft.sevaId);
    return match || sevasList[0];
  });

  // Selected Day (1 to 28) — starts as dayParam or draft.selectedDay or null/1
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(() => {
    if (dayParam) {
      const parsed = parseInt(dayParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 28) return parsed;
    }
    const draft = specialSevaBookingService.getActiveDraft();
    if (draft.selectedDay && draft.selectedDay >= 1 && draft.selectedDay <= 28) {
      return draft.selectedDay;
    }
    return 1; // Default to Day 1
  });

  // Fetch dynamic sevas from Database
  useEffect(() => {
    async function loadDynamicSevas() {
      try {
        const res = await fetch('/api/admin/sevas');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const activeOnly = json.data.filter((s: any) => s.active !== false);
          if (activeOnly.length > 0) {
            setAllSevas(activeOnly.map((s: any) => ({
              id: s.id,
              slug: s.slug,
              title: s.title,
              titleTe: s.title_te || s.title,
              titleHi: s.title_hi || s.title,
              price: Number(s.amount),
              amount: Number(s.amount),
              shortDesc: s.short_desc || '',
              shortDescTe: s.short_desc_te || s.short_desc || '',
              shortDescHi: s.short_desc_hi || s.short_desc || '',
              category: s.category || 'homam',
            })));
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic sevas, fallback to static:', err);
      } finally {
        setIsLoadingSevas(false);
      }
    }
    loadDynamicSevas();
  }, []);

  // Update selectedSeva when dynamic sevas load or sevaParam changes
  useEffect(() => {
    if (allSevas.length === 0) return;
    if (sevaParam) {
      const match = allSevas.find(
        (s) => s.slug.toLowerCase() === sevaParam.toLowerCase() || s.id.toLowerCase() === sevaParam.toLowerCase()
      );
      if (match) {
        setSelectedSeva(match);
        return;
      }
    }
    const draft = specialSevaBookingService.getActiveDraft();
    const match = allSevas.find((s) => s.slug === draft.sevaSlug || s.id === draft.sevaId);
    if (match) {
      setSelectedSeva(match);
    }
  }, [allSevas, sevaParam]);

  const sevaLockInfo = useMemo(() => {
    return getSevaLockInfo(selectedSeva?.id || selectedSeva?.slug || selectedSeva?.title);
  }, [selectedSeva]);

  // Lock selectedDayNumber if Seva is locked to specific day(s)
  useEffect(() => {
    if (sevaLockInfo) {
      if (!selectedDayNumber || !sevaLockInfo.allowedDays.includes(selectedDayNumber)) {
        const targetDay = sevaLockInfo.defaultDay;
        setSelectedDayNumber(targetDay);
        const targetDayInfo = PROGRAMME_28_DAYS.find((d) => d.dayNumber === targetDay) || PROGRAMME_28_DAYS[targetDay - 1];
        specialSevaBookingService.saveActiveDraft({
          sevaId: selectedSeva.id,
          sevaSlug: selectedSeva.slug,
          sevaName: selectedSeva.title,
          amount: selectedSeva.price || selectedSeva.amount,
          selectedDay: targetDay,
          selectedDate: targetDayInfo.date,
          mahayajnamNakshatra: targetDayInfo.nameEn,
          nakshatra: targetDayInfo.nameEn,
          ...(sevaLockInfo.lockedNakshatra ? { janmaNakshatra: sevaLockInfo.lockedNakshatra } : {}),
        });
      }
    }
  }, [sevaLockInfo, selectedSeva, selectedDayNumber]);

  // Selected Day details
  const selectedDayInfo = useMemo(() => {
    if (!selectedDayNumber) return null;
    return PROGRAMME_28_DAYS.find((d) => d.dayNumber === selectedDayNumber) || PROGRAMME_28_DAYS[0];
  }, [selectedDayNumber]);

  // Filtered 28 Days
  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) return PROGRAMME_28_DAYS;
    const q = searchQuery.toLowerCase().trim();
    return PROGRAMME_28_DAYS.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameTe.toLowerCase().includes(q) ||
        (d.nameHi && d.nameHi.toLowerCase().includes(q)) ||
        String(d.dayNumber).includes(q) ||
        `day ${d.dayNumber}`.includes(q)
    );
  }, [searchQuery]);

  const handleSelectDay = (dayNum: number) => {
    if (sevaLockInfo && !sevaLockInfo.allowedDays.includes(dayNum)) {
      return;
    }

    setSelectedDayNumber(dayNum);
    const day = PROGRAMME_28_DAYS.find((d) => d.dayNumber === dayNum) || PROGRAMME_28_DAYS[0];

    specialSevaBookingService.saveActiveDraft({
      sevaId: selectedSeva.id,
      sevaSlug: selectedSeva.slug,
      sevaName: selectedSeva.title,
      amount: selectedSeva.price || selectedSeva.amount,
      selectedDay: day.dayNumber,
      selectedDate: day.date,
      mahayajnamNakshatra: day.nameEn,
      nakshatra: day.nameEn,
      ...(sevaLockInfo?.lockedNakshatra ? { janmaNakshatra: sevaLockInfo.lockedNakshatra } : {}),
    });
  };

  const handleContinue = () => {
    if (!selectedDayNumber || !selectedDayInfo) return;

    specialSevaBookingService.saveActiveDraft({
      sevaId: selectedSeva.id,
      sevaSlug: selectedSeva.slug,
      sevaName: selectedSeva.title,
      amount: selectedSeva.price || selectedSeva.amount,
      selectedDay: selectedDayInfo.dayNumber,
      selectedDate: selectedDayInfo.date,
      mahayajnamNakshatra: selectedDayInfo.nameEn,
      nakshatra: selectedDayInfo.nameEn,
      ...(sevaLockInfo?.lockedNakshatra ? { janmaNakshatra: sevaLockInfo.lockedNakshatra } : {}),
    });

    router.push(`/${locale}/special-seva-booking/details`);
  };

  const sevaTitle = isTe ? (selectedSeva.titleTe || selectedSeva.title) : isHi ? (selectedSeva.titleHi || selectedSeva.title) : selectedSeva.title;

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/sevas"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'సేవలకు వెనుకకు' : isHi ? 'सभी सेवाएँ' : 'Back to Sevas'}</span>
          </Link>
        </div>

        {/* Dedicated Special Seva Stepper (Step 1) */}
        <SpecialSevaStepper currentStep={1} />

        {/* Selected Special Seva Header Card with Dynamic Dropdown Selector */}
        <div className="rounded-2xl bg-gradient-to-r from-[#4A0A14] via-[#5A0714] to-[#35030A] border-2 border-[#D6A532]/60 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                  {isTe ? 'ఎంచుకున్న ప్రత్యేక సేవ' : isHi ? 'चयनित विशेष सेवा' : 'SELECTED SPECIAL SEVA'}
                </span>

                {/* Dynamic Seva Selector Dropdown */}
                {allSevas.length > 1 && (
                  <select
                    value={selectedSeva.id || selectedSeva.slug}
                    onChange={(e) => {
                      const found = allSevas.find((s) => s.id === e.target.value || s.slug === e.target.value);
                      if (found) {
                        setSelectedSeva(found);
                        specialSevaBookingService.saveActiveDraft({
                          sevaId: found.id,
                          sevaSlug: found.slug,
                          sevaName: found.title,
                          amount: found.price || found.amount,
                        });
                      }
                    }}
                    className="bg-[#230206] border border-[#D6A532]/50 text-[#F2C14E] text-xs font-cinzel font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                  >
                    {allSevas.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isTe ? (s.titleTe || s.title) : (s.titleHi || s.title)} ({formatCurrency(s.price || s.amount)})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#FAF4E6]">
                {sevaTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#F2C14E] font-medium font-sans">
                {isTe ? (selectedSeva.shortDescTe || selectedSeva.shortDesc) : isHi ? (selectedSeva.shortDescHi || selectedSeva.shortDesc) : selectedSeva.shortDesc}
              </p>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 border-[#D6A532]/20 pt-3 md:pt-0 shrink-0">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'విరాళం' : isHi ? 'सहयोग राशि' : 'CONTRIBUTION'}
              </span>
              <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#F2C14E]">
                {formatCurrency(selectedSeva.price || selectedSeva.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* DAY SELECTION CARD (28 PROGRAMME DAYS) */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F2C14E]">
                <Star className="w-5 h-5 fill-[#F2C14E]/20" />
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                  {isTe ? 'మహాయజ్ఞ దినాన్ని ఎంచుకోండి' : isHi ? 'महायज्ञ दिवस चुनें' : 'SELECT YOUR MAHAYAJNAM DAY'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
                {isTe
                  ? 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞంలో ఈ ప్రత్యేక సేవను ఏ రోజున నిర్వహించాలో ఆ దినాన్ని ఎంచుకోండి (Day 1 నుండి Day 28 వరకు).'
                  : isHi
                  ? 'श्रीकरी अति रुद्र महायज्ञ में इस विशेष सेवा हेतु दिवस का चयन करें (Day 1 से Day 28)।'
                  : 'Select which sacred day of the 28-Day Mahayajnam you wish to sponsor this Special Seva (Day 1 to Day 28).'}
              </p>
            </div>

          {/* Locked Date Notice for Kalyanam Seva */}
          {sevaLockInfo && (
            <div className="rounded-xl bg-gradient-to-r from-[#5A0714] via-[#4A0A14] to-[#3B040B] border-2 border-[#D6A532] p-4 flex items-center gap-3.5 text-[#F2C14E] shadow-[0_0_20px_rgba(214,165,50,0.3)]">
              <div className="w-10 h-10 rounded-full bg-[#D6A532]/20 border border-[#D6A532] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#F2C14E]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#FAF4E6] flex items-center gap-2">
                  <span>
                    {sevaLockInfo.isMultiDay
                      ? (isTe
                          ? `🔒 కేవలం విశేష నక్షత్ర దినములలో మాత్రమే లభ్యం: Days ${sevaLockInfo.allowedDays.join(', ')}`
                          : isHi
                          ? `🔒 केवल विशेष नक्षत्र दिवसों पर उपलब्ध: Days ${sevaLockInfo.allowedDays.join(', ')}`
                          : `🔒 Available Exclusively on Days ${sevaLockInfo.allowedDays.join(', ')}`)
                      : (isTe
                          ? `🔒 దినం ${sevaLockInfo.defaultDay} కు లాక్ చేయబడింది (${sevaLockInfo.lockedNakshatra || ''} నక్షత్రం)`
                          : isHi
                          ? `🔒 समर्पित तिथि आरक्षित: दिवस ${sevaLockInfo.defaultDay} (${sevaLockInfo.lockedNakshatra || ''} नक्षत्र)`
                          : `🔒 Dedicated Date Locked: Day ${sevaLockInfo.defaultDay} (${selectedDayInfo?.date} — ${sevaLockInfo.lockedNakshatra} Nakshatram)`)}
                  </span>
                </h4>
                <p className="text-xs text-[#FFF8E8]/85 font-sans leading-relaxed">
                  {sevaLockInfo.isMultiDay
                    ? (isTe
                        ? `${isTe ? (selectedSeva.titleTe || selectedSeva.title) : selectedSeva.title} సేవ పవిత్ర విశేష నక్షత్ర దినములైన Day ${sevaLockInfo.allowedDays.join(', Day ')} లలో మాత్రమే నిర్వహించబడుతుంది. దయచేసి ఒక దినాన్ని ఎంచుకోండి.`
                        : isHi
                        ? `${selectedSeva.titleHi || selectedSeva.title} केवल पावन विशेष नक्षत्र दिवसों Day ${sevaLockInfo.allowedDays.join(', Day ')} पर आयोजित की जाती है। कृपया अपना इच्छित दिवस चुनें।`
                        : `${selectedSeva?.title} is exclusively performed on designated Visesha Nakshatra days: Day ${sevaLockInfo.allowedDays.join(', Day ')}. Please select your preferred day.`)
                    : (isTe
                        ? `${selectedSeva.titleTe || selectedSeva.title} పవిత్ర ${sevaLockInfo.lockedNakshatra || ''} నక్షత్ర దినమైన Day ${sevaLockInfo.defaultDay} న మాత్రమే నిర్వహించబడుతుంది.`
                        : isHi
                        ? `${selectedSeva.titleHi || selectedSeva.title} केवल पावन ${sevaLockInfo.lockedNakshatra || ''} नक्षत्र दिवस (Day ${sevaLockInfo.defaultDay}) को ही आयोजित होगा।`
                        : `${selectedSeva?.title} is exclusively consecrated for Day ${sevaLockInfo.defaultDay} (${sevaLockInfo.lockedNakshatra} Nakshatram).`)}
                </p>
              </div>
            </div>
          )}

          {/* Day Search Bar */}
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

          {/* 28 Programme Days Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {filteredDays.map((d) => {
              const isSelected = selectedDayNumber === d.dayNumber;
              const isAllowed = !sevaLockInfo || sevaLockInfo.allowedDays.includes(d.dayNumber);
              const isConcludingCard = d.dayNumber === 28;

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDay(d.dayNumber)}
                  disabled={!isAllowed}
                  className={`group relative flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all duration-200 select-none min-h-[110px] ${
                    !isAllowed
                      ? 'bg-[#180204]/60 border-zinc-800 text-zinc-600 opacity-35 cursor-not-allowed pointer-events-none'
                      : isSelected
                      ? 'bg-gradient-to-b from-[#5A0714] to-[#3B040B] border-[#F2C14E] shadow-[0_0_18px_rgba(214,165,50,0.5)] ring-2 ring-[#D6A532] scale-[1.03] cursor-pointer'
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
                        : isConcludingCard
                        ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/50'
                        : 'bg-[#5A0714]/60 text-[#E8C76A]/90'
                    }`}
                  >
                    DAY {d.dayNumber}
                  </span>

                  {/* Star Name */}
                  <div className="my-1 space-y-0.5">
                    <span
                      className={`font-cinzel text-xs sm:text-sm font-black block leading-tight ${
                        isSelected ? 'text-[#F2C14E]' : 'text-[#FAF4E6]'
                      }`}
                    >
                      {d.nameEn}
                    </span>
                    <span className="font-sans text-[10px] font-medium text-[#E8C76A]/80 block">
                      {isTe ? d.nameTe : isHi ? (d.nameHi || d.nameEn) : d.nameTe}
                    </span>
                  </div>

                  {/* Date Label */}
                  <span
                    className={`text-[9px] font-sans truncate max-w-full px-1 ${
                      isSelected ? 'text-[#FAF4E6] font-semibold' : 'text-[#FFF8E8]/60'
                    }`}
                  >
                    {d.date.replace(' 2026', '')}
                  </span>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Banner & Continue Action */}
          <div className="pt-4 border-t border-[#D6A532]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'ఎంచుకున్న దినం' : 'SELECTED DAY'}
              </span>
              {selectedDayInfo ? (
                <div className="font-cinzel text-sm sm:text-base font-bold text-[#FAF4E6] flex flex-wrap items-center gap-2">
                  <span className="text-[#F2C14E] font-black">DAY {selectedDayInfo.dayNumber}</span>
                  <span>•</span>
                  <span>{selectedDayInfo.date}</span>
                  <span>•</span>
                  <span className="text-[#F2C14E]">{selectedDayInfo.nameEn} Nakshatra</span>
                </div>
              ) : (
                <p className="text-xs text-rose-400 font-sans">
                  {isTe ? 'దయచేసి ఒక రోజును ఎంచుకోండి' : 'Please select a day to continue'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedDayNumber}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isTe ? 'భక్తుని వివరాలకు కొనసాగండి' : isHi ? 'भक्त विवरण हेतु बढ़ें' : 'CONTINUE TO DEVOTEE DETAILS'}</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
