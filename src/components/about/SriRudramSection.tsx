'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export function SriRudramSection() {
  const t = useTranslations('about.sriRudram');
  const locale = useLocale();
  const isTe = locale === 'te';

  return (
    <section className="py-16 md:py-20 bg-burgundy-deep/70 border-y border-gold/25 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Educational Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#2B0005] border border-[#D6A532]/60 shadow-xs">
                <span className={`text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
                  {isTe ? 'కృష్ణ యజుర్వేద తైత్తిరీయ సంహిత' : 'Krishna Yajurvedic Taittiriya Samhita'}
                </span>
              </div>
              <h2 className={`${isTe ? 'font-telugu text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.35]' : 'font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight'} text-[#F2C14E]`}>
                {t('heading')}
              </h2>
              <p className="text-sm sm:text-base text-[#FAF4E6]/90 font-sans leading-relaxed">
                {t('description')}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#F2C14E]/90 font-sans leading-relaxed bg-[#2B0005]/80 p-4 rounded-xl border border-[#D6A532]/30">
              {t('significance')}
            </p>
          </motion.div>

          {/* Right Column: Sri Rudram Visual Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border-2 border-[#D6A532]/50 shadow-2xl shadow-black/80 bg-burgundy-deep"
          >
            <Image
              src="/assets/ABOUT/SRI RUDRAM.png"
              alt="Sri Rudram Taittiriya Samhita"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
              loading="lazy"
              quality={85}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className={`text-xs font-bold text-[#FAF4E6] tracking-widest uppercase ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
                {isTe ? 'శ్రీ రుద్ర నమకం & చమకం' : 'Sri Rudra Namakam & Chamakam'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SriRudramSection;
