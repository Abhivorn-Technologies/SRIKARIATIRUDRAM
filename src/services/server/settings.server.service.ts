import { connectToDatabase } from '@/lib/mongodb';

export interface SiteSettingItem {
  key: string;
  value: any;
  description?: string;
  updated_at?: string | Date;
}

export const settingsServerService = {
  async getAllSettings(): Promise<Record<string, any>> {
    try {
      const { db } = await connectToDatabase();
      const docs = await db.collection('site_settings').find({}).toArray();

      const map: Record<string, any> = {};
      for (const doc of docs) {
        map[doc.key] = doc.value;
      }
      return map;
    } catch (e) {
      console.error('Error fetching settings from MongoDB', e);
      return {};
    }
  },

  async getSetting<T = any>(key: string, defaultValue?: T): Promise<T> {
    try {
      const { db } = await connectToDatabase();
      const doc = await db.collection('site_settings').findOne({ key });
      if (!doc) return defaultValue as T;
      return doc.value as T;
    } catch (e) {
      return defaultValue as T;
    }
  },

  async setSetting(key: string, value: any, description?: string): Promise<any> {
    const { db } = await connectToDatabase();
    await db.collection('site_settings').updateOne(
      { key },
      {
        $set: {
          key,
          value,
          description: description || null,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );
    return value;
  },

  async updateBulkSettings(settingsMap: Record<string, any>): Promise<Record<string, any>> {
    for (const [key, val] of Object.entries(settingsMap)) {
      await this.setSetting(key, val);
    }
    return this.getAllSettings();
  }
};
