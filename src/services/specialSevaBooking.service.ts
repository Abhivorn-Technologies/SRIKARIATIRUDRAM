import { sevasList } from '@/data/sevas';
import { PROGRAMME_28_DAYS } from '@/data/nakshatras';
import { ConfirmedBooking } from '@/types/booking';

export interface SpecialSevaBookingDraft {
  sevaId: string;
  sevaName: string;
  sevaSlug: string;
  amount: number;
  selectedDay?: number;
  selectedDate?: string;
  mahayajnamNakshatra?: string;
  nakshatra?: string;
  rasi?: string;
  devoteeName: string;
  gotram: string;
  janmaNakshatra: string;
  mobile: string;
  email?: string;
  familyMembers?: string;
  address?: string;
  devoteeParticipation?: 'attending' | 'not-attending';
  bookingId?: string;
  paymentStatus?: 'CONFIRMED' | 'PENDING' | 'FAILED';
  transactionId?: string;
}

const SPECIAL_SEVA_DRAFT_KEY = 'srikari_active_special_seva_draft';
const BOOKINGS_STORAGE_KEY = 'srikari_devotee_bookings';

const defaultSpecialDraft: SpecialSevaBookingDraft = {
  sevaId: 'ati-rudram-donation',
  sevaSlug: 'ati-rudram-donation',
  sevaName: 'ATI RUDRAM DONATION',
  amount: 216,
  selectedDay: 1,
  selectedDate: '25 November 2026',
  mahayajnamNakshatra: 'Rohini',
  nakshatra: 'Rohini',
  rasi: 'Mesha (Aries)',
  devoteeName: '',
  gotram: 'Bharadwaja',
  janmaNakshatra: 'Rohini',
  mobile: '',
  email: '',
  familyMembers: '',
  address: '',
  paymentStatus: 'PENDING',
};

export interface SevaLockConfig {
  allowedDays: number[];
  defaultDay: number;
  lockedNakshatra?: string;
  isMultiDay?: boolean;
}

export function getSevaLockInfo(sevaIdOrSlug?: string | null): SevaLockConfig | null {
  if (!sevaIdOrSlug) return null;
  const key = sevaIdOrSlug.toLowerCase();

  if (key === 'chandi-homam' || key.includes('chandi')) {
    return {
      allowedDays: [3, 12, 21],
      defaultDay: 3,
      isMultiDay: true,
    };
  }
  if (key === 'sarpa-sukta-homam' || key.includes('sarpa')) {
    return {
      allowedDays: [2, 11, 20],
      defaultDay: 2,
      isMultiDay: true,
    };
  }
  if (key === 'aslesha-bali' || key.includes('aslesha') || key.includes('ashlesha')) {
    return {
      allowedDays: [6],
      defaultDay: 6,
      lockedNakshatra: 'Ashlesha',
    };
  }
  if (key === 'valli-devasena-subramanyeswara-kalyanam' || key.includes('subraman')) {
    return {
      allowedDays: [25],
      defaultDay: 25,
      lockedNakshatra: 'Krittika',
    };
  }
  if (key === 'parvathi-parameswara-kalyanam' || key.includes('parvathi') || key.includes('parameswara')) {
    return {
      allowedDays: [28],
      defaultDay: 28,
      lockedNakshatra: 'Rohini',
    };
  }
  return null;
}

