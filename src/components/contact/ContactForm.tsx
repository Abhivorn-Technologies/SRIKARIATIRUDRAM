'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/data/site';
import { faqList } from '@/data/about';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { AccordionItem } from '@/components/ui/Tabs';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactInfoAndForm() {
  const t = useTranslations('contact');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* Info Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card variant="sacred" className="p-6 space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-gold-lighter border-b border-gold/25 pb-3">
            {t('venue')}
          </h3>

          <div className="space-y-4 text-xs sm:text-sm font-sans">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-ivory block font-semibold">{siteConfig.venue.title}</strong>
                <span className="text-ivory/80 block mt-0.5">{siteConfig.venue.address}</span>
                <span className="text-gold-light text-xs block mt-0.5 font-medium">Landmark: {siteConfig.venue.landmark}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-ivory/60 block text-[11px]">Primary & Secondary Phone</span>
                <a href={`tel:${siteConfig.contact.primary}`} className="text-gold-light block font-bold text-sm hover:underline">
                  Primary: {siteConfig.contact.primary}
                </a>
                <a href={`tel:${siteConfig.contact.secondary}`} className="text-gold-light block font-semibold text-xs hover:underline">
                  Secondary: {siteConfig.contact.secondary}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-ivory/60 block text-[11px]">Official Business WhatsApp</span>
                <a
                  href={`https://wa.me/91${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold block text-sm hover:underline"
                >
                  {siteConfig.contact.whatsapp}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-ivory/60 block text-[11px]">Official & Operational Emails</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-ivory block hover:text-gold transition-colors font-medium">
                  General: {siteConfig.contact.email}
                </a>
                <a href={`mailto:${siteConfig.contact.sevaEmail}`} className="text-ivory/90 block hover:text-gold transition-colors text-xs">
                  Sevas: {siteConfig.contact.sevaEmail}
                </a>
                <a href={`mailto:${siteConfig.contact.donationsEmail}`} className="text-ivory/90 block hover:text-gold transition-colors text-xs">
                  Donations: {siteConfig.contact.donationsEmail}
                </a>
                <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-ivory/90 block hover:text-gold transition-colors text-xs">
                  Support: {siteConfig.contact.supportEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-gold/20 text-xs text-ivory/80 space-y-1">
              <div>
                <span className="text-gold-light font-semibold">Organized by: </span>
                <span>{siteConfig.organization.name}</span>
              </div>
              <div>
                <span className="text-gold-light font-semibold">In association with: </span>
                <span>{siteConfig.organization.associate}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-7">
        <Card variant="gold-border" className="p-6 sm:p-8 space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-gold-lighter border-b border-gold/25 pb-3">
            {t('formTitle')}
          </h3>

          {isSent ? (
            <div className="p-8 text-center space-y-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-cinzel text-lg font-bold text-emerald-200">
                Message Sent Successfully!
              </h4>
              <p className="text-xs text-ivory/80 font-sans">
                Our Yagasala coordination team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('name')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="tel"
                  label={t('phone')}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Textarea
                label={t('message')}
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask any question regarding Sevas, Prasadam, Travel, Accommodation..."
              />

              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold uppercase tracking-wider py-3"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('send')}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export function FaqSection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const t = useTranslations('contact');

  return (
    <section className="w-full bg-[#FAF4E6] text-[#3A0008] py-16 lg:py-20 border-t border-[#D6A532]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h3
          className={`text-2xl sm:text-3xl font-black text-[#3A0008] text-center tracking-tight ${
            isTe ? 'font-telugu leading-normal' : isHi ? 'font-hindi leading-normal' : 'font-cinzel'
          }`}
        >
          {t('faqTitle')}
        </h3>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqList.map((faq, idx) => {
            const question = isTe ? faq.qTe : isHi ? faq.qHi : faq.q;
            const answer = isTe ? faq.aTe : isHi ? faq.aHi : faq.a;

            return (
              <FaqAccordionItem
                key={idx}
                title={question}
                defaultOpen={idx === 0}
                isTe={isTe}
                isHi={isHi}
              >
                <p
                  className={`text-xs sm:text-sm leading-relaxed text-[#4A151D]/90 ${
                    isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-sans'
                  }`}
                >
                  {answer}
                </p>
              </FaqAccordionItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqAccordionItem({
  title,
  children,
  defaultOpen = false,
  isTe = false,
  isHi = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isTe?: boolean;
  isHi?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#D6A532]/40 rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:border-[#D6A532]/70">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[#FAF4E6]/50"
      >
        <span
          className={`text-base md:text-lg font-bold text-[#3A0008] pr-4 ${
            isTe ? 'font-telugu leading-normal' : isHi ? 'font-hindi leading-normal' : 'font-cinzel'
          }`}
        >
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#8B5E0A] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 text-xs sm:text-sm leading-relaxed text-[#4A151D]/90 border-t border-[#D6A532]/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className="w-full space-y-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactInfoAndForm />
      </div>
      <FaqSection />
    </div>
  );
}
