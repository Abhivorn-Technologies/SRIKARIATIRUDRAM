import { query } from '@/lib/db';

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
    let sql = `SELECT * FROM public.devotees`;
    const params: any[] = [];

    if (search) {
      sql += ` WHERE (full_name ILIKE $1 OR phone_number ILIKE $1 OR email ILIKE $1 OR gotram ILIKE $1 OR city ILIKE $1)`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY total_bookings DESC, total_donated DESC, created_at DESC;`;

    const res = await query<DevoteeRecord>(sql, params);
    return res.rows;
  },

  async getDevoteeById(id: string): Promise<{ devotee: DevoteeRecord | null; bookings: any[]; donations: any[] }> {
    const devoteeRes = await query<DevoteeRecord>(`
      SELECT * FROM public.devotees
      WHERE id::text = $1 OR phone_number = $1
      LIMIT 1;
    `, [id]);

    const devotee = devoteeRes.rows[0] || null;
    if (!devotee) return { devotee: null, bookings: [], donations: [] };

    const bookingsRes = await query(`
      SELECT * FROM public.bookings
      WHERE phone_number = $1
      ORDER BY created_at DESC;
    `, [devotee.phone_number]);

    const donationsRes = await query(`
      SELECT * FROM public.donations
      WHERE mobile = $1
      ORDER BY created_at DESC;
    `, [devotee.phone_number]);

    return {
      devotee,
      bookings: bookingsRes.rows,
      donations: donationsRes.rows
    };
  },

  async updateDevotee(id: string, updates: Partial<DevoteeRecord>): Promise<DevoteeRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof DevoteeRecord)[] = [
      'full_name', 'email', 'gotram', 'nakshatram', 'rasi', 'dob',
      'address', 'city', 'country', 'notes'
    ];

    for (const k of allowed) {
      if (updates[k] !== undefined) {
        fields.push(`${String(k)} = $${idx}`);
        values.push(updates[k]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.devotees
      SET ${fields.join(', ')}
      WHERE id::text = $${idx}
      RETURNING *;
    `;

    const res = await query<DevoteeRecord>(sql, values);
    return res.rows[0] || null;
  }
};
