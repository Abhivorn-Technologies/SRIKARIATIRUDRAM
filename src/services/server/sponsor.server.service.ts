import { connectToDatabase } from '@/lib/mongodb';

export interface SponsorRecord {
  id: string;
  name: string;
  title?: string;
  category: 'MAHAYAJNA' | 'ANNADANA' | 'VEDA_SEVA' | 'DAILY_SEVA';
  amount?: number;
  contact_person?: string;
  phone?: string;
  image_url?: string;
  display_consent: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const sponsorServerService = {
  async getSponsors(onlyActive = false): Promise<SponsorRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (onlyActive) {
      filter.active = true;
      filter.display_consent = true;
    }

    const docs = await db.collection('sponsors')
      .find(filter)
      .sort({ sort_order: 1, amount: -1, created_at: -1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async createSponsor(data: Partial<SponsorRecord>): Promise<SponsorRecord> {
    const { db } = await connectToDatabase();
    const sponsorId = 'sponsor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newSponsor: SponsorRecord = {
      id: sponsorId,
      name: data.name || 'Honourable Sponsor',
      title: data.title || 'Maha Poshaka (Grand Sponsor)',
      category: data.category || 'MAHAYAJNA',
      amount: data.amount || undefined,
      contact_person: data.contact_person || undefined,
      phone: data.phone || undefined,
      image_url: data.image_url || undefined,
      display_consent: data.display_consent !== false,
      sort_order: data.sort_order || 0,
      active: data.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('sponsors').insertOne(newSponsor as any);
    return newSponsor;
  },

  async updateSponsor(id: string, updates: Partial<SponsorRecord>): Promise<SponsorRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('sponsors').findOneAndUpdate(
      { $or: [{ id }, { _id: id as any }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async deleteSponsor(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('sponsors').deleteOne({
      $or: [{ id }, { _id: id as any }]
    });
    return res.deletedCount > 0;
  }
};

