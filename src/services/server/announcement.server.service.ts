import { connectToDatabase } from '@/lib/mongodb';

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
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (onlyActive) filter.active = true;

    const docs = await db.collection('announcements')
      .find(filter)
      .sort({ priority: 1, created_at: -1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async createAnnouncement(data: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const { db } = await connectToDatabase();
    const announcementId = 'announcement_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newAnnouncement: AnnouncementItem = {
      id: announcementId,
      title: data.title || 'Important Announcement',
      description: data.description || undefined,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date || undefined,
      priority: data.priority || 'NORMAL',
      active: data.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('announcements').insertOne(newAnnouncement as any);
    return newAnnouncement;
  },

  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<AnnouncementItem | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('announcements').findOneAndUpdate(
      { $or: [{ id }, { _id: id as any }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!res || !res.value) return null;
    return {
      ...res.value,
      id: res.value.id || res.value._id.toString()
    } as any;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('announcements').deleteOne({
      $or: [{ id }, { _id: id as any }]
    });
    return res.deletedCount > 0;
  }
};
