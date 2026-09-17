'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Flame, Calendar, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/site';

export function HeroSection() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 lg:py-24 bg-[#2B0005]">
      {/* Background Image Container with Continuous Slow Cinematic Zoom Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat will-change-transform brightness-110 contrast-105"
          style={{
            backgroundImage: "url('/assets/hero.png')",
            backgroundPosition: 'center center',
          }}
        />
        {/* Brighter Gradient Overlay for Enhanced Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F0004]/35 via-[#2B0005]/40 to-[#1F0004]/65 pointer-events-none" />
      </div>

      {/* Decorative Radial Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D6A532]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#5A0714]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 overflow-visible">
        {/* Sacred Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B0005]/95 border-2 border-[#F2C14E] shadow-md shadow-black/60 max-w-full overflow-visible"
        >
          <Sparkles className="w-4 h-4 text-[#FFE899] shrink-0" />
          <span
            className={`${
              isTe
                ? 'font-telugu text-xs sm:text-sm md:text-base font-bold tracking-normal leading-normal'
                : isHi
                ? 'font-hindi text-xs sm:text-sm md:text-base font-bold tracking-normal leading-normal'
                : 'font-cinzel text-xs md:text-sm font-black tracking-wider uppercase'
            } text-[#FFE899] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]`}
          >
            {t('subtitle')}
          </span>
        </motion.div>

        {/* Grand Title with High-Contrast Typography Hierarchy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl mx-auto overflow-visible py-2"
        >
          <h1 className="flex flex-col items-center justify-center text-center overflow-visible h-auto min-h-0">
            {/* Supporting / Pre-Title */}
            <span
              className={`${
                isTe
                  ? 'font-telugu text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.38] sm:leading-[1.42] tracking-normal py-1 px-1 telugu-clip-safe'
                  : isHi
                  ? 'font-hindi text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.38] sm:leading-[1.42] tracking-normal py-1 px-1 telugu-clip-safe'
                  : 'font-cinzel text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-wider uppercase leading-[1.25]'
              } text-transparent bg-clip-text bg-gradient-to-r from-[#FFE899] via-[#FFFFFF] to-[#F2C14E] drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)] mb-2 sm:mb-3 block max-w-4xl whitespace-normal break-words overflow-visible`}
            >
              {t('titleSupporting')}
            </span>

            {/* Main Dominant Title */}
            <span
              className={`${
                isTe
                  ? 'font-telugu text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-black tracking-normal leading-[1.38] sm:leading-[1.45] py-1.5 sm:py-2 px-1 telugu-clip-safe'
                  : isHi
                  ? 'font-hindi text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-black tracking-normal leading-[1.38] sm:leading-[1.45] py-1.5 sm:py-2 px-1 telugu-clip-safe'
                  : 'font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-black tracking-tight leading-[1.12]'
              } text-transparent bg-clip-text bg-gradient-to-r from-[#FFE899] via-[#FFFFFF] to-[#F2C14E] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] block max-w-5xl whitespace-normal break-words overflow-visible`}
            >
              {t('titleMain')}
            </span>
          </h1>
        </motion.div>

        {/* Sacred Telugu / Hindi Sloka Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#2B0005]/95 border-2 border-[#D6A532]/60 shadow-xl shadow-black/60 backdrop-blur-md overflow-visible"
        >
          <p
            className={`${
              isHi ? 'font-hindi' : 'font-telugu'
            } text-xs sm:text-sm md:text-base text-white leading-[1.75] font-bold tracking-normal py-1 overflow-visible drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}
          >
            {t('teluguSloka')}
          </p>
        </motion.div>

        {/* Event Dates & Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white font-sans overflow-visible"
        >
          <div className="flex items-center gap-2 bg-[#3A0008]/95 px-4 sm:px-5 py-2.5 rounded-full border-2 border-[#D6A532]/50 shadow-md overflow-visible">
            <Calendar className="w-4.5 h-4.5 text-[#FFE899] shrink-0" />
            <span
              className={`font-bold ${
                isTe
                  ? 'font-telugu text-xs sm:text-sm leading-normal'
                  : isHi
                  ? 'font-hindi text-xs sm:text-sm leading-normal'
                  : ''
              }`}
            >
              {t('dates')}
            </span>
          </div>
          <a
            href="https://maps.app.goo.gl/JzekkVB3tJuigngh7?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Exact Google Maps Location"
            className="flex items-center gap-2 bg-[#3A0008]/95 px-4 sm:px-5 py-2.5 rounded-full border-2 border-[#D6A532]/50 shadow-md hover:border-[#F2C14E] hover:bg-[#5A0714] transition-all cursor-pointer group overflow-visible"
          >
            <MapPin className="w-4.5 h-4.5 text-[#FFE899] shrink-0 group-hover:scale-110 transition-transform" />
            <span
              className={
                isTe
                  ? 'font-telugu text-xs sm:text-sm leading-normal group-hover:text-[#FFE899] transition-colors font-bold'
                  : isHi
                  ? 'font-hindi text-xs sm:text-sm leading-normal group-hover:text-[#FFE899] transition-colors font-bold'
                  : 'group-hover:text-[#FFE899] transition-colors font-bold'
              }
            >
              {t('location')}
            </span>
          </a>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/schedule" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="xl"
              leftIcon={<Flame className="w-5 h-5" />}
              className={`w-full sm:w-auto font-bold ${
                isTe
                  ? 'font-telugu text-sm sm:text-base tracking-normal py-3.5'
                  : isHi
                  ? 'font-hindi text-sm sm:text-base tracking-normal py-3.5'
                  : 'uppercase tracking-wider'
              } shadow-gold-lg`}
            >
              {t('bookSevaBtn')}
            </Button>
          </Link>
          <Link href="/schedule" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="xl"
              leftIcon={<Calendar className="w-5 h-5" />}
              className={`w-full sm:w-auto font-semibold ${
                isTe
                  ? 'font-telugu text-sm sm:text-base tracking-normal py-3.5'
                  : isHi
                  ? 'font-hindi text-sm sm:text-base tracking-normal py-3.5'
                  : 'uppercase tracking-wider'
              }`}
            >
              {t('viewScheduleBtn')}
            </Button>
          </Link>
        </motion.div>

        {/* Countdown Box */}
        <div className="pt-4 overflow-visible">
          <EventCountdown targetDate={siteConfig.eventStartDate} />
        </div>
      </div>
    </section>
  );
}

