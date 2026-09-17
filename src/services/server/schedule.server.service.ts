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

    // Enrich docs with assigned_sevas and real-time ticket availability
    const availabilities = await db.collection('seva_availability').find({}).toArray();
    const allSevas = await db.collection('sevas').find({ active: { $ne: false } }).toArray();
    const sevasMap = new Map<string, any>();
    allSevas.forEach(s => {
      sevasMap.set(s.id, s);
      if (s.slug) sevasMap.set(s.slug, s);
    });

    const everydaySevaIds = ['ati-rudram-donation', 'ekadasa-rudra-abhishekam', 'nakshatra-shanthi'];

    const enriched = docs.map(sc => {
      const dayAvails = availabilities.filter(sa => sa.date === sc.date || (sa.day_number !== undefined && sa.day_number === sc.day_number));
      const list: any[] = [];
      const seenSevaKeys = new Set<string>();

      dayAvails.forEach(sa => {
        const s = sevasMap.get(sa.seva_id) || sevasMap.get(sa.slug);
        const key = (s?.slug || s?.id || sa.seva_id || '').toLowerCase();
        if (key) seenSevaKeys.add(key);

        if (!s || s.active === false || sa.status === 'HIDDEN') return;
        const amt = s.amount || s.price || sa.amount || 0;
        if (amt <= 0) return;

        const capacity = sa.capacity || 50;
        const booked = sa.booked_count || 0;
        const available = Math.max(0, capacity - booked);
        const status = sa.status || (available === 0 ? 'FULLY_BOOKED' : available <= 5 ? 'FEW_SLOTS_LEFT' : 'AVAILABLE');

        list.push({
          availability_id: sa.id || sa._id?.toString(),
          seva_id: s.id || sa.seva_id,
          slug: s.slug || sa.seva_id,
          title: s.title || sa.seva_id,
          title_te: s.title_te || s.titleTe || s.title,
          amount: amt,
          category: s.category || 'General',
          capacity,
          booked_count: booked,
          available_slots: available,
          status
        });
      });

      // Add active everyday sevas if not already explicitly assigned or hidden
      everydaySevaIds.forEach(id => {
        const s = sevasMap.get(id);
        if (s && s.active !== false) {
          const key = (s.slug || s.id || id).toLowerCase();
          if (!seenSevaKeys.has(key)) {
            seenSevaKeys.add(key);
            const amt = s.amount || s.price || 0;
            if (amt > 0) {
              list.push({
                availability_id: `everyday-${sc.day_number}-${s.id}`,
                seva_id: s.id,
                slug: s.slug || s.id,
                title: s.title || s.name,
                title_te: s.title_te || s.titleTe || s.title,
                amount: amt,
                category: s.category || 'General',
                capacity: s.availableSlots || 50,
                booked_count: 0,
                available_slots: s.availableSlots || 50,
                status: 'AVAILABLE'
              });
            }
          }
        }
      });

      // Add special day seva if specified or applicable
      let specialSlug: string | null = sc.special_seva_id || sc.special_seva_slug || null;
      if (!specialSlug) {
        if ([2, 11, 20].includes(sc.day_number)) specialSlug = 'sarpa-suktam-homam';
        else if ([3, 12, 21].includes(sc.day_number)) specialSlug = 'chandi-homam';
        else if (sc.day_number === 6) specialSlug = 'ashlesha-bali';
        else if (sc.day_number === 25) specialSlug = 'valli-devasena-subramanyeswara-kalyanam';
        else if (sc.day_number === 28) specialSlug = 'parvathi-parameswara-kalyanam';
      }

      if (specialSlug) {
        const s = sevasMap.get(specialSlug);
        if (s && s.active !== false) {
          const key = (s.slug || s.id || specialSlug).toLowerCase();
          if (!seenSevaKeys.has(key)) {
            seenSevaKeys.add(key);
            const amt = s.amount || s.price || 0;
            if (amt > 0) {
              list.push({
                availability_id: `special-${sc.day_number}-${s.id}`,
                seva_id: s.id,
                slug: s.slug || s.id,
                title: s.title || s.name,
                title_te: s.title_te || s.titleTe || s.title,
                amount: amt,
                category: s.category || 'General',
                capacity: s.availableSlots || 50,
                booked_count: 0,
                available_slots: s.availableSlots || 50,
                status: 'AVAILABLE'
              });
            }
          }
        }
      }

      const assigned_sevas = list
        .filter(item => item && item.status !== 'HIDDEN' && item.amount > 0)
        .sort((a, b) => a.amount - b.amount);

      return {
        ...sc,
        assigned_sevas
      };
    });

    return enriched as any;
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
    const updatedDoc = (res && typeof res === 'object' && 'value' in res && res.value) ? res.value : res;
    return updatedDoc as any;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const dayNum = Number(id);
    const filter = !isNaN(dayNum) ? { $or: [{ day_number: dayNum }, { date: id }, { id }] } : { $or: [{ date: id }, { id }] };
    const res = await db.collection('schedules').deleteOne(filter);
    return res.deletedCount > 0;
  }
};
