'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, Calendar, Flame, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

import { scheduleList } from '@/data/schedule';

export function NakshatraInfoSection() {
  const t = useTranslations('about.nakshatras');
  const locale = useLocale();
  const isTe = locale === 'te';

  // Four sample highlights from central 28-day schedule (Day 1, 2, 3, 28)
  const sampleDays = [
    scheduleList[0],  // Day 1 - Rohini
    scheduleList[1],  // Day 2 - Mrigasira
    scheduleList[2],  // Day 3 - Arudra
    scheduleList[27], // Day 28 - Rohini
  ];

  return (
    <section className="w-full bg-[#230206] py-14 sm:py-16 lg:py-20 border-t border-[#D6A532]/20 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#2B0005] border border-[#D6A532]/60 shadow-xs">
            <span className={`text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
              {isTe ? 'విశ్వ నక్షత్ర చక్రం' : 'COSMIC ALIGNMENT'}
            </span>
          </div>
          <h2 className={`${isTe ? 'font-telugu text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.35]' : 'font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight'} text-[#F2C14E]`}>
            {t('heading')}
          </h2>
          <p className="text-sm sm:text-base text-[#FAF4E6]/85 font-sans leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* 4 Nakshatra Cards — Perfectly aligned 4-column grid on desktop, 2x2 on tablet, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch">
          {sampleDays.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="h-full flex flex-col w-full"
            >
              <div className="h-full w-full rounded-2xl bg-[#3A0008]/85 border border-[#D6A532]/35 hover:border-[#D6A532] transition-colors p-5 lg:p-6 shadow-md flex flex-col justify-between">
                
                {/* 1. Top Section: Nakshatram Badge & Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#D6A532] tracking-widest">
                      {t('labels.nakshatra')}
                    </span>
                    <Star className="w-4 h-4 text-[#F2C14E] fill-[#F2C14E]/30 shrink-0" />
                  </div>
                  <h4 className={`${isTe ? 'font-telugu font-bold text-lg sm:text-xl' : 'font-cinzel text-lg sm:text-xl font-bold'} text-[#FAF4E6]`}>
                    {isTe ? item.nakshatraTe : item.nakshatra}
                  </h4>
                </div>

                {/* 2. Middle Section: Programme Date */}
                <div className="pt-3.5 mt-3.5 border-t border-gold/20 space-y-1 text-xs font-sans">
                  <div className="text-[#FAF4E6]/60 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#D6A532] shrink-0" />
                    <span>{t('labels.programmeDate')}:</span>
                  </div>
                  <strong className="text-[#F2C14E] block font-semibold text-xs sm:text-[13px] pt-0.5">
                    {isTe ? `రోజు ${item.dayNumber} (${item.date})` : `Day ${item.dayNumber} (${item.date})`}
                  </strong>
                </div>

                {/* 3. Bottom Section: Special Seva */}
                <div className="pt-3.5 mt-3.5 border-t border-gold/20 space-y-1 text-xs font-sans flex-1 flex flex-col justify-start">
                  <div className="text-[#FAF4E6]/60 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold">
                    <Flame className="w-3.5 h-3.5 text-[#D6A532] shrink-0" />
                    <span>{t('labels.specialSeva')}:</span>
                  </div>
                  <p className="text-ivory/95 font-medium text-xs sm:text-[13px] leading-snug pt-0.5">
                    {isTe ? item.pradhanaHomamTe : item.pradhanaHomam}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Action CTAs Centered Underneath */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/schedule">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className={`font-bold uppercase tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-3.5 shadow-gold-md ${isTe ? 'font-telugu tracking-normal' : ''}`}
            >
              {t('ctaSchedule')}
            </Button>
          </Link>
          <Link href="/nakshatra">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Compass className="w-4 h-4" />}
              className={`font-semibold uppercase tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-3.5 ${isTe ? 'font-telugu tracking-normal' : ''}`}
            >
              {t('ctaFind')}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default NakshatraInfoSection;
