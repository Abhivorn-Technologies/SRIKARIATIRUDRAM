'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { sevasList } from '@/data/sevas';
import { scheduleList } from '@/data/schedule';
import { NAKSHATRAS, RASIS, COMMON_GOTRAMS, RELATIONS } from '@/lib/constants';
import { BookingState, ConfirmedBooking, FamilyMember, PrimaryDevotee } from '@/types/booking';
import { bookingService } from '@/services/booking.service';
import { BookingStepper, BOOKING_STEPS } from '@/components/booking/BookingStepper';
import { BookingSummaryCard } from '@/components/booking/BookingSummary';
import { PaymentUI, PaymentMethodType } from '@/components/booking/PaymentUI';
import { ReceiptCard } from '@/components/booking/Receipt';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Flame, Calendar, User, Heart, ShieldCheck, CheckCircle, Plus, Trash2, ArrowLeft, ArrowRight, Star, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookSevaPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTe = locale === 'te';

  const initialSevaSlug = searchParams.get('seva') || 'chandi-homam';
  const initialDayParam = searchParams.get('day');

  // Multi-step Wizard: 1: Seva, 2: Date/Nakshatra, 3: Sankalpam, 4: Review, 5: Payment, 6: Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Step 1: Selected Seva
  const [selectedSevaSlug, setSelectedSevaSlug] = useState<string>(initialSevaSlug);
  const selectedSeva = sevasList.find((s) => s.slug === selectedSevaSlug) || sevasList[0];

  // Step 2: Date / Nakshatra Selection
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('25 Nov 2026');
  const [selectedNakshatra, setSelectedNakshatra] = useState<string>('Rohini');
  const [janmaNakshatraFilter, setJanmaNakshatraFilter] = useState<string>('Rohini');

  // Step 3: Sankalpam Form State
  const [devotee, setDevotee] = useState<PrimaryDevotee>({
    fullName: '',
    gotram: 'Bharadwaja',
    nakshatra: 'Rohini',
    sankalpamNames: '',
    phone: '',
    email: '',
    city: '',
    country: 'India',
    attendingPersonally: 'no',
    rasi: 'Vrishabha',
    address: '',
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [specialPrayers, setSpecialPrayers] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<'temple_pickup' | 'postal_courier'>('postal_courier');

  // Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync initial search params
  useEffect(() => {
    if (initialDayParam) {
      const dayNum = parseInt(initialDayParam, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 28) {
        setSelectedDayNumber(dayNum);
        const dayObj = scheduleList.find((d) => d.dayNumber === dayNum);
        if (dayObj) {
          setSelectedDate(dayObj.date);
          setSelectedNakshatra(dayObj.nakshatra);
        }
      }
    }
  }, [initialDayParam]);

  // Handle Seva Change
  const handleSelectSeva = (slug: string) => {
    setSelectedSevaSlug(slug);
    const seva = sevasList.find((s) => s.slug === slug);
    if (!seva) return;

    // Auto-set default date for special sevas with designated dates
    if (slug === 'chandi-homam') {
      setSelectedDayNumber(3);
      setSelectedDate('27 Nov 2026');
      setSelectedNakshatra('Arudra');
    } else if (slug === 'sarpa-suktam-homam') {
      setSelectedDayNumber(2);
      setSelectedDate('26 Nov 2026');
      setSelectedNakshatra('Mrigasira');
    } else if (slug === 'ashlesha-bali') {
      setSelectedDayNumber(6);
      setSelectedDate('30 Nov 2026');
      setSelectedNakshatra('Ashlesha');
    } else if (slug === 'valli-devasena-subramanyeswara-kalyanam') {
      setSelectedDayNumber(25);
      setSelectedDate('19 Dec 2026');
      setSelectedNakshatra('Krittika');
    } else if (slug === 'parvathi-parameswara-kalyanam') {
      setSelectedDayNumber(28);
      setSelectedDate('22 Dec 2026');
      setSelectedNakshatra('Rohini');
    }
  };

  // Handle Janma Nakshatra Selection for Nakshatra Shanthi
  const handleJanmaNakshatraSelect = (nakshatraName: string) => {
    setJanmaNakshatraFilter(nakshatraName);
    const matchedDay = scheduleList.find(
      (d) => d.nakshatra.toLowerCase() === nakshatraName.toLowerCase()
    ) || scheduleList[0];

    setSelectedDayNumber(matchedDay.dayNumber);
    setSelectedDate(matchedDay.date);
    setSelectedNakshatra(matchedDay.nakshatra);

    setDevotee((prev) => ({ ...prev, nakshatra: nakshatraName }));
  };

  // Add & Remove Family Members
  const handleAddFamily = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: '', relation: 'Spouse', gotram: devotee.gotram, nakshatra: devotee.nakshatra, rasi: '' },
    ]);
  };

  const handleRemoveFamily = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleFamilyChange = (index: number, field: keyof FamilyMember, val: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: val };
    setFamilyMembers(updated);
  };

  // Form Validation for Step 3
  const validateSankalpamForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!devotee.fullName.trim()) {
      errors.fullName = 'Devotee Name is required';
    } else if (devotee.fullName.trim().length < 2) {
      errors.fullName = 'Please enter a valid full name';
    }

    if (!devotee.gotram.trim()) {
      errors.gotram = 'Gotram is required';
    }

    if (!devotee.nakshatra) {
      errors.nakshatra = 'Janma Nakshatram is required';
    }

    if (!devotee.sankalpamNames.trim()) {
      errors.sankalpamNames = 'Please enter names of family members for Sankalpam chanting';
    }

    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!devotee.phone.trim()) {
      errors.phone = 'Mobile number is required for booking confirmation';
    } else if (!phoneRegex.test(devotee.phone.trim().replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!devotee.email.trim()) {
      errors.email = 'Email address is required for sending receipt';
    } else if (!emailRegex.test(devotee.email.trim())) {
      errors.email = 'Please enter a valid email format';
    }

    if (!devotee.city.trim()) {
      errors.city = 'City is required';
    }

    if (!devotee.country.trim()) {
      errors.country = 'Country is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSankalpamForm()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mock Payment Completion
  const handlePaymentSuccess = async (method: PaymentMethodType) => {
    setIsProcessingPayment(true);

    const bookingPayload: BookingState = {
      sevaId: selectedSeva.id,
      sevaSlug: selectedSeva.slug,
      date: selectedDate,
      dayNumber: selectedDayNumber,
      nakshatra: selectedNakshatra,
      timeSlot: selectedSeva.time,
      primaryDevotee: devotee,
      familyMembers: familyMembers.filter((f) => f.name.trim().length > 0),
      specialPrayers,
      deliveryOption,
      paymentMethod: method,
      totalDakshina: selectedSeva.price,
      convenienceFee: 0,
      grandTotal: selectedSeva.price,
    };

    try {
      const confirmed = await bookingService.createBooking(bookingPayload);
      setConfirmedBooking(confirmed);
      setCurrentStep(6); // Step 6 = Success Screen

      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F2C14E', '#D6A532', '#FAF4E6', '#8B1E2D'],
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Reset Flow for Booking Another Seva
  const handleReset = () => {
    setCurrentStep(1);
    setConfirmedBooking(null);
    setDevotee({
      fullName: '',
      gotram: 'Bharadwaja',
      nakshatra: 'Rohini',
      sankalpamNames: '',
      phone: '',
      email: '',
      city: '',
      country: 'India',
      attendingPersonally: 'no',
      rasi: 'Vrishabha',
      address: '',
    });
    setFamilyMembers([]);
    setFormErrors({});
  };

  // Get Special Seva Eligible Dates
  const getEligibleDatesForSeva = () => {
    if (selectedSevaSlug === 'chandi-homam') {
      return [
        { dayNumber: 3, date: '27 Nov 2026', nakshatra: 'Arudra', status: 'available', slots: 25 },
        { dayNumber: 12, date: '06 Dec 2026', nakshatra: 'Swathi', status: 'few_slots', slots: 4 },
        { dayNumber: 21, date: '15 Dec 2026', nakshatra: 'Sathabhishekam', status: 'available', slots: 20 },
      ];
    }
    if (selectedSevaSlug === 'sarpa-suktam-homam') {
      return [
        { dayNumber: 2, date: '26 Nov 2026', nakshatra: 'Mrigasira', status: 'available', slots: 25 },
        { dayNumber: 11, date: '05 Dec 2026', nakshatra: 'Chitta', status: 'available', slots: 25 },
        { dayNumber: 20, date: '14 Dec 2026', nakshatra: 'Dhanishta', status: 'few_slots', slots: 6 },
      ];
    }
    if (selectedSevaSlug === 'ashlesha-bali') {
      return [
        { dayNumber: 6, date: '30 Nov 2026', nakshatra: 'Ashlesha', status: 'few_slots', slots: 8 },
      ];
    }
    if (selectedSevaSlug === 'valli-devasena-subramanyeswara-kalyanam') {
      return [
        { dayNumber: 27, date: '21 Dec 2026', nakshatra: 'Krithika', status: 'available', slots: 50 },
      ];
    }
    if (selectedSevaSlug === 'parvathi-parameswara-kalyanam') {
      return [
        { dayNumber: 28, date: '22 Dec 2026', nakshatra: 'Rohini (Concluding Day)', status: 'available', slots: 50 },
      ];
    }
    return null;
  };

  const specialDates = getEligibleDatesForSeva();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
          Online Seva Sankalpam Registration
        </Badge>
        <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-tight">
          LOKAKALYANAHITA SRIKARI ATI RUDRAM
        </h1>
        <p className="text-xs sm:text-sm text-ivory/80 font-sans">
          28 Days • 27 Nakshatras • Rohini to Rohini (25 Nov – 22 Dec 2026)
        </p>
      </div>

      {/* Progress Stepper (Only visible during steps 1-5) */}
      {currentStep <= 5 && (
        <BookingStepper currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />
      )}

      {/* Main Grid: Form Steps + Sticky Summary */}
      {currentStep <= 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Container */}
          <div className="lg:col-span-8">
            <Card variant="sacred" className="p-6 md:p-8 space-y-6">
              
              {/* ============================================================ */}
              {/* STEP 1: SELECT SEVA                                          */}
              {/* ============================================================ */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-gold/25 pb-3">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                      Step 01 of 05
                    </span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                      Select Sacred Seva or Homam
                    </h2>
                    <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                      Choose the auspicious ritual you wish to offer your Sankalpam for.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sevasList.map((seva) => {
                      const isSelected = selectedSevaSlug === seva.slug;
                      return (
                        <div
                          key={seva.id}
                          onClick={() => handleSelectSeva(seva.slug)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? 'bg-primary/70 border-gold shadow-gold-md scale-[1.01]'
                              : 'bg-burgundy-deep/75 border-gold/20 hover:border-gold/50 hover:bg-burgundy-deep'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase font-bold text-gold px-2 py-0.5 rounded bg-burgundy-deep border border-gold/30">
                                {seva.category}
                              </span>
                              <span className="font-cinzel text-lg font-black text-gold">
                                {formatCurrency(seva.price)}
                              </span>
                            </div>

                            <h3 className="font-cinzel text-base font-bold text-ivory group-hover:text-gold-light">
                              {isTe ? seva.titleTe : seva.title}
                            </h3>

                            <p className="text-xs text-ivory/75 font-sans leading-relaxed line-clamp-2">
                              {isTe ? seva.shortDescTe : seva.shortDesc}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                            <span className="text-[11px] text-emerald-400 font-sans flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Prasadam Included
                            </span>
                            <span className={`text-xs font-bold font-sans uppercase px-3 py-1 rounded-full ${
                              isSelected ? 'bg-gold text-burgundy-deep' : 'text-gold-light bg-burgundy-deep/80 border border-gold/30'
                            }`}>
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gold/20">
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={() => {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 shadow-gold-md"
                    >
                      Continue to Date / Nakshatra
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: SELECT DATE / NAKSHATRA                              */}
              {/* ============================================================ */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-gold/25 pb-3">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                      Step 02 of 05
                    </span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                      {selectedSevaSlug === 'nakshatra-shanthi'
                        ? 'Perform Nakshatra Shanthi on Your Janma Nakshatra'
                        : 'Select Auspicious Date & Nakshatram'}
                    </h2>
                    <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                      Selected Seva: <strong className="text-gold-light">{selectedSeva.title}</strong> ({formatCurrency(selectedSeva.price)})
                    </p>
                  </div>

                  {/* SPECIAL FLOW A: Nakshatra Shanthi (27 Janma Nakshatras Selector) */}
                  {selectedSevaSlug === 'nakshatra-shanthi' ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-burgundy-deep/90 border border-gold/35 space-y-3">
                        <div className="flex items-center gap-2 text-gold">
                          <Star className="w-5 h-5" />
                          <h3 className="font-cinzel text-sm sm:text-base font-bold">
                            Select Your Janma Nakshatram
                          </h3>
                        </div>
                        <p className="text-xs text-ivory/80 font-sans">
                          Select your birth star. Your Sankalpam will be conducted on the designated day of the 28-day cycle with special oblations.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 max-h-72 overflow-y-auto p-1">
                          {NAKSHATRAS.map((n) => {
                            const isSelected = janmaNakshatraFilter.toLowerCase() === n.nameEn.toLowerCase();
                            const matchedDay = scheduleList.find(
                              (d) => d.nakshatra.toLowerCase() === n.nameEn.toLowerCase()
                            );

                            return (
                              <button
                                key={n.id}
                                type="button"
                                onClick={() => handleJanmaNakshatraSelect(n.nameEn)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                  isSelected
                                    ? 'bg-gold text-burgundy-deep font-bold border-gold shadow-gold-sm'
                                    : 'bg-burgundy-deep text-ivory/90 border-gold/25 hover:border-gold/50'
                                }`}
                              >
                                <span className="font-bold block">{n.nameEn}</span>
                                <span className="text-[10px] opacity-80 block">{isTe ? n.nameTe : n.rasiEn}</span>
                                {matchedDay && (
                                  <span className="text-[9px] text-emerald-400 font-mono block mt-1">
                                    Day {matchedDay.dayNumber} ({matchedDay.date})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Day Match Highlight */}
                      <div className="p-4 rounded-2xl bg-primary/40 border border-gold/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gold tracking-wider block">
                            Assigned Mahayagnam Date
                          </span>
                          <span className="font-cinzel text-lg font-bold text-gold-lighter">
                            Day {selectedDayNumber} • {selectedDate} ({selectedNakshatra})
                          </span>
                          <span className="text-xs text-ivory/70 font-sans block mt-0.5">
                            Rituals: Sri Rudra Parayanam &amp; {selectedNakshatra} Shanthi Homam
                          </span>
                        </div>
                        <Badge variant="success" size="sm">Available</Badge>
                      </div>
                    </div>
                  ) : specialDates ? (
                    /* SPECIAL FLOW B: Special Seva with Designated Dates */
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gold-lighter font-sans">
                        Designated Auspicious Muhurtham Dates for {selectedSeva.title}
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {specialDates.map((item) => {
                          const isSelected = selectedDayNumber === item.dayNumber;
                          const isFullyBooked = item.status === 'fully_booked';

                          return (
                            <div
                              key={item.dayNumber}
                              onClick={() => {
                                if (!isFullyBooked) {
                                  setSelectedDayNumber(item.dayNumber);
                                  setSelectedDate(item.date);
                                  setSelectedNakshatra(item.nakshatra);
                                }
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                                isFullyBooked
                                  ? 'opacity-50 cursor-not-allowed bg-black/40 border-gray-600'
                                  : isSelected
                                  ? 'bg-primary/70 border-gold shadow-gold-md'
                                  : 'bg-burgundy-deep/80 border-gold/25 hover:border-gold/50'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-gold">
                                  Day {item.dayNumber}
                                </span>
                                <h4 className="font-cinzel text-lg font-bold text-gold-lighter">
                                  {item.date}
                                </h4>
                                <span className="text-xs text-ivory/80 font-sans block">
                                  Nakshatram: <strong className="text-gold-light">{item.nakshatra}</strong>
                                </span>
                              </div>

                              <div className="pt-2 border-t border-gold/15 flex items-center justify-between">
                                {isFullyBooked ? (
                                  <Badge variant="warning" size="sm">Fully Booked</Badge>
                                ) : item.status === 'few_slots' ? (
                                  <Badge variant="warning" size="sm">Few Slots Left ({item.slots})</Badge>
                                ) : (
                                  <Badge variant="success" size="sm">Available ({item.slots} Slots)</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* GENERAL FLOW C: 28 Days Selection */
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gold-lighter font-sans">
                        Select Any Day from the 28-Day Mahayagnam (25 Nov – 22 Dec 2026)
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1 scrollbar-none">
                        {scheduleList.map((day) => {
                          const isSelected = selectedDayNumber === day.dayNumber;
                          return (
                            <div
                              key={day.dayNumber}
                              onClick={() => {
                                setSelectedDayNumber(day.dayNumber);
                                setSelectedDate(day.date);
                                setSelectedNakshatra(day.nakshatra);
                              }}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-gold text-burgundy-deep font-bold border-gold shadow-gold-sm'
                                  : 'bg-burgundy-deep/80 text-ivory/90 border-gold/25 hover:border-gold/50'
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold block">Day {day.dayNumber}</span>
                              <span className="text-xs font-bold font-cinzel block mt-0.5">{day.nakshatra}</span>
                              <span className="text-[10px] opacity-80 block">{day.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setCurrentStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                      className="text-xs sm:text-sm font-semibold uppercase"
                    >
                      Back to Sevas
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={() => {
                        setCurrentStep(3);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 shadow-gold-md"
                    >
                      Continue to Sankalpam Details
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: ENTER SANKALPAM DETAILS                              */}
              {/* ============================================================ */}
              {currentStep === 3 && (
                <form onSubmit={handleProceedToReview} className="space-y-6">
                  <div className="border-b border-gold/25 pb-3">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                      Step 03 of 05
                    </span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                      Enter Sankalpam &amp; Devotee Details
                    </h2>
                    <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                      Please provide accurate Gotram and Names. Vedic Ritwiks will recite these during the sacred Pooja.
                    </p>
                  </div>

                  {/* Primary Devotee Information Grid */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-lighter font-sans flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gold" /> Primary Devotee Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                      <div>
                        <Input
                          label="Devotee Full Name *"
                          placeholder="e.g. K. Satyanarayana Sharma"
                          required
                          value={devotee.fullName}
                          onChange={(e) => setDevotee({ ...devotee, fullName: e.target.value })}
                          error={formErrors.fullName}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ivory/90 mb-1.5 font-sans">
                          Gotram *
                        </label>
                        <input
                          type="text"
                          list="gotrams-list"
                          placeholder="e.g. Bharadwaja / Kashyapa"
                          required
                          value={devotee.gotram}
                          onChange={(e) => setDevotee({ ...devotee, gotram: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl bg-burgundy-deep/90 border text-ivory placeholder:text-ivory/40 focus:outline-hidden focus:ring-2 focus:ring-gold text-xs sm:text-sm ${
                            formErrors.gotram ? 'border-red-400' : 'border-gold/30'
                          }`}
                        />
                        <datalist id="gotrams-list">
                          {COMMON_GOTRAMS.map((g) => (
                            <option key={g} value={g} />
                          ))}
                        </datalist>
                        {formErrors.gotram && (
                          <span className="text-[11px] text-red-400 mt-1 block">{formErrors.gotram}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ivory/90 mb-1.5 font-sans">
                          Janma Nakshatram *
                        </label>
                        <select
                          value={devotee.nakshatra}
                          onChange={(e) => setDevotee({ ...devotee, nakshatra: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-burgundy-deep/90 border border-gold/30 text-ivory focus:outline-hidden focus:ring-2 focus:ring-gold text-xs sm:text-sm"
                        >
                          {NAKSHATRAS.map((n) => (
                            <option key={n.id} value={n.nameEn} className="bg-[#2B0005] text-white">
                              {n.nameEn} ({n.nameTe})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ivory/90 mb-1.5 font-sans">
                          Rashi (Optional)
                        </label>
                        <select
                          value={devotee.rasi}
                          onChange={(e) => setDevotee({ ...devotee, rasi: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-burgundy-deep/90 border border-gold/30 text-ivory focus:outline-hidden focus:ring-2 focus:ring-gold text-xs sm:text-sm"
                        >
                          <option value="" className="bg-[#2B0005]">Select Rashi (Optional)</option>
                          {RASIS.map((r) => (
                            <option key={r.id} value={r.nameEn} className="bg-[#2B0005] text-white">
                              {r.nameEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Sankalpam Names (Family names to be recited during pooja) *"
                          placeholder="e.g. Satyanarayana, Annapurna, Shiva Karthik, Tejaswi"
                          required
                          value={devotee.sankalpamNames}
                          onChange={(e) => setDevotee({ ...devotee, sankalpamNames: e.target.value })}
                          error={formErrors.sankalpamNames}
                        />
                      </div>

                      <div>
                        <Input
                          label="Mobile Number (for SMS & WhatsApp Confirmation) *"
                          type="tel"
                          placeholder="10-digit mobile number"
                          required
                          value={devotee.phone}
                          onChange={(e) => setDevotee({ ...devotee, phone: e.target.value })}
                          error={formErrors.phone}
                        />
                      </div>

                      <div>
                        <Input
                          label="Email Address (for Digital Receipt) *"
                          type="email"
                          placeholder="devotee@example.com"
                          required
                          value={devotee.email}
                          onChange={(e) => setDevotee({ ...devotee, email: e.target.value })}
                          error={formErrors.email}
                        />
                      </div>

                      <div>
                        <Input
                          label="City *"
                          placeholder="e.g. Hyderabad / Dallas / London"
                          required
                          value={devotee.city}
                          onChange={(e) => setDevotee({ ...devotee, city: e.target.value })}
                          error={formErrors.city}
                        />
                      </div>

                      <div>
                        <Input
                          label="Country *"
                          placeholder="e.g. India / USA / UK"
                          required
                          value={devotee.country}
                          onChange={(e) => setDevotee({ ...devotee, country: e.target.value })}
                          error={formErrors.country}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-ivory/90 mb-1.5 font-sans">
                          Attending Personally at Yagasala? *
                        </label>
                        <div className="flex gap-6 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-ivory">
                            <input
                              type="radio"
                              name="attending"
                              value="yes"
                              checked={devotee.attendingPersonally === 'yes'}
                              onChange={() => setDevotee({ ...devotee, attendingPersonally: 'yes' })}
                              className="accent-[#D6A532]"
                            />
                            <span>Yes, attending in-person</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-ivory">
                            <input
                              type="radio"
                              name="attending"
                              value="no"
                              checked={devotee.attendingPersonally === 'no'}
                              onChange={() => setDevotee({ ...devotee, attendingPersonally: 'no' })}
                              className="accent-[#D6A532]"
                            />
                            <span>No, perform on my behalf (Online Sankalpam)</span>
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Full Postal Address (Optional — for delivery of Consecrated Prasadam)"
                          placeholder="House/Flat No, Street, Landmark, Pin code"
                          value={devotee.address || ''}
                          onChange={(e) => setDevotee({ ...devotee, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Family Members for Sankalpam */}
                  <div className="pt-4 border-t border-gold/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold-lighter font-sans">
                          Additional Family Members for Sankalpam (Optional)
                        </h3>
                        <p className="text-[11px] text-ivory/70 font-sans">
                          Add specific details for your spouse, children, or parents.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFamily}
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        className="text-xs font-semibold text-gold-light hover:text-gold"
                      >
                        Add Member
                      </Button>
                    </div>

                    {familyMembers.map((fm, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-burgundy-deep/80 border border-gold/25 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gold uppercase tracking-wider">
                            Family Member #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFamily(idx)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-sans">
                          <div>
                            <label className="block text-[11px] font-semibold text-ivory/80 mb-1">Name</label>
                            <input
                              type="text"
                              placeholder="Name"
                              value={fm.name}
                              onChange={(e) => handleFamilyChange(idx, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-burgundy-deep border border-gold/25 text-ivory text-xs focus:ring-1 focus:ring-gold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-ivory/80 mb-1">Relation</label>
                            <select
                              value={fm.relation}
                              onChange={(e) => handleFamilyChange(idx, 'relation', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-burgundy-deep border border-gold/25 text-ivory text-xs"
                            >
                              {RELATIONS.map((r) => (
                                <option key={r.id} value={r.nameEn} className="bg-[#2B0005]">
                                  {r.nameEn}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-ivory/80 mb-1">Gotram</label>
                            <input
                              type="text"
                              placeholder="Gotram"
                              value={fm.gotram || ''}
                              onChange={(e) => handleFamilyChange(idx, 'gotram', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-burgundy-deep border border-gold/25 text-ivory text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-ivory/80 mb-1">Nakshatram</label>
                            <select
                              value={fm.nakshatra || ''}
                              onChange={(e) => handleFamilyChange(idx, 'nakshatra', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-burgundy-deep border border-gold/25 text-ivory text-xs"
                            >
                              <option value="">Select (Optional)</option>
                              {NAKSHATRAS.map((n) => (
                                <option key={n.id} value={n.nameEn} className="bg-[#2B0005]">
                                  {n.nameEn}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                      className="text-xs sm:text-sm font-semibold uppercase"
                    >
                      Back to Date
                    </Button>
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 shadow-gold-md"
                    >
                      Review Booking Details
                    </Button>
                  </div>
                </form>
              )}

              {/* ============================================================ */}
              {/* STEP 4: REVIEW DETAILS                                       */}
              {/* ============================================================ */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-gold/25 pb-3">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                      Step 04 of 05
                    </span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                      Review Your Booking &amp; Sankalpam Details
                    </h2>
                    <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                      Please verify all details before proceeding to payment.
                    </p>
                  </div>

                  {/* Complete Review Card */}
                  <div className="p-6 rounded-2xl bg-burgundy-deep/90 border-2 border-gold/40 space-y-5 text-xs sm:text-sm font-sans">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gold/20">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                          Selected Seva
                        </span>
                        <h3 className="font-cinzel text-lg sm:text-xl font-black text-gold-lighter">
                          {selectedSeva.title}
                        </h3>
                      </div>
                      <span className="font-cinzel text-2xl font-black text-gold">
                        {formatCurrency(selectedSeva.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gold-light font-semibold block">Scheduled Date:</span>
                        <span className="text-ivory font-bold">{selectedDate} (Day {selectedDayNumber})</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Nakshatram:</span>
                        <span className="text-ivory font-bold">{selectedNakshatra}</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Primary Devotee:</span>
                        <span className="text-ivory font-bold">{devotee.fullName}</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Gotram &amp; Nakshatram:</span>
                        <span className="text-ivory font-bold">Gotram: {devotee.gotram} • Star: {devotee.nakshatra}</span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-gold-light font-semibold block">Sankalpam Chanted Names:</span>
                        <span className="text-ivory font-bold block">{devotee.sankalpamNames}</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Contact:</span>
                        <span className="text-ivory">{devotee.phone} • {devotee.email}</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Location:</span>
                        <span className="text-ivory">{devotee.city}, {devotee.country}</span>
                      </div>

                      <div>
                        <span className="text-gold-light font-semibold block">Attending In-Person:</span>
                        <span className="text-ivory font-semibold">{devotee.attendingPersonally === 'yes' ? 'Yes' : 'No'}</span>
                      </div>

                      {devotee.address && (
                        <div className="sm:col-span-2">
                          <span className="text-gold-light font-semibold block">Prasadam Delivery Address:</span>
                          <span className="text-ivory">{devotee.address}</span>
                        </div>
                      )}
                    </div>

                    {familyMembers.length > 0 && (
                      <div className="pt-3 border-t border-gold/20 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold block">
                          Family Members ({familyMembers.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {familyMembers.map((fm, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-primary/40 border border-gold/20 flex justify-between">
                              <span className="font-semibold text-ivory">{fm.name}</span>
                              <span className="text-gold-light">{fm.relation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setCurrentStep(3);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                      className="text-xs sm:text-sm font-semibold uppercase"
                    >
                      Edit Details
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={() => {
                        setCurrentStep(5);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold uppercase tracking-wider text-xs sm:text-sm px-6 py-3.5 shadow-gold-md"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 5: MAKE PAYMENT                                         */}
              {/* ============================================================ */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-gold/25 pb-3">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block font-sans">
                      Step 05 of 05
                    </span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-lighter mt-1">
                      Offer Auspicious Dakshina
                    </h2>
                    <p className="text-xs sm:text-sm text-ivory/75 font-sans mt-1">
                      Select your preferred payment mode to complete the registration.
                    </p>
                  </div>

                  <PaymentUI
                    amount={selectedSeva.price}
                    onPaymentSuccess={handlePaymentSuccess}
                    isProcessing={isProcessingPayment}
                  />

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentStep(4);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                      className="text-xs uppercase font-semibold"
                    >
                      Back to Review
                    </Button>
                  </div>
                </div>
              )}

            </Card>
          </div>

          {/* Sticky Summary Card (Desktop) */}
          <div className="lg:col-span-4">
            <BookingSummaryCard
              seva={selectedSeva}
              selectedDate={selectedDate}
              dayNumber={selectedDayNumber}
              nakshatra={selectedNakshatra}
              primaryName={devotee.fullName}
              gotram={devotee.gotram}
              familyCount={familyMembers.length}
            />
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* BOOKING SUCCESS SCREEN (STEP 6)                              */
        /* ============================================================ */
        confirmedBooking && (
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-tight">
                BOOKING CONFIRMED &amp; BLESSED
              </h2>
              <p className="text-sm text-ivory/80 font-sans leading-relaxed">
                May Lord Shiva bless you and your family with boundless health, peace and prosperity. A digital receipt has been registered.
              </p>
            </div>

            {/* Printable Receipt Card */}
            <ReceiptCard booking={confirmedBooking} onReset={handleReset} />
          </div>
        )
      )}
    </div>
  );
}
