'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { specialSevaBookingService, getSevaLockInfo } from '@/services/specialSevaBooking.service';
import { SpecialSevaStepper } from '@/components/special-seva/SpecialSevaStepper';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { RASIS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import {
  User,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';

const JANMA_NAKSHATRAS_27 = [
  { id: 'Ashwini', nameEn: 'Ashwini', nameTe: 'అశ్విని', nameHi: 'अश्विनी' },
  { id: 'Bharani', nameEn: 'Bharani', nameTe: 'భరణి', nameHi: 'भरणी' },
  { id: 'Krittika', nameEn: 'Krittika', nameTe: 'కృత్తిక', nameHi: 'कृत्तिका' },
  { id: 'Rohini', nameEn: 'Rohini', nameTe: 'రోహిణి', nameHi: 'रोहिणी' },
  { id: 'Mrigasira', nameEn: 'Mrigasira', nameTe: 'మృగశిర', nameHi: 'मृगशिरा' },
  { id: 'Ardra', nameEn: 'Ardra', nameTe: 'ఆర్ద్ర', nameHi: 'आर्द्रा' },
  { id: 'Punarvasu', nameEn: 'Punarvasu', nameTe: 'పునర్వసు', nameHi: 'पुनर्वसु' },
  { id: 'Pushya', nameEn: 'Pushya', nameTe: 'పుష్యమి', nameHi: 'पुष्य' },
  { id: 'Ashlesha', nameEn: 'Ashlesha', nameTe: 'ఆశ్లేష', nameHi: 'आश्लेषा' },
  { id: 'Magha', nameEn: 'Magha', nameTe: 'మఖ', nameHi: 'मघा' },
  { id: 'Purva Phalguni', nameEn: 'Purva Phalguni', nameTe: 'పూర్వ ఫల్గుణి', nameHi: 'पूर्वाफाल्गुनी' },
  { id: 'Uttara Phalguni', nameEn: 'Uttara Phalguni', nameTe: 'ఉత్తర ఫల్గుణి', nameHi: 'उत्तराफाल्गुनी' },
  { id: 'Hasta', nameEn: 'Hasta', nameTe: 'హస్త', nameHi: 'हस्त' },
  { id: 'Chitta', nameEn: 'Chitta', nameTe: 'చిత్త', nameHi: 'चित्रा' },
  { id: 'Swati', nameEn: 'Swati', nameTe: 'స్వాతి', nameHi: 'स्वाति' },
  { id: 'Vishakha', nameEn: 'Vishakha', nameTe: 'విశాఖ', nameHi: 'विशाखा' },
  { id: 'Anuradha', nameEn: 'Anuradha', nameTe: 'అనూరాధ', nameHi: 'अनुराधा' },
  { id: 'Jyeshta', nameEn: 'Jyeshta', nameTe: 'జ్యేష్ఠ', nameHi: 'ज्येष्ठा' },
  { id: 'Moola', nameEn: 'Moola', nameTe: 'మూల', nameHi: 'मूल' },
  { id: 'Purva Ashadha', nameEn: 'Purva Ashadha', nameTe: 'పూర్వాషాఢ', nameHi: 'पूर्वाषाढ़ा' },
  { id: 'Uttara Ashadha', nameEn: 'Uttara Ashadha', nameTe: 'ఉత్తరాషాఢ', nameHi: 'उत्तराषाढ़ा' },
  { id: 'Shravana', nameEn: 'Shravana', nameTe: 'శ్రవణం', nameHi: 'श्रवण' },
  { id: 'Dhanishta', nameEn: 'Dhanishta', nameTe: 'ధనిష్ఠ', nameHi: 'धनिष्ठा' },
  { id: 'Shatabhisha', nameEn: 'Shatabhisha', nameTe: 'శతాభిషం', nameHi: 'शतभिषा' },
  { id: 'Purva Bhadrapada', nameEn: 'Purva Bhadrapada', nameTe: 'పూర్వాభాద్ర', nameHi: 'पूर्वाभाद्रपद' },
  { id: 'Uttara Bhadrapada', nameEn: 'Uttara Bhadrapada', nameTe: 'ఉత్తరాభాద్ర', nameHi: 'उत्तराभाद्रपद' },
  { id: 'Revati', nameEn: 'Revati', nameTe: 'రేవతి', nameHi: 'रेवती' },
];

import { useDevoteeAuth } from '@/context/DevoteeAuthContext';

export default function SpecialSevaDevoteeDetailsPage() {
  const router = useRouter();
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const { session, isLoading } = useDevoteeAuth();

  const [draft, setDraft] = useState(() => specialSevaBookingService.getActiveDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !session?.phone) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : `/${locale}/special-seva-booking/details`;
      router.push(`/${locale}/account/login?mode=signup&redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const current = specialSevaBookingService.getActiveDraft();
    if (!current.selectedDate || !current.sevaName || !current.selectedDay) {
      router.push(`/${locale}/special-seva-booking/day`);
      return;
    }

    // Auto-fill phone and name from logged in session
    if (session?.phone && !current.mobile) {
      current.mobile = session.phone;
    }
    if (session?.fullName && !current.devoteeName) {
      current.devoteeName = session.fullName;
    }
    if (session?.gotram && !current.gotram) {
      current.gotram = session.gotram;
    }

    setDraft(current);
  }, [locale, router, session, isLoading]);

  const sevaLockInfo = React.useMemo(() => {
    if (!draft) return null;
    return getSevaLockInfo(draft.sevaId || draft.sevaSlug || draft.sevaName);
  }, [draft]);

  useEffect(() => {
    if (sevaLockInfo?.lockedNakshatra && draft.janmaNakshatra !== sevaLockInfo.lockedNakshatra) {
      const lockedNak = sevaLockInfo.lockedNakshatra;
      setDraft((prev) => ({
        ...prev,
        janmaNakshatra: lockedNak,
        nakshatra: lockedNak,
        mahayajnamNakshatra: lockedNak,
      }));
    }
  }, [sevaLockInfo, draft.janmaNakshatra]);

  const validate = (): boolean => {
    const err: Record<string, string> = {};

    if (!draft.devoteeName || !draft.devoteeName.trim()) {
      err.devoteeName = isTe ? 'భక్తుని పూర్తి పేరు తప్పనిసరి' : isHi ? 'भक्त का पूरा नाम आवश्यक है' : 'Devotee Full Name is required';
    } else if (draft.devoteeName.trim().length < 2) {
      err.devoteeName = isTe ? 'దయచేసి సరైన పేరు నమోదు చేయండి' : 'Please enter a valid full name';
    }

    const effectiveGotram = (draft.gotram || '').trim();
    if (!effectiveGotram) {
      err.gotram = isTe ? 'గోత్రం తప్పనిసరి' : isHi ? 'गोत्र आवश्यक है' : 'Gotram is required';
    }

    if (!draft.janmaNakshatra || !draft.janmaNakshatra.trim()) {
      err.janmaNakshatra = isTe ? 'జన్మ నక్షత్రం తప్పనిసరి' : isHi ? 'जन्म नक्षत्र आवश्यक है' : 'Janma Nakshatra is required';
    }

    const phoneDigits = (draft.mobile || '').replace(/\D/g, '');
    if (!draft.mobile || !draft.mobile.trim()) {
      err.mobile = isTe ? 'మొబైల్ / వాట్సాప్ నంబర్ తప్పనిసరి' : isHi ? 'मोबाइल / व्हाट्सएप नंबर आवश्यक है' : 'Mobile / WhatsApp Number is required';
    } else if (phoneDigits.length < 10) {
      err.mobile = isTe ? 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit mobile number';
    }

    if (!draft.devoteeParticipation) {
      err.devoteeParticipation = isTe
        ? 'దయచేసి మీరు స్వయంగా సేవలో పాల్గొంటారో లేదో ఎంచుకోండి.'
        : isHi
        ? 'कृपया चुनें कि क्या आप व्यक्तिगत रूप से सेवा में उपस्थित रहेंगे।'
        : 'Please select whether you will attend the Seva in person.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const cleanAddress = Number(draft.amount || 0) >= 5000 ? (draft.address || '').trim() : '';
      specialSevaBookingService.saveActiveDraft({
        ...draft,
        gotram: (draft.gotram || '').trim(),
        address: cleanAddress,
        devoteeParticipation: draft.devoteeParticipation || 'attending',
      });
      router.push(`/${locale}/special-seva-booking/payment`);
    } else {
      window.scrollTo({ top: 250, behavior: 'smooth' });
    }
  };

  const programmeNakshatraDisplay = draft.mahayajnamNakshatra || draft.nakshatra || 'Rohini';

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation Row: Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/special-seva-booking/day"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D6A532]/40 bg-[#230206]/80 text-[#FAF4E6] hover:bg-[#5A0714] hover:border-[#D6A532] text-xs sm:text-sm font-cinzel font-bold tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>{isTe ? 'రోజు ఎంపికకు వెనుకకు' : isHi ? 'दिवस चयन पर वापस' : 'Back to Day Selection'}</span>
          </Link>
        </div>

        {/* Dedicated Special Seva Stepper (Step 2) */}
        <SpecialSevaStepper currentStep={2} />

        {/* Selected Seva & Day Summary Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#4A0A14] via-[#5A0714] to-[#35030A] border-2 border-[#D6A532]/60 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'ఎంచుకున్న ప్రత్యేక సేవ & దినం' : isHi ? 'चयनित विशेष सेवा एवं दिवस' : 'SELECTED SPECIAL SEVA & DAY'}
              </span>
              <h2 className="font-cinzel text-lg sm:text-xl font-black text-[#FAF4E6]">
                {draft.sevaName}
              </h2>
              <p className="text-xs sm:text-sm text-[#F2C14E] font-semibold flex flex-wrap items-center gap-2 font-sans">
                <span>📅 Day {draft.selectedDay} ({draft.selectedDate})</span>
                <span>• 🔱 {programmeNakshatraDisplay} Day</span>
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 border-[#D6A532]/20 pt-3 sm:pt-0">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-bold block">
                {isTe ? 'విరాళం' : isHi ? 'सहयोग राशि' : 'Contribution'}
              </span>
              <span className="font-cinzel text-xl sm:text-2xl font-black text-[#F2C14E]">
                {formatCurrency(draft.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Devotee Details Form Card */}
        <Card variant="sacred" className="p-6 sm:p-8 space-y-6 bg-[#2B040A]/95 border-[#D6A532]/40 shadow-xl">
          <div className="border-b border-[#D6A532]/25 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-[#F2C14E]">
              <User className="w-5 h-5" />
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
                {isTe ? 'సంకల్ప వివరాలు' : isHi ? 'संकल्प विवरण' : 'DEVOTEE & SANKALPAM DETAILS'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
              {isTe
                ? 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞంలో పండితులు మీ పేరిట వేద సంకల్పం ఉచ్ఛరించేందుకు వివరాలను నమోదు చేయండి.'
                : isHi
                ? 'महायज्ञ में वैदिक संकल्प हेतु अपना नाम, गोत्र, जन्म नक्षत्र एवं पारिवारिक विवरण दर्ज करें।'
                : 'Please enter your name, Gotram, Janma Nakshatra, and family details for Vedic Sankalpam recitation.'}
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-6">
            {/* 2-Column Responsive Layout: Left (Name, Gotram, Janma Nakshatra) | Right (Rasi, Mobile, Email) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* === LEFT COLUMN === */}
              <div className="space-y-5">
                {/* 1. Devotee Full Name * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'భక్తుని పూర్తి పేరు' : isHi ? 'भक्त का पूरा नाम' : 'DEVOTEE FULL NAME'} *
                  </label>
                  <input
                    type="text"
                    value={draft.devoteeName}
                    onChange={(e) => setDraft({ ...draft, devoteeName: e.target.value })}
                    placeholder={isTe ? 'ఉదా. సత్యనారాయణ శర్మ' : isHi ? 'उदा. सत्यनारायण शर्मा' : 'Enter your full name'}
                    className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                  />
                  {errors.devoteeName && (
                    <p className="text-[11px] text-rose-400 font-semibold">{errors.devoteeName}</p>
                  )}
                </div>

                {/* 2. Gotram * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'గోత్రం' : isHi ? 'गोत्र' : 'GOTRAM'} *
                  </label>
                  <input
                    type="text"
                    value={draft.gotram || ''}
                    onChange={(e) => setDraft({ ...draft, gotram: e.target.value })}
                    placeholder={isTe ? 'మీ గోత్రం నమోదు చేయండి (ఉదా. భరద్వాజ, కాశ్యప, విశ్వామిత్ర...)' : isHi ? 'अपना गोत्र दर्ज करें (उदा. भारद्वाज, कश्यप, विश्वामित्र...)' : 'Enter your Gotram (e.g. Bharadwaja, Kashyapa, Viswamitra...)'}
                    className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                  />
                  {errors.gotram && (
                    <p className="text-[11px] text-rose-400 font-semibold">{errors.gotram}</p>
                  )}
                </div>

                {/* 3. Janma Nakshatra * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'జన్మ నక్షత్రం' : isHi ? 'जन्म नक्षत्र' : 'JANMA NAKSHATRA'} *
                  </label>
                  {sevaLockInfo?.lockedNakshatra ? (
                    <div className="w-full rounded-xl bg-[#1F0205] border-2 border-[#D6A532]/70 text-[#FAF4E6] p-3 text-sm font-sans flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F2C14E] shrink-0" />
                        <span className="font-bold text-[#F2C14E] text-sm sm:text-base font-cinzel">
                          {(() => {
                            const match = JANMA_NAKSHATRAS_27.find((n) => n.id.toLowerCase() === (sevaLockInfo.lockedNakshatra || '').toLowerCase());
                            return isTe ? `${match?.nameTe || sevaLockInfo.lockedNakshatra} నక్షత్రం` : isHi ? `${match?.nameHi || sevaLockInfo.lockedNakshatra} नक्षत्र` : `${sevaLockInfo.lockedNakshatra} Nakshatram`;
                          })()}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-sans font-bold px-2.5 py-1 rounded bg-[#5A0714] text-[#F2C14E] border border-[#D6A532]/50 flex items-center gap-1 shrink-0">
                        <Lock className="w-3 h-3 text-[#F2C14E]" />
                        <span>
                          {(() => {
                            const match = JANMA_NAKSHATRAS_27.find((n) => n.id.toLowerCase() === (sevaLockInfo.lockedNakshatra || '').toLowerCase());
                            const nakName = isTe ? (match?.nameTe || sevaLockInfo.lockedNakshatra) : isHi ? (match?.nameHi || sevaLockInfo.lockedNakshatra) : sevaLockInfo.lockedNakshatra;
                            return isTe ? `${nakName} నక్షత్రానికి లాక్ అయింది` : isHi ? `${nakName} नक्षत्र हेतु आरक्षित` : `Locked to ${sevaLockInfo.lockedNakshatra}`;
                          })()}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <Select
                      value={draft.janmaNakshatra || 'Rohini'}
                      placeholder={isTe ? 'జన్మ నక్షత్రం ఎంచుకోండి' : isHi ? 'जन्म नक्षत्र चुनें' : 'Select Janma Nakshatra'}
                      onChange={(e) => setDraft({ ...draft, janmaNakshatra: e.target.value })}
                    >
                      {JANMA_NAKSHATRAS_27.map((nak) => (
                        <option key={nak.id} value={nak.id}>
                          {isTe ? nak.nameTe : isHi ? nak.nameHi : nak.nameEn}
                        </option>
                      ))}
                    </Select>
                  )}
                  {errors.janmaNakshatra && (
                    <p className="text-[11px] text-rose-400 font-semibold">{errors.janmaNakshatra}</p>
                  )}
                </div>
              </div>

              {/* === RIGHT COLUMN === */}
              <div className="space-y-5">
                {/* 4. Rasi (Custom Dropdown) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'రాశి' : isHi ? 'राशि' : 'RASI'}
                  </label>
                  <Select
                    value={draft.rasi || 'Mesha (Aries)'}
                    placeholder={isTe ? 'రాశి ఎంచుకోండి' : isHi ? 'राशि चुनें' : 'Select Rasi'}
                    onChange={(e) => setDraft({ ...draft, rasi: e.target.value })}
                  >
                    {RASIS.map((r) => (
                      <option key={r.id} value={r.nameEn}>
                        {isTe ? r.nameTe : isHi ? r.nameHi : r.nameEn}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* 5. Mobile / WhatsApp Number * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'మొబైల్ / వాట్సాప్ నంబర్' : isHi ? 'मोबाइल / व्हाट्सएप नंबर' : 'MOBILE / WHATSAPP NUMBER'} *
                  </label>
                  <input
                    type="tel"
                    value={draft.mobile}
                    onChange={(e) => setDraft({ ...draft, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                  />
                  {errors.mobile && (
                    <p className="text-[11px] text-rose-400 font-semibold">{errors.mobile}</p>
                  )}
                </div>

                {/* 6. Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'ఈమెయిల్ చిరునామా' : isHi ? 'ईमेल' : 'EMAIL ADDRESS'} (For Digital Receipt)
                  </label>
                  <input
                    type="email"
                    value={draft.email || ''}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                  />
                </div>
              </div>

            </div>

            {/* === FULL WIDTH FIELDS BELOW === */}
            <div className="space-y-5 pt-2 border-t border-[#D6A532]/20">
              {/* 7. Family Members / Sankalpam Names */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                  {isTe
                    ? 'సంకల్పంలో ఉచ్ఛరించాల్సిన కుటుంబ సభ్యుల పేర్లు'
                    : isHi
                    ? 'परिवार के सदस्यों के नाम (संकल्प हेतु)'
                    : 'FAMILY MEMBERS / SANKALPAM NAMES'}
                </label>
                <textarea
                  rows={2}
                  value={draft.familyMembers || ''}
                  onChange={(e) => setDraft({ ...draft, familyMembers: e.target.value })}
                  placeholder="e.g. Smt. Annapurna (Wife), Chi. Shiva Karthik (Son)"
                  className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                />
              </div>

              {/* 8. Address for Prasadam Delivery (Conditional for >= ₹5,000 Sevas) */}
              {(Number(draft.amount || 0) >= 5000) ? (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#1D0206] border border-emerald-500/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      {isTe ? 'చిరునామా (ప్రసాదం పంపడానికి)' : isHi ? 'डाक पता (प्रसाद वितरण हेतु)' : 'POSTAL ADDRESS FOR PRASADAM DELIVERY'}
                    </label>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      📦 {isTe ? 'ఉచిత స్పీడ్ పోస్ట్ ప్రసాదం లభించును (₹5,000+)' : 'Complimentary Speed Post Delivery Included (₹5,000+)'}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={draft.address || ''}
                    onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                    placeholder="Door No, Street, City, State, Pincode"
                    className="w-full rounded-xl bg-[#1F0205] border border-[#D6A532]/40 text-[#FAF4E6] placeholder:text-[#FAF4E6]/40 text-sm p-3 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] font-sans transition-all"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#170104] border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {isTe
                        ? 'పోస్టల్ ప్రసాదం డెలివరీ (₹5,000 పైబడిన సేవలకు మాత్రమే)'
                        : isHi
                        ? 'डाक द्वारा प्रसाद (केवल ₹5,000+ सेवाओं हेतु)'
                        : 'Postal Prasadam Delivery (For Sevas ₹5,000 & above)'}
                    </span>
                  </div>
                  <p className="text-xs text-[#FFF8E8]/75 leading-relaxed font-sans">
                    {isTe
                      ? 'రూ. 5,000 కంటే తక్కువ విరాళాలు/సేవలకు పవిత్ర ప్రసాదాన్ని యజ్ఞశాల కౌంటర్ వద్ద నేరుగా స్వీకరించవచ్చు. రూ. 5,000 మరియు ఆ పైబడిన సేవలకు ఉచిత స్పీడ్ పోస్ట్ ద్వారా ఇంటికి పంపబడును.'
                      : isHi
                      ? '₹5,000 से कम की सेवा हेतु प्रसाद महायज्ञशाला काउंटर पर प्राप्त किया जा सकता है। ₹5,000 व अधिक की सेवा हेतु स्पीड पोस्ट द्वारा आपके पते पर भेजा जाएगा।'
                      : 'Speed Post delivery of sacred Prasadam is complimentary for Seva contributions of ₹5,000 or above. For contributions under ₹5,000, sacred Prasadam can be collected in-person at the Yagnashala counter.'}
                  </p>
                </div>
              )}

              {/* 9. DEVOTEE PARTICIPATION */}
              <div className="space-y-3 pt-3 border-t border-[#D6A532]/25">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2C14E] font-sans">
                    {isTe ? 'భక్తుల ప్రత్యక్ష భాగస్వామ్యం' : isHi ? 'भक्तों की प्रत्यक्ष उपस्थिति' : 'DEVOTEE PARTICIPATION'} *
                  </label>
                  <p className="text-xs text-[#FFF8E8]/75 font-sans mt-0.5">
                    {isTe
                      ? 'మీరు స్వయంగా సేవలో పాల్గొంటారా?'
                      : isHi
                      ? 'क्या आप प्रत्यक्ष रूप से सेवा में उपस्थित रहेंगे?'
                      : 'Will you be attending the Seva in person?'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1: YES, I WILL ATTEND */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setDraft({ ...draft, devoteeParticipation: 'attending' });
                      if (errors.devoteeParticipation) {
                        const newErr = { ...errors };
                        delete newErr.devoteeParticipation;
                        setErrors(newErr);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                      draft.devoteeParticipation === 'attending'
                        ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_18px_rgba(214,165,50,0.35)] ring-1 ring-[#F2C14E]'
                        : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Premium Radio Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          draft.devoteeParticipation === 'attending'
                            ? 'border-2 border-[#F2C14E] bg-[#2A0409]'
                            : 'border-2 border-[#D6A532]/40 bg-transparent'
                        }`}
                      >
                        {draft.devoteeParticipation === 'attending' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F2C14E] shadow-[0_0_6px_#F2C14E]" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`text-xs sm:text-sm font-bold uppercase tracking-wider font-cinzel block ${
                            draft.devoteeParticipation === 'attending' ? 'text-[#FAF4E6]' : 'text-[#FAF4E6]/80'
                          }`}
                        >
                          {isTe ? 'అవును, నేను స్వయంగా పాల్గొంటాను' : isHi ? 'हाँ, मैं प्रत्यक्ष उपस्थित रहूँगा' : 'YES, I WILL ATTEND'}
                        </span>
                        <span className="text-[10px] text-[#E8C76A]/75 font-sans block mt-0.5">
                          {isTe ? 'యజ్ఞశాలలో ప్రత్యక్ష ప్రవేశం మరియు ఆశీర్వచనం' : 'Physical presence at the Yajnashala'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: NO, I WILL NOT ATTEND */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setDraft({ ...draft, devoteeParticipation: 'not-attending' });
                      if (errors.devoteeParticipation) {
                        const newErr = { ...errors };
                        delete newErr.devoteeParticipation;
                        setErrors(newErr);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                      draft.devoteeParticipation === 'not-attending'
                        ? 'bg-[#5A0714] border-[#F2C14E] shadow-[0_0_18px_rgba(214,165,50,0.35)] ring-1 ring-[#F2C14E]'
                        : 'bg-[#1F0205] border-[#D6A532]/30 hover:border-[#D6A532]/60 hover:bg-[#250307]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Premium Radio Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          draft.devoteeParticipation === 'not-attending'
                            ? 'border-2 border-[#F2C14E] bg-[#2A0409]'
                            : 'border-2 border-[#D6A532]/40 bg-transparent'
                        }`}
                      >
                        {draft.devoteeParticipation === 'not-attending' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F2C14E] shadow-[0_0_6px_#F2C14E]" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`text-xs sm:text-sm font-bold uppercase tracking-wider font-cinzel block ${
                            draft.devoteeParticipation === 'not-attending' ? 'text-[#FAF4E6]' : 'text-[#FAF4E6]/80'
                          }`}
                        >
                          {isTe ? 'కాదు, నేను హాజరు కాలేను' : isHi ? 'नहीं, मैं उपस्थित नहीं हो पाऊँगा' : 'NO, I WILL NOT ATTEND'}
                        </span>
                        <span className="text-[10px] text-[#E8C76A]/75 font-sans block mt-0.5">
                          {Number(draft.amount || 0) >= 5000
                            ? (isTe ? 'సంకల్పం మీ పేరుతో ఉచ్ఛరిస్తారు & ప్రసాదం పోస్ట్ ద్వారా' : 'Priest Sankalpam & Prasadam dispatched via courier')
                            : (isTe ? 'సంకల్పం మీ పేరుతో ఉచ్ఛరిస్తారు (ప్రసాదం కౌంటర్ వద్ద లభించును)' : 'Priest Sankalpam in your name (Prasadam collectable at counter)')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {errors.devoteeParticipation && (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                    <span>⚠️</span> {errors.devoteeParticipation}
                  </p>
                )}
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-sans font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  {Object.values(errors)[0]}
                </span>
              </div>
            )}

            {/* Actions: Back & Continue to Payment */}
            <div className="pt-4 border-t border-[#D6A532]/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <Link href="/special-seva-booking/day" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#D6A532]/50 text-[#FAF4E6] hover:bg-[#5A0714] font-cinzel text-xs sm:text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isTe ? 'రోజు మార్చండి' : isHi ? 'दिवस बदलें' : 'CHANGE DAY'}</span>
                </button>
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.4)] hover:shadow-[0_0_30px_rgba(214,165,50,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer"
              >
                <span>{isTe ? 'చెల్లింపుకు కొనసాగండి' : isHi ? 'भुगतान हेतु बढ़ें' : 'CONTINUE TO PAYMENT'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}
