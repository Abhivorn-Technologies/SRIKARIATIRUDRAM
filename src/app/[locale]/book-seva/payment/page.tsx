'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { bookingService } from '@/services/booking.service';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { Card } from '@/components/ui/Card';
import { PaymentUI, PaymentMethodType } from '@/components/booking/PaymentUI';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<any>({ amount: 0, devoteeName: '', sevaName: '', selectedDate: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = bookingService.getActiveDraft();
    if (!current.devoteeName || !current.selectedDate || !current.sevaName) {
      router.push(`/${locale}/book-seva/review`);
      return;
    }
    setDraft(current);
  }, [locale, router]);

  const handlePaymentSuccess = async (method: PaymentMethodType, transactionId?: string) => {
    setIsProcessing(true);
    try {
      const confirmed = await bookingService.createBooking({
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

      // Clear draft and redirect to success step
      bookingService.clearActiveDraft();
      router.push(`/${locale}/book-seva/success?id=${confirmed.bookingId}`);
    } catch (err: any) {
      console.error('Payment confirmation error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-12 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D6A532] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-xs text-[#F2C14E]">Loading Sacred Payment Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/book-seva/review"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'వెనుకకు' : isHi ? 'वापस' : 'Back'}</span>
          </Link>
        </div>

        {/* Progress Stepper: Step 4 PAYMENT */}
        <BookingStepper currentStep={4} />

        {/* Payment Summary Header Card */}
        <Card variant="sacred" className="p-6 sm:p-7 space-y-5 bg-[#2B040A]/95 border-[#D6A532]/50 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-3">
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532]">
              {isTe ? 'దాన సమర్పణ / చెల్లింపు' : isHi ? 'दान समर्पण / भुगतान' : 'PAYMENT & DAKSHINA DETAILS'}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'ఎంచుకున్న సేవ' : 'Selected Seva'}
              </span>
              <span className="font-cinzel text-base font-bold text-[#FAF4E6]">
                {draft.sevaName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'యజ్ఞ తేదీ' : 'Mahayagnam Date'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                Day {draft.dayNumber} ({draft.selectedDate})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుని పేరు & గోత్రం' : 'Devotee & Gotram'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                {draft.devoteeName} ({draft.gotram})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'నక్షత్రం' : 'Janma Nakshatra'}
              </span>
              <span className="font-semibold text-[#FAF4E6]">
                {draft.janmaNakshatra || draft.nakshatra} Star
              </span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుల ప్రత్యక్ష భాగస్వామ్యం' : 'Devotee Participation'}
              </span>
              <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5">
                <span>{draft.devoteeParticipation === 'attending' ? '🪔' : '📦'}</span>
                <span>
                  {draft.devoteeParticipation === 'attending'
                    ? (isTe ? 'అవును, నేను స్వయంగా పాల్గొంటాను' : isHi ? 'हाँ, मैं उपस्थित रहूँगा' : 'Yes, I will attend in person')
                    : (isTe ? 'కాదు, నేను హాజరు కాలేను' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा' : 'No, I will not attend (Courier Prasadam)')}
                </span>
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-[#35030A] border border-[#D6A532]/40 flex items-center justify-between">
            <span className="font-cinzel text-xs sm:text-sm uppercase tracking-widest text-[#E8C76A] font-bold">
              {isTe ? 'మొత్తం సమర్పణ / విరాళం' : isHi ? 'कुल समर्पण राशि' : 'TOTAL SACRED CONTRIBUTION'}
            </span>
            <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#F2C14E]">
              {formatCurrency(draft.amount)}
            </span>
          </div>
        </Card>

        {/* Razorpay Payment Card */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
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
