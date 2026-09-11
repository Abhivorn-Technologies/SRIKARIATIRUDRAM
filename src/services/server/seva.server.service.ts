import { query } from '@/lib/db';

export interface SevaItem {
  id: string;
  slug: string;
  title: string;
  title_te?: string;
  title_hi?: string;
  amount: number;
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
  created_at?: string;
  updated_at?: string;
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
    const where = onlyActive ? 'WHERE active = true' : '';
    const res = await query<SevaItem>(`
      SELECT * FROM public.sevas
      ${where}
      ORDER BY sort_order ASC, amount ASC;
    `);
    return res.rows;
  },

  async getSevaByIdOrSlug(idOrSlug: string): Promise<SevaItem | null> {
    const res = await query<SevaItem>(`
      SELECT * FROM public.sevas
      WHERE id = $1 OR slug = $1
      LIMIT 1;
    `, [idOrSlug]);
    return res.rows[0] || null;
  },

  async createSeva(data: Partial<SevaItem>): Promise<SevaItem> {
    const id = data.id || data.slug || `seva-${Date.now()}`;
    const slug = data.slug || id;

    const res = await query<SevaItem>(`
      INSERT INTO public.sevas (
        id, slug, title, title_te, title_hi, amount, short_desc, short_desc_te, short_desc_hi,
        full_desc, full_desc_te, full_desc_hi, category, icon, duration, time,
        capacity, active, featured, sort_order, benefits, prasadam, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW()
      )
      RETURNING *;
    `, [
      id, slug, data.title, data.title_te, data.title_hi, data.amount || 216,
      data.short_desc, data.short_desc_te, data.short_desc_hi,
      data.full_desc, data.full_desc_te, data.full_desc_hi,
      data.category || 'homam', data.icon || '🕉️', data.duration, data.time,
      data.capacity || 100, data.active !== false, data.featured || false, data.sort_order || 0,
      JSON.stringify(data.benefits || []), JSON.stringify(data.prasadam || [])
    ]);

    return res.rows[0];
  },

  async updateSeva(id: string, updates: Partial<SevaItem>): Promise<SevaItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowedKeys: (keyof SevaItem)[] = [
      'slug', 'title', 'title_te', 'title_hi', 'amount', 'short_desc',
      'short_desc_te', 'short_desc_hi', 'full_desc', 'full_desc_te', 'full_desc_hi',
      'category', 'icon', 'duration', 'time', 'capacity', 'active', 'featured', 'sort_order'
    ];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        fields.push(`${String(key)} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (updates.benefits !== undefined) {
      fields.push(`benefits = $${idx}`);
      values.push(JSON.stringify(updates.benefits));
      idx++;
    }

    if (updates.prasadam !== undefined) {
      fields.push(`prasadam = $${idx}`);
      values.push(JSON.stringify(updates.prasadam));
      idx++;
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.sevas
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR slug = $${idx}
      RETURNING *;
    `;

    const res = await query<SevaItem>(sql, values);
    return res.rows[0] || null;
  },

  async deleteSeva(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.sevas
      WHERE id = $1;
    `, [id]);
    return res.rowCount > 0;
  },

  async getSevaAvailability(date?: string, sevaId?: string): Promise<SevaAvailabilityItem[]> {
    let whereClause = '';
    const params: any[] = [];

    if (date && sevaId) {
      whereClause = 'WHERE sa.date = $1::date AND sa.seva_id = $2';
      params.push(date, sevaId);
    } else if (date) {
      whereClause = 'WHERE sa.date = $1::date';
      params.push(date);
    } else if (sevaId) {
      whereClause = 'WHERE sa.seva_id = $1';
      params.push(sevaId);
    }

    const sql = `
      SELECT 
        sa.id,
        sa.date::text as date,
        sa.seva_id,
        s.title as seva_title,
        sa.capacity,
        sa.booked_count,
        sa.status,
        GREATEST(0, sa.capacity - sa.booked_count) as available_slots
      FROM public.seva_availability sa
      JOIN public.sevas s ON s.id = sa.seva_id
      ${whereClause}
      ORDER BY sa.date ASC, s.sort_order ASC;
    `;

    const res = await query<SevaAvailabilityItem>(sql, params);
    return res.rows;
  },

  async updateSevaAvailability(date: string, sevaId: string, capacity: number): Promise<SevaAvailabilityItem | null> {
    const sql = `
      INSERT INTO public.seva_availability (date, seva_id, capacity, booked_count, status, updated_at)
      VALUES ($1::date, $2, $3, 0, 'AVAILABLE', NOW())
      ON CONFLICT (date, seva_id) DO UPDATE SET
        capacity = EXCLUDED.capacity,
        status = CASE 
          WHEN EXCLUDED.capacity <= public.seva_availability.booked_count THEN 'FULLY_BOOKED'
          WHEN (EXCLUDED.capacity - public.seva_availability.booked_count) <= 5 THEN 'FEW_SLOTS_LEFT'
          ELSE 'AVAILABLE'
        END,
        updated_at = NOW()
      RETURNING *, GREATEST(0, capacity - booked_count) as available_slots;
    `;

    const res = await query<SevaAvailabilityItem>(sql, [date, sevaId, capacity]);
    return res.rows[0] || null;
  }
};
