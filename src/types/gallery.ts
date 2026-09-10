export type GalleryCategory = 'all' | 'rituals' | 'deities' | 'homams' | 'annadanam' | 'videos';

export interface GalleryItem {
  id: string;
  title: string;
  titleTe: string;
  category: GalleryCategory;
  type: 'image' | 'video';
  thumbnailUrl: string;
  fullUrl: string;
  dayNumber?: number;
  date?: string;
  description?: string;
  descriptionTe?: string;
}

export type SponsorTier = 'diamond' | 'gold' | 'silver' | 'patron';

export interface Sponsor {
  id: string;
  name: string;
  nameTe: string;
  tier: SponsorTier;
  title: string;
  titleTe: string;
  city: string;
  logoUrl?: string;
  contributionType?: string;
  contributionTypeTe?: string;
}
