import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import '../globals.css';

import { BackgroundAudioPlayer } from '@/components/layout/BackgroundAudioPlayer';
import { DevoteeAuthProvider } from '@/context/DevoteeAuthContext';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: `${t('title')} | Srikari Ati Rudram`,
    description: `${t('dates')} - ${t('location')}`,
    keywords: ['Ati Rudram', 'Srikari', 'Mahayagnam', 'Rudrabhishekam', 'Nakshatra Shanthi', 'Vedic Yajna', 'Annadanam'],
    icons: {
      icon: [
        { url: '/assets/icons/FAVICON.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/assets/icons/FAVICON.svg',
      apple: '/assets/icons/FAVICON.svg',
    },
    openGraph: {
      title: `${t('title')} | Srikari Ati Rudram`,
      description: t('dates'),
      siteName: 'Srikari Ati Rudram',
      images: [
        {
          url: '/assets/images/hero/shiva-hero.svg',
          width: 800,
          height: 600,
          alt: 'Srikari Ati Rudram',
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <DevoteeAuthProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
        <WhatsAppButton />
        <BackgroundAudioPlayer />
      </DevoteeAuthProvider>
    </NextIntlClientProvider>
  );
}
