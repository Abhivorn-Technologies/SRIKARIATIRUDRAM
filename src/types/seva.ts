export type SevaCategory = 'homam' | 'abhishekam' | 'archana' | 'special' | 'annadanam' | 'donation' | 'kalyanam';

export type SevaAvailability = 'available' | 'few_slots' | 'sold_out';

export interface Seva {
  id: string;
  slug: string;
  title: string;
  titleTe: string;
  shortDesc: string;
  shortDescTe: string;
  fullDesc: string;
  fullDescTe: string;
  category: SevaCategory;
  price: number;
  duration: string;
  durationTe: string;
  time: string;
  timeTe: string;
  image: string;
  prasadam: string[];
  prasadamTe: string[];
  benefits: string[];
  benefitsTe: string[];
  availability: SevaAvailability;
  availableSlots: number;
  featured?: boolean;
}
