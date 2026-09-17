'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { specialSevaBookingService } from '@/services/specialSevaBooking.service';
import { ConfirmedBooking } from '@/types/booking';
import { SpecialSevaStepper } from '@/components/special-seva/SpecialSevaStepper';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Download, Home, Share2, ArrowLeft } from 'lucide-react';

export default function SpecialSevaSuccessPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const bookingIdParam = searchParams.get('id');
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('srikari_devotee_bookings');
        if (stored) {
          const all: ConfirmedBooking[] = JSON.parse(stored);
          if (bookingIdParam) {
            const found = all.find((b) => b.bookingId === bookingIdParam);
            if (found) {
              setBooking(found);
              return;
            }
          }
          if (all.length > 0) {
            setBooking(all[0]);
          }
        }
      } catch (e) {
        console.warn('Could not read devotee bookings', e);
      }
    }
  }, [bookingIdParam]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined' || !booking) return;
    const text = encodeURIComponent(
      `Om Namah Shivaya! 🙏\nI have registered for ${booking.sevaName || booking.sevaSlug} at SRIKARI ATI RUDRA MAHAYAGNAM.\nBooking ID: ${booking.bookingId}\nDay: Day ${booking.dayNumber || 1} (${booking.selectedDate || booking.date})\nNakshatra: ${booking.nakshatra}\nDevotee: ${booking.primaryDevotee.fullName}\nGotram: ${booking.primaryDevotee.gotram}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const displaySeva = booking?.sevaName || booking?.sevaSlug || 'Special Seva';
  const displayDate = booking?.selectedDate || booking?.date || '25 November 2026';
  const displayId = booking?.bookingId || 'SAR-2026-000123';
  const displayAmount = booking?.amount || booking?.grandTotal || booking?.totalDakshina || 0;
  const displayName = booking?.primaryDevotee.fullName || 'Devotee';
  const displayGotram = booking?.primaryDevotee.gotram || 'Not Provided';
  const displayNakshatra = booking?.nakshatra || booking?.primaryDevotee.nakshatra || 'Not Provided';
  const displayRasi = booking?.rasi || booking?.primaryDevotee.rasi || '';
  const displayDayNum = booking?.dayNumber ? `DAY ${booking.dayNumber < 10 ? `0${booking.dayNumber}` : booking.dayNumber}` : 'DAY 01';
  const isAttending = booking?.devoteeParticipation === 'attending' || booking?.primaryDevotee.attendingPersonally === 'yes';

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12 print:p-0 print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 print:p-0 print:max-w-none">
        
        {/* Top Navigation Row: Back to Home Button */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/sevas"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'ప్రత్యేక సేవల జాబితాకు' : isHi ? 'विशेष सेवाओं पर वापस' : 'Back to Special Sevas'}</span>
          </Link>
        </div>

        {/* Progress Stepper: Step 4 CONFIRMED (hidden during print) */}
        <div className="print:hidden">
          <SpecialSevaStepper currentStep={4} />
        </div>

        {/* Success Confirmation Card */}
        <Card
          variant="sacred"
          className="p-6 sm:p-10 space-y-8 bg-[#2B040A]/95 border-2 border-[#D6A532]/60 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-center print:border-none print:shadow-none print:bg-white print:text-black"
        >
          {/* Sacred Lamp & Title (NO STEP 9) */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5A0714] border-2 border-[#F2C14E] shadow-[0_0_25px_rgba(214,165,50,0.5)] text-3xl select-none mb-1 print:hidden">
              🪔
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-sans tracking-widest text-[#E8C76A] font-bold block print:hidden">
                HAR HAR MAHADEV
              </span>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532] tracking-wide print:text-black">
                {isTe ? 'సేవ నమోదు ధ్రువీకరించబడింది' : isHi ? 'बुकिंग कन्फर्म हो गई' : 'BOOKING CONFIRMED'}
              </h1>
              <p className="text-sm sm:text-base text-[#FFF8E8]/90 font-sans max-w-lg mx-auto print:text-black">
                {isTe
                  ? 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞంలో పాల్గొన్నందుకు ధన్యవాదాలు. మీ పవిత్ర సంకల్ప సేవ నమోదు చేయబడింది.'
                  : isHi
                  ? 'श्रीकरी अति रुद्र महायज्ञ में सम्मिलित होने हेतु धन्यवाद। आपका पावन संकल्प पंजीकृत हो चुका है।'
                  : 'Thank you for participating in SRIKARI ATI RUDRA MAHAYAGNAM. Your sacred Sankalpam has been registered.'}
              </p>
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="p-6 rounded-2xl bg-[#35030A]/90 border border-[#D6A532]/40 text-left space-y-4 font-sans print:bg-gray-50 print:border-gray-300 print:text-black">
            <div className="flex items-center justify-between border-b border-[#D6A532]/25 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'రసీదు సంఖ్య / బుకింగ్ ఐడి' : isHi ? 'रसीद संख्या / बुकिंग आईडी' : 'BOOKING / RECEIPT ID'}
                </span>
                <span className="font-cinzel text-lg sm:text-xl font-black text-[#F2C14E] print:text-black">
                  {displayId}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  PAYMENT STATUS
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-cinzel text-xs font-black tracking-wider uppercase inline-block">
                  {isTe ? 'ధ్రువీకరించబడింది' : isHi ? 'कन्फर्म' : 'CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  DEVOTEE NAME
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  {displayName}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  GOTRAM
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  {displayGotram}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  SPECIAL SEVA
                </span>
                <span className="font-cinzel font-bold text-[#FAF4E6] print:text-black">
                  {displaySeva}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  DAY
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  {displayDayNum}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  PROGRAMME DATE
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  {displayDate}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  JANMA NAKSHATRA
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  ⭐ {displayNakshatra}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  RASI
                </span>
                <span className="font-bold text-[#FAF4E6] print:text-black">
                  ♈ {displayRasi}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  DONATION AMOUNT
                </span>
                <span className="font-cinzel text-base font-black text-[#F2C14E] print:text-black">
                  {formatCurrency(displayAmount)}
                </span>
              </div>

              <div className="space-y-0.5 sm:col-span-2 pt-2 border-t border-[#D6A532]/20">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  DEVOTEE PARTICIPATION
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider font-cinzel ${
                  isAttending
                    ? 'bg-[#5A0714] text-[#F2C14E] border border-[#F2C14E]/60 print:bg-transparent print:border-gray-400 print:text-black'
                    : 'bg-[#230206] text-[#FAF4E6]/90 border border-[#D6A532]/30 print:bg-transparent print:border-gray-400 print:text-black'
                }`}>
                  <span>{isAttending ? '🪔' : '📦'}</span>
                  <span>
                    {isAttending ? 'ATTENDING IN PERSON' : 'NOT ATTENDING IN PERSON (COURIER PRASADAM)'}
                  </span>
                </span>
              </div>
            </div>

            {booking?.primaryDevotee?.sankalpamNames && (
              <div className="pt-2 border-t border-[#D6A532]/20 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'సంకల్ప నామాలు' : 'Sankalpam Chanting Names'}
                </span>
                <span className="text-[#FFF8E8]/90 print:text-black">
                  {booking.primaryDevotee.sankalpamNames}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons (Download Receipt, WhatsApp Share & Back to Home) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isTe ? 'రసీదు డౌన్‌లోడ్' : isHi ? 'रसीद डाउनलोड करें' : 'DOWNLOAD RECEIPT'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <Link href="/" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full px-6 py-3.5 rounded-xl border border-[#D6A532]/50 text-[#FAF4E6] hover:bg-[#5A0714] font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <Home className="w-4 h-4" />
                <span>{isTe ? 'హోమ్‌కు వెళ్లండి' : isHi ? 'मुख्य पृष्ठ पर जाएँ' : 'BACK TO HOME'}</span>
              </button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