export function EventCountdown({ targetDate }: { targetDate: string }) {
  const t = useTranslations('home.countdown');
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      let difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        // When countdown completes, automatically restart from 365 days cycle
        const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        const elapsed = Math.abs(difference) % YEAR_MS;
        difference = YEAR_MS - elapsed;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="inline-block p-4 sm:p-6 rounded-2xl bg-[#2B0005]/95 border border-[#D6A532]/50 shadow-xl shadow-black/40 max-w-full overflow-visible">
      <span
        className={`${
          isTe
            ? 'font-telugu text-xs sm:text-sm font-semibold tracking-normal leading-normal'
            : isHi
            ? 'font-hindi text-xs sm:text-sm font-semibold tracking-normal leading-normal'
            : 'font-cinzel text-xs font-bold tracking-widest uppercase'
        } text-[#F2C14E] block mb-3 text-center`}
      >
        {t('title')}
      </span>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: t('days'), value: timeLeft.days },
          { label: t('hours'), value: timeLeft.hours },
          { label: t('minutes'), value: timeLeft.minutes },
          { label: t('seconds'), value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-[#3A0008]/85 border border-[#D6A532]/35 rounded-xl px-2 sm:px-5 py-2 sm:py-3 min-w-[65px] sm:min-w-[85px] shadow-sm overflow-visible"
          >
            <span className="font-cinzel text-xl sm:text-3xl font-black text-[#F2C14E] tabular-nums">
              {String(item.value).padStart(2, '0')}
            </span>
            <span
              className={`text-[10px] sm:text-xs text-[#FAF4E6]/85 font-medium ${
                isTe
                  ? 'font-telugu tracking-normal leading-tight mt-1'
                  : isHi
                  ? 'font-hindi tracking-normal leading-tight mt-1'
                  : 'uppercase tracking-wider mt-0.5'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


