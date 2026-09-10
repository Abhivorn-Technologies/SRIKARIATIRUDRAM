import { scheduleService } from '@/services/schedule.service';
import { ScheduleHero } from '@/components/schedule/DayScheduleCard';
import { DayScheduleGrid } from '@/components/schedule/DayScheduleGrid';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isTe = locale === 'te';
  return {
    title: isTe
      ? 'రోజువారీ కార్యక్రమం | శ్రీకరీ అతిరుద్ర మహాయజ్ఞం'
      : 'Day-Wise Programme | Srikari Ati Rudra Mahayagnam',
    description: isTe
      ? 'శ్రీకరీ అతిరుద్ర మహాయజ్ఞం 28 రోజుల సంపూర్ణ రోజువారీ కార్యక్రమం, నక్షత్ర జపాలు, శాంతి, రుద్ర పారాయణాలు మరియు విశేష హోమాలు.'
      : 'Complete official 28-day programme of Srikari Ati Rudra Mahayagnam from Rohini to Rohini (25 November to 22 December 2026).',
  };
}

export default async function SchedulePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const days = await scheduleService.getAllDays();
  const t = await getTranslations({ locale, namespace: 'schedule' });

  return (
    <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. PAGE HERO */}
      <ScheduleHero />

      {/* 2. BREADCRUMB */}
      <div className="flex items-center justify-center -mt-2">
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 text-xs text-gold-light/80 font-sans bg-burgundy-deep/90 px-4 py-1.5 rounded-full border border-gold/25 shadow-sm"
        >
          <Link href="/" className="hover:text-gold transition-colors font-medium">
            {t('breadcrumbHome')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gold/50" />
          <span className="text-gold font-bold">
            {t('breadcrumbSchedule')}
          </span>
        </nav>
      </div>

      {/* 3–13. INTRO, FILTERS, SEARCH, & COMPLETE 28-DAY GRID */}
      <DayScheduleGrid days={days} />
    </div>
  );
}
