'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { bookingService } from '@/services/booking.service';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  User,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  Flame,
} from 'lucide-react';

export default function BookingReviewPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [draft, setDraft] = useState(() => bookingService.getActiveDraft());

  useEffect(() => {
    const current = bookingService.getActiveDraft();
    if (!current.devoteeName || !current.selectedDate || !current.sevaName) {
      router.push(`/${locale}/book-seva/details`);
      return;
    }
    setDraft(current);
  }, [locale, router]);

  const handleProceedToPayment = () => {
    router.push(`/${locale}/book-seva/payment`);
  };

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/book-seva/details"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'వెనుకకు' : isHi ? 'वापस' : 'Back'}</span>
          </Link>
        </div>

        {/* Progress Stepper: Step 3 REVIEW */}
        <BookingStepper currentStep={3} />

        {/* Review Header Card */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/50 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F2C14E]">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                  {isTe ? 'సేవ వివరాల సమీక్ష' : isHi ? 'सेवा विवरण समीक्षा' : 'REVIEW YOUR SANKALPAM'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
                {isTe
                  ? 'దయచేసి సమర్పించిన వివరాలను సరిచూసుకుని దాన సమర్పణకు కొనసాగండి.'
                  : isHi
                  ? 'कृपया सभी विवरणों की पुष्टि करें और दक्षिणा समर्पण हेतु आगे बढ़ें।'
                  : 'Please verify your Sankalpam and Seva details before making the sacred contribution.'}
              </p>
            </div>

            <Badge variant="gold" size="sm" className="font-cinzel uppercase tracking-wider shrink-0">
              {draft.dayType || 'MAHAYAGNAM SEVA'}
            </Badge>
          </div>

          {/* Section 1: Seva & Nakshatra Information */}
          <div className="p-5 rounded-xl bg-[#35030A]/90 border border-[#D6A532]/35 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6A532]/20 pb-2.5">
              <span className="text-[11px] uppercase font-sans font-bold tracking-widest text-[#E8C76A]">
                {isTe ? 'సేవ & ముహూర్త వివరాలు' : 'SEVA & NAKSHATRA DETAILS'}
              </span>
              <span className="font-cinzel text-xs text-[#F2C14E] font-bold">
                Day {draft.dayNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm font-sans">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'ఎంచుకున్న సేవ' : 'Selected Seva'}
                </span>
                <span className="font-cinzel text-base font-bold text-[#FAF4E6] block">
                  {draft.sevaName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'యజ్ఞ తేదీ' : 'Mahayagnam Date'}
                </span>
                <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {draft.selectedDate}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'జన్మ నక్షత్రం & రాశి' : 'Janma Nakshatra & Rasi'}
                </span>
                <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {draft.janmaNakshatra || draft.nakshatra} {draft.rasi ? `(${draft.rasi})` : ''}
                </span>
              </div>
            </div>

            {draft.specialProgramme && (
              <div className="p-3 rounded-lg bg-[#230206] border border-[#F2C14E]/30 flex items-center gap-2.5 text-xs text-[#FAF4E6]">
                <Flame className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>
                  <strong className="text-[#F2C14E] font-cinzel">{draft.specialProgramme}</strong> included with this Nakshatra Shanthi.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Devotee & Sankalpam Details */}
          <div className="p-5 rounded-xl bg-[#35030A]/90 border border-[#D6A532]/35 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6A532]/20 pb-2.5">
              <span className="text-[11px] uppercase font-sans font-bold tracking-widest text-[#E8C76A]">
                {isTe ? 'భక్తుని సంకల్ప సమాచారం' : 'DEVOTEE & SANKALPAM DETAILS'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm font-sans">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'భక్తుని పేరు' : 'Devotee Full Name'}
                </span>
                <span className="font-bold text-[#FAF4E6] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {draft.devoteeName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'గోత్రం' : 'Gotram'}
                </span>
                <span className="font-semibold text-[#FAF4E6]">
                  {draft.gotram}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'మొబైల్ సంఖ్య' : 'Mobile Number'}
                </span>
                <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {draft.mobile}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2 md:col-span-3">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                  {isTe ? 'ఈమెయిల్' : 'Email Address'}
                </span>
                <span className="font-semibold text-[#FAF4E6] flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {draft.email || '—'}
                </span>
              </div>
            </div>

            {/* Devotee Physical Participation Display */}
            <div className="pt-3 border-t border-[#D6A532]/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block">
                {isTe ? 'భక్తుల ప్రత్యక్ష భాగస్వామ్యం' : 'DEVOTEE PARTICIPATION'}
              </span>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  draft.devoteeParticipation === 'attending'
                    ? 'bg-[#5A0714] text-[#F2C14E] border border-[#F2C14E]/60 shadow-[0_0_10px_rgba(214,165,50,0.3)]'
                    : 'bg-[#230206] text-[#FAF4E6]/90 border border-[#D6A532]/30'
                }`}>
                  <span className="text-sm">{draft.devoteeParticipation === 'attending' ? '🪔' : '📦'}</span>
                  <span>
                    {draft.devoteeParticipation === 'attending'
                      ? (isTe ? 'అవును, నేను స్వయంగా పాల్గొంటాను' : isHi ? 'हाँ, मैं उपस्थित रहूँगा' : 'Yes, I will attend')
                      : (Number(draft.amount || 0) >= 5000
                          ? (isTe ? 'కాదు, నేను హాజరు కాలేను (ప్రసాదం పోస్ట్ ద్వారా)' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा (डाक द्वारा प्रसाद)' : 'No, I will not attend (Courier Prasadam)')
                          : (isTe ? 'కాదు, నేను హాజరు కాలేను (సంకల్పం మీ పేరుతో)' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा (आपके नाम से संकल्प)' : 'No, I will not attend (Sankalpam in your name)'))}
                  </span>
                </span>
              </div>
            </div>

            {draft.familyMembers && (
              <div className="pt-2 border-t border-[#D6A532]/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {isTe ? 'సంకల్పంలో ఉచ్ఛరించాల్సిన పేర్లు' : 'Family Members / Sankalpam Chanting Names'}
                </span>
                <p className="text-xs text-[#FFF8E8]/90 font-sans italic bg-[#230206] p-2.5 rounded-lg border border-[#D6A532]/20">
                  {draft.familyMembers}
                </p>
              </div>
            )}

            {Number(draft.amount || 0) >= 5000 && draft.address && (
              <div className="pt-2 border-t border-[#D6A532]/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#E8C76A]/80 tracking-widest block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F2C14E]" />
                  {isTe ? 'ప్రసాదం పంపే చిరునామా' : 'Prasadam Delivery Address'}
                </span>
                <p className="text-xs text-[#FFF8E8]/90 font-sans bg-[#230206] p-2.5 rounded-lg border border-[#D6A532]/20">
                  {draft.address}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Contribution Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#4A0A14] via-[#5A0714] to-[#35030A] border-2 border-[#D6A532]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#E8C76A] font-bold block">
                {isTe ? 'మొత్తం సమర్పించవలసిన విరాళం' : 'TOTAL SACRED CONTRIBUTION'}
              </span>
              <p className="text-xs text-[#FFF8E8]/70 font-sans">
                {isTe ? 'రశీదు తక్షణమే ఉత్పత్తి చేయబడుతుంది.' : 'Concludes with immediate consecrated digital receipt.'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#F2C14E]">
                {formatCurrency(draft.amount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#D6A532]/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <Link href="/book-seva/details" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#D6A532]/50 text-[#FAF4E6] hover:bg-[#5A0714] font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isTe ? 'వివరాలు సవరించండి' : isHi ? 'विवरण बदलें' : 'EDIT DETAILS'}</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer"
            >
              <span>{isTe ? 'దాన సమర్పణ / చెల్లింపుకు వెళ్లండి' : isHi ? 'दान समर्पण / भुगतान हेतु बढ़ें' : 'MAKE DONATION / PROCEED TO PAYMENT'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
