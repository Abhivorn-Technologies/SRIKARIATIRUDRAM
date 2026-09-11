import { query } from '@/lib/db';

export interface SponsorRecord {
  id: string;
  name: string;
  title?: string;
  category: 'MAHAYAJNA' | 'ANNADANA' | 'VEDA_SEVA' | 'DAILY_SEVA';
  amount?: number;
  image_url?: string;
  display_consent: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const sponsorServerService = {
  async getSponsors(onlyActive = false): Promise<SponsorRecord[]> {
    const where = onlyActive ? 'WHERE active = true AND display_consent = true' : '';
    const res = await query<SponsorRecord>(`
      SELECT * FROM public.sponsors
      ${where}
      ORDER BY 
        CASE category
          WHEN 'MAHAYAJNA' THEN 1
          WHEN 'ANNADANA' THEN 2
          WHEN 'VEDA_SEVA' THEN 3
          ELSE 4
        END,
        sort_order ASC,
        amount DESC NULLS LAST;
    `);
    return res.rows;
  },

  async createSponsor(data: Partial<SponsorRecord>): Promise<SponsorRecord> {
    const res = await query<SponsorRecord>(`
      INSERT INTO public.sponsors (
        name, title, category, amount, image_url, display_consent, sort_order, active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
      )
      RETURNING *;
    `, [
      data.name || 'Honourable Sponsor',
      data.title || null,
      data.category || 'MAHAYAJNA',
      data.amount || null,
      data.image_url || null,
      data.display_consent !== false,
      data.sort_order || 0,
      data.active !== false
    ]);

    return res.rows[0];
  },

  async updateSponsor(id: string, updates: Partial<SponsorRecord>): Promise<SponsorRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof SponsorRecord)[] = ['name', 'title', 'category', 'amount', 'image_url', 'display_consent', 'sort_order', 'active'];

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
      UPDATE public.sponsors
      SET ${fields.join(', ')}
      WHERE id::text = $${idx}
      RETURNING *;
    `;

    const res = await query<SponsorRecord>(sql, values);
    return res.rows[0] || null;
  },

  async deleteSponsor(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.sponsors
      WHERE id::text = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
