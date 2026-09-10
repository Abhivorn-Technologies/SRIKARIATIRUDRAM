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
  rasi?: string;
  address?: string;
  pincode?: string;
}

export interface BookingState {
  sevaId: string;
  sevaSlug: string;
  date: string;
  dayNumber?: number;
  nakshatra?: string;
  timeSlot?: string;
  primaryDevotee: PrimaryDevotee;
  familyMembers: FamilyMember[];
  specialPrayers?: string;
  deliveryOption?: 'temple_pickup' | 'postal_courier';
  paymentMethod?: 'upi' | 'card' | 'debit_card' | 'netbanking' | 'qr' | 'international';
  totalDakshina: number;
  convenienceFee: number;
  grandTotal: number;
}

export interface ConfirmedBooking extends BookingState {
  bookingId: string;
  bookingDate: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  receiptUrl?: string;
  transactionRef: string;
}
