export type SevaCategory =
  | 'donation'
  | 'abhishekam'
  | 'nakshatra'
  | 'homam'
  | 'bali'
  | 'kalyanam'
  | 'annadanam'
  | 'special'
  | 'archana';

export type SevaAvailability = 'available' | 'few_slots' | 'sold_out';

export interface Seva {
  id: string;
  slug: string;
  title: string;
  titleTe: string;
  titleHi?: string;
  name?: string;
  amount?: number;
  price: number;
  description?: string;
  shortDesc: string;
  shortDescTe: string;
  shortDescHi?: string;
  fullDesc: string;
  fullDescTe: string;
  fullDescHi?: string;
  category: SevaCategory;
  icon?: string;
  duration: string;
  durationTe: string;
  durationHi?: string;
  time: string;
  timeTe: string;
  timeHi?: string;
  image: string;
  prasadam: string[];
  prasadamTe: string[];
  prasadamHi?: string[];
  benefits: string[];
  benefitsTe: string[];
  benefitsHi?: string[];
  availability: SevaAvailability;
  availableSlots: number;
  featured?: boolean;
}
