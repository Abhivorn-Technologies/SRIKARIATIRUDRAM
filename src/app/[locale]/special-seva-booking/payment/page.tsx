'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { specialSevaBookingService, SpecialSevaBookingDraft } from '@/services/specialSevaBooking.service';
import { SpecialSevaStepper } from '@/components/special-seva/SpecialSevaStepper';
import { Card } from '@/components/ui/Card';
import { PaymentUI, PaymentMethodType } from '@/components/booking/PaymentUI';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SpecialSevaPaymentPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [draft, setDraft] = useState<SpecialSevaBookingDraft>(() => specialSevaBookingService.getActiveDraft());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const current = specialSevaBookingService.getActiveDraft();
    if (!current.devoteeName || !current.selectedDate || !current.sevaName || !current.selectedDay) {
      router.push(`/${locale}/special-seva-booking/details`);
      return;
    }
    setDraft(current);
  }, [locale, router]);

  const handlePaymentSuccess = async (method: PaymentMethodType, transactionId?: string) => {
    setIsProcessing(true);
    try {
      const confirmed = await specialSevaBookingService.createBooking({
        ...draft,
        paymentStatus: 'CONFIRMED',
        transactionId: transactionId || `RAZORPAY_${Date.now()}`,
      });

      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F2C14E', '#D6A532', '#FAF4E6', '#8B1E2D'],
        });
      }

      // Clear active draft and route to success
      specialSevaBookingService.clearActiveDraft();
      router.push(`/${locale}/special-seva-booking/success?id=${confirmed.bookingId}`);
    } catch (err: any) {
      console.error('Payment confirmation error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/special-seva-booking/details"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'భక్తుని వివరాలకు వెనుకకు' : isHi ? 'विवरण पर वापस' : 'Back to Devotee Details'}</span>
          </Link>
        </div>

        {/* Progress Stepper: Step 3 PAYMENT */}
        <SpecialSevaStepper currentStep={3} />

        {/* Payment Summary Header Card */}
        <Card variant="sacred" className="p-6 sm:p-7 space-y-5 bg-[#2B040A]/95 border-[#D6A532]/50 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-3">
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532]">
              {isTe ? 'దాన సమర్పణ / చెల్లింపు' : isHi ? 'दान समर्पण / भुगतान' : 'Donation / Payment'}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'ప్రత్యేక సేవ' : 'SPECIAL SEVA'}
              </span>
              <span className="font-cinzel text-base font-bold text-[#FAF4E6]">
                {draft.sevaName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'ఎంచుకున్న మహాయజ్ఞ దినం' : 'SELECTED MAHAYAJNAM DAY'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                DAY {(draft.selectedDay || 1) < 10 ? `0${draft.selectedDay || 1}` : draft.selectedDay}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'కార్యక్రమ నక్షత్రం' : 'PROGRAMME NAKSHATRA'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                🔱 {draft.mahayajnamNakshatra || draft.nakshatra || 'Rohini'} Star
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'కార్యక్రమ తేదీ' : 'PROGRAMME DATE'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                📅 {draft.selectedDate}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుని జన్మ నక్షత్రం' : 'DEVOTEE JANMA NAKSHATRA'}
              </span>
              <span className="font-bold text-[#F2C14E]">
                ⭐ {draft.janmaNakshatra || 'Rohini'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'రాశి' : 'RASI'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                ♈ {draft.rasi || 'Mesha (Aries)'}
              </span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుని పేరు & గోత్రం' : 'DEVOTEE & GOTRAM'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                {draft.devoteeName} ({draft.gotram})
              </span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుల ప్రత్యక్ష భాగస్వామ్యం' : 'DEVOTEE PARTICIPATION'}
              </span>
              <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5">
                <span>{draft.devoteeParticipation === 'attending' ? '🪔' : '📦'}</span>
                <span>
                  {draft.devoteeParticipation === 'attending'
                    ? (isTe ? 'అవును, నేను స్వయంగా పాల్గొంటాను' : isHi ? 'हाँ, मैं उपस्थित रहूँगा' : 'YES, I WILL ATTEND')
                    : (Number(draft.amount || 0) >= 5000
                        ? (isTe ? 'కాదు, నేను హాజరు కాలేను (ప్రసాదం పోస్ట్ ద్వారా)' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा' : 'NO, I WILL NOT ATTEND (Courier Delivery)')
                        : (isTe ? 'కాదు, నేను హాజరు కాలేను (సంకల్పం మీ పేరుతో)' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा (आपके नाम से संकल्प)' : 'NO, I WILL NOT ATTEND (Sankalpam in your name)'))}
                </span>
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="rounded-xl bg-gradient-to-r from-[#4A0A14] to-[#1F0205] border-2 border-[#D6A532]/70 p-4 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E8C76A] tracking-wider block">
                {isTe ? 'మొత్తం సేవా సమర్పణ' : isHi ? 'कुल सेवा राशि' : 'CONTRIBUTION'}
              </span>
              <span className="text-xs text-[#FAF4E6]/75 font-sans">
                {isTe ? '100% పవిత్ర యజ్ఞ కైంకర్యం' : 'Sacred Mahayagnam Offering'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#F2C14E] drop-shadow-md">
                {formatCurrency(draft.amount)}
              </span>
            </div>
          </div>
        </Card>

        {/* Razorpay Payment Methods Selection Card */}
        <Card variant="sacred" className="p-6 sm:p-7 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="space-y-1">
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#FAF4E6] tracking-wide">
              {isTe ? 'చెల్లింపు విధానం ఎంచుకోండి' : isHi ? 'भुगतान विधि चुनें' : 'SELECT PAYMENT METHOD'}
            </h2>
            <p className="text-xs text-[#FFF8E8]/70 font-sans">
              {isTe
                ? 'సురక్షిత ఆన్‌లైన్ పేమెంట్ గేట్‌వే (UPI, QR కోడ్, క్రెడిట్/డెబిట్ కార్డు లేదా నెట్ బ్యాంకింగ్).'
                : 'Secure encrypted payment options (Instant UPI, Dynamic QR, Debit/Credit Card, or Net Banking).'}
            </p>
          </div>

          <PaymentUI
            amount={draft.amount}
            devoteeName={draft.devoteeName}
            devoteePhone={draft.mobile}
            devoteeEmail={draft.email}
            onPaymentSuccess={handlePaymentSuccess}
            isProcessing={isProcessing}
          />
        </Card>

      </div>
    </div>
  );
}
