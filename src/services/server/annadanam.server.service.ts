import { query } from '@/lib/db';
import { scheduleServerService } from './schedule.server.service';

export interface AnnadanamRecord {
  id: string;
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
  created_at?: string;
  updated_at?: string;
}

export const annadanamServerService = {
  async getAllAnnadanam(date?: string): Promise<AnnadanamRecord[]> {
    let sql = `SELECT * FROM public.annadanam`;
    const params: any[] = [];

    if (date) {
      sql += ` WHERE date = $1::date`;
      params.push(date);
    }

    sql += ` ORDER BY date ASC, created_at DESC;`;

    const res = await query<AnnadanamRecord>(sql, params);
    return res.rows;
  },

  async getAnnadanamById(id: string): Promise<AnnadanamRecord | null> {
    const res = await query<AnnadanamRecord>(`
      SELECT * FROM public.annadanam
      WHERE id::text = $1
      LIMIT 1;
    `, [id]);
    return res.rows[0] || null;
  },

  async createAnnadanam(data: Partial<AnnadanamRecord>): Promise<AnnadanamRecord> {
    const cleanDate = new Date(data.date || '2026-11-25').toISOString().split('T')[0];
    const schedule = await scheduleServerService.getScheduleByDate(cleanDate);
    const dayNumber = schedule?.day_number || 1;

    const res = await query<AnnadanamRecord>(`
      INSERT INTO public.annadanam (
        date, day_number, sponsor_name, mobile, email, amount, occasion, display_name,
        payment_status, status, is_anonymous, transaction_id, created_at, updated_at
      ) VALUES (
        $1::date, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, NOW(), NOW()
      )
      RETURNING *;
    `, [
      cleanDate,
      dayNumber,
      data.sponsor_name || 'Anonymous Devotee',
      data.mobile || '',
      data.email || null,
      data.amount || 5116,
      data.occasion || null,
      data.display_name || data.sponsor_name || null,
      data.payment_status || 'PENDING',
      data.status || 'CONFIRMED',
      data.is_anonymous || false,
      data.transaction_id || null
    ]);

    return res.rows[0];
  },

  async updateAnnadanam(id: string, updates: Partial<AnnadanamRecord>): Promise<AnnadanamRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof AnnadanamRecord)[] = [
      'date', 'sponsor_name', 'mobile', 'email', 'amount', 'occasion',
      'display_name', 'payment_status', 'status', 'is_anonymous', 'transaction_id'
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
      UPDATE public.annadanam
      SET ${fields.join(', ')}
      WHERE id::text = $${idx}
      RETURNING *;
    `;

    const res = await query<AnnadanamRecord>(sql, values);
    return res.rows[0] || null;
  },

  async deleteAnnadanam(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.annadanam
      WHERE id::text = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
