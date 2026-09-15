import { connectToDatabase } from '@/lib/mongodb';

export interface EnquiryRecord {
  id?: string;
  enquiry_id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'RESPONDED' | 'RESOLVED';
  created_at?: string | Date;
  updated_at?: string | Date;
}

export const enquiryServerService = {
  async getAllEnquiries(search?: string): Promise<EnquiryRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (search) {
      const q = new RegExp(search, 'i');
      filter.$or = [{ name: q }, { phone: q }, { email: q }, { subject: q }, { enquiry_id: q }];
    }

    const docs = await db.collection('enquiries').find(filter).sort({ created_at: -1 }).toArray();
    return docs as any;
  },

  async createEnquiry(data: Partial<EnquiryRecord>): Promise<EnquiryRecord> {
    const { db } = await connectToDatabase();
    const rand = Math.floor(100 + Math.random() * 900);
    const enquiryId = `ENQ-${Date.now().toString().slice(-4)}${rand}`;

    const newRecord: EnquiryRecord = {
      enquiry_id: enquiryId,
      name: data.name || 'Anonymous Devotee',
      phone: data.phone || '',
      email: data.email || undefined,
      subject: data.subject || 'General Enquiry from Contact Form',
      message: data.message || '',
      status: (data.status as any) || 'NEW',
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('enquiries').insertOne(newRecord as any);
    return newRecord;
  },

  async updateEnquiryStatus(id: string, status: string): Promise<EnquiryRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('enquiries').findOneAndUpdate(
      { $or: [{ enquiry_id: id }, { id }, { _id: id as any }] },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('enquiries').deleteOne({
      $or: [{ enquiry_id: id }, { id }, { _id: id as any }]
    });
    return res.deletedCount > 0;
  }
};
