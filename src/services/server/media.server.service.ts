import { query } from '@/lib/db';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export interface MediaAssetRecord {
  id: string;
  key?: string;
  name: string;
  title?: string;
  description?: string;
  media_type: 'video' | 'image' | 'audio';
  cloudinary_public_id?: string;
  secure_url: string;
  url: string;
  thumbnail_url?: string;
  format?: string;
  duration?: string;
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
  /**
   * Generate secure server-signed upload params for client-side direct upload to Cloudinary
   */
  generateUploadSignature(folder = 'srikari_atirudram', tags?: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params: any = {
      timestamp,
      folder,
    };
    if (tags) params.tags = tags;

    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    };
  },

  async getMediaAssets(type?: 'video' | 'image' | 'audio', onlyPublished = false): Promise<MediaAssetRecord[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (type) {
      conditions.push(`media_type = $${idx}`);
      params.push(type);
      idx++;
    }

    if (onlyPublished) {
      conditions.push(`published = true`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT * FROM public.media_assets
      ${whereClause}
      ORDER BY sort_order ASC, created_at DESC;
    `;

    const res = await query<MediaAssetRecord>(sql, params);
    return res.rows;
  },

  async getMediaById(id: string): Promise<MediaAssetRecord | null> {
    const res = await query<MediaAssetRecord>(`
      SELECT * FROM public.media_assets
      WHERE id::text = $1 OR key = $1
      LIMIT 1;
    `, [id]);
    return res.rows[0] || null;
  },

  async createMediaAsset(data: Partial<MediaAssetRecord>): Promise<MediaAssetRecord> {
    const res = await query<MediaAssetRecord>(`
      INSERT INTO public.media_assets (
        key, name, title, description, media_type, cloudinary_public_id,
        secure_url, url, thumbnail_url, format, duration, bytes, metadata,
        category, day_number, nakshatra, featured, published, sort_order, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, NOW(), NOW()
      )
      RETURNING *;
    `, [
      data.key || data.cloudinary_public_id || ('media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)),
      data.name || 'asset',
      data.title || data.name,
      data.description || null,
      data.media_type || 'image',
      data.cloudinary_public_id || null,
      data.secure_url || data.url,
      data.url || data.secure_url,
      data.thumbnail_url || null,
      data.format || null,
      data.duration ? String(data.duration) : null,
      data.bytes || null,
      JSON.stringify(data.metadata || {}),
      data.category || 'general',
      data.day_number || null,
      data.nakshatra || null,
      data.featured || false,
      data.published !== false,
      data.sort_order || 0
    ]);

    return res.rows[0];
  },

  async updateMediaAsset(id: string, updates: Partial<MediaAssetRecord>): Promise<MediaAssetRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof MediaAssetRecord)[] = [
      'name', 'title', 'description', 'media_type', 'cloudinary_public_id',
      'secure_url', 'url', 'thumbnail_url', 'format', 'duration', 'bytes',
      'category', 'day_number', 'nakshatra', 'featured', 'published', 'sort_order'
    ];

    for (const k of allowed) {
      if (updates[k] !== undefined) {
        fields.push(`${String(k)} = $${idx}`);
        values.push(updates[k]);
        idx++;
      }
    }

    if (updates.metadata !== undefined) {
      fields.push(`metadata = $${idx}`);
      values.push(JSON.stringify(updates.metadata));
      idx++;
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.media_assets
      SET ${fields.join(', ')}
      WHERE id::text = $${idx} OR key = $${idx}
      RETURNING *;
    `;

    const res = await query<MediaAssetRecord>(sql, values);
    return res.rows[0] || null;
  },

  async deleteMediaAsset(id: string): Promise<boolean> {
    const asset = await this.getMediaById(id);
    if (asset && asset.cloudinary_public_id) {
      // Clean up from Cloudinary if public_id exists
      try {
        await cloudinary.v2.uploader.destroy(asset.cloudinary_public_id, {
          resource_type: asset.media_type === 'video' ? 'video' : 'image'
        });
      } catch (e) {
        console.warn('Cloudinary delete warning:', e);
      }
    }

    const res = await query(`
      DELETE FROM public.media_assets
      WHERE id::text = $1 OR key = $1;
    `, [id]);
    return res.rowCount > 0;
  }
};
