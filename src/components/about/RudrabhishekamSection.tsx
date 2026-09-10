'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Flame, CheckCircle, Sparkles, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export function RudrabhishekamSection() {
  const t = useTranslations('about.rudrabhishekam');

  const features = [
    { label: t('features.recitation'), icon: Sparkles },
    { label: t('features.abhishekam'), icon: Droplets },
    { label: t('features.participation'), icon: Flame },
    { label: t('features.tradition'), icon: CheckCircle },
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Shiva Lingam Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-gold-md bg-burgundy-deep"
        >
          <Image
            src="/assets/ABOUT/RUDRABHISHEKAM.png"
            alt="Rudrabhishekam Seva"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
            loading="lazy"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="font-cinzel text-xs font-bold text-gold-lighter tracking-widest uppercase">
              Abhishekam with 11 Sacred Dravyas
            </span>
          </div>
        </motion.div>

        {/* Right Column: Educational Significance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="space-y-3">
            <Badge variant="gold" size="sm" className="font-bold tracking-widest uppercase">
              Devotional Worship
            </Badge>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-gold-lighter">
              {t('heading')}
            </h2>
            <p className="text-sm sm:text-base text-ivory/85 font-sans leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* 4 Feature List */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-burgundy-deep/80 border border-gold/30 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/60 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-cinzel text-xs font-bold text-ivory tracking-wide">
                    {feat.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link href="/sevas/ekadasa-rudra-abhishekam">
              <Button
                variant="gold"
                size="lg"
                leftIcon={<Flame className="w-4 h-4" />}
                className="font-bold uppercase tracking-wider text-xs sm:text-sm"
              >
                {t('cta')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RudrabhishekamSection;
