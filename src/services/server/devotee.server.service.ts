import { connectToDatabase } from '@/lib/mongodb';

export interface DevoteeRecord {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  gotram?: string;
  nakshatram?: string;
  rasi?: string;
  dob?: string;
  family_members?: any[];
  address?: string;
  city?: string;
  country?: string;
  total_bookings: number;
  total_donated: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const devoteeServerService = {
  async getDevotees(search?: string): Promise<DevoteeRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};

    if (search) {
      const q = new RegExp(search, 'i');
      filter.$or = [
        { full_name: q },
        { phone_number: q },
        { email: q },
        { gotram: q },
        { city: q }
      ];
    }

    const docs = await db.collection('devotees')
      .find(filter)
      .sort({ total_bookings: -1, total_donated: -1, created_at: -1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async getDevoteeById(id: string): Promise<{ devotee: DevoteeRecord | null; bookings: any[]; donations: any[] }> {
    const { db } = await connectToDatabase();
    const devotee = await db.collection('devotees').findOne({
      $or: [{ id }, { phone_number: id }]
    });

    if (!devotee) return { devotee: null, bookings: [], donations: [] };

    const phone = devotee.phone_number;
    const bookings = await db.collection('bookings')
      .find({ phone_number: phone })
      .sort({ created_at: -1 })
      .toArray();

    const donations = await db.collection('donations')
      .find({ $or: [{ mobile: phone }, { phone_number: phone }] })
      .sort({ created_at: -1 })
      .toArray();

    return {
      devotee: {
        ...devotee,
        id: devotee.id || devotee._id.toString()
      } as any,
      bookings,
      donations
    };
  },

  async updateDevotee(id: string, updates: Partial<DevoteeRecord>): Promise<DevoteeRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('devotees').findOneAndUpdate(
      { $or: [{ id }, { phone_number: id }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!res || !res.value) return null;
    return {
      ...res.value,
      id: res.value.id || res.value._id.toString()
    } as any;
  }
};
