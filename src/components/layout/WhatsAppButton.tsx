'use client';

import React from 'react';
import { siteConfig } from '@/data/site';
import { MessageCircle } from 'lucide-react';
import { usePathname } from '@/i18n/routing';

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Om Namah Shivaya! I would like to inquire about Srikari Ati Rudra Mahayagnam Sevas.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-400/40"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
      <span className="text-xs md:text-sm font-semibold tracking-wide hidden sm:inline">
        WhatsApp Helpline
      </span>
    </a>
  );
}
