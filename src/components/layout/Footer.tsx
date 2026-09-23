'use client';

import React from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/data/site';
import { Phone, Mail, MapPin, MessageCircle, Heart, Flame } from 'lucide-react';

export function Footer() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const pathname = usePathname();

  // Do not render public footer inside admin portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-burgundy to-burgundy-deep border-t border-gold/30 text-ivory pt-16 pb-24 lg:pb-12 mt-20 relative overflow-hidden print:hidden no-print">
      {/* Background Mandala overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#E8C76A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gold/20">
          {/* Col 1: Sacred Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="Srikari Ati Rudram Home">
              <Image
                src="/assets/icons/SRIKARIATI RUDRAM.svg"
                alt="Srikari Ati Rudram"
                width={180}
                height={50}
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <p className="text-xs md:text-sm text-ivory/80 leading-relaxed font-sans">
              {isTe
                ? 'లోకకల్యాణహిత నక్షత్ర శాంతి సహిత శ్రీకరీ అతి రుద్ర మహాయజ్ఞం • 28 రోజులు • 27 నక్షత్రాలు • రోహిణి నుండి రోహిణి (25 నవంబర్ – 22 డిసెంబర్ 2026).'
                : isHi
                ? 'लोककल्याणहित नक्षत्र शांति सहित श्रीकरी अति रुद्र महायज्ञम् • 28 दिन • 27 नक्षत्र • रोहिणी से रोहिणी (25 नवम्बर – 22 दिसम्बर 2026)।'
                : 'Lokakalyanahita Nakshatra Shanthi Sahita Srikari Ati Rudra Mahayagnam • 28 Days • 27 Nakshatras • Rohini to Rohini (25 Nov – 22 Dec 2026).'}
            </p>

            <div className="p-3 rounded-lg bg-burgundy-deep/80 border border-gold/25 text-xs text-gold-lighter font-sans">
              <span className="font-bold block text-gold">
                {isTe ? 'నిర్వహణ:' : isHi ? 'आयोजक:' : 'Organized by:'}
              </span>
              {isTe
                ? 'శ్రీకరీ సేవా సమితి (శ్రీకరీ స్పిరిచువల్ NC, USA సౌజన్యంతో)'
                : isHi
                ? 'श्रीकरी सेवा समिति (श्रीकरी स्पिरिचुअल NC, USA के सहयोग से)'
                : 'Srikari Seva Samiti (in assoc. with Srikari Spiritual NC, USA)'}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase border-b border-gold/20 pb-2">
              {isTe ? 'పావన సేవలు & నివేదనలు' : isHi ? 'पावन सेवाएँ एवं अर्पण' : 'Auspicious Offerings'}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/sevas" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-gold-light shrink-0" />
                  <span>{t('sevas')}</span>
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>{t('schedule')}</span>
                </Link>
              </li>
              <li>
                <Link href="/nakshatra" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>{t('nakshatra')}</span>
                </Link>
              </li>
              <li>
                <Link href="/annadanam" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>{t('annadanam')}</span>
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{t('donate')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Information */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase border-b border-gold/20 pb-2">
              {isTe ? 'సమాచారం & ప్రసారం' : isHi ? 'सूचना एवं मीडिया' : 'Information & Media'}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/live" className="text-ivory/80 hover:text-gold-light transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-semibold text-red-300">{t('live')}</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-ivory/80 hover:text-gold-light transition-colors">
                  {t('gallery')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ivory/80 hover:text-gold-light transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-ivory/80 hover:text-gold-light transition-colors">
                  {t('sponsors')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-gold tracking-widest uppercase border-b border-gold/20 pb-2">
              {isTe ? 'ప్రాంగణం & సంప్రదించండి' : isHi ? 'स्थान एवं संपर्क' : 'Venue & Contact'}
            </h4>
            <div className="space-y-2.5 text-xs text-ivory/80 font-sans">
              <a
                href={siteConfig.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Location in Google Maps"
                className="flex items-start gap-2.5 hover:text-gold transition-colors group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-gold-light shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-snug group-hover:underline">
                  {isTe ? 'శ్రీకరీ దేవాలయం, నందనవనం లేఅవుట్, హైదరాబాద్' : isHi ? 'श्रीकरी मंदिर, नंदनवनम लेआउट, हैदराबाद' : siteConfig.venue.title}
                </span>
              </a>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`tel:${siteConfig.contact.primary}`} className="hover:text-gold transition-colors">
                  {isTe ? 'ముఖ్య సంఖ్య:' : isHi ? 'प्राथमिक:' : 'Primary:'} {siteConfig.contact.primary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`tel:${siteConfig.contact.secondary}`} className="hover:text-gold transition-colors">
                  {isTe ? 'మరొక సంఖ్య:' : isHi ? 'द्वितीयक:' : 'Secondary:'} {siteConfig.contact.secondary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/91${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 transition-colors"
                >
                  WhatsApp: {siteConfig.contact.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-gold transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <p>
            {isTe
              ? '© 2026 శ్రీకరీ సేవా సమితి. సర్వ హక్కులూ ప్రత్యేకించబడినవి.'
              : isHi
              ? '© 2026 श्रीकरी सेवा समिति। सर्वाधिकार सुरक्षित।'
              : '© 2026 Srikari Seva Samiti. All Rights Reserved.'}
          </p>
          <p className="text-ivory/70">
            {isTe ? 'రూపకల్పన & అభివృద్ధి' : isHi ? 'द्वारा विकसित' : 'Developed by'}{' '}
            <a
              href="https://abhivorn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:underline font-medium"
            >
              Abhivorn Technologies Pvt. Ltd.
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/schedule" className="hover:text-gold-light">{t('schedule')}</Link>
            <Link href="/contact" className="hover:text-gold-light">{t('contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
