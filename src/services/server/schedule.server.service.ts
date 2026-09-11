import { query } from '@/lib/db';

export interface ScheduleItem {
  id: string;
  day_number: number;
  date: string;
  date_display: string;
  nakshatra: string;
  rasi?: string;
  day_type: string;
  special_seva_id?: string;
  status: string;
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
  created_at?: string;
  updated_at?: string;
}

export const scheduleServerService = {
  async getAllSchedules(): Promise<ScheduleItem[]> {
    const res = await query<ScheduleItem>(`
      SELECT * FROM public.schedules
      ORDER BY day_number ASC;
    `);
    return res.rows;
  },

  async getScheduleById(id: string): Promise<ScheduleItem | null> {
    const res = await query<ScheduleItem>(`
      SELECT * FROM public.schedules
      WHERE id::text = $1 OR day_number::text = $1 OR date::text = $1
      LIMIT 1;
    `, [id]);
    return res.rows[0] || null;
  },

  async getScheduleByDate(dateStr: string): Promise<ScheduleItem | null> {
    const res = await query<ScheduleItem>(`
      SELECT * FROM public.schedules
      WHERE date = $1::date OR date_display ILIKE $2
      LIMIT 1;
    `, [dateStr, `%${dateStr}%`]);
    return res.rows[0] || null;
  },

  async createSchedule(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const res = await query<ScheduleItem>(`
      INSERT INTO public.schedules (
        day_number, date, date_display, nakshatra, rasi, day_type, special_seva_id, status, title,
        morning_programme, madhyahnika, special_programme, evening_programme, annadanam_menu, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
      )
      RETURNING *;
    `, [
      data.day_number,
      data.date,
      data.date_display || data.date,
      data.nakshatra || 'Sarva Nakshatras',
      data.rasi || '',
      data.day_type || 'REGULAR',
      data.special_seva_id || null,
      data.status || 'SCHEDULED',
      data.title || `Day ${data.day_number} Mahotsavam`,
      data.morning_programme || '06:30 AM Suprabhatam & Rudra Abhishekam',
      data.madhyahnika || '11:30 AM Madhyahnika Pooja',
      data.special_programme || '08:30 AM Nakshatra Hawan',
      data.evening_programme || '06:00 PM Deeparadhana & Harathi',
      data.annadanam_menu || 'Sattvic Annaprasadam'
    ]);
    return res.rows[0];
  },

  async updateSchedule(id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowedKeys: (keyof ScheduleItem)[] = [
      'day_number', 'date', 'date_display', 'nakshatra', 'rasi', 'day_type',
      'special_seva_id', 'status', 'title', 'title_te', 'title_hi', 'description',
      'tithi', 'morning_programme', 'madhyahnika', 'special_programme',
      'evening_programme', 'annadanam_menu'
    ];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        fields.push(`${String(key)} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (fields.length === 0) {
      return this.getScheduleById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.schedules
      SET ${fields.join(', ')}
      WHERE id::text = $${idx} OR day_number::text = $${idx}
      RETURNING *;
    `;

    const res = await query<ScheduleItem>(sql, values);
    return res.rows[0] || null;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.schedules
      WHERE id::text = $1 OR day_number::text = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
