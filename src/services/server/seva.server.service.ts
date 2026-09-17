import { connectToDatabase } from '@/lib/mongodb';

export interface SevaItem {
  id: string;
  slug: string;
  title: string;
  title_te?: string;
  title_hi?: string;
  amount: number;
  price?: number;
  short_desc?: string;
  short_desc_te?: string;
  short_desc_hi?: string;
  full_desc?: string;
  full_desc_te?: string;
  full_desc_hi?: string;
  category: string;
  icon?: string;
  duration?: string;
  time?: string;
  prasadam?: string[] | any;
  benefits?: string[] | any;
  capacity: number;
  active: boolean;
  featured: boolean;
  sort_order: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface SevaAvailabilityItem {
  id: string;
  date: string;
  seva_id: string;
  seva_title?: string;
  capacity: number;
  booked_count: number;
  status: 'AVAILABLE' | 'FEW_SLOTS_LEFT' | 'FULLY_BOOKED';
  available_slots?: number;
}

export const sevaServerService = {
  async getAllSevas(onlyActive = false): Promise<SevaItem[]> {
    const { db } = await connectToDatabase();
    const filter = onlyActive ? { active: true } : {};
    const docs = await db.collection('sevas')
      .find(filter)
      .sort({ sort_order: 1, amount: 1 })
      .toArray();

    return docs.map(d => {
      const amt = Number(d.amount ?? d.price ?? 0);
      return {
        ...d,
        id: d.id || d.slug || d._id.toString(),
        amount: amt,
        price: amt
      };
    }) as any;
  },

  async getSevaByIdOrSlug(idOrSlug: string): Promise<SevaItem | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('sevas').findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }]
    });
    if (!doc) return null;
    const amt = Number(doc.amount ?? doc.price ?? 0);
    return {
      ...doc,
      id: doc.id || doc.slug || doc._id.toString(),
      amount: amt,
      price: amt
    } as any;
  },

  async createSeva(data: Partial<SevaItem>): Promise<SevaItem> {
    const { db } = await connectToDatabase();
    const id = data.id || data.slug || `seva-${Date.now()}`;
    const slug = data.slug || id;
    const numAmount = Number(data.amount ?? data.price ?? 216);

    const newSeva: SevaItem = {
      id,
      slug,
      title: data.title || 'Untitled Seva',
      title_te: data.title_te,
      title_hi: data.title_hi,
      amount: numAmount,
      price: numAmount,
      short_desc: data.short_desc,
      short_desc_te: data.short_desc_te,
      short_desc_hi: data.short_desc_hi,
      full_desc: data.full_desc,
      full_desc_te: data.full_desc_te,
      full_desc_hi: data.full_desc_hi,
      category: data.category || 'homam',
      icon: data.icon || '🕉️',
      duration: data.duration,
      time: data.time,
      capacity: Number(data.capacity || 100),
      active: data.active !== false,
      featured: data.featured || false,
      sort_order: Number(data.sort_order || 0),
      benefits: data.benefits || [],
      prasadam: data.prasadam || [],
      updated_at: new Date(),
      created_at: new Date()
    };

    await db.collection('sevas').insertOne(newSeva as any);
    return newSeva;
  },

  async updateSeva(id: string, updates: Partial<SevaItem>): Promise<SevaItem | null> {
    const { db } = await connectToDatabase();
    const payload: Record<string, any> = { ...updates, updated_at: new Date() };

    if (updates.amount !== undefined || updates.price !== undefined) {
      const numAmt = Number(updates.amount ?? updates.price ?? 0);
      payload.amount = numAmt;
      payload.price = numAmt;
    }

    const res = await db.collection('sevas').findOneAndUpdate(
      { $or: [{ id }, { slug: id }] },
      { $set: payload },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    const amt = Number(doc.amount ?? doc.price ?? 0);
    return {
      ...doc,
      id: doc.id || doc._id.toString(),
      amount: amt,
      price: amt
    } as any;
  },

  async deleteSeva(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('sevas').deleteOne({
      $or: [{ id }, { slug: id }]
    });
    return res.deletedCount > 0;
  },

  async getSevaAvailability(date?: string, sevaId?: string): Promise<SevaAvailabilityItem[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (date) filter.date = date;
    if (sevaId) filter.seva_id = sevaId;

    const docs = await db.collection('seva_availability').find(filter).toArray();
    return docs as any;
  },

  async updateSevaAvailability(date: string, sevaId: string, capacity: number): Promise<SevaAvailabilityItem | null> {
    const { db } = await connectToDatabase();
    const existing = await db.collection('seva_availability').findOne({ date, seva_id: sevaId });
    const bookedCount = existing?.booked_count || 0;
    const availableSlots = Math.max(0, capacity - bookedCount);
    const status = availableSlots === 0 ? 'FULLY_BOOKED' : availableSlots <= 5 ? 'FEW_SLOTS_LEFT' : 'AVAILABLE';

    const item: SevaAvailabilityItem = {
      id: existing?.id || `sa-${Date.now()}`,
      date,
      seva_id: sevaId,
      capacity,
      booked_count: bookedCount,
      status,
      available_slots: availableSlots
    };

    await db.collection('seva_availability').updateOne(
      { date, seva_id: sevaId },
      { $set: item },
      { upsert: true }
    );

    return item;
  }
};
