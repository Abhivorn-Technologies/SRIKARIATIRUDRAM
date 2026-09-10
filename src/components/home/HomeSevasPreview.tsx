'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { sevasList } from '@/data/sevas';
import { SevaCard } from '@/components/sevas/SevaCard';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomeSevasPreview() {
  const t = useTranslations('home.sevasPreview');
  // Limited selection of featured sevas (top 3)
  const previewSevas = sevasList.slice(0, 3);

  return (
    <section className="w-full bg-[#FAF4E6] text-[#3A0008] py-16 lg:py-24 border-t border-[#D6A532]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EBD5] text-[#8B5E0A] border border-[#D6A532]/50 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#8B5E0A]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
              {t('badge')}
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A0008] tracking-tight">
            {t('title')}
          </h2>

          <p className="text-sm sm:text-base text-[#4A151D]/80 font-sans leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Sevas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {previewSevas.map((seva, index) => (
            <motion.div
              key={seva.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SevaCard seva={seva} />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-4">
          <Link href="/sevas" className="inline-block">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              {t('viewAllBtn')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
