'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ContactInfoAndForm, FaqSection } from '@/components/contact/ContactForm';
import { MapPin } from 'lucide-react';

export function HomeContactSection() {
  const t = useTranslations('home.contactPreview');

  return (
    <>
      <section className="w-full bg-[#2B0005] text-[#FAF4E6] py-16 lg:py-24 border-t border-[#D6A532]/25 relative overflow-hidden">
        {/* Subtle radial aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(214,165,50,0.06),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A0008] text-[#F2C14E] border border-[#D6A532]/40 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
                {t('badge')}
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2C14E] tracking-tight">
              {t('title')}
            </h2>

            <p className="text-sm sm:text-base text-[#FAF4E6]/80 font-sans leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Contact Info & Form */}
          <ContactInfoAndForm />
        </div>
      </section>

      {/* Dedicated #FAF4E6 FAQ Section */}
      <FaqSection />
    </>
  );
}
