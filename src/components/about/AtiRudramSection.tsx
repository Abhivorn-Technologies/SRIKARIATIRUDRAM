'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function AtiRudramSection() {
  const t = useTranslations('about.atiRudram');
  const locale = useLocale();
  const isTe = locale === 'te';

  const stats = [
    { value: '14,641', label: t('stats.japas') },
    { value: '121', label: t('stats.scholars') },
    { value: '11', label: t('stats.kundas') },
    { value: '28', label: t('stats.days') },
  ];

  return (
    <section className="w-full bg-[#2B0005] py-14 sm:py-16 lg:py-20 border-t border-[#D6A532]/20 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* LEFT COLUMN: Dedicated Ati Rudram Image Card (~42-45% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/4.2] xl:aspect-[4/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D6A532]/60 shadow-2xl shadow-black/80 ring-1 ring-[#F2C14E]/20 group">
              <Image
                src="/assets/ABOUT/ATI RUDRAM.png"
                alt={t('heading')}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                quality={90}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Full Ati Rudram Content (~55-58% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-5 sm:space-y-6 flex flex-col justify-center"
          >
            {/* 1. Small Badge */}
            <div>
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#230206] border border-[#D6A532]/60 shadow-xs">
                <span className={`text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
                  {isTe ? 'వేద యజ్ఞాలలో అత్యున్నత శిఖరం' : 'THE PINNACLE OF VEDIC YAJNAS'}
                </span>
              </div>
            </div>

            {/* 2. Main Heading */}
            <h2 className={`${isTe ? 'font-telugu text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.35]' : 'font-cinzel text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight leading-tight'} text-[#F2C14E]`}>
              {t('heading')}
            </h2>

            {/* 3. Description */}
            <p className="text-sm sm:text-[15px] lg:text-base text-[#FAF4E6]/90 font-sans leading-relaxed">
              {t('description')}
            </p>

            {/* 4. Four Statistics Cards (2 columns on mobile, 4 columns on larger screens) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-1">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-4 rounded-xl bg-[#3A0008]/85 border border-[#D6A532]/35 flex flex-col items-center justify-center text-center hover:border-[#D6A532] transition-colors shadow-sm"
                >
                  <span className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-black text-[#F2C14E] tabular-nums">
                    {stat.value}
                  </span>
                  <span className={`text-[11px] sm:text-xs text-[#FAF4E6]/80 font-medium block mt-1 leading-tight ${isTe ? 'font-telugu' : 'font-sans'}`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 5. VEDIC MAGNITUDE Progression Section */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#230206]/95 border border-[#D6A532]/40 text-center space-y-3 shadow-md">
              <span className={`text-[10px] sm:text-xs font-bold text-[#D6A532] uppercase tracking-widest block ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
                {t('progressionTitle')}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold font-cinzel text-ivory">
                <span className={`px-3 py-1.5 rounded-lg bg-[#3A0008] border border-[#D6A532]/30 text-[#FAF4E6] ${isTe ? 'font-telugu' : ''}`}>
                  {t('rudram')}
                </span>
                <ArrowRight className="w-4 h-4 text-[#D6A532] shrink-0" />
                <span className={`px-3 py-1.5 rounded-lg bg-[#3A0008] border border-[#D6A532]/30 text-[#FAF4E6] ${isTe ? 'font-telugu' : ''}`}>
                  {t('ekadasa')}
                </span>
                <ArrowRight className="w-4 h-4 text-[#D6A532] shrink-0" />
                <span className={`px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#2B0005] font-black shadow-gold-sm ${isTe ? 'font-telugu' : ''}`}>
                  {t('atiRudram')}
                </span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AtiRudramSection;
