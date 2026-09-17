import { sevasList } from '@/data/sevas';
import { Seva, SevaCategory } from '@/types/seva';
import { sevaServerService, SevaItem } from '@/services/server/seva.server.service';

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

function mapDbSevaToSeva(item: SevaItem, staticFallback?: Seva): Seva {
  const fallback = staticFallback || sevasList.find(s => s.id === item.id || s.slug === item.slug);
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    titleTe: item.title_te || fallback?.titleTe || item.title,
    titleHi: item.title_hi || fallback?.titleHi || item.title,
    name: item.title,
    amount: Number(item.amount),
    price: Number(item.amount),
    description: item.short_desc || fallback?.description || '',
    shortDesc: item.short_desc || fallback?.shortDesc || '',
    shortDescTe: item.short_desc_te || fallback?.shortDescTe || item.short_desc || '',
    shortDescHi: item.short_desc_hi || fallback?.shortDescHi || item.short_desc || '',
    fullDesc: item.full_desc || fallback?.fullDesc || '',
    fullDescTe: item.full_desc_te || fallback?.fullDescTe || item.full_desc || '',
    fullDescHi: item.full_desc_hi || fallback?.fullDescHi || item.full_desc || '',
    category: (item.category as SevaCategory) || fallback?.category || 'homam',
    icon: item.icon || fallback?.icon || '🕉️',
    duration: item.duration || fallback?.duration || '1 Hour',
    durationTe: fallback?.durationTe || item.duration || '1 గంట',
    durationHi: fallback?.durationHi || item.duration || '1 घंटा',
    time: item.time || fallback?.time || '08:30 AM',
    timeTe: fallback?.timeTe || item.time || 'ఉదయం 08:30',
    timeHi: fallback?.timeHi || item.time || 'सुबह 08:30',
    image: fallback?.image || '/assets/images/sevas/rudrabhishekam.jpg',
    prasadam: Array.isArray(item.prasadam) ? item.prasadam : (fallback?.prasadam || []),
    prasadamTe: fallback?.prasadamTe || (Array.isArray(item.prasadam) ? item.prasadam : []),
    prasadamHi: fallback?.prasadamHi || (Array.isArray(item.prasadam) ? item.prasadam : []),
    benefits: Array.isArray(item.benefits) ? item.benefits : (fallback?.benefits || []),
    benefitsTe: fallback?.benefitsTe || (Array.isArray(item.benefits) ? item.benefits : []),
    benefitsHi: fallback?.benefitsHi || (Array.isArray(item.benefits) ? item.benefits : []),
    availability: item.active ? 'available' : 'sold_out',
    availableSlots: item.capacity || 100,
    featured: item.featured ?? fallback?.featured ?? false,
  };
}

export const sevaService = {
  async getAllSevas(): Promise<Seva[]> {
    try {
      const dbSevas = await sevaServerService.getAllSevas(true);
      if (dbSevas && dbSevas.length > 0) {
        return dbSevas
          .map(s => mapDbSevaToSeva(s))
          .sort((a, b) => (a.amount || a.price || 0) - (b.amount || b.price || 0));
      }
    } catch (err) {
      console.warn('Falling back to static sevasList due to DB error:', err);
    }
    return [...sevasList].sort((a, b) => (a.amount || a.price || 0) - (b.amount || b.price || 0));
  },

  async getSevaBySlug(slug: string): Promise<Seva | undefined> {
    const canonical = SLUG_ALIASES[slug.toLowerCase()] || slug.toLowerCase();
    try {
      const dbSeva = await sevaServerService.getSevaByIdOrSlug(canonical);
      if (dbSeva) {
        return mapDbSevaToSeva(dbSeva);
      }
    } catch (err) {
      console.warn('Falling back to static seva lookup due to DB error:', err);
    }
    return sevasList.find(
      (s) =>
        s.slug.toLowerCase() === canonical ||
        s.id.toLowerCase() === canonical ||
        s.slug.toLowerCase() === slug.toLowerCase() ||
        s.id.toLowerCase() === slug.toLowerCase()
    );
  },

  async getFeaturedSevas(): Promise<Seva[]> {
    const all = await this.getAllSevas();
    return all.filter((s) => s.featured);
  },

  async getSevasByCategory(category: SevaCategory): Promise<Seva[]> {
    const all = await this.getAllSevas();
    return all.filter((s) => s.category === category);
  },
};

