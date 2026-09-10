import { ContactSection } from '@/components/contact/ContactForm';
import { Badge } from '@/components/ui/Badge';
import { getTranslations } from 'next-intl/server';

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="w-full flex flex-col space-y-12 py-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
          Yagasala Location & Devotee Support
        </Badge>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold">
          {t('title')}
        </h1>
        <p className="text-sm md:text-base text-ivory/80 font-sans leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <ContactSection />
    </div>
  );
}
