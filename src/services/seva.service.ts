import { sevasList } from '@/data/sevas';
import { Seva, SevaCategory } from '@/types/seva';

const SLUG_ALIASES: Record<string, string> = {
  'maha-rudrabhishekam': 'ekadasa-rudra-abhishekam',
  'rudrabhishekam': 'ekadasa-rudra-abhishekam',
  'ekadasa-rudram': 'ekadasa-rudra-abhishekam',
  'ekadasa-rudra': 'ekadasa-rudra-abhishekam',
  'nakshatra-shanthi-homam': 'nakshatra-shanthi',
  'nakshatra-shanti': 'nakshatra-shanthi',
  'chandi-homa': 'chandi-homam',
  'sarpa-suktam': 'sarpa-suktam-homam',
  'parvathi-parameswara-maha-shanti-kalyanam': 'parvathi-parameswara-kalyanam',
  'subramanyeswara-kalyanam': 'valli-devasena-subramanyeswara-kalyanam',
  'valli-devasena-kalyanam': 'valli-devasena-subramanyeswara-kalyanam',
  'annadanam': 'one-day-annadanam',
  'ati-rudram': 'ati-rudram-donation',
};

export const sevaService = {
  async getAllSevas(): Promise<Seva[]> {
    return sevasList;
  },

  async getSevaBySlug(slug: string): Promise<Seva | undefined> {
    const canonical = SLUG_ALIASES[slug.toLowerCase()] || slug.toLowerCase();
    return sevasList.find(
      (s) =>
        s.slug.toLowerCase() === canonical ||
        s.id.toLowerCase() === canonical ||
        s.slug.toLowerCase() === slug.toLowerCase() ||
        s.id.toLowerCase() === slug.toLowerCase()
    );
  },

  async getFeaturedSevas(): Promise<Seva[]> {
    return sevasList.filter((s) => s.featured);
  },

  async getSevasByCategory(category: SevaCategory): Promise<Seva[]> {
    return sevasList.filter((s) => s.category === category);
  },
};
