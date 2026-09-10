/**
 * Centralized Route Registry for Srikari Ati Rudram
 * Provides standard, canonical paths for all internal pages.
 */
export const routes = {
  home: () => '/',
  about: () => '/about',
  schedule: () => '/schedule',
  scheduleDay: (day: number | string) => `/schedule/${day}`,
  sevas: () => '/sevas',
  seva: (slug: string) => `/sevas/${slug}`,
  bookSeva: (params?: { seva?: string; day?: number | string; nakshatra?: string }) => {
    if (!params) return '/book-seva';
    const query = new URLSearchParams();
    if (params.seva) query.set('seva', params.seva);
    if (params.day) query.set('day', String(params.day));
    if (params.nakshatra) query.set('nakshatra', params.nakshatra);
    const qs = query.toString();
    return qs ? `/book-seva?${qs}` : '/book-seva';
  },
  nakshatra: () => '/nakshatra',
  annadanam: () => '/annadanam',
  donate: () => '/donate',
  live: () => '/live',
  liveDay: (day: number | string) => `/live/day/${day}`,
  gallery: () => '/gallery',
  galleryDay: (day: number | string) => `/gallery/day/${day}`,
  sponsors: () => '/sponsors',
  contact: () => '/contact',
  account: () => '/account',
  accountLogin: () => '/account/login',
  accountBookings: () => '/account/bookings',
  accountBookingDetail: (id: string) => `/account/bookings/${id}`,
  accountDonations: () => '/account/donations',
  accountReceipts: () => '/account/receipts',
  accountSankalpam: () => '/account/sankalpam',
  accountProfile: () => '/account/profile',
  accountUpcoming: () => '/account/upcoming',
};
