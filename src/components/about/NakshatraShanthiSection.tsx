'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Flame, Star, Calendar, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function NakshatraShanthiSection() {
  const t = useTranslations('about.nakshatraShanthi');

  const processSteps = [
    { title: t('process.step1'), desc: 'Identify your birth star & rasi', icon: Star },
    { title: t('process.step2'), desc: 'Find designated day in 28-day schedule', icon: Calendar },
    { title: t('process.step3'), desc: 'Sacred Homa Kunda Aradhana & Havis', icon: Flame },
    { title: t('process.step4'), desc: 'Family names recited & prasadam blessed', icon: UserCheck },
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <Badge variant="gold" size="sm" className="font-bold tracking-widest uppercase">
          Planetary Remedial Worship
        </Badge>
        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-gold-lighter">
          {t('heading')}
        </h2>
        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold tracking-wide">
          {t('headline')}
        </h3>
        <p className="text-sm sm:text-base text-ivory/85 font-sans leading-relaxed pt-1">
          {t('description')}
        </p>
      </div>

      {/* Visual 4-Step Process */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {processSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card variant="sacred" className="p-6 text-center space-y-3 h-full border-gold/30">
                <div className="w-12 h-12 rounded-full bg-primary/60 border border-gold/40 mx-auto flex items-center justify-center text-gold shadow-gold-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                  Step {idx + 1}
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-ivory">
                  {step.title}
                </h4>
                <p className="text-xs text-ivory/70 font-sans">
                  {step.desc}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/sevas/nakshatra-shanthi">
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
    </section>
  );
}

export default NakshatraShanthiSection;
