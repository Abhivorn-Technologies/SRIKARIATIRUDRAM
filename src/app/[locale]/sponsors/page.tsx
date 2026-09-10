import { SponsorGrid } from '@/components/sponsors/SponsorGrid';
import { Badge } from '@/components/ui/Badge';
import { getTranslations } from 'next-intl/server';

export default async function SponsorsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'sponsors' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
          Devout Yajna Patrons & Poshakulu
        </Badge>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold">
          {t('title')}
        </h1>
        <p className="text-sm md:text-base text-ivory/80 font-sans leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <SponsorGrid />
    </div>
  );
}
