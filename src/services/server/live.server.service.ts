import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface LiveStreamConfig {
  id: string;
  live_url: string;
  title: string;
  description?: string;
  is_live: boolean;
  platform?: string;
  channel_name?: string;
  viewers_count?: number;
  updated_at?: string;
}

export interface LiveArchiveRecord {
  id: string;
  day: number;
  title: string;
  title_te?: string;
  duration?: string;
  views?: string;
  youtube_id?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const liveServerService = {
  async getLiveConfig(): Promise<LiveStreamConfig> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('live_stream').findOne({}, { sort: { updated_at: -1 } });

    if (!doc) {
      return {
        id: '00000000-0000-0000-0000-000000000001',
        live_url: '',
        title: 'Sri Ati Rudra Mahayagnam 2026 — Live Telecast',
        description: 'Watch continuous live streaming of holy homams and rituals.',
        is_live: false,
        platform: 'youtube',
        channel_name: 'Srikari Ati Rudram Official',
        viewers_count: 0
      };
    }

    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async updateLiveConfig(updates: Partial<LiveStreamConfig>): Promise<LiveStreamConfig> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('live_stream').findOne({}, { sort: { updated_at: -1 } });

    const current = doc ? {
      ...doc,
      id: doc.id || doc._id.toString()
    } : {
      id: '00000000-0000-0000-0000-000000000001',
      live_url: '',
      title: 'Sri Ati Rudra Mahayagnam 2026 — Live Telecast',
      description: 'Watch continuous live streaming of holy homams and rituals.',
      is_live: false,
      platform: 'youtube',
      channel_name: 'Srikari Ati Rudram Official',
      viewers_count: 0
    };

    const { _id, ...currentClean } = current as any;
    const { _id: updateId, ...updatesClean } = updates as any;

    const newConfig = {
      ...currentClean,
      ...updatesClean,
      updated_at: new Date().toISOString()
    };

    if (doc?._id) {
      await db.collection('live_stream').updateOne(
        { _id: doc._id },
        { $set: newConfig },
        { upsert: true }
      );
    } else {
      await db.collection('live_stream').insertOne(newConfig as any);
    }

    return newConfig;
  },

  async getArchives(onlyPublished: boolean = false): Promise<LiveArchiveRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (onlyPublished) filter.published = { $ne: false };

    const docs = await db.collection('live_archives')
      .find(filter)
      .sort({ day: 1, created_at: -1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async createArchive(data: Partial<LiveArchiveRecord>): Promise<LiveArchiveRecord> {
    const { db } = await connectToDatabase();
    const archiveId = 'archive_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newArchive: LiveArchiveRecord = {
      id: archiveId,
      day: data.day || 1,
      title: data.title || 'Day Broadcast Recording',
      title_te: data.title_te || data.title || undefined,
      duration: data.duration || '3h 45m',
      views: data.views || '10.5K',
      youtube_id: data.youtube_id || undefined,
      published: data.published !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('live_archives').insertOne(newArchive as any);
    return newArchive;
  },

  async updateArchive(id: string, updates: Partial<LiveArchiveRecord>): Promise<LiveArchiveRecord | null> {
    const { db } = await connectToDatabase();
    const { _id, ...cleanUpdates } = updates as any;

    const filter: any[] = [{ id }];
    if (ObjectId.isValid(id)) {
      filter.push({ _id: new ObjectId(id) });
    }

    const res = await db.collection('live_archives').findOneAndUpdate(
      { $or: filter },
      { $set: { ...cleanUpdates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async deleteArchive(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();

    const filter: any[] = [{ id }];
    if (ObjectId.isValid(id)) {
      filter.push({ _id: new ObjectId(id) });
    }

    const res = await db.collection('live_archives').deleteOne({
      $or: filter
    });
    return res.deletedCount > 0;
  }
};

