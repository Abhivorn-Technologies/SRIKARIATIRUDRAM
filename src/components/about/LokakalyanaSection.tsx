'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Flame, Star, Utensils, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function LokakalyanaSection() {
  const t = useTranslations('about.lokakalyana');

  const points = [
    { title: t('points.rituals'), desc: '14,641 Japas with continuous pure ghee offerings in 11 Kundas', icon: Flame },
    { title: t('points.nakshatraShanthi'), desc: 'Remedial homams covering all 28 cosmic birth stars for societal harmony', icon: Star },
    { title: t('points.annadanam'), desc: 'Nitya Maha Annadanam feeding 10,000+ visiting devotees daily', icon: Utensils },
    { title: t('points.devoteeParticipation'), desc: 'Global participation via live streaming, seva bookings and sankalpam', icon: Users },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-burgundy-deep via-primary/70 to-burgundy-deep border-y border-gold/30 relative overflow-hidden">
      {/* Subtle fire glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center justify-center gap-3 space-y-0">
          <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
            Universal Well-being &amp; Peace
          </Badge>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold py-2 px-1 block w-full text-center overflow-visible">
            {t('heading')}
          </h2>
          <p className="text-sm sm:text-base text-ivory/85 font-sans leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* 4 Visual Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card
                  variant="gold-border"
                  className="p-6 text-center space-y-3 h-full flex flex-col justify-between bg-burgundy-deep/90 shadow-gold-sm"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/60 border border-gold/40 mx-auto flex items-center justify-center text-gold shadow-gold-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-cinzel text-base font-bold text-gold-lighter">
                      {pt.title}
                    </h3>
                  </div>
                  <p className="text-xs text-ivory/75 font-sans leading-relaxed pt-2 border-t border-gold/15">
                    {pt.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LokakalyanaSection;
