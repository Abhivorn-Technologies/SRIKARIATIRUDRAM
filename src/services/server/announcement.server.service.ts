import { query } from '@/lib/db';

export interface AnnouncementItem {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const announcementServerService = {
  async getAnnouncements(onlyActive = false): Promise<AnnouncementItem[]> {
    const where = onlyActive ? 'WHERE active = true' : '';
    const res = await query<AnnouncementItem>(`
      SELECT * FROM public.announcements
      ${where}
      ORDER BY 
        CASE priority 
          WHEN 'URGENT' THEN 1 
          WHEN 'HIGH' THEN 2 
          ELSE 3 
        END, 
        created_at DESC;
    `);
    return res.rows;
  },

  async createAnnouncement(data: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const res = await query<AnnouncementItem>(`
      INSERT INTO public.announcements (
        title, description, start_date, end_date, priority, active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, NOW(), NOW()
      )
      RETURNING *;
    `, [
      data.title || 'Important Announcement',
      data.description || null,
      data.start_date || new Date().toISOString().split('T')[0],
      data.end_date || null,
      data.priority || 'NORMAL',
      data.active !== false
    ]);

    return res.rows[0];
  },

  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<AnnouncementItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof AnnouncementItem)[] = ['title', 'description', 'start_date', 'end_date', 'priority', 'active'];

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
      UPDATE public.announcements
      SET ${fields.join(', ')}
      WHERE id::text = $${idx}
      RETURNING *;
    `;

    const res = await query<AnnouncementItem>(sql, values);
    return res.rows[0] || null;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.announcements
      WHERE id::text = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
