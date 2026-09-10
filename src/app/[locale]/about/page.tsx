import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AboutHero } from '@/components/about/AboutHero';
import { SrikariTempleSection } from '@/components/about/SrikariTempleSection';
import { AboutIntro } from '@/components/about/AboutIntro';
import { SriRudramSection } from '@/components/about/SriRudramSection';
import { EkadasaRudramSection } from '@/components/about/EkadasaRudramSection';
import { AtiRudramSection } from '@/components/about/AtiRudramSection';
import { RudrabhishekamSection } from '@/components/about/RudrabhishekamSection';
import { NakshatraInfoSection } from '@/components/about/NakshatraInfoSection';
import { NakshatraShanthiSection } from '@/components/about/NakshatraShanthiSection';
import { LokakalyanaSection } from '@/components/about/LokakalyanaSection';
import AboutCTA from '@/components/about/AboutCTA';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'about.seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'Ati Rudram',
      'Sri Rudram',
      'Ekadasa Rudram',
      'Rudrabhishekam',
      'Nakshatra Shanthi',
      'Srikari Ati Rudra Mahayagnam',
      'Vedic Homam',
      'Lord Shiva',
      'Lokakalyanam',
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://srikariatirudram.com/${locale}/about`,
      siteName: 'Srikari Ati Rudram',
      images: [
        {
          url: '/assets/ABOUT/ATI RUDRAM.png',
          width: 1200,
          height: 630,
          alt: 'Srikari Ati Rudram - About',
        },
      ],
      locale: locale === 'te' ? 'te_IN' : 'en_US',
      type: 'website',
    },
  };
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-burgundy-deep text-ivory">
      {/* 1. HERO SECTION */}
      <AboutHero />

      {/* 2. ABOUT SRIKARI TEMPLE & ADVISORY BOARD */}
      <SrikariTempleSection />

      {/* 3. INTRODUCTION TO SRIKARI ATI RUDRAM */}
      <AboutIntro />

      {/* 3. WHAT IS SRI RUDRAM? */}
      <SriRudramSection />

      {/* 4. WHAT IS EKADASA RUDRAM? */}
      <EkadasaRudramSection />

      {/* 5. WHAT IS ATI RUDRAM? */}
      <AtiRudramSection />

      {/* 6. RUDRABHISHEKAM */}
      <RudrabhishekamSection />

      {/* 7. NAKSHATRAS */}
      <NakshatraInfoSection />

      {/* 8. NAKSHATRA SHANTHI */}
      <NakshatraShanthiSection />

      {/* 9. LOKAKALYANAHITA MAHAYAGNAM */}
      <LokakalyanaSection />

      {/* 10. 28-DAY PROGRAMME & BOOK SEVA CTAS */}
      <AboutCTA />
    </div>
  );
}
