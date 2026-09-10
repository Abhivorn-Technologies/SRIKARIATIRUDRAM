'use client';

import React, { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, History, Flame, Utensils, HeartHandshake } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function MainVideoSection() {
  const t = useTranslations('home.mainVideo');
  const locale = useLocale();
  const isTe = locale === 'te';
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleViewportEnter = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {
        // Safe catch for browser autoplay policies
      });
    }
  };

  const featureCards = [
    {
      title: t('card1Title'),
      desc: t('card1Desc'),
      icon: History,
    },
    {
      title: t('card2Title'),
      desc: t('card2Desc'),
      icon: Flame,
    },
    {
      title: t('card3Title'),
      desc: t('card3Desc'),
      icon: Utensils,
    },
    {
      title: t('card4Title'),
      desc: t('card4Desc'),
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="w-full bg-[#2B0005] text-[#FAF4E6] py-16 lg:py-24 border-t border-[#D6A532]/30 relative overflow-hidden">
      {/* Subtle sacred radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(214,165,50,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 lg:space-y-12">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-3.5"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3D000A] text-[#F2C14E] border border-[#D6A532]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
              {t('badge')}
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2C14E] tracking-tight ${
              isTe ? 'leading-[1.4] py-1' : ''
            }`}
          >
            {t('title')}
          </h2>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#FAF4E6]/85 font-sans leading-relaxed max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Large Centered 16:9 Landscape Video Container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          onViewportEnter={handleViewportEnter}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#1C0004] via-[#120002] to-[#0A0001] border-2 border-[#D6A532]/50 shadow-[0_4px_35px_rgba(214,165,50,0.25)] ring-1 ring-[#D6A532]/30">
            {/* Native 16:9 Landscape Video Element with Autoplay Muted & Native Controls */}
            <video
              ref={videoRef}
              src="/assets/gallary/MAINVD.mp4"
              autoPlay
              muted
              playsInline
              controls
              preload="metadata"
              title="Srikari Temple Complete Overview Video"
              aria-label="Srikari Temple Complete Overview Video"
              className="w-full h-full object-cover bg-black"
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        </motion.div>

        {/* Supporting Information Cards */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto pt-2"
        >
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#340008]/85 border border-[#D6A532]/30 shadow-sm hover:border-[#D6A532]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2B0005] border border-[#D6A532]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#F2C14E]" />
                  </div>
                  <h4 className="font-cinzel text-xs sm:text-[13px] font-bold text-[#F2C14E] tracking-wide uppercase">
                    {card.title}
                  </h4>
                </div>
                <p className="text-xs text-[#FAF4E6]/75 font-sans leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
