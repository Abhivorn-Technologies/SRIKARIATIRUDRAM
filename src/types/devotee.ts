export interface DevoteeProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  gotram: string;
  nakshatra: string;
  rasi: string;
  address: string;
  city: string;
  pincode: string;
  familyMembers: Array<{
    id: string;
    name: string;
    relation: string;
    nakshatra: string;
    rasi: string;
  }>;
}

export interface DevoteeStats {
  totalBookings: number;
  upcomingSevas: number;
  donationsCount: number;
  annadanamDays: number;
  totalContributed: number;
}
