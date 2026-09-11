import { BookingState, ConfirmedBooking, BookingDraft } from '@/types/booking';
import { sevasList } from '@/data/sevas';
import { scheduleList } from '@/data/schedule';
import { getNakshatraBookingOptions } from '@/data/nakshatras';

const BOOKINGS_STORAGE_KEY = 'srikari_devotee_bookings';
const ACTIVE_DRAFT_KEY = 'srikari_active_booking_draft';

const defaultDraft: BookingDraft = {
  sevaId: 'ati-rudram-donation',
  sevaSlug: 'ati-rudram-donation',
  sevaName: 'ATI RUDRAM DONATION',
  amount: 216,
  selectedDate: '25 November 2026',
  dayNumber: 1,
  nakshatra: 'Rohini',
  rasi: 'Vrishabha',
  devoteeName: '',
  gotram: 'Bharadwaja',
  janmaNakshatra: 'Rohini',
  dateOfBirth: '',
  familyMembers: '',
  mobile: '',
  email: '',
  address: '',
  paymentStatus: 'PENDING',
};

const mockInitialBookings: ConfirmedBooking[] = [
  {
    bookingId: "SAR-2026-000123",
    bookingDate: "2026-11-20",
    status: "confirmed",
    paymentStatus: "CONFIRMED",
    transactionRef: "UPI/TXN949046265201",
    sevaId: "nakshatra-shanthi",
    sevaSlug: "nakshatra-shanthi",
    sevaName: "NAKSHATRA SHANTHI",
    amount: 10116,
    selectedDate: "9 December 2026",
    date: "9 December 2026",
    dayNumber: 15,
    nakshatra: "Jyeshta",
    rasi: "Vrischika",
    timeSlot: "08:30 AM – 11:30 AM",
    primaryDevotee: {
      fullName: "K. Satyanarayana Sharma",
      gotram: "Bharadwaja",
      nakshatra: "Jyeshta",
      sankalpamNames: "K. Satyanarayana Sharma, Annapurna, Shiva Karthik",
      phone: "+91 98765 43210",
      email: "satya.sharma@example.com",
      city: "Hyderabad",
      country: "India",
      attendingPersonally: "yes",
      rasi: "Vrischika",
      address: "Flat 402, Sri Nilayam, Banjara Hills, Hyderabad"
    },
    familyMembers: [
      { name: "Smt. K. Annapurna", relation: "Spouse", gotram: "Bharadwaja", nakshatra: "Rohini", rasi: "Vrishabha" },
      { name: "Chi. K. Shiva Karthik", relation: "Son", gotram: "Bharadwaja", nakshatra: "Hastha", rasi: "Kanya" }
    ],
    deliveryOption: "postal_courier",
    paymentMethod: "upi",
    totalDakshina: 10116,
    convenienceFee: 0,
    grandTotal: 10116
  }
];

