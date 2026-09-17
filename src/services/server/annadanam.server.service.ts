import { connectToDatabase } from '@/lib/mongodb';
import { scheduleServerService } from './schedule.server.service';
import { annadanamCalendarDays, AnnadanamDay } from '@/data/annadanam';

export interface AnnadanamRecord {
  id?: string;
  date: string;
  day_number?: number;
  sponsor_name: string;
  mobile: string;
  email?: string;
  amount: number;
  occasion?: string;
  display_name?: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  is_anonymous: boolean;
  transaction_id?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export const annadanamServerService = {
  async getAllAnnadanam(date?: string): Promise<AnnadanamRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (date) filter.date = date;

    const docs = await db.collection('annadanam').find(filter).sort({ date: 1, created_at: -1 }).toArray();
    return docs as any;
  },

  async getOneDayStats(): Promise<{ totalCapacity: number; bookedCount: number; availableSlots: number }> {
    const sponsors = await this.getAllAnnadanam();
    const bookedCount = sponsors.filter(sp => sp.status !== 'CANCELLED' && Number(sp.amount) >= 25116).length;
    const totalCapacity = 11;
    const availableSlots = Math.max(0, totalCapacity - bookedCount);
    return { totalCapacity, bookedCount, availableSlots };
  },

  async getCalendarDays(): Promise<AnnadanamDay[]> {
    const sponsors = await this.getAllAnnadanam();

    const sponsorMap = new Map<number, AnnadanamRecord>();
    for (const sp of sponsors) {
      if (sp.status === 'CANCELLED') continue;
      if (sp.day_number && sp.day_number >= 1 && sp.day_number <= 28) {
        if (!sponsorMap.has(sp.day_number) || Number(sp.amount) >= 25116) {
          sponsorMap.set(sp.day_number, sp);
        }
      } else if (sp.date) {
        const dStr = new Date(sp.date).toISOString().split('T')[0];
        const start = new Date('2026-11-25').getTime();
        const cur = new Date(dStr).getTime();
        const dayNo = Math.round((cur - start) / (86400 * 1000)) + 1;
        if (dayNo >= 1 && dayNo <= 28) {
          if (!sponsorMap.has(dayNo) || Number(sp.amount) >= 25116) {
            sponsorMap.set(dayNo, sp);
          }
        }
      }
    }

    return annadanamCalendarDays.map((d) => {
      const sp = sponsorMap.get(d.day);
      if (sp) {
        return {
          ...d,
          status: 'SPONSORED' as const,
          sponsorName: sp.is_anonymous ? 'Private Devotee' : (sp.display_name || sp.sponsor_name),
          occasion: sp.occasion || undefined
        };
      }
      return {
        ...d,
        status: 'AVAILABLE' as const,
        sponsorName: undefined,
        occasion: undefined
      };
    });
  },

  async getAnnadanamById(id: string): Promise<AnnadanamRecord | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('annadanam').findOne({
      $or: [{ id }, { transaction_id: id }]
    });
    return doc as any;
  },

  async createAnnadanam(data: Partial<AnnadanamRecord>): Promise<AnnadanamRecord> {
    const { db } = await connectToDatabase();
    const cleanDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '2026-11-25';
    let dayNumber = data.day_number;
    if (!dayNumber) {
      const schedule = await scheduleServerService.getScheduleByDate(cleanDate);
      dayNumber = schedule?.day_number || 1;
    }

    const newRecord: AnnadanamRecord = {
      id: data.id || `ann-${Date.now()}`,
      date: cleanDate,
      day_number: dayNumber,
      sponsor_name: data.sponsor_name || 'Anonymous Devotee',
      mobile: data.mobile || '',
      email: data.email || undefined,
      amount: Number(data.amount || 5116),
      occasion: data.occasion || undefined,
      display_name: data.display_name || data.sponsor_name || undefined,
      payment_status: data.payment_status || 'SUCCESS',
      status: data.status || 'CONFIRMED',
      is_anonymous: data.is_anonymous || false,
      transaction_id: data.transaction_id || `ANN-TXN-${Date.now().toString().slice(-8)}`,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('annadanam').insertOne(newRecord as any);
    return newRecord;
  },

  async updateAnnadanam(id: string, updates: Partial<AnnadanamRecord>): Promise<AnnadanamRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('annadanam').findOneAndUpdate(
      { $or: [{ id }, { transaction_id: id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res?.value as any;
  },

  async deleteAnnadanam(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('annadanam').deleteOne({
      $or: [{ id }, { transaction_id: id }]
    });
    return res.deletedCount > 0;
  }
};
