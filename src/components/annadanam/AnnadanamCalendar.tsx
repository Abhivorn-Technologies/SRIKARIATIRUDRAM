'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { annadanamCalendarDays, annadanamAmounts, AnnadanamDay } from '@/data/annadanam';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PaymentUI, PaymentMethodType } from '@/components/booking/PaymentUI';
import {
  Utensils,
  Calendar as CalendarIcon,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  Printer,
  Share2,
  Home,
  Check,
  Building,
  Phone,
  MapPin,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Link } from '@/i18n/routing';

interface SponsorFormData {
  sponsorName: string;
  mobile: string;
  email: string;
  occasion: string;
  displayName: string;
  isPrivate: boolean;
}

export function AnnadanamSection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const calendarSectionRef = useRef<HTMLDivElement>(null);
  const participationSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Selected Day State
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Selected Amount State
  const [selectedAmount, setSelectedAmount] = useState<number>(25116);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountValue, setCustomAmountValue] = useState<string>('');
  const [customAmountError, setCustomAmountError] = useState<string>('');

  // Flow Step: 1 = Selection & Form, 2 = Review, 3 = Payment, 4 = Confirmation
  const [flowStep, setFlowStep] = useState<number>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Dynamic 28-day calendar state
  const [calendarDays, setCalendarDays] = useState<AnnadanamDay[]>(annadanamCalendarDays);

  const fetchLiveCalendar = async () => {
    try {
      const res = await fetch('/api/annadanam', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.calendarDays)) {
        setCalendarDays(json.calendarDays);
      }
    } catch (err) {
      console.error('Failed to fetch dynamic Annadanam calendar:', err);
    }
  };

  useEffect(() => {
    fetchLiveCalendar();
  }, []);

  // Sponsor Form State
  const [formData, setFormData] = useState<SponsorFormData>({
    sponsorName: '',
    mobile: '',
    email: '',
    occasion: '',
    displayName: '',
    isPrivate: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Confirmed Booking Info
  const [confirmedBooking, setConfirmedBooking] = useState<{
    sponsorshipId: string;
    day: AnnadanamDay;
    amount: number;
    sponsorName: string;
    displayName: string;
    mobile: string;
    email: string;
    occasion: string;
    isPrivate: boolean;
    date: string;
    paymentRef: string;
  } | null>(null);

  // Active Selected Day Object
  const selectedDay: AnnadanamDay = useMemo(() => {
    return (
      calendarDays.find((d) => d.day === selectedDayNumber) ||
      calendarDays[0]
    );
  }, [selectedDayNumber, calendarDays]);

  // Effective Amount
  const effectiveAmount = isCustomAmount
    ? parseInt(customAmountValue, 10) || 0
    : selectedAmount;

  // Scroll Helpers
  const scrollToCalendar = () => {
    calendarSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Day Selection Handler
  const handleSelectDay = (day: AnnadanamDay) => {
    if (day.status === 'SPONSORED') return;
    setSelectedDayNumber(day.day);
    // Smooth scroll to participation / sponsor details
    setTimeout(() => {
      participationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Amount Selection Handler
  const handleSelectAmount = (amt: number) => {
    setIsCustomAmount(false);
    setSelectedAmount(amt);
    setCustomAmountError('');
  };

  const handleCustomAmountClick = () => {
    setIsCustomAmount(true);
    if (!customAmountValue) {
      setCustomAmountValue('5000');
    }
  };

  const handleCustomAmountChange = (val: string) => {
    const numericOnly = val.replace(/[^\d]/g, '');
    setCustomAmountValue(numericOnly);
    const num = parseInt(numericOnly, 10);
    if (isNaN(num) || num <= 0) {
      setCustomAmountError(
        isTe ? 'మొత్తం ₹0 కంటే ఎక్కువగా ఉండాలి' : 'Please enter an amount greater than ₹0'
      );
    } else {
      setCustomAmountError('');
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.sponsorName.trim()) {
      errors.sponsorName = isTe
        ? 'దాత పేరు తప్పనిసరి'
        : isHi
        ? 'प्रायोजक का नाम आवश्यक है'
        : 'Sponsor Name is required';
    } else if (formData.sponsorName.trim().length < 2) {
      errors.sponsorName = isTe ? 'దయచేసి పూర్తి పేరు నమోదు చేయండి' : 'Please enter a valid full name';
    }

    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!formData.mobile.trim()) {
      errors.mobile = isTe
        ? 'మొబైల్ నంబర్ తప్పనిసరి'
        : isHi
        ? 'मोबाइल नंबर आवश्यक है'
        : 'Mobile Number is required';
    } else if (!phoneRegex.test(formData.mobile.trim().replace(/\s+/g, ''))) {
      errors.mobile = isTe
        ? 'దయచేసి 10 అంకెల సరైన మొబైల్ నంబర్ నమోదు చేయండి'
        : 'Please enter a valid 10-digit mobile number';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = isTe ? 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి' : 'Please enter a valid email format';
      }
    }

    if (isCustomAmount) {
      const num = parseInt(customAmountValue, 10);
      if (isNaN(num) || num <= 0) {
        errors.customAmount = isTe
          ? 'మొత్తం ₹0 కంటే ఎక్కువగా ఉండాలి'
          : 'Please enter a valid amount greater than ₹0';
      }
    } else if (selectedAmount <= 0) {
      errors.amount = 'Please select a valid amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to Review (Step 2)
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setFlowStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Payment Completion Handler
  const handlePaymentSuccess = async (method: PaymentMethodType) => {
    setIsProcessingPayment(true);
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `ANN-2026-${randomSuffix}`;
    const txRef = `TXN${Date.now().toString().slice(-8)}`;

    try {
      await fetch('/api/annadanam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsor_name: formData.sponsorName.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim() || undefined,
          amount: effectiveAmount,
          occasion: formData.occasion.trim() || undefined,
          display_name: formData.displayName.trim() || undefined,
          is_anonymous: formData.isPrivate,
          date: selectedDay.date,
          day_number: selectedDay.day,
          transaction_id: txRef,
          payment_status: 'SUCCESS',
          status: 'CONFIRMED'
        })
      });
      fetchLiveCalendar();
    } catch (err) {
      console.error('Failed to save sponsorship:', err);
    }

    const confirmed = {
      sponsorshipId: bookingRef,
      day: selectedDay,
      amount: effectiveAmount,
      sponsorName: formData.sponsorName.trim(),
      displayName: formData.displayName.trim() || formData.sponsorName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      occasion: formData.occasion.trim(),
      isPrivate: formData.isPrivate,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      paymentRef: txRef,
    };

    setConfirmedBooking(confirmed);
    setIsProcessingPayment(false);
    setFlowStep(4); // Step 4 = Confirmation

    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F2C14E', '#D6A532', '#FAF4E6', '#8B1E2D'],
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFlowStep(1);
    setConfirmedBooking(null);
    setFormData({
      sponsorName: '',
      mobile: '',
      email: '',
      occasion: '',
      displayName: '',
      isPrivate: false,
    });
    setFormErrors({});
  };

  const handlePrintReceipt = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined' || !confirmedBooking) return;
    const text = encodeURIComponent(
      `Om Namah Shivaya! 🙏\n\nI have sponsored Annadanam at LOKAKALYANAHITA SRIKARI ATI RUDRA MAHAYAGNAM.\n\nSponsorship ID: ${confirmedBooking.sponsorshipId}\nDate: ${confirmedBooking.day.date} (Day ${confirmedBooking.day.day} - ${confirmedBooking.day.nakshatra})\nAmount: ${formatCurrency(confirmedBooking.amount)}\nSponsor: ${confirmedBooking.isPrivate ? 'Private Devotee' : confirmedBooking.sponsorName}\nHelpline: 9490462652`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* ============================================================ */}
      {/* 1. HERO / INTRO SECTION                                       */}
      {/* ============================================================ */}
      {flowStep === 1 && (
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
            {isTe ? 'అన్నదానం సమం దానం న భూతో న భవిష్యతి' : 'Sacred 28-Day Maha Annadanam Service'}
          </Badge>

          <div className="space-y-1">
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-wide">
              {isTe ? 'అన్నదానం మహాదానం' : isHi ? 'अन्नदानं महादानम्' : 'అన్నదానం మహాదానం'}
            </h1>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-tight uppercase">
              {isTe
                ? 'శ్రీకరీ అతి రుద్ర మహాయజ్ఞంలో అన్నదానం సమర్పించండి'
                : 'SPONSOR ANNADANAM DURING SRIKARI ATI RUDRA MAHAYAJNAM'}
            </h2>
          </div>

          <p className="text-sm md:text-base text-ivory/85 font-sans max-w-3xl mx-auto leading-relaxed">
            {isTe
              ? 'అన్నదానం సమస్త దానములలోకెల్లా అత్యంత శ్రేష్టమైన మహాదానం. 28 రోజుల శ్రీకరీ అతి రుద్ర మహాయజ్ఞంలో (25 నవంబర్ నుండి 22 డిసెంబర్ 2026) విచ్చేసే వేలాది మంది భక్తులకు, యాత్రికులకు మరియు వేద పండితులకు సాత్విక అన్నప్రసాద వితరణలో భాగస్వాములు కండి.'
              : isHi
              ? 'अन्नदान को सभी दानों में सर्वोपरि माना गया है। 28 दिवसीय श्रीकरी अति रुद्र महायज्ञ (25 नवम्बर से 22 दिसम्बर 2026) के पावन अवसर पर पधारने वाले श्रद्धालुओं और वेद पंडितों के लिए पवित्र अन्नप्रसाद सेवा में सहभागी बनें।'
              : 'Annadanam is revered as the supreme offering (Maha Danam). Devotees are invited to sponsor consecrated satvik Annadanam for visiting devotees, pilgrims, and Veda Pandits throughout the 28 sacred days of the Srikari Ati Rudra Mahayajnam (25 Nov – 22 Dec 2026).'}
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. PROMINENT ONE-DAY ANNADANAM SPONSORSHIP HERO BANNER        */}
      {/* ============================================================ */}
      {flowStep === 1 && (
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-r from-burgundy-deep via-primary/40 to-burgundy-deep border-2 border-gold/60 shadow-gold-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold-lighter text-xs font-bold font-cinzel uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Maha Annadana Seva</span>
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-ivory">
                ONE-DAY ANNADANAM SPONSORSHIP
              </h3>

              <p className="text-sm sm:text-base text-ivory/85 font-sans max-w-2xl leading-relaxed">
                {isTe
                  ? 'ఒక భక్తుడు మహాయజ్ఞంలో ఒక పూర్తి రోజు అన్నదానాన్ని ₹25,116తో సమర్పించవచ్చు.'
                  : 'A devotee can sponsor Annadanam for one complete day of the Mahayajnam for ₹25,116.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0">
              <div className="text-center lg:text-right">
                <span className="text-xs text-gold-light uppercase font-bold tracking-widest block font-cinzel">
                  One Full Day Sponsorship
                </span>
                <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-gold drop-shadow-md">
                  ₹25,116
                </span>
              </div>

              <Button
                variant="gold"
                size="lg"
                onClick={() => {
                  setSelectedAmount(25116);
                  setIsCustomAmount(false);
                  scrollToCalendar();
                }}
                leftIcon={<Utensils className="w-5 h-5" />}
                className="font-bold uppercase tracking-wider text-sm sm:text-base px-8 py-4 shadow-gold-md"
              >
                {isTe ? 'అన్నదానం సమర్పించండి' : 'SPONSOR ANNADANAM'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. 28-DAY ANNADANAM CALENDAR SECTION                         */}
      {/* ============================================================ */}
      {flowStep === 1 && (
        <div ref={calendarSectionRef} className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-lighter tracking-wide uppercase">
              28-DAY ANNADANAM CALENDAR
            </h3>
            <p className="text-xs sm:text-sm text-ivory/75 font-sans">
              {isTe
                ? '28 రోజుల మహాయజ్ఞంలో మీకు అనుకూలమైన పవిత్ర దినాన్ని ఎంచుకోండి. (కేవలం AVAILABLE దినాలను మాత్రమే ఎంచుకోవచ్చు).'
                : 'Select an available auspicious day to sponsor Annadanam. Sponsored days are reserved.'}
            </p>
          </div>

          {/* Calendar Grid: 4 cols (desktop) / 2 cols (tablet) / 1 col (mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {calendarDays.map((day) => {
              const isSelected = selectedDayNumber === day.day;
              const isAvailable = day.status === 'AVAILABLE';
              const displayDate = isTe ? day.dateTe : isHi ? day.dateHi : day.date;
              const displayNakshatra = isTe ? day.nakshatraTe : isHi ? day.nakshatraHi : day.nakshatra;
              const displayDayOfWeek = isTe ? day.dayOfWeekTe : isHi ? day.dayOfWeekHi : day.dayOfWeek;

              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (day.day % 4) * 0.05 }}
                  className={`rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between space-y-3 relative ${
                    isAvailable
                      ? isSelected
                        ? 'bg-primary/50 border-gold shadow-gold-md ring-2 ring-gold/40'
                        : 'bg-burgundy-deep/80 border-gold/25 hover:border-gold/60 hover:bg-burgundy-deep/95 cursor-pointer'
                      : 'bg-burgundy-dark/50 border-white/10 opacity-70 cursor-not-allowed select-none'
                  }`}
                  onClick={() => isAvailable && handleSelectDay(day)}
                >
                  {/* Card Top: Day number & Status Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-gold/15 pb-2.5">
                    <span className="font-cinzel text-xs font-black text-gold-lighter uppercase tracking-wider">
                      DAY {String(day.day).padStart(2, '0')}
                    </span>

                    {/* ONLY TWO STATUSES: AVAILABLE or SPONSORED */}
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AVAILABLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-burgundy-deep text-rose-300 border border-rose-400/30 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        SPONSORED
                      </span>
                    )}
                  </div>

                  {/* Card Center: Date & Nakshatra */}
                  <div className="space-y-1 py-1">
                    <div className="font-sans font-bold text-ivory text-sm sm:text-base">
                      {displayDate}
                    </div>
                    <div className="text-xs text-gold-light/90 font-sans font-medium flex items-center gap-1">
                      <span>{displayDayOfWeek}</span>
                      <span>•</span>
                      <span className="truncate">{displayNakshatra}</span>
                    </div>

                    {!isAvailable && day.sponsorName && (
                      <div className="text-[11px] text-ivory/60 font-sans italic pt-1 truncate">
                        Sponsor: {day.sponsorName}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Action Button or Disabled Label */}
                  <div className="pt-2 border-t border-gold/15">
                    {isAvailable ? (
                      <Button
                        type="button"
                        variant={isSelected ? 'gold' : 'outline'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDay(day);
                        }}
                        className="w-full text-xs font-bold uppercase tracking-wider justify-center"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" />
                            {isTe ? 'ఎంపికైంది' : 'SELECTED'}
                          </>
                        ) : (
                          isTe ? 'అన్నదానం సమర్పించండి' : 'SPONSOR ANNADANAM'
                        )}
                      </Button>
                    ) : (
                      <div className="text-center text-[11px] text-ivory/50 uppercase font-sans font-semibold py-1.5">
                        {isTe ? 'పూర్తయింది (రిజర్వ్ అయింది)' : 'Day Reserved'}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. ANNADANAM PARTICIPATION AMOUNTS SECTION                   */}
      {/* ============================================================ */}
      {flowStep === 1 && (
        <div ref={participationSectionRef} className="space-y-6 pt-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-lighter tracking-wide uppercase">
              ANNADANAM PARTICIPATION
            </h3>
            <p className="text-xs sm:text-sm text-ivory/75 font-sans">
              {isTe
                ? 'మీ అనుకూలమైన మొత్తాన్ని ఎంచుకోండి. ₹25,116 ఒక పూర్తి రోజు స్పాన్సర్‌షిప్.'
                : 'Choose an amount or enter a custom contribution to participate in the Annadanam.'}
            </p>
          </div>

          {/* Amount Options Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {annadanamAmounts.map((item) => {
              const isSelected = !isCustomAmount && selectedAmount === item.amount;
              return (
                <div
                  key={item.amount}
                  onClick={() => handleSelectAmount(item.amount)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center relative ${
                    isSelected
                      ? 'bg-primary/50 border-gold shadow-gold-md ring-2 ring-gold/40'
                      : 'bg-burgundy-deep/80 border-gold/25 hover:border-gold/60 hover:bg-burgundy-deep/95'
                  }`}
                >
                  {item.isOneDay && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-burgundy-deep uppercase font-cinzel absolute -top-2.5 left-1/2 -translate-x-1/2 shadow-sm whitespace-nowrap">
                      1-Day Sponsor
                    </span>
                  )}
                  <div>
                    <span className="font-cinzel text-xl sm:text-2xl font-black text-gold block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-ivory/75 font-sans block mt-1 leading-tight">
                      {isTe ? item.descTe : item.desc}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gold/15">
                    <span
                      className={`text-[10.5px] font-bold uppercase ${
                        isSelected ? 'text-gold-light' : 'text-ivory/50'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Custom Amount Button */}
            <div
              onClick={handleCustomAmountClick}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center ${
                isCustomAmount
                  ? 'bg-primary/50 border-gold shadow-gold-md ring-2 ring-gold/40'
                  : 'bg-burgundy-deep/80 border-gold/25 hover:border-gold/60 hover:bg-burgundy-deep/95'
              }`}
            >
              <div>
                <span className="font-cinzel text-base sm:text-lg font-black text-gold block">
                  CUSTOM
                </span>
                <span className="text-[11px] text-ivory/75 font-sans block mt-1 leading-tight">
                  {isTe ? 'ఇతర మొత్తం' : 'Custom Amount'}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-gold/15">
                <span
                  className={`text-[10.5px] font-bold uppercase ${
                    isCustomAmount ? 'text-gold-light' : 'text-ivory/50'
                  }`}
                >
                  {isCustomAmount ? 'Selected' : 'Enter ₹'}
                </span>
              </div>
            </div>
          </div>

          {/* Custom Amount Input Field */}
          {isCustomAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-burgundy-deep/90 border border-gold/40 max-w-md mx-auto space-y-2"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-gold font-cinzel">
                {isTe ? 'మీ అనుకూలమైన మొత్తాన్ని నమోదు చేయండి (₹):' : 'Enter Custom Contribution Amount (₹):'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-cinzel text-lg font-bold text-gold">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmountValue}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] font-bold text-lg focus:outline-none focus:border-[#D6A532] font-sans"
                />
              </div>
              {customAmountError && (
                <p className="text-xs text-rose-400 font-semibold">{customAmountError}</p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SPONSOR DETAILS FORM SECTION                              */}
      {/* ============================================================ */}
      {flowStep === 1 && (
        <div ref={formSectionRef} className="pt-6">
          <Card variant="sacred" className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-gold/25 pb-3">
              <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                Devotee Registration
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                {isTe ? 'అన్నదాత వివరాలు' : isHi ? 'अन्नदाता विवरण' : 'Sponsor Details'}
              </h3>
              <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                {isTe
                  ? 'మీ అన్నదాన సంకల్పం మరియు రశీదు కొరకు వివరాలను నమోదు చేయండి.'
                  : 'Enter your name and contact details for the sacred Annadanam sponsorship record.'}
              </p>
            </div>

            {/* Selected Summary Bar */}
            <div className="p-3.5 rounded-xl bg-burgundy-deep/90 border border-gold/30 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gold shrink-0" />
                <span className="text-ivory">
                  Annadanam Date: <strong className="text-gold-lighter">{selectedDay.date}</strong> (Day {selectedDay.day} - {selectedDay.nakshatra})
                </span>
              </div>
              <div className="font-cinzel text-base font-black text-gold">
                Amount: {formatCurrency(effectiveAmount)}
              </div>
            </div>

            <form onSubmit={handleProceedToReview} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sponsor Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                    {isTe ? 'స్పాన్సర్ / దాత పేరు' : 'SPONSOR NAME'} *
                  </label>
                  <Input
                    value={formData.sponsorName}
                    onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                    placeholder="e.g. Satyanarayana Sharma"
                    className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans"
                  />
                  {formErrors.sponsorName && (
                    <p className="text-[11px] text-rose-400 font-semibold">{formErrors.sponsorName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                    {isTe ? 'మొబైల్ నంబర్' : 'MOBILE NUMBER'} *
                  </label>
                  <Input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans"
                  />
                  {formErrors.mobile && (
                    <p className="text-[11px] text-rose-400 font-semibold">{formErrors.mobile}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                    {isTe ? 'ఈమెయిల్ చిరునామా' : 'EMAIL ADDRESS'} (Optional)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="For digital confirmation"
                    className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-400 font-semibold">{formErrors.email}</p>
                  )}
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                    {isTe ? 'ప్రదర్శిత నామం' : 'DISPLAY NAME'} (Optional)
                  </label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. K. Satyanarayana Sharma & Family"
                    className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans"
                  />
                </div>
              </div>

              {/* Occasion / In Memory Of */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                  {isTe ? 'సందర్భం / స్మృతిలో' : 'OCCASION / IN MEMORY OF'} (Optional)
                </label>
                <Input
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g. Birthday / Wedding Anniversary / In Memory of Late Parents"
                  className="bg-white border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans"
                />
              </div>

              {/* Privacy Option */}
              <div className="space-y-2 pt-2 border-t border-gold/20">
                <label className="block text-xs font-bold uppercase tracking-wider text-gold">
                  {isTe ? 'గోప్యతా ప్రాధాన్యత' : 'PRIVACY PREFERENCE'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, isPrivate: false })}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      !formData.isPrivate
                        ? 'bg-primary/40 border-gold text-ivory ring-1 ring-gold/40'
                        : 'bg-burgundy-deep/70 border-gold/20 text-ivory/70 hover:border-gold/40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        !formData.isPrivate ? 'border-gold bg-gold text-burgundy-deep' : 'border-gold/40'
                      }`}
                    >
                      {!formData.isPrivate && <span className="w-1.5 h-1.5 rounded-full bg-burgundy-deep" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-gold-light" />
                        DISPLAY MY NAME PUBLICLY
                      </span>
                      <span className="text-[10.5px] text-ivory/60 block">Name visible on sponsor list</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, isPrivate: true })}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.isPrivate
                        ? 'bg-primary/40 border-gold text-ivory ring-1 ring-gold/40'
                        : 'bg-burgundy-deep/70 border-gold/20 text-ivory/70 hover:border-gold/40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.isPrivate ? 'border-gold bg-gold text-burgundy-deep' : 'border-gold/40'
                      }`}
                    >
                      {formData.isPrivate && <span className="w-1.5 h-1.5 rounded-full bg-burgundy-deep" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-gold-light" />
                        KEEP MY SPONSORSHIP PRIVATE
                      </span>
                      <span className="text-[10.5px] text-ivory/60 block">Sponsor name will remain confidential</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto font-bold uppercase tracking-wider shadow-gold-sm"
                >
                  <span>{isTe ? 'సమీక్షకు కొనసాగండి' : 'Proceed to Review'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. STEP 2: REVIEW DETAILS                                    */}
      {/* ============================================================ */}
      {flowStep === 2 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card variant="sacred" className="p-6 md:p-8 space-y-6">
            <div className="border-b border-gold/25 pb-3">
              <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                Review & Confirm
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                {isTe ? 'అన్నదాన వివరాల సమీక్ష' : 'Review Annadanam Sponsorship'}
              </h3>
              <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                Please verify your sponsorship date, amount, and devotee details before making the sacred offering.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-burgundy-deep/90 border border-gold/30 space-y-3.5 font-sans text-xs sm:text-sm">
              <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                <span className="text-ivory/70">Annadanam Date:</span>
                <span className="font-bold text-gold-lighter text-right">
                  {selectedDay.date} (Day {selectedDay.day} - {selectedDay.nakshatra})
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                <span className="text-ivory/70">Sponsorship Contribution:</span>
                <span className="font-cinzel text-lg font-black text-gold text-right">
                  {formatCurrency(effectiveAmount)}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                <span className="text-ivory/70">Sponsor Name:</span>
                <span className="font-bold text-ivory text-right">
                  {formData.sponsorName}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                <span className="text-ivory/70">Mobile Number:</span>
                <span className="font-medium text-ivory text-right">{formData.mobile}</span>
              </div>

              {formData.email && (
                <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                  <span className="text-ivory/70">Email Address:</span>
                  <span className="font-medium text-ivory text-right">{formData.email}</span>
                </div>
              )}

              {formData.occasion && (
                <div className="flex justify-between items-baseline border-b border-gold/20 pb-2">
                  <span className="text-ivory/70">Occasion / In Memory Of:</span>
                  <span className="font-medium text-ivory text-right italic">{formData.occasion}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline">
                <span className="text-ivory/70">Privacy Preference:</span>
                <span className="font-semibold text-gold-light text-right">
                  {formData.isPrivate ? 'Private (Confidential)' : 'Public Display'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4 border-t border-gold/20">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setFlowStep(1)}
                className="text-xs sm:text-sm text-gold-light hover:text-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                {isTe ? 'వివరాలు సవరించండి' : 'Back to Edit'}
              </Button>

              <Button
                type="button"
                variant="gold"
                size="lg"
                onClick={() => setFlowStep(3)}
                className="font-bold uppercase tracking-wider shadow-gold-sm"
              >
                <span>{isTe ? 'చెల్లింపునకు కొనసాగండి' : 'Proceed to Payment'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. STEP 3: PAYMENT UI                                        */}
      {/* ============================================================ */}
      {flowStep === 3 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card variant="sacred" className="p-6 md:p-8 space-y-6">
            <div className="border-b border-gold/25 pb-3">
              <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                Sacred Offering
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                {isTe ? 'పవిత్ర అన్నదాన సమర్పణ' : 'Offer Sacred Annadanam Dakshina'}
              </h3>
              <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                Complete your offering via secure UPI, QR Code, Netbanking or Cards.
              </p>
            </div>

            <PaymentUI
              amount={effectiveAmount}
              bookingId={`ANN-DAY-${selectedDay.day}`}
              devoteeName={formData.sponsorName}
              devoteePhone={formData.mobile}
              devoteeEmail={formData.email}
              onPaymentSuccess={handlePaymentSuccess}
              isProcessing={isProcessingPayment}
            />

            <div className="pt-4 border-t border-gold/20">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFlowStep(2)}
                className="text-xs text-gold-light hover:text-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                {isTe ? 'సమీక్షకు వెనుకకు' : 'Back to Review'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. STEP 4: CONFIRMATION & RECEIPT SCREEN                     */}
      {/* ============================================================ */}
      {flowStep === 4 && confirmedBooking && (
        <div className="max-w-3xl mx-auto space-y-6 print:max-w-none print:w-full print:m-0 print:p-0">
          {/* Printable Receipt Card */}
          <div className="bg-sacred-card border-2 border-gold/60 rounded-3xl p-6 sm:p-8 shadow-gold-xl text-ivory space-y-5 print:bg-white print:text-black print:border-2 print:border-[#8B1E2D] print:rounded-2xl print:p-5 print:shadow-none print:space-y-3.5 print-receipt-document">
            
            {/* 1. Header & Logo */}
            <div className="text-center pb-4 border-b border-gold/30 print:border-[#C99A3D]/60 print:pb-3 space-y-1.5 print-avoid-break">
              {/* Screen Logo */}
              <div className="flex justify-center items-center mb-1 print:hidden">
                <Image
                  src="/assets/icons/SRIKARIATI RUDRAM.svg"
                  alt="Srikari Ati Rudram"
                  width={240}
                  height={60}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>

              {/* Print Logo */}
              <div className="print-only-logo mb-2 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/icons/print%20logo.png"
                  alt="Srikari Ati Rudra Mahayagnam"
                  className="h-14 sm:h-16 w-auto object-contain mx-auto"
                />
              </div>

              <span className="font-cinzel text-xs sm:text-sm font-bold text-gold tracking-widest uppercase block print:text-[#8B1E2D]">
                SRIKARI ATI RUDRA MAHAYAGNAM
              </span>

              <h2 className="font-cinzel text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-wider uppercase print:text-[#5A0714] print:bg-none">
                LOKAKALYANAHITA NAKSHATRA SHANTHI SAHITA
                <br /> SRIKARI ATI RUDRA MAHAYAGNAM
              </h2>

              <div className="inline-block px-3 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold-light print:bg-[#FAF4E6] print:border-[#C99A3D] print:text-[#5A0714] text-[11px] sm:text-xs font-semibold tracking-wide uppercase font-cinzel">
                ANNADANAM SPONSORSHIP CONFIRMED
              </div>
            </div>

            {/* 2. Status Banner */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-300 print:bg-[#F0FDF4] print:border-[#16A34A] print:text-[#14532D] print:py-2 print:px-3 print-avoid-break">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400 print:text-[#16A34A] shrink-0" />
                <span>PAYMENT STATUS: <span className="uppercase text-emerald-200 print:text-[#14532D]">CONFIRMED & BLESSED</span></span>
              </div>

              <div className="font-mono font-black text-xs sm:text-sm text-gold-light bg-burgundy-deep/80 px-3 py-1 rounded-lg border border-gold/30 print:bg-white print:border-[#C99A3D] print:text-[#5A0714] print:py-0.5">
                SPONSORSHIP NUMBER: {confirmedBooking.sponsorshipId}
              </div>
            </div>

            {/* 3. Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-sans print:gap-3 print-avoid-break">
              {/* Sponsor Details */}
              <div className="space-y-1.5 bg-burgundy-deep/70 p-3.5 sm:p-4 rounded-xl border border-gold/25 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-3">
                <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
                  <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                    SPONSOR INFORMATION
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-ivory/60 print:text-gray-600 block">Sponsor Name:</span>
                  <span className="font-bold text-ivory text-sm sm:text-base print:text-[#1A0004] block">
                    {confirmedBooking.sponsorName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Mobile:</span>
                    <span className="font-medium text-ivory/90 print:text-[#1A0004]">{confirmedBooking.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Privacy:</span>
                    <span className="font-medium text-gold-light print:text-[#8B1E2D]">
                      {confirmedBooking.isPrivate ? 'Private' : 'Public Display'}
                    </span>
                  </div>
                </div>
                {confirmedBooking.occasion && (
                  <div className="pt-1">
                    <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Occasion:</span>
                    <span className="font-normal text-ivory/90 print:text-[#1A0004] text-xs italic">
                      {confirmedBooking.occasion}
                    </span>
                  </div>
                )}
              </div>

              {/* Seva & Amount Details */}
              <div className="space-y-1.5 bg-burgundy-deep/70 p-3.5 sm:p-4 rounded-xl border border-gold/25 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
                    <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                      ANNADANAM SCHEDULE & DAKSHINA
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-ivory/70 print:text-gray-600 text-xs">Annadanam Date:</span>
                    <span className="font-bold text-gold-lighter print:text-[#5A0714] text-right font-cinzel">
                      {confirmedBooking.day.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-ivory/70 print:text-gray-600 text-xs">Mahayajnam Day:</span>
                    <span className="font-medium text-ivory print:text-[#1A0004] text-right">
                      Day {confirmedBooking.day.day} ({confirmedBooking.day.nakshatra})
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-ivory/70 print:text-gray-600 text-xs">Transaction Ref:</span>
                    <span className="font-mono text-ivory/90 print:text-[#1A0004] text-right">
                      {confirmedBooking.paymentRef}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gold/25 print:border-[#D6A532]/40 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ivory/80 print:text-[#5A0714] font-cinzel">
                    Total Dakshina:
                  </span>
                  <span className="font-cinzel text-lg sm:text-xl font-black text-gold print:text-[#8B1E2D]">
                    {formatCurrency(confirmedBooking.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Venue & Contact */}
            <div className="p-3.5 rounded-xl bg-burgundy-deep/90 border border-gold/25 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-ivory/85 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-2.5 print-avoid-break">
              <div className="space-y-1">
                <span className="text-gold print:text-[#8B1E2D] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px] font-cinzel">
                  <MapPin className="w-3.5 h-3.5 text-gold print:text-[#8B1E2D]" /> YAGNA VENUE
                </span>
                <div className="text-[11px] print:text-[#1A0004] space-y-0.5 leading-snug">
                  <span className="font-bold block">Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam</span>
                  <span className="block text-ivory/70 print:text-gray-700">Behind MLRIT College, Basuragadi, Hyderabad</span>
                </div>
              </div>

              <div className="space-y-1 sm:border-l sm:border-gold/20 sm:pl-3 print:border-[#D6A532]/40">
                <span className="text-gold print:text-[#8B1E2D] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px] font-cinzel">
                  <Phone className="w-3.5 h-3.5 text-gold print:text-[#8B1E2D]" /> CONTACT & SUPPORT
                </span>
                <div className="text-[11px] print:text-[#1A0004] space-y-0.5 leading-snug">
                  <span className="block">
                    WhatsApp: <strong className="font-semibold text-ivory print:text-[#1A0004]">9490462652</strong>
                  </span>
                  <span className="block">
                    Secondary: <strong className="font-semibold text-ivory print:text-[#1A0004]">7569253943</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Sacred Footer */}
            <div className="text-center pt-3 border-t border-gold/30 print:border-[#C99A3D]/50 space-y-1 print-avoid-break">
              <div className="font-cinzel text-sm sm:text-base font-bold text-gold print:text-[#8B1E2D] tracking-widest">
                || OM NAMAH SHIVAYA ||
              </div>
              <div className="text-[11px] font-medium text-ivory/80 print:text-[#1A0004]">
                <strong>Srikari Seva Samiti</strong>, Hyderabad, India
              </div>
              <div className="text-[10px] text-ivory/60 print:text-gray-600 italic">
                In association with Srikari Spiritual, USA
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden no-print">
            <Button
              variant="gold"
              size="md"
              onClick={handlePrintReceipt}
              leftIcon={<Printer className="w-4 h-4" />}
              className="font-bold uppercase tracking-wider shadow-gold-sm text-xs sm:text-sm"
            >
              Download / Print Receipt
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleShareWhatsApp}
              leftIcon={<Share2 className="w-4 h-4" />}
              className="font-bold uppercase tracking-wider text-xs sm:text-sm"
            >
              Share on WhatsApp
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={handleReset}
              leftIcon={<Utensils className="w-4 h-4" />}
              className="text-xs sm:text-sm text-gold-light hover:text-gold"
            >
              Sponsor Another Day
            </Button>

            <Link href="/">
              <Button
                variant="ghost"
                size="md"
                leftIcon={<Home className="w-4 h-4" />}
                className="text-xs sm:text-sm text-ivory/80 hover:text-ivory"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