export const bookingService = {
  // --- Active Booking Draft Management (Session / Local persistence) ---
  getActiveDraft(): BookingDraft {
    if (typeof window === 'undefined') return defaultDraft;
    try {
      const stored = sessionStorage.getItem(ACTIVE_DRAFT_KEY) || localStorage.getItem(ACTIVE_DRAFT_KEY);
      if (stored) {
        return { ...defaultDraft, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read active booking draft', e);
    }
    return defaultDraft;
  },

  saveActiveDraft(updates: Partial<BookingDraft>): BookingDraft {
    if (typeof window === 'undefined') return { ...defaultDraft, ...updates };
    try {
      const current = this.getActiveDraft();
      const updated = { ...current, ...updates };
      sessionStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(updated));
      localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not save active booking draft', e);
      return { ...defaultDraft, ...updates };
    }
  },

  clearActiveDraft(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(ACTIVE_DRAFT_KEY);
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
    } catch (e) {
      console.warn('Could not clear active booking draft', e);
    }
  },

  setDraftFromNakshatra(nakshatraName: string, selectedSevaSlugOrId?: string): BookingDraft {
    const info = getNakshatraBookingOptions(nakshatraName);
    let chosenSeva = info.availableSevas[0];
    if (selectedSevaSlugOrId) {
      const found = info.availableSevas.find(
        (s) => s.id === selectedSevaSlugOrId || s.slug === selectedSevaSlugOrId
      );
      if (found) chosenSeva = found;
    }

    return this.saveActiveDraft({
      janmaNakshatra: info.nakshatra,
      nakshatra: info.nakshatra,
      rasi: info.rasi,
      dayNumber: info.dayNumber,
      selectedDate: info.date,
      dayType: info.dayType,
      specialProgramme: info.specialSeva || undefined,
      sevaId: chosenSeva.id,
      sevaSlug: chosenSeva.slug,
      sevaName: chosenSeva.title,
      amount: chosenSeva.price,
    });
  },

  resolveSeva(slugOrId?: string | null) {
    if (!slugOrId) return sevasList[0];
    const canonical = slugOrId.toLowerCase().trim();
    const found = sevasList.find(
      (s) =>
        s.slug.toLowerCase() === canonical ||
        s.id.toLowerCase() === canonical ||
        s.title.toLowerCase() === canonical
    );
    return found || sevasList[0];
  },

  resolveScheduleDay(dateString?: string | null) {
    if (!dateString) return scheduleList[0];
    const cleanDate = dateString.toLowerCase().trim();
    return (
      scheduleList.find(
        (d) =>
          d.date.toLowerCase().includes(cleanDate) ||
          cleanDate.includes(d.date.toLowerCase())
      ) || scheduleList[0]
    );
  },

  // --- Confirmed Bookings Management ---
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
    return bookings.find((b) => b.bookingId === bookingId) || mockInitialBookings.find((b) => b.bookingId === bookingId);
  },

  async createBooking(booking: BookingState | BookingDraft): Promise<ConfirmedBooking> {
    const isDraft = 'devoteeName' in booking;
    const participation = isDraft
      ? booking.devoteeParticipation
      : (booking.devoteeParticipation || booking.primaryDevotee.devoteeParticipation);

    const payload = isDraft
      ? {
          seva_id: booking.sevaId,
          selected_date: booking.selectedDate,
          nakshatra: booking.janmaNakshatra || booking.nakshatra || 'Rohini',
          rasi: booking.rasi || 'Vrishabha',
          full_name: booking.devoteeName,
          phone_number: booking.mobile,
          email: booking.email || '',
          gotram: booking.gotram || '',
          janma_nakshatra: booking.janmaNakshatra || '',
          date_of_birth: booking.dateOfBirth || '',
          sankalpam_names: booking.familyMembers || booking.devoteeName,
          address: booking.address || '',
          attending_personally: participation === 'attending' ? 'yes' : participation === 'not-attending' ? 'no' : undefined,
          devotee_participation: participation,
          payment_method: 'upi'
        }
      : {
          seva_id: booking.sevaId,
          selected_date: booking.date,
          nakshatra: booking.nakshatra || 'Rohini',
          rasi: booking.rasi || 'Vrishabha',
          full_name: booking.primaryDevotee.fullName,
          phone_number: booking.primaryDevotee.phone,
          email: booking.primaryDevotee.email || '',
          gotram: booking.primaryDevotee.gotram || '',
          janma_nakshatra: booking.primaryDevotee.nakshatra || '',
          sankalpam_names: booking.primaryDevotee.sankalpamNames || booking.primaryDevotee.fullName,
          address: booking.primaryDevotee.address || '',
          attending_personally: participation === 'attending' ? 'yes' : participation === 'not-attending' ? 'no' : undefined,
          devotee_participation: participation,
          payment_method: booking.paymentMethod || 'upi'
        };

    let serverBooking: any = null;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.data) {
        serverBooking = json.data;
        // Verify and confirm payment on server
        await fetch('/api/bookings/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: serverBooking.booking_id,
            transaction_id: `UPI/TXN${Date.now().toString().slice(-10)}`
          })
        });
      }
    } catch (e) {
      console.warn('Could not post to /api/bookings, using local fallback:', e);
    }

    const bookingId = serverBooking?.booking_id || `SAR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmed: ConfirmedBooking = isDraft
      ? {
          bookingId,
          bookingDate: new Date().toISOString().split('T')[0],
          status: 'confirmed',
          paymentStatus: 'CONFIRMED',
          transactionRef: `UPI/TXN${Date.now().toString().slice(-10)}`,
          receiptUrl: `/book-seva/receipt/${bookingId}`,
          sevaId: booking.sevaId,
          sevaSlug: booking.sevaSlug,
          sevaName: booking.sevaName,
          amount: booking.amount,
          selectedDate: booking.selectedDate,
          date: booking.selectedDate,
          dayNumber: booking.dayNumber || 1,
          nakshatra: booking.janmaNakshatra || booking.nakshatra || 'Rohini',
          rasi: booking.rasi || 'Vrishabha',
          timeSlot: '08:30 AM – 12:00 PM',
          devoteeParticipation: participation,
          primaryDevotee: {
            fullName: booking.devoteeName,
            gotram: booking.gotram,
            nakshatra: booking.janmaNakshatra,
            sankalpamNames: booking.familyMembers || booking.devoteeName,
            phone: booking.mobile,
            email: booking.email || '',
            city: 'Hyderabad',
            country: 'India',
            attendingPersonally: participation === 'attending' ? 'yes' : 'no',
            devoteeParticipation: participation,
            rasi: booking.rasi || '',
            address: booking.address || '',
            dateOfBirth: booking.dateOfBirth || '',
          },
          familyMembers: booking.familyMembers
            ? booking.familyMembers.split(',').map((name) => ({ name: name.trim() }))
            : [],
          deliveryOption: 'postal_courier',
          paymentMethod: 'upi',
          totalDakshina: booking.amount,
          convenienceFee: 0,
          grandTotal: booking.amount,
        }
      : {
          ...booking,
          devoteeParticipation: participation,
          bookingId,
          bookingDate: new Date().toISOString().split('T')[0],
          status: 'confirmed',
          paymentStatus: 'CONFIRMED',
          transactionRef: `UPI/TXN${Date.now().toString().slice(-10)}`,
          receiptUrl: `/book-seva/receipt/${bookingId}`,
        };

    if (typeof window !== 'undefined') {
      const current = await this.getDevoteeBookings();
      const updated = [confirmed, ...current];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    }

    return confirmed;
  },
};
