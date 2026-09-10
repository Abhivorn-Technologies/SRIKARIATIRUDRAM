export type AnnadanamTier = 'full_day' | 'morning' | 'evening' | 'custom';

export interface AnnadanamSponsorship {
  id: string;
  sponsorName: string;
  inMemoryOf?: string;
  occasion?: string;
  phone: string;
  email: string;
  gotram?: string;
  nakshatra?: string;
  date: string;
  tier: AnnadanamTier;
  amount: number;
  mealsServed: number;
  status: 'confirmed' | 'reserved';
}
