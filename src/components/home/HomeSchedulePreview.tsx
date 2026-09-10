'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { scheduleList } from '@/data/schedule';
import { DayScheduleCard } from '@/components/schedule/DayScheduleCard';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomeSchedulePreview() {
  const t = useTranslations('home.schedulePreview');
  // First 6 days as preview
  const previewDays = scheduleList.slice(0, 6);

  return (
    <section className="w-full bg-[#2B0005] text-[#FAF4E6] py-16 lg:py-24 border-t border-[#D6A532]/25 relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(214,165,50,0.07),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A0008] text-[#F2C14E] border border-[#D6A532]/40 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
              {t('badge')}
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2C14E] tracking-tight">
            {t('title')}
          </h2>

          <p className="text-sm sm:text-base text-[#FAF4E6]/80 font-sans leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 3-Column Responsive Landscape Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {previewDays.map((day, index) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 2) * 0.08 }}
              className="h-full"
            >
              <DayScheduleCard day={day} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA to view all 28 days */}
        <div className="text-center pt-4">
          <Link href="/schedule" className="inline-block">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="font-bold uppercase tracking-wider shadow-gold-lg hover:shadow-gold-xl transition-all"
            >
              {t('viewAllBtn')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
