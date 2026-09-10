import { DonationRecord } from '@/types/donation';
import { AnnadanamSponsorship } from '@/types/annadanam';
import { DevoteeProfile, DevoteeStats } from '@/types/devotee';

export const donationService = {
  async getDevoteeDonations(): Promise<DonationRecord[]> {
    return [
      {
        id: "DON-2026-1029",
        donorName: "K. Satyanarayana Sharma",
        phone: "9876543210",
        email: "satya.sharma@example.com",
        amount: 5116,
        purpose: "yajna_samagri",
        purposeLabel: "Yajna Dravyas & Sacred Ghee",
        purposeLabelTe: "యాగ ద్రవ్యాలు & పవిత్ర నెయ్యి",
        date: "2026-08-20",
        receiptNumber: "SRK/2026/0492",
        status: "completed"
      }
    ];
  }
};

export const annadanamService = {
  async getDevoteeSponsorships(): Promise<AnnadanamSponsorship[]> {
    return [
      {
        id: "ANN-2026-3021",
        sponsorName: "K. Satyanarayana Sharma & Family",
        inMemoryOf: "Late Sri K. Venkatappaiah",
        phone: "9876543210",
        email: "satya.sharma@example.com",
        gotram: "Bharadwaja",
        nakshatra: "Arudra",
        date: "2026-10-18",
        tier: "morning",
        amount: 25000,
        mealsServed: 5000,
        status: "confirmed"
      }
    ];
  }
};

export const devoteeService = {
  async getProfile(): Promise<DevoteeProfile> {
    return {
      id: "DEV-84920",
      fullName: "K. Satyanarayana Sharma",
      phone: "9876543210",
      email: "satya.sharma@example.com",
      gotram: "Bharadwaja",
      nakshatra: "Arudra",
      rasi: "Mithuna",
      address: "Flat 402, Sri Nilayam, Road No 10, Banjara Hills",
      city: "Hyderabad",
      pincode: "500034",
      familyMembers: [
        { id: "1", name: "Smt. K. Annapurna", relation: "Spouse", nakshatra: "Rohini", rasi: "Vrishabha" },
        { id: "2", name: "Chi. K. Shiva Karthik", relation: "Son", nakshatra: "Hastha", rasi: "Kanya" }
      ]
    };
  },

  async getStats(): Promise<DevoteeStats> {
    return {
      totalBookings: 2,
      upcomingSevas: 1,
      donationsCount: 1,
      annadanamDays: 1,
      totalContributed: 31232
    };
  }
};
