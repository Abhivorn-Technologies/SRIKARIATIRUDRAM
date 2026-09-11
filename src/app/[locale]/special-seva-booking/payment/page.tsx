'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { specialSevaBookingService, SpecialSevaBookingDraft } from '@/services/specialSevaBooking.service';
import { SpecialSevaStepper } from '@/components/special-seva/SpecialSevaStepper';
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
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SpecialSevaPaymentPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [draft, setDraft] = useState<SpecialSevaBookingDraft>(() => specialSevaBookingService.getActiveDraft());
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const current = specialSevaBookingService.getActiveDraft();
    if (!current.devoteeName || !current.selectedDate || !current.sevaName || !current.selectedDay) {
      router.push(`/${locale}/special-seva-booking/details`);
      return;
    }
    setDraft(current);
  }, [locale, router]);

  const handleMakePayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const confirmed = await specialSevaBookingService.createBooking({
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

      // Clear active draft and route to success
      specialSevaBookingService.clearActiveDraft();
      router.push(`/${locale}/special-seva-booking/success?id=${confirmed.bookingId}`);
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
                    : (isTe ? 'కాదు, నేను హాజరు కాలేను (ప్రసాదం పోస్ట్ ద్వారా)' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा' : 'NO, I WILL NOT ATTEND (Courier Delivery)')}
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

        {/* Payment Methods Selection */}
        <Card variant="sacred" className="p-6 sm:p-7 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D6A532]/25 pb-3">
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#FAF4E6] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#F2C14E]" />
              <span>{isTe ? 'చెల్లింపు పద్ధతిని ఎంచుకోండి' : isHi ? 'भुगतान विधि चुनें' : 'SELECT PAYMENT METHOD'}</span>
            </h2>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>256-bit Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Method 1: UPI */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                paymentMethod === 'upi'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.3)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#2A0409] border border-[#D6A532]/40 text-[#F2C14E]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#FAF4E6]">UPI Apps</h4>
                  <p className="text-[11px] text-[#E8C76A]/80 font-sans">GPay / PhonePe / Paytm</p>
                </div>
              </div>
              {paymentMethod === 'upi' && <Check className="w-5 h-5 text-[#F2C14E]" />}
            </div>

            {/* Method 2: Instant QR */}
            <div
              onClick={() => setPaymentMethod('qr')}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                paymentMethod === 'qr'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.3)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#2A0409] border border-[#D6A532]/40 text-[#F2C14E]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#FAF4E6]">Dynamic QR</h4>
                  <p className="text-[11px] text-[#E8C76A]/80 font-sans">Scan & Pay Instantly</p>
                </div>
              </div>
              {paymentMethod === 'qr' && <Check className="w-5 h-5 text-[#F2C14E]" />}
            </div>

            {/* Method 3: Cards */}
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                paymentMethod === 'card'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.3)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#2A0409] border border-[#D6A532]/40 text-[#F2C14E]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#FAF4E6]">Cards</h4>
                  <p className="text-[11px] text-[#E8C76A]/80 font-sans">Debit / Credit / RuPay</p>
                </div>
              </div>
              {paymentMethod === 'card' && <Check className="w-5 h-5 text-[#F2C14E]" />}
            </div>

            {/* Method 4: Net Banking */}
            <div
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                paymentMethod === 'netbanking'
                  ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.3)] ring-1 ring-[#F2C14E]'
                  : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#2A0409] border border-[#D6A532]/40 text-[#F2C14E]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#FAF4E6]">Net Banking</h4>
                  <p className="text-[11px] text-[#E8C76A]/80 font-sans">All Major Indian Banks</p>
                </div>
              </div>
              {paymentMethod === 'netbanking' && <Check className="w-5 h-5 text-[#F2C14E]" />}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-sans">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Action Buttons: Back & Complete Payment */}
          <div className="pt-4 border-t border-[#D6A532]/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <Link href="/special-seva-booking/details" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#D6A532]/50 text-[#FAF4E6] hover:bg-[#5A0714] font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isTe ? 'వివరాలు సవరించండి' : isHi ? 'विवरण बदलें' : 'EDIT DETAILS'}</span>
              </button>
            </Link>

            <button
              onClick={handleMakePayment}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
            >
              {isProcessing ? (
                <span>{isTe ? 'ప్రాసెస్ అవుతోంది...' : 'PROCESSING SACRED OFFERING...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isTe ? `సమర్పించండి ${formatCurrency(draft.amount)}` : `CONFIRM & PAY ${formatCurrency(draft.amount)}`}</span>
                </>
              )}
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
