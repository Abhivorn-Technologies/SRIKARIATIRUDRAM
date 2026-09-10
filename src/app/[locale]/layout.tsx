import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import '../globals.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
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
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/icons/FAVICON.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/icons/FAVICON.svg" />
      </head>
      <body className="bg-burgundy-deep text-ivory min-h-screen flex flex-col selection:bg-gold selection:text-burgundy-deep">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
