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
    let docs = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();

    // Auto-seed raw 28 days if collection is empty
    if (!docs || docs.length === 0) {
      try {
        const { rawScheduleData } = await import('@/data/schedule');
        const seedItems = rawScheduleData.map(item => {
          const key = (item.specialKey || '').toLowerCase();
          const dayType = key.includes('sarpa') ? 'SARPA_SUKTA' :
                          key.includes('chandi') ? 'CHANDI' :
                          key.includes('aslesha') ? 'ASLESHA_BALI' :
                          key.includes('krithika') || item.nakshatra.toLowerCase().includes('krittika') ? 'SUBRAMANYESWARA_KALYANAM' :
                          item.dayNumber === 28 || key.includes('poornahuti') ? 'POORNAHUTI' : 'REGULAR';
          return {
            day_number: item.dayNumber,
            date: item.date,
            date_display: item.date,
            nakshatra: item.nakshatra,
            rasi: item.rasi || '',
            day_type: dayType,
            status: 'SCHEDULED',
            title: item.title,
            title_te: item.titleTe,
            morning_programme: item.programme,
            special_programme: item.pradhanaHomam || item.specialProgramme || '',
            evening_programme: item.eveningProgramme,
            created_at: new Date(),
            updated_at: new Date()
          };
        });

        if (seedItems.length > 0) {
          await db.collection('schedules').insertMany(seedItems);
          docs = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();
        }
      } catch (seedErr) {
        console.error('Auto-seed schedule collection error:', seedErr);
      }
    }

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
    const { _id, ...cleanData } = data as any;
    const newSchedule: ScheduleItem = {
      day_number: Number(cleanData.day_number || 1),
      date: cleanData.date || '2026-11-25',
      date_display: cleanData.date_display || cleanData.date || '25 Nov 2026',
      nakshatra: cleanData.nakshatra || 'Sarva Nakshatras',
      rasi: cleanData.rasi || '',
      day_type: cleanData.day_type || 'REGULAR',
      special_seva_id: cleanData.special_seva_id,
      status: cleanData.status || 'SCHEDULED',
      title: cleanData.title || `Day ${cleanData.day_number} Mahotsavam`,
      morning_programme: cleanData.morning_programme || '06:30 AM Suprabhatam & Rudra Abhishekam',
      madhyahnika: cleanData.madhyahnika || '11:30 AM Madhyahnika Pooja',
      special_programme: cleanData.special_programme || '08:30 AM Nakshatra Hawan',
      evening_programme: cleanData.evening_programme || '06:00 PM Deeparadhana & Harathi',
      annadanam_menu: cleanData.annadanam_menu || 'Sattvic Annaprasadam',
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

    const { _id, ...cleanUpdates } = updates as any;

    const res = await db.collection('schedules').findOneAndUpdate(
      filter,
      { $set: { ...cleanUpdates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    return res as any;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const dayNum = Number(id);
    const filter = !isNaN(dayNum) ? { $or: [{ day_number: dayNum }, { date: id }, { id }] } : { $or: [{ date: id }, { id }] };
    const res = await db.collection('schedules').deleteOne(filter);
    return res.deletedCount > 0;
  }
};
