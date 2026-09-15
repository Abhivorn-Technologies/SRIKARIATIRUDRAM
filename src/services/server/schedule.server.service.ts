import { connectToDatabase } from '@/lib/mongodb';

export interface ScheduleItem {
  id?: string;
  day_number: number;
  date: string;
  date_display: string;
  nakshatra: string;
  rasi?: string;
  day_type: string;
  special_seva_id?: string;
  status?: string;
  title?: string;
  title_te?: string;
  title_hi?: string;
  description?: string;
  tithi?: string;
  special_events?: any[];
  morning_programme?: string;
  madhyahnika?: string;
  special_programme?: string;
  evening_programme?: string;
  annadanam_menu?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export const scheduleServerService = {
  async getAllSchedules(): Promise<ScheduleItem[]> {
    const { db } = await connectToDatabase();
    const docs = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();
    return docs as any;
  },

  async getScheduleById(id: string): Promise<ScheduleItem | null> {
    const { db } = await connectToDatabase();
    const dayNum = Number(id);
    const filter = !isNaN(dayNum) ? { $or: [{ day_number: dayNum }, { date: id }, { id }] } : { $or: [{ date: id }, { id }] };
    const doc = await db.collection('schedules').findOne(filter);
    return doc as any;
  },

  async getScheduleByDate(dateStr: string): Promise<ScheduleItem | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('schedules').findOne({
      $or: [{ date: dateStr }, { date_display: new RegExp(dateStr, 'i') }]
    });
    return doc as any;
  },

  async createSchedule(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const { db } = await connectToDatabase();
    const newSchedule: ScheduleItem = {
      day_number: Number(data.day_number || 1),
      date: data.date || '2026-11-25',
      date_display: data.date_display || data.date || '25 Nov 2026',
      nakshatra: data.nakshatra || 'Sarva Nakshatras',
      rasi: data.rasi || '',
      day_type: data.day_type || 'REGULAR',
      special_seva_id: data.special_seva_id,
      status: data.status || 'SCHEDULED',
      title: data.title || `Day ${data.day_number} Mahotsavam`,
      morning_programme: data.morning_programme || '06:30 AM Suprabhatam & Rudra Abhishekam',
      madhyahnika: data.madhyahnika || '11:30 AM Madhyahnika Pooja',
      special_programme: data.special_programme || '08:30 AM Nakshatra Hawan',
      evening_programme: data.evening_programme || '06:00 PM Deeparadhana & Harathi',
      annadanam_menu: data.annadanam_menu || 'Sattvic Annaprasadam',
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('schedules').updateOne(
      { day_number: newSchedule.day_number },
      { $set: newSchedule },
      { upsert: true }
    );
    return newSchedule;
  },

  async updateSchedule(id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem | null> {
    const { db } = await connectToDatabase();
    const dayNum = Number(id);
    const filter = !isNaN(dayNum) ? { $or: [{ day_number: dayNum }, { date: id }, { id }] } : { $or: [{ date: id }, { id }] };

    const res = await db.collection('schedules').findOneAndUpdate(
      filter,
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res?.value as any;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const dayNum = Number(id);
    const filter = !isNaN(dayNum) ? { $or: [{ day_number: dayNum }, { date: id }, { id }] } : { $or: [{ date: id }, { id }] };
    const res = await db.collection('schedules').deleteOne(filter);
    return res.deletedCount > 0;
  }
};
