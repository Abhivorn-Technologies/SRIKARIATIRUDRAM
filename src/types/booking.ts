export interface FamilyMember {
  name: string;
  relation?: string;
  gotram?: string;
  nakshatra?: string;
  rasi?: string;
}

export interface PrimaryDevotee {
  fullName: string;
  gotram: string;
  nakshatra: string;
  sankalpamNames: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  attendingPersonally: 'yes' | 'no';
  devoteeParticipation?: 'attending' | 'not-attending';
  rasi?: string;
  address?: string;
  pincode?: string;
  dateOfBirth?: string;
}

export interface BookingState {
  sevaId: string;
  sevaSlug: string;
  sevaName?: string;
  amount?: number;
  selectedDate?: string;
  date: string;
  dayNumber?: number;
  nakshatra?: string;
  mahayajnamNakshatra?: string;
  rasi?: string;
  timeSlot?: string;
  primaryDevotee: PrimaryDevotee;
  familyMembers: FamilyMember[];
  specialPrayers?: string;
  deliveryOption?: 'temple_pickup' | 'postal_courier';
  paymentMethod?: 'upi' | 'card' | 'debit_card' | 'netbanking' | 'qr' | 'international';
  totalDakshina: number;
  convenienceFee: number;
  grandTotal: number;
  devoteeParticipation?: 'attending' | 'not-attending';
}

export interface ConfirmedBooking extends BookingState {
  bookingId: string;
  bookingDate: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  receiptUrl?: string;
  transactionRef: string;
  paymentStatus?: 'CONFIRMED' | 'PENDING' | 'FAILED';
  devoteeParticipation?: 'attending' | 'not-attending';
}

export interface BookingDraft {
  sevaId: string;
  sevaName: string;
  sevaSlug: string;
  amount: number;
  selectedDate: string;
  dayNumber?: number;
  nakshatra?: string;
  rasi?: string;
  dayType?: string;
  specialProgramme?: string;
  devoteeName: string;
  gotram: string;
  janmaNakshatra: string;
  dateOfBirth?: string;
  familyMembers?: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  devoteeParticipation?: 'attending' | 'not-attending';
  bookingId?: string;
  paymentStatus?: 'CONFIRMED' | 'PENDING' | 'FAILED';
}