export const specialSevaBookingService = {
  getActiveDraft(): SpecialSevaBookingDraft {
    if (typeof window === 'undefined') return defaultSpecialDraft;
    try {
      const stored = sessionStorage.getItem(SPECIAL_SEVA_DRAFT_KEY) || localStorage.getItem(SPECIAL_SEVA_DRAFT_KEY);
      if (stored) {
        return { ...defaultSpecialDraft, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read active special seva draft', e);
    }
    return defaultSpecialDraft;
  },

  saveActiveDraft(updates: Partial<SpecialSevaBookingDraft>): SpecialSevaBookingDraft {
    if (typeof window === 'undefined') return { ...defaultSpecialDraft, ...updates };
    try {
      const current = this.getActiveDraft();
      const updated = { ...current, ...updates };
      sessionStorage.setItem(SPECIAL_SEVA_DRAFT_KEY, JSON.stringify(updated));
      localStorage.setItem(SPECIAL_SEVA_DRAFT_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not save active special seva draft', e);
      return { ...defaultSpecialDraft, ...updates };
    }
  },

  clearActiveDraft(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(SPECIAL_SEVA_DRAFT_KEY);
      localStorage.removeItem(SPECIAL_SEVA_DRAFT_KEY);
    } catch (e) {
      console.warn('Could not clear active special seva draft', e);
    }
  },

  initDraftWithSeva(sevaSlugOrId?: string | null, dayNumber: number = 1): SpecialSevaBookingDraft {
    const seva = sevaSlugOrId
      ? sevasList.find((s) => s.slug === sevaSlugOrId || s.id === sevaSlugOrId) || sevasList[0]
      : sevasList[0];

    const lock = getSevaLockInfo(seva.id || seva.slug);
    let safeDayNum = dayNumber >= 1 && dayNumber <= 28 ? dayNumber : 1;
    if (lock && !lock.allowedDays.includes(safeDayNum)) {
      safeDayNum = lock.defaultDay;
    }
    const dayInfo = PROGRAMME_28_DAYS.find((d) => d.dayNumber === safeDayNum) || PROGRAMME_28_DAYS[0];
    const existing = this.getActiveDraft();

    return this.saveActiveDraft({
      sevaId: seva.id,
      sevaSlug: seva.slug,
      sevaName: seva.title,
      amount: seva.price,
      selectedDay: dayInfo.dayNumber,
      selectedDate: dayInfo.date,
      mahayajnamNakshatra: dayInfo.nameEn,
      nakshatra: dayInfo.nameEn,
      janmaNakshatra: lock?.lockedNakshatra || existing.janmaNakshatra || 'Rohini',
      rasi: existing.rasi || 'Mesha (Aries)',
    });
  },

  setDay(dayNumber: number): SpecialSevaBookingDraft {
    const current = this.getActiveDraft();
    const lock = getSevaLockInfo(current.sevaId || current.sevaSlug);
    let safeDayNum = dayNumber >= 1 && dayNumber <= 28 ? dayNumber : 1;
    if (lock && !lock.allowedDays.includes(safeDayNum)) {
      safeDayNum = lock.defaultDay;
    }
    const dayInfo = PROGRAMME_28_DAYS.find((d) => d.dayNumber === safeDayNum) || PROGRAMME_28_DAYS[0];

    return this.saveActiveDraft({
      selectedDay: dayInfo.dayNumber,
      selectedDate: dayInfo.date,
      mahayajnamNakshatra: dayInfo.nameEn,
      nakshatra: dayInfo.nameEn,
      janmaNakshatra: lock?.lockedNakshatra || current.janmaNakshatra,
    });
  },

  async createBooking(draft: SpecialSevaBookingDraft): Promise<ConfirmedBooking> {
    const payload = {
      seva_id: draft.sevaId,
      selected_date: draft.selectedDate || '25 November 2026',
      nakshatra: draft.janmaNakshatra || draft.mahayajnamNakshatra || 'Rohini',
      mahayajnam_nakshatra: draft.mahayajnamNakshatra || 'Rohini',
      rasi: draft.rasi || 'Mesha (Aries)',
      full_name: draft.devoteeName,
      phone_number: draft.mobile,
      email: draft.email || '',
      gotram: draft.gotram || '',
      janma_nakshatra: draft.janmaNakshatra || 'Rohini',
      sankalpam_names: draft.familyMembers || draft.devoteeName,
      address: draft.address || '',
      attending_personally: draft.devoteeParticipation === 'attending' ? 'yes' : 'no',
      devotee_participation: draft.devoteeParticipation,
      payment_method: 'upi'
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
        // Verify payment on server
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
      console.warn('Could not post special seva booking to /api/bookings:', e);
    }

    const bookingId = serverBooking?.booking_id || `SAR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmed: ConfirmedBooking = {
      bookingId,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      paymentStatus: 'CONFIRMED',
      transactionRef: `UPI/TXN${Date.now().toString().slice(-10)}`,
      receiptUrl: `/special-seva-booking/success?id=${bookingId}`,
      sevaId: draft.sevaId,
      sevaSlug: draft.sevaSlug,
      sevaName: draft.sevaName,
      amount: draft.amount,
      selectedDate: draft.selectedDate || '25 November 2026',
      date: draft.selectedDate || '25 November 2026',
      dayNumber: draft.selectedDay || 1,
      nakshatra: draft.janmaNakshatra || 'Rohini',
      mahayajnamNakshatra: draft.mahayajnamNakshatra || 'Rohini',
      rasi: draft.rasi || 'Mesha (Aries)',
      timeSlot: '08:30 AM – 12:00 PM',
      devoteeParticipation: draft.devoteeParticipation,
      primaryDevotee: {
        fullName: draft.devoteeName,
        gotram: draft.gotram,
        nakshatra: draft.janmaNakshatra || 'Rohini',
        sankalpamNames: draft.familyMembers || draft.devoteeName,
        phone: draft.mobile,
        email: draft.email || '',
        city: 'Hyderabad',
        country: 'India',
        attendingPersonally: draft.devoteeParticipation === 'attending' ? 'yes' : 'no',
        devoteeParticipation: draft.devoteeParticipation,
        rasi: draft.rasi || '',
        address: draft.address || '',
      },
      familyMembers: draft.familyMembers
        ? draft.familyMembers.split(',').map((name) => ({ name: name.trim() }))
        : [],
      deliveryOption: 'postal_courier',
      paymentMethod: 'upi',
      totalDakshina: draft.amount,
      convenienceFee: 0,
      grandTotal: draft.amount,
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        const current = stored ? JSON.parse(stored) : [];
        const updated = [confirmed, ...current];
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save booking to localStorage:', e);
      }
    }

    return confirmed;
  }
};
