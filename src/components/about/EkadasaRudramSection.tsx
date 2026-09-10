'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function EkadasaRudramSection() {
  const t = useTranslations('about.ekadasaRudram');
  const locale = useLocale();
  const isTe = locale === 'te';

  const progressionSteps = [
    {
      step: 'STEP 1',
      stepTe: 'దశ 1',
      title: t('step1'),
      subtitle: isTe
        ? 'శ్రీ రుద్ర నమకం & చమకం ఏక పారాయణం'
        : 'Single recitation of Sri Rudra Namakam & Chamakam',
    },
    {
      step: 'STEP 2',
      stepTe: 'దశ 2',
      title: t('step2'),
      subtitle: isTe
        ? '11 మంది వేద ఋత్విక్కులచే 11 సార్లు పారాయణం'
        : '11 recitations chanted by 11 consecrated Vedic Ritwiks',
    },
    {
      step: 'STEP 3',
      stepTe: 'దశ 3',
      title: t('step3'),
      subtitle: isTe
        ? '28 రోజుల అఖండ యజ్ఞంలో 14,641 జపాలు పూర్తి'
        : '14,641 Japas completed across 28 days of Akhanda Yajna',
    },
  ];

  return (
    <section className="w-full bg-[#230206] py-14 sm:py-16 lg:py-20 border-t border-[#D6A532]/20 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* LEFT COLUMN: Dedicated Ekadasa Rudram Image Card (~42-45% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/4.2] xl:aspect-[4/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D6A532]/60 shadow-2xl shadow-black/80 ring-1 ring-[#F2C14E]/20 group">
              <Image
                src="/assets/ABOUT/EKADASA RUDRAM.png"
                alt={t('heading')}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                quality={90}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Full Ekadasa Rudram Content (~55-58% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-5 sm:space-y-6 flex flex-col justify-center"
          >
            {/* 1. Small Badge */}
            <div>
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#2B0005] border border-[#D6A532]/60 shadow-xs">
                <span className={`text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest ${isTe ? 'font-telugu tracking-normal' : 'font-cinzel'}`}>
                  {isTe ? '11 విశ్వ రుద్ర రూపాలు' : '11 FORMS OF COSMIC RUDRA'}
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

            {/* 4. Three Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-3 lg:gap-3.5 pt-1">
              {progressionSteps.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 sm:p-4 lg:p-5 bg-[#3A0008]/85 border border-[#D6A532]/35 flex flex-col justify-between text-center hover:border-[#D6A532] transition-colors shadow-sm"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D6A532] block">
                      {isTe ? item.stepTe : item.step}
                    </span>
                    <h3 className={`${isTe ? 'font-telugu font-bold text-sm sm:text-base' : 'font-cinzel font-bold text-sm sm:text-[15px] lg:text-base'} text-[#FAF4E6]`}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#FAF4E6]/75 font-sans leading-snug pt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-3">
                    <ArrowRight className="w-4 h-4 mx-auto text-[#D6A532]" />
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Supporting Explanation */}
            <p className="text-xs sm:text-sm text-[#FAF4E6]/80 font-sans leading-relaxed text-center sm:text-left pt-1">
              {t('explanation')}
            </p>

            {/* 6. Centered Action CTA */}
            <div className="pt-2 flex justify-center sm:justify-start lg:justify-center">
              <Link href="/book-seva?seva=ekadasa-rudra-abhishekam" className="inline-block">
                <Button
                  variant="gold"
                  size="lg"
                  leftIcon={<Flame className="w-4 h-4" />}
                  className={`font-bold uppercase tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-3.5 shadow-gold-md ${isTe ? 'font-telugu tracking-normal' : ''}`}
                >
                  {t('cta')}
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default EkadasaRudramSection;
