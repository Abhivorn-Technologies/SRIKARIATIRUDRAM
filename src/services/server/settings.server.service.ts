import { query } from '@/lib/db';

export interface SiteSettingItem {
  key: string;
  value: any;
  description?: string;
  updated_at?: string;
}

export const settingsServerService = {
  async getAllSettings(): Promise<Record<string, any>> {
    const res = await query<SiteSettingItem>(`
      SELECT * FROM public.site_settings;
    `);

    const map: Record<string, any> = {};
    for (const row of res.rows) {
      map[row.key] = row.value;
    }
    return map;
  },

  async getSetting<T = any>(key: string, defaultValue?: T): Promise<T> {
    const res = await query<SiteSettingItem>(`
      SELECT value FROM public.site_settings
      WHERE key = $1
      LIMIT 1;
    `, [key]);

    if (res.rows.length === 0) return defaultValue as T;
    return res.rows[0].value as T;
  },

  async setSetting(key: string, value: any, description?: string): Promise<any> {
    const res = await query<SiteSettingItem>(`
      INSERT INTO public.site_settings (key, value, description, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, public.site_settings.description),
        updated_at = NOW()
      RETURNING *;
    `, [key, JSON.stringify(value), description || null]);

    return res.rows[0]?.value;
  },

  async updateBulkSettings(settingsMap: Record<string, any>): Promise<Record<string, any>> {
    for (const [key, val] of Object.entries(settingsMap)) {
      await this.setSetting(key, val);
    }
    return this.getAllSettings();
  }
};
