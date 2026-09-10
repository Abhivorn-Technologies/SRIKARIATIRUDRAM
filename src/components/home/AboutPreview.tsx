'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutPreview() {
  const t = useTranslations('home.aboutPreview');

  const highlights = [
    t('highlight1'),
    t('highlight2'),
    t('highlight3'),
  ];

  return (
    <section className="w-full bg-[#FAF4E6] text-[#3A0008] py-16 lg:py-24 border-t border-[#D6A532]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Asset */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-[#2B0005] border-2 border-[#D6A532]/50 shadow-2xl shadow-[#3A0008]/20 group">
              <Image
                src="/assets/about.png"
                alt="Srikari Devi Aalayam"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 448px"
                loading="lazy"
                quality={85}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B0005]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#2B0005]/90 border border-[#D6A532]/40 backdrop-blur-sm text-center">
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#F2C14E] tracking-wider uppercase">
                  {t('imageBadge')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Description & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EBD5] text-[#8B5E0A] border border-[#D6A532]/50 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5E0A]" />
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
                  {t('badge')}
                </span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A0008] tracking-tight leading-tight">
                {t('title')}
              </h2>

              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#8B5E0A] leading-snug uppercase">
                {t('heading')}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#4A151D]/85 leading-relaxed font-sans">
              {t('description')}
            </p>

            {/* Key Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 border border-[#D6A532]/35 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#8B5E0A] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#3A0008]/90 font-sans">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Prominent CTA Button */}
            <div className="pt-4">
              <Link href="/about" className="inline-block">
                <Button
                  variant="gold"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  {t('knowAboutBtn')}
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
