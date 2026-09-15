import { HeroSection } from '@/components/home/HeroSection';
import { AboutPreview } from '@/components/home/AboutPreview';
import { QuickSevaActions, TodayAtSrikari, ParticipationSection } from '@/components/home/QuickSevaActions';
import { HomeSchedulePreview } from '@/components/home/HomeSchedulePreview';
import { HomeSevasPreview } from '@/components/home/HomeSevasPreview';
import { HomeGalleryPreview } from '@/components/home/HomeGalleryPreview';
import { HomeContactSection } from '@/components/home/HomeContactSection';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. ABOUT SRIKARI TEMPLE — PREVIEW */}
      <AboutPreview />

      {/* 3. KEY INFORMATION & SEVAS */}
      <QuickSevaActions />

      {/* 4. DAILY DIVINE DARSHAN */}
      <TodayAtSrikari />

      {/* 5. 28-DAY NAKSHATRA SCHEDULE — FIRST 10 DAYS ONLY */}
      <HomeSchedulePreview />

      {/* 6. SEVAS — PREVIEW */}
      <HomeSevasPreview />

      {/* 7. BE A PART OF THIS DIVINE YAJNAM */}
      <ParticipationSection />

      {/* 8. GLIMPSES OF THE DIVINE */}
      <HomeGalleryPreview />

      {/* 9. CONTACT */}
      <HomeContactSection />
    </div>
  );
}

