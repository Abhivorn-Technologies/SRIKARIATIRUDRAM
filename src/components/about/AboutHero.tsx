'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutHero() {
  const t = useTranslations('about');

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-20 bg-gradient-to-b from-burgundy-deep/95 via-primary/85 to-burgundy-deep">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/assets/ABOUT/ATI RUDRAM.png"
          alt="About Srikari Ati Rudram"
          fill
          sizes="100vw"
          quality={85}
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative Radial Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs text-gold-light/80 font-sans"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gold font-semibold">About Ati Rudram</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-tight"
        >
          {t('title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-ivory/85 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>
      </div>
    </section>
  );
}

export default AboutHero;
