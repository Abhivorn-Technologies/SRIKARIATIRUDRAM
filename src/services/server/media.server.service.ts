import { connectToDatabase } from '@/lib/mongodb';

export interface MediaAssetRecord {
  id: string;
  key?: string;
  name: string;
  title?: string;
  description?: string;
  media_type: 'image' | 'audio' | 'video';
  secure_url: string;
  url: string;
  thumbnail_url?: string;
  format?: string;
  bytes?: number;
  metadata?: any;
  category?: string;
  day_number?: number;
  nakshatra?: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const mediaServerService = {
  async getMediaAssets(type?: 'video' | 'image' | 'audio', onlyPublished = false): Promise<MediaAssetRecord[]> {
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (type) filter.media_type = type;
    if (onlyPublished) filter.published = true;

    const docs = await db.collection('media_assets')
      .find(filter)
      .sort({ sort_order: 1, created_at: -1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async getMediaById(id: string): Promise<MediaAssetRecord | null> {
    const { db } = await connectToDatabase();
    const doc = await db.collection('media_assets').findOne({
      $or: [{ id }, { key: id }, { _id: id as any }]
    });
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async createMediaAsset(data: Partial<MediaAssetRecord>): Promise<MediaAssetRecord> {
    const { db } = await connectToDatabase();
    const assetId = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const record: MediaAssetRecord = {
      id: assetId,
      key: data.key || assetId,
      name: data.name || 'asset',
      title: data.title || data.name || 'Media Asset',
      description: data.description || undefined,
      media_type: data.media_type || 'image',
      secure_url: data.secure_url || data.url || '',
      url: data.url || data.secure_url || '',
      thumbnail_url: data.thumbnail_url || undefined,
      format: data.format || undefined,
      bytes: data.bytes || undefined,
      metadata: data.metadata || {},
      category: data.category || 'general',
      day_number: data.day_number || undefined,
      nakshatra: data.nakshatra || undefined,
      featured: data.featured || false,
      published: data.published !== false,
      sort_order: data.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('media_assets').insertOne(record as any);
    return record;
  },

  async updateMediaAsset(id: string, updates: Partial<MediaAssetRecord>): Promise<MediaAssetRecord | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('media_assets').findOneAndUpdate(
      { $or: [{ id }, { key: id }, { _id: id as any }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async deleteMediaAsset(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('media_assets').deleteOne({
      $or: [{ id }, { key: id }, { _id: id as any }]
    });
    return res.deletedCount > 0;
  }
};
