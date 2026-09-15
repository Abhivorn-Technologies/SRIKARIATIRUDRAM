import { connectToDatabase } from '@/lib/mongodb';

export interface DonationRecord {
  id?: string;
  donation_id: string;
  donor_name: string;
  mobile: string;
  email?: string;
  amount: number;
  purpose: string;
  gotram?: string;
  nakshatram?: string;
  address?: string;
  payment_status: string;
  transaction_id?: string;
  notes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export const donationServerService = {
  async getDonations(purpose?: string, search?: string): Promise<DonationRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (purpose) filter.purpose = purpose;
    if (search) {
      const q = new RegExp(search, 'i');
      filter.$or = [{ donor_name: q }, { mobile: q }, { donation_id: q }, { gotram: q }];
    }

    const docs = await db.collection('donations').find(filter).sort({ created_at: -1 }).toArray();
    return docs as any;
  },

  async createDonation(data: Partial<DonationRecord>): Promise<DonationRecord> {
    const { db } = await connectToDatabase();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const donationId = data.donation_id || `SAR-DON-${rand}`;

    const newDonation: DonationRecord = {
      donation_id: donationId,
      donor_name: data.donor_name || 'Anonymous Donor',
      mobile: data.mobile || '',
      email: data.email || undefined,
      amount: Number(data.amount || 216),
      purpose: data.purpose || 'ATI_RUDRAM',
      gotram: data.gotram || undefined,
      nakshatram: data.nakshatram || undefined,
      address: data.address || undefined,
      payment_status: data.payment_status || 'SUCCESS',
      transaction_id: data.transaction_id || `UPI/TXN${Date.now().toString().slice(-8)}`,
      notes: data.notes || undefined,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('donations').insertOne(newDonation as any);
    return newDonation;
  },

  async updateDonation(id: string, updates: Partial<DonationRecord>): Promise<DonationRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('donations').findOneAndUpdate(
      { $or: [{ donation_id: id }, { id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res?.value as any;
  },

  async getDonationById(id: string): Promise<DonationRecord | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('donations').findOne({
      $or: [{ donation_id: id }, { id }]
    });
    return doc as any;
  },

  async deleteDonation(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('donations').deleteOne({
      $or: [{ donation_id: id }, { id }]
    });
    return res.deletedCount > 0;
  }
};
