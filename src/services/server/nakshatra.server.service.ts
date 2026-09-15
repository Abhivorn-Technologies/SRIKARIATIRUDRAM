import { connectToDatabase } from '@/lib/mongodb';
import { sevaServerService } from './seva.server.service';

export interface NakshatraItem {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  deity?: string;
  rasi?: string;
  lord?: string;
  programme_date?: string;
  day_number?: number;
  day_type: string;
  special_seva_id?: string;
  special_seva_name?: string;
  active: boolean;
}

export interface NakshatraProgrammeResult {
  nakshatra: string;
  nameTe?: string;
  nameHi?: string;
  rasi?: string;
  deity?: string;
  lord?: string;
  dayNumber: number;
  programmeDate: string;
  dateDisplay: string;
  dayType: string;
  specialSeva: {
    id?: string;
    name?: string;
  } | null;
  availableSevas: {
    id: string;
    slug: string;
    title: string;
    titleTe?: string;
    titleHi?: string;
    amount: number;
    description: string;
    category: string;
    isSpecial?: boolean;
    tag?: string;
    capacity: number;
    bookedCount: number;
    availableSlots: number;
    availabilityStatus: 'AVAILABLE' | 'FEW_SLOTS_LEFT' | 'FULLY_BOOKED';
  }[];
}

export const nakshatraServerService = {
  async getAllNakshatras(): Promise<NakshatraItem[]> {
    const { db } = await connectToDatabase();
    const docs = await db.collection('nakshatras')
      .find({})
      .sort({ day_number: 1, name: 1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async getNakshatraByName(name: string): Promise<NakshatraItem | null> {
    const { db } = await connectToDatabase();
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const docs = await db.collection('nakshatras').find({}).toArray();

    const matched = docs.find((d: any) => {
      const dClean = (d.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return dClean === cleanName;
    });

    if (!matched) return null;
    return {
      ...matched,
      id: matched.id || matched._id.toString()
    } as any;
  },

  async createNakshatra(data: Partial<NakshatraItem>): Promise<NakshatraItem> {
    const { db } = await connectToDatabase();
    const nakId = 'nak_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newNak: NakshatraItem = {
      id: nakId,
      name: data.name || '',
      name_te: data.name_te || undefined,
      name_hi: data.name_hi || undefined,
      deity: data.deity || undefined,
      rasi: data.rasi || undefined,
      lord: data.lord || undefined,
      programme_date: data.programme_date || undefined,
      day_number: data.day_number || 1,
      day_type: data.day_type || 'REGULAR',
      special_seva_id: data.special_seva_id || undefined,
      special_seva_name: data.special_seva_name || undefined,
      active: data.active !== false
    };

    await db.collection('nakshatras').insertOne(newNak as any);
    return newNak;
  },

  async updateNakshatra(id: string, updates: Partial<NakshatraItem>): Promise<NakshatraItem | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('nakshatras').findOneAndUpdate(
      { $or: [{ id }, { name: id }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!res || !res.value) return null;
    return {
      ...res.value,
      id: res.value.id || res.value._id.toString()
    } as any;
  },

  async deleteNakshatra(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('nakshatras').deleteOne({
      $or: [{ id }, { name: id }]
    });
    return res.deletedCount > 0;
  },

  async getNakshatraProgramme(nakshatraName: string): Promise<NakshatraProgrammeResult | null> {
    const nakshatra = await this.getNakshatraByName(nakshatraName);
    if (!nakshatra) return null;

    const { db } = await connectToDatabase();
    const schedule = await db.collection('schedules').findOne({
      $or: [{ day_number: nakshatra.day_number || 1 }, { date: nakshatra.programme_date }]
    }) || {
      day_number: nakshatra.day_number || 1,
      date: nakshatra.programme_date || '2026-11-25',
      date_display: '25 November 2026',
      day_type: nakshatra.day_type || 'REGULAR'
    };

    const targetDate = schedule.date ? new Date(schedule.date).toISOString().split('T')[0] : '2026-11-25';
    const allSevas = await sevaServerService.getAllSevas();
    const applicableList: NakshatraProgrammeResult['availableSevas'] = [];

    for (const s of allSevas) {
      if (s.active !== false) {
        applicableList.push({
          id: s.id,
          slug: s.slug || s.id,
          title: s.title,
          titleTe: s.title_te,
          titleHi: s.title_hi,
          amount: Number(s.amount || 0),
          description: s.short_desc || 'Sacred offering dedicated to your Janma Nakshatra day.',
          category: s.category || 'General',
          capacity: s.capacity || 100,
          bookedCount: 0,
          availableSlots: s.capacity || 100,
          availabilityStatus: 'AVAILABLE'
        });
      }
    }

    return {
      nakshatra: nakshatra.name,
      nameTe: nakshatra.name_te,
      nameHi: nakshatra.name_hi,
      rasi: nakshatra.rasi,
      deity: nakshatra.deity,
      lord: nakshatra.lord,
      dayNumber: schedule.day_number,
      programmeDate: targetDate,
      dateDisplay: schedule.date_display || '25 November 2026',
      dayType: schedule.day_type || nakshatra.day_type || 'REGULAR',
      specialSeva: nakshatra.special_seva_id ? {
        id: nakshatra.special_seva_id,
        name: nakshatra.special_seva_name
      } : null,
      availableSevas: applicableList
    };
  }
};
