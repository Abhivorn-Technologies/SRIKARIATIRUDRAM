'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { bookingService } from '@/services/booking.service';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  ArrowLeft,
  Check,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [draft, setDraft] = useState(() => bookingService.getActiveDraft());
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const current = bookingService.getActiveDraft();
    if (!current.devoteeName || !current.selectedDate || !current.sevaName) {
      router.push(`/${locale}/book-seva/review`);
      return;
    }
    setDraft(current);
  }, [locale, router]);

  const handleMakePayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const confirmed = await bookingService.createBooking({
        ...draft,
        paymentStatus: 'CONFIRMED',
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
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
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

        {/* Payment Methods Card */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'upi'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.4)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#230206] border-[#D6A532]/25 hover:border-[#D6A532]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#F2C14E]" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#FAF4E6] block">UPI / GPay / PhonePe</span>
                  <span className="text-[10px] text-[#FFF8E8]/60">Instant payment via any UPI App</span>
                </div>
              </div>
              {paymentMethod === 'upi' && (
                <div className="w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* QR Code Option */}
            <div
              onClick={() => setPaymentMethod('qr')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'qr'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.4)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#230206] border-[#D6A532]/25 hover:border-[#D6A532]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-[#F2C14E]" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#FAF4E6] block">Scan Mandir QR</span>
                  <span className="text-[10px] text-[#FFF8E8]/60">Scan and pay from banking app</span>
                </div>
              </div>
              {paymentMethod === 'qr' && (
                <div className="w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Card Option */}
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'card'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.4)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#230206] border-[#D6A532]/25 hover:border-[#D6A532]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#F2C14E]" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#FAF4E6] block">Credit / Debit Cards</span>
                  <span className="text-[10px] text-[#FFF8E8]/60">Visa, Mastercard, RuPay</span>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Net Banking Option */}
            <div
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'netbanking'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.4)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#230206] border-[#D6A532]/25 hover:border-[#D6A532]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#F2C14E]" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#FAF4E6] block">Net Banking</span>
                  <span className="text-[10px] text-[#FFF8E8]/60">All Indian Banks supported</span>
                </div>
              </div>
              {paymentMethod === 'netbanking' && (
                <div className="w-5 h-5 rounded-full bg-[#F2C14E] text-[#280509] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-sans">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[#E8C76A]/80 pt-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-bit encrypted secure checkout. Consecrated digital receipt generated instantly.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#D6A532]/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <Link href="/book-seva/review" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#D6A532]/50 text-[#FAF4E6] hover:bg-[#5A0714] font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isTe ? 'సమీక్షకు తిరిగి వెళ్లండి' : isHi ? 'समीक्षा पर लौटें' : 'BACK TO REVIEW'}</span>
              </button>
            </Link>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleMakePayment}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer disabled:opacity-50"
            >
              <span>{isProcessing ? 'PROCESSING PAYMENT...' : 'COMPLETE DONATION & REGISTER SEVA'}</span>
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
