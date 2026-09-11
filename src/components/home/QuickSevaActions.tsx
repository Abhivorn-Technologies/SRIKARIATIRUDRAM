'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Flame, Utensils, Star, Radio, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function QuickSevaActions() {
  const t = useTranslations('home.quickActions');

  const actions = [
    {
      title: t('bookSeva'),
      desc: t('bookSevaDesc'),
      href: '/schedule',
      icon: Flame,
      color: 'text-gold',
      badge: 'Most Popular',
    },
    {
      title: t('sponsorAnnadanam'),
      desc: t('sponsorAnnadanamDesc'),
      href: '/sevas',
      icon: Utensils,
      color: 'text-amber-400',
      badge: '10,000+ Daily Meals',
    },
    {
      title: t('nakshatraLookup'),
      desc: t('nakshatraLookupDesc'),
      href: '/sevas',
      icon: Star,
      color: 'text-gold-light',
      badge: '28 Star Homams',
    },
    {
      title: t('watchLive'),
      desc: t('watchLiveDesc'),
      href: '/sevas',
      icon: Radio,
      color: 'text-red-400',
      badge: 'HD Broadcast',
    },
  ];

  return (
    <section className="w-full bg-[#2B0005] text-[#FAF4E6] py-16 border-t border-[#D6A532]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2C14E] tracking-wide">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base text-[#FAF4E6]/80 font-sans leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((act, index) => {
            const Icon = act.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={act.href} className="block h-full group">
                  <div className="h-full flex flex-col justify-between rounded-2xl bg-[#3A0008]/85 border border-[#D6A532]/35 hover:border-[#D6A532] p-6 relative overflow-hidden group-hover:shadow-lg group-hover:shadow-[#D6A532]/10 transition-all duration-300 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-[#2B0005] border border-[#D6A532]/40 flex items-center justify-center text-[#F2C14E] group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D6A532]/15 text-[#F2C14E] border border-[#D6A532]/30">
                          {act.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-cinzel text-lg font-bold text-[#FAF4E6] group-hover:text-[#F2C14E] transition-colors">
                          {act.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#FAF4E6]/75 mt-2 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#D6A532]/20 flex items-center text-xs font-semibold text-[#F2C14E] group-hover:text-[#FAF4E6] gap-1 transition-colors">
                      <span>{t('participateNow')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TodayAtSrikari() {
  const t = useTranslations('home.todayAtSrikari');

  return (
    <section className="w-full bg-[#FAF4E6] text-[#3A0008] py-16 lg:py-20 border-y border-[#D6A532]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Highlight Card */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F6EBD5] text-[#8B5E0A] text-xs font-bold uppercase tracking-widest border border-[#D6A532]/50 shadow-sm">
              {t('badge')}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A0008] tracking-tight">
              {t('title')}
            </h2>
            <p className="text-sm sm:text-base text-[#4A151D]/80 leading-relaxed font-sans">
              {t('subtitle')}
            </p>

            <div className="p-5 rounded-2xl bg-white/95 border border-[#D6A532]/40 shadow-sm space-y-2.5">
              <span className="text-xs text-[#8B5E0A] font-bold uppercase tracking-wider block">
                {t('nakshatraToday')}
              </span>
              <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#3A0008]">
                {t('highlightHomam')}
              </h4>
            </div>

            <Link href="/schedule" className="inline-block pt-1">
              <span className="text-sm font-bold text-[#8B5E0A] hover:text-[#3A0008] flex items-center gap-1.5 transition-colors">
                {t('viewFullDay')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Right Column: Sessions Breakdown */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Morning Session Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#D6A532]/35 shadow-sm shadow-[#D6A532]/5 hover:shadow-md hover:border-[#D6A532]/60 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5E0A] mb-4 pb-2 border-b border-[#D6A532]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D6A532] animate-pulse" />
                <span>{t('morning')}</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#3A0008]/85 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">06:30</span>
                  <span className="leading-snug">Suprabhata Seva & Maha Ganapathi Homam</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">07:30</span>
                  <span className="leading-snug">14,641 Sri Rudra Trishathi Abhishekam</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">10:30</span>
                  <span className="leading-snug">Pradhana Homa Kunda Aradhana</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">12:30</span>
                  <span className="leading-snug">Maha Mangala Harathi & Nitya Annadanam</span>
                </li>
              </ul>
            </div>

            {/* Evening Session Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#D6A532]/35 shadow-sm shadow-[#D6A532]/5 hover:shadow-md hover:border-[#D6A532]/60 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5E0A] mb-4 pb-2 border-b border-[#D6A532]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5E0A]" />
                <span>{t('evening')}</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#3A0008]/85 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">04:30</span>
                  <span className="leading-snug">Veda Vinnapam & Spiritual Discourse</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">06:30</span>
                  <span className="leading-snug">Sahasra Deepalankara Seva (1008 Lamps)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">07:30</span>
                  <span className="leading-snug">Shiva Sahasranama Archana & Prasadam</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-[#8B5E0A] shrink-0 min-w-[42px]">08:30</span>
                  <span className="leading-snug">Ekanta Seva & Sacred Day Closure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ParticipationSection() {
  const t = useTranslations('home.participation');

  const stats = [
    { value: t('stat1'), label: t('stat1Label') },
    { value: t('stat2'), label: t('stat2Label') },
    { value: t('stat3'), label: t('stat3Label') },
    { value: t('stat4'), label: t('stat4Label') },
  ];

  return (
    <section className="w-full bg-[#2B0005] text-[#FAF4E6] py-20 lg:py-24 relative overflow-hidden border-b border-[#D6A532]/25">
      {/* Subtle radial gold aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(214,165,50,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 relative z-10">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2C14E] tracking-wide">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base text-[#FAF4E6]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-[#3A0008]/90 border border-[#D6A532]/40 shadow-lg shadow-black/30 flex flex-col items-center justify-center space-y-2 backdrop-blur-sm"
            >
              <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F2C14E] via-[#FAF4E6] to-[#D6A532]">
                {st.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#FAF4E6]/90 uppercase tracking-wide">
                {st.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
