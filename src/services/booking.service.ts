import { BookingState, ConfirmedBooking } from '@/types/booking';

const BOOKINGS_STORAGE_KEY = 'srikari_devotee_bookings';

const mockInitialBookings: ConfirmedBooking[] = [
  {
    bookingId: "SAR-261127-0158",
    bookingDate: "2026-11-20",
    status: "confirmed",
    transactionRef: "UPI/TXN949046265201",
    sevaId: "chandi-homam",
    sevaSlug: "chandi-homam",
    date: "27 Nov 2026",
    dayNumber: 3,
    nakshatra: "Arudra",
    timeSlot: "08:30 AM – 12:00 PM",
    primaryDevotee: {
      fullName: "K. Satyanarayana Sharma",
      gotram: "Bharadwaja",
      nakshatra: "Arudra",
      sankalpamNames: "K. Satyanarayana Sharma, Annapurna, Shiva Karthik",
      phone: "+91 98765 43210",
      email: "satya.sharma@example.com",
      city: "Hyderabad",
      country: "India",
      attendingPersonally: "yes",
      rasi: "Mithuna",
      address: "Flat 402, Sri Nilayam, Banjara Hills"
    },
    familyMembers: [
      { name: "Smt. K. Annapurna", relation: "Spouse", gotram: "Bharadwaja", nakshatra: "Rohini", rasi: "Vrishabha" },
      { name: "Chi. K. Shiva Karthik", relation: "Son", gotram: "Bharadwaja", nakshatra: "Hastha", rasi: "Kanya" }
    ],
    deliveryOption: "postal_courier",
    paymentMethod: "upi",
    totalDakshina: 12116,
    convenienceFee: 0,
    grandTotal: 12116
  }
];

export const bookingService = {
  async getDevoteeBookings(): Promise<ConfirmedBooking[]> {
    if (typeof window === 'undefined') return mockInitialBookings;
    const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(mockInitialBookings));
      return mockInitialBookings;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return mockInitialBookings;
    }
  },

  async getBookingById(bookingId: string): Promise<ConfirmedBooking | undefined> {
    const bookings = await this.getDevoteeBookings();
    return bookings.find(b => b.bookingId === bookingId) || mockInitialBookings[0];
  },

  async createBooking(booking: BookingState): Promise<ConfirmedBooking> {
    // Generate dynamic Booking ID format: SAR-YYMMDD-XXXX (e.g. SAR-261126-0158)
    const now = new Date();
    const yy = '26';
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    const newBookingId = `SAR-${yy}${mm}${dd}-${rand}`;

    const confirmed: ConfirmedBooking = {
      ...booking,
      bookingId: newBookingId,
      bookingDate: now.toISOString().split('T')[0],
      status: 'confirmed',
      transactionRef: `UPI/TXN${Date.now().toString().slice(-10)}`,
      receiptUrl: `/book-seva/receipt/${newBookingId}`
    };

    if (typeof window !== 'undefined') {
      const current = await this.getDevoteeBookings();
      const updated = [confirmed, ...current];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    }

    return confirmed;
  }
};
