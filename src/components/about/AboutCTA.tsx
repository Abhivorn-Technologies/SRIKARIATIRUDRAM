'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Calendar, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export function AboutCTA() {
  const t = useTranslations('about.cta');

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#1F0206] via-[#2A040A] to-[#160104] text-ivory overflow-hidden border-t border-gold/20">
      {/* Decorative background aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,154,61,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle sacred geometry background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C99A3D 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-light text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>28 Days of Divine Grace</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gold-light tracking-wide max-w-3xl mx-auto leading-tight">
            {t('title')}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-ivory/80 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-2 h-2 rotate-45 border border-gold bg-gold/20" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <Link
              href="/schedule"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#5A0714] text-ivory font-serif font-semibold border border-gold/40 shadow-lg shadow-burgundy/50 hover:border-gold hover:from-[#A22435] hover:to-[#6E0919] hover:shadow-gold/20 transition-all duration-300 group"
            >
              <Calendar className="w-5 h-5 text-gold-light group-hover:scale-110 transition-transform" />
              <span>{t('scheduleBtn')}</span>
              <ArrowRight className="w-4 h-4 text-gold-light group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/book-seva"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#C99A3D] to-[#A87B28] text-[#200307] font-serif font-bold shadow-lg shadow-gold/20 hover:brightness-110 hover:shadow-gold/30 hover:scale-[1.02] transition-all duration-300 group"
            >
              <HeartHandshake className="w-5 h-5 text-[#200307] group-hover:scale-110 transition-transform" />
              <span>{t('bookSevaBtn')}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutCTA;
