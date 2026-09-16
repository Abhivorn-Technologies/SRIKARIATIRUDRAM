import { AnnadanamSection } from '@/components/annadanam/AnnadanamCalendar';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'అన్నదానం మహాదానం | Sponsor Annadanam | Srikari Ati Rudram',
  description: 'Sponsor consecrated Annadanam during the 28-day Srikari Ati Rudra Mahayagnam (25 Nov – 22 Dec 2026).',
};

export default function AnnadanamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-10">
      <AnnadanamSection />
    </div>
  );
}
