import { notFound } from 'next/navigation';
import { scheduleService } from '@/services/schedule.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Calendar, Star, Flame, ArrowLeft, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  return Array.from({ length: 28 }, (_, i) => ({ day: (i + 1).toString() }));
}

export async function generateMetadata({
  params: { day, locale },
}: {
  params: { day: string; locale: string };
}) {
  const dayNumber = parseInt(day, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 28) {
    return { title: 'Day-Wise Programme | Srikari Ati Rudra Mahayagnam' };
  }

  const dayData = await scheduleService.getDayByNumber(dayNumber);
  if (!dayData) return { title: 'Day-Wise Programme | Srikari Ati Rudra Mahayagnam' };

  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  
  let title = `Day ${dayData.dayNumber}: ${dayData.nakshatra} Nakshatram - ${dayData.title} | Srikari Ati Rudra Mahayagnam`;
  let description = dayData.specialSignificance;

  if (isTe) {
    title = `దినం ${dayData.dayNumber}: ${dayData.nakshatraTe} నక్షత్రం - ${dayData.titleTe} | శ్రీకరీ అతిరుద్ర మహాయజ్ఞం`;
    description = dayData.specialSignificanceTe;
  } else if (isHi) {
    title = `दिन ${dayData.dayNumber}: ${dayData.nakshatraHi || dayData.nakshatra} नक्षत्र - ${dayData.titleHi || dayData.title} | श्रीकरी अति रुद्र महायज्ञ`;
    description = dayData.specialSignificanceHi || dayData.specialSignificance;
  }

  return {
    title,
    description,
  };
}

export default async function DayDetailPage({
  params: { day, locale },
}: {
  params: { day: string; locale: string };
}) {
  const dayNumber = parseInt(day, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 28) {
    notFound();
  }

  const dayData = await scheduleService.getDayByNumber(dayNumber);
  if (!dayData) notFound();

  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const t = await getTranslations({ locale, namespace: 'schedule' });

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < 28 ? dayNumber + 1 : null;

  const paddedDay = String(dayData.dayNumber).padStart(2, '0');
  const isOpening = dayData.dayNumber === 1;
  const isConcluding = dayData.dayNumber === 28;
  const isSpecial = dayData.isSpecial;

  // Localized texts
  const displayTitle = isTe ? dayData.titleTe : isHi ? (dayData.titleHi || dayData.title) : dayData.title;
  const displayDate = isTe ? dayData.dateTe : isHi ? (dayData.dateHi || dayData.date) : dayData.date;
  const displayDayOfWeek = isTe ? dayData.dayOfWeekTe : isHi ? (dayData.dayOfWeekHi || dayData.dayOfWeek) : dayData.dayOfWeek;
  const displayNakshatra = isTe ? `${dayData.nakshatraTe} నక్షత్రం` : isHi ? `${dayData.nakshatraHi || dayData.nakshatra} नक्षत्र` : `${dayData.nakshatra} Nakshatram`;
  const displayRasi = isTe ? dayData.rasiTe : isHi ? (dayData.rasiHi || dayData.rasi) : dayData.rasi;
  const displayDeity = isTe ? dayData.presidingDeityTe : isHi ? (dayData.presidingDeityHi || dayData.presidingDeity) : dayData.presidingDeity;
  const displaySignificance = isTe ? dayData.specialSignificanceTe : isHi ? (dayData.specialSignificanceHi || dayData.specialSignificance) : dayData.specialSignificance;
  const displayProgramme = isTe ? dayData.programmeTe : isHi ? (dayData.programmeHi || dayData.programme) : dayData.programme;
  const displayEveningProgramme = isTe ? dayData.eveningProgrammeTe : isHi ? (dayData.eveningProgrammeHi || dayData.eveningProgramme) : dayData.eveningProgramme;
  const displaySeva = isTe
    ? (dayData.specialSevaTe || dayData.pradhanaHomamTe)
    : isHi
    ? (dayData.specialSevaHi || dayData.pradhanaHomamHi || dayData.specialSeva || dayData.pradhanaHomam)
    : (dayData.specialSeva || dayData.pradhanaHomam);

  const fontClass = isTe ? 'font-telugu' : isHi ? 'font-hindi' : '';

  // Status badge config
  const statusConfig = {
    available: {
      label: isTe ? 'అందుబాటులో ఉంది' : isHi ? 'उपलब्ध' : t('statusAvailable'),
      dotClass: 'bg-emerald-400',
      textClass: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/40',
    },
    few_slots: {
      label: isTe ? 'కొద్ది స్థలాలు మిగిలి ఉన్నాయి' : isHi ? 'कुछ ही स्थान शेष' : t('statusFewSlots'),
      dotClass: 'bg-amber-400 animate-pulse',
      textClass: 'text-amber-300 border-amber-500/30 bg-amber-950/40',
    },
    fully_booked: {
      label: isTe ? 'పూర్తిగా బుక్ చేయబడింది' : isHi ? 'पूर्णतः आरक्षित' : t('statusFullyBooked'),
      dotClass: 'bg-rose-400',
      textClass: 'text-rose-300 border-rose-500/30 bg-rose-950/40',
    },
  };

  const currentStatus = statusConfig[dayData.status] || statusConfig.available;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Day Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToSchedule')}
        </Link>

        <div className="flex items-center gap-2">
          {prevDay && (
            <Link href={`/schedule/${prevDay}`}>
              <Button variant="outline" size="sm" className={`text-xs py-1 px-3 border-gold/40 hover:border-gold ${fontClass}`}>
                ← {t('day')} {String(prevDay).padStart(2, '0')}
              </Button>
            </Link>
          )}
          {nextDay && (
            <Link href={`/schedule/${nextDay}`}>
              <Button variant="outline" size="sm" className={`text-xs py-1 px-3 border-gold/40 hover:border-gold ${fontClass}`}>
                {t('day')} {String(nextDay).padStart(2, '0')} →
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Day Header Card */}
      <Card
        variant={isConcluding || isOpening ? 'gold-border' : isSpecial ? 'gold-border' : 'sacred'}
        className={`p-6 md:p-8 space-y-6 ${
          isConcluding
            ? 'ring-2 ring-gold/70 shadow-gold bg-gradient-to-b from-burgundy-dark via-burgundy-deep to-burgundy'
            : isOpening
            ? 'ring-1 ring-gold/60 shadow-gold bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep'
            : isSpecial
            ? 'ring-1 ring-gold/40 shadow-gold bg-burgundy-deep/95'
            : 'bg-burgundy-deep/80'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/30 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="lg" className="font-bold font-cinzel">
                {t('day')} {paddedDay} / 28
              </Badge>
              {isConcluding ? (
                <span className={`inline-flex items-center gap-1 text-xs font-black text-burgundy-deep uppercase tracking-wider bg-gradient-to-r from-gold-light via-gold to-gold-light px-3 py-1 rounded-full shadow-gold-sm ${fontClass}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {isTe ? 'మహా పూర్ణాహుతి దినం' : isHi ? 'महा पूर्णाहुति दिवस' : 'GRAND CONCLUDING DAY'}
                </span>
              ) : isOpening ? (
                <span className={`inline-flex items-center gap-1 text-xs font-black text-burgundy-deep uppercase tracking-wider bg-gradient-to-r from-gold-light to-gold px-3 py-1 rounded-full shadow-gold-sm ${fontClass}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {isTe ? 'ప్రారంభ దినం' : isHi ? 'उद्घाटन दिवस' : 'OPENING DAY'}
                </span>
              ) : isSpecial ? (
                <span className={`inline-flex items-center gap-1 text-xs font-bold text-gold uppercase tracking-wider bg-gold/15 px-2.5 py-1 rounded-full border border-gold/30 ${fontClass}`}>
                  <Sparkles className="w-3 h-3" />
                  {t('specialDayBadge')}
                </span>
              ) : null}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${currentStatus.textClass} ${fontClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${currentStatus.dotClass}`} />
                {currentStatus.label}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black text-gold-lighter mt-1 ${
              isTe ? 'font-telugu leading-[1.4]' : isHi ? 'font-hindi leading-[1.4]' : 'font-cinzel'
            }`}>
              {displayTitle}
            </h1>
            <p className={`text-xs text-ivory/70 ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'}`}>
              {displayDayOfWeek}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end shrink-0 bg-primary/40 px-4 py-2.5 rounded-xl border border-gold/25">
            <span className={`text-[11px] text-gold-light uppercase font-bold tracking-wider ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>
              {isTe ? 'శుభ దినం / తేదీ' : isHi ? 'शुभ तिथि' : 'Auspicious Date'}
            </span>
            <span className={`text-lg md:text-xl font-black text-ivory flex items-center gap-1.5 mt-0.5 ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
            }`}>
              <Calendar className="w-4 h-4 text-gold" />
              {displayDate}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-sans w-full max-w-full">
          <div className="p-3.5 sm:p-4 rounded-xl bg-burgundy/80 border border-gold/25 space-y-1.5 min-w-0 w-full overflow-hidden">
            <span className={`text-gold uppercase font-bold flex items-center gap-1 truncate ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>
              <Star className="w-3.5 h-3.5 fill-gold/30 shrink-0" /> {t('nakshatraShanthi')}
            </span>
            <span className={`font-semibold text-ivory text-xs sm:text-sm block break-words ${fontClass}`}>
              {displayNakshatra} ({displayRasi})
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-burgundy/80 border border-gold/25 space-y-1.5 min-w-0 w-full overflow-hidden">
            <span className={`text-gold uppercase font-bold block truncate ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>{t('deity')}</span>
            <span className={`font-semibold text-ivory text-xs sm:text-sm block break-words ${fontClass}`}>
              {displayDeity}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-burgundy/80 border border-gold/25 space-y-1.5 min-w-0 w-full overflow-hidden">
            <span className={`text-gold uppercase font-bold block truncate ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>{t('relevantSeva')}</span>
            <span className={`font-semibold text-ivory text-xs sm:text-sm block break-words ${fontClass}`}>
              {displaySeva}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-burgundy/80 border border-gold/25 space-y-1.5 min-w-0 w-full overflow-hidden">
            <span className={`text-gold uppercase font-bold block truncate ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>{t('sevaAmount')}</span>
            <span className="font-semibold text-gold-light text-xs sm:text-sm block truncate">
              {dayData.price ? `₹${dayData.price.toLocaleString('en-IN')}` : isTe ? 'సంకల్ప సేవ' : isHi ? 'संकल्प सेवा' : 'Sankalpam Seva'}
            </span>
          </div>
        </div>

        {/* Significance Content */}
        <div className="space-y-2 bg-primary/30 p-4 sm:p-5 rounded-xl border border-gold/20">
          <span className={`text-[11px] text-gold-light uppercase tracking-wider font-bold block ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>
            {t('nakshatraSignificance')}
          </span>
          <p className={`text-xs sm:text-sm text-ivory/90 leading-relaxed ${
            isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-sans'
          }`}>
            {displaySignificance}
          </p>
        </div>

        {/* CTA Banner */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-4 rounded-xl border border-gold/30">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className={`text-xs text-gold-light font-bold ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>
              {isTe
                ? `దినం ${dayData.dayNumber} (${dayData.nakshatraTe}) సంకల్పం సమర్పించండి`
                : isHi
                ? `दिन ${dayData.dayNumber} (${dayData.nakshatraHi || dayData.nakshatra}) के लिए अपना संकल्प अर्पित करें`
                : `Offer Your Sankalpam for Day ${dayData.dayNumber} (${dayData.nakshatra})`}
            </span>
            <p className={`text-[11px] text-ivory/70 ${fontClass}`}>
              {isTe
                ? 'మీ కుటుంబ గోత్రం మరియు నక్షత్రంతో పవిత్ర అతిరుద్ర యజ్ఞ క్రతువులలో పాల్గొనండి.'
                : isHi
                ? 'अपने परिवार के गोत्र और नक्षत्र के साथ पवित्र अति रुद्र अनुष्ठानों में भाग लें।'
                : 'Participate in the sacred Ati Rudram rituals with family Gotram and Nakshatram.'}
            </p>
          </div>

          <Link
            href={`/book-seva?day=${dayData.dayNumber}&nakshatra=${encodeURIComponent(
              dayData.nakshatra
            )}${dayData.sevaSlug ? `&seva=${dayData.sevaSlug}` : ''}${dayData.price ? `&amount=${dayData.price}` : ''}`}
            className="w-full sm:w-auto"
          >
            <Button variant="gold" size="lg" className={`w-full sm:w-auto font-bold uppercase tracking-wider shadow-gold-sm ${fontClass}`}>
              <Flame className="w-4 h-4 mr-1.5 text-primary-dark" />
              {isTe ? 'సేవ బుక్ చేయండి' : isHi ? 'सेवा बुक करें' : t('bookNow')}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Programme Section */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
          <h3 className={`text-xl md:text-2xl font-bold text-gold-lighter ${
            isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-cinzel'
          }`}>
            {t('dailyTimelineTitle')} ({t('day')} {dayData.dayNumber})
          </h3>
          <span className={`text-xs text-gold-light/80 hidden sm:inline ${fontClass}`}>
            {displayDate}
          </span>
        </div>

        {/* Day & Evening Programme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daytime Programme */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sacred-card border border-gold/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className={`text-base sm:text-lg font-bold text-gold-lighter ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
              }`}>
                {t('programme')}
              </h4>
            </div>
            <p className={`text-xs sm:text-sm text-ivory/90 leading-relaxed ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}>
              {displayProgramme}
            </p>
          </div>

          {/* Evening Programme */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sacred-card border border-gold/30 space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              <h4 className={`text-base sm:text-lg font-bold text-gold-lighter ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
              }`}>
                {t('eveningProgramme')}
              </h4>
            </div>
            <p className={`text-xs sm:text-sm text-ivory/90 leading-relaxed ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}>
              {displayEveningProgramme}
            </p>
          </div>
        </div>

        {/* Common Daily Sequence Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-burgundy-deep/80 border border-gold/25 space-y-2">
          <div className={`flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider ${isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'}`}>
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>{t('commonSequenceTitle')}</span>
          </div>
          <p className={`text-xs text-gold-light/90 leading-relaxed ${
            isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
          }`}>
            {t('commonSequence')}
          </p>
        </div>
      </div>
    </div>
  );
}

