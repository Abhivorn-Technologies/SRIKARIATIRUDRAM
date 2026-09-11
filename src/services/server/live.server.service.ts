import { query } from '@/lib/db';

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

export const liveServerService = {
  async getLiveConfig(): Promise<LiveStreamConfig> {
    const res = await query<LiveStreamConfig>(`
      SELECT * FROM public.live_stream
      ORDER BY updated_at DESC
      LIMIT 1;
    `);

    if (res.rows.length === 0) {
      // Return default configuration
      return {
        id: '00000000-0000-0000-0000-000000000001',
        live_url: 'https://www.youtube.com/watch?v=live_stream_placeholder',
        title: 'Sri Ati Rudra Mahayagnam 2026 — Live Telecast',
        description: 'Watch continuous live streaming of holy homams and rituals.',
        is_live: false,
        platform: 'youtube',
        channel_name: 'Srikari Ati Rudram Official',
        viewers_count: 0
      };
    }

    return res.rows[0];
  },

  async updateLiveConfig(updates: Partial<LiveStreamConfig>): Promise<LiveStreamConfig> {
    const current = await this.getLiveConfig();

    const res = await query<LiveStreamConfig>(`
      INSERT INTO public.live_stream (
        id, live_url, title, description, is_live, platform, channel_name, viewers_count, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        live_url = EXCLUDED.live_url,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        is_live = EXCLUDED.is_live,
        platform = EXCLUDED.platform,
        channel_name = EXCLUDED.channel_name,
        viewers_count = EXCLUDED.viewers_count,
        updated_at = NOW()
      RETURNING *;
    `, [
      current.id,
      updates.live_url !== undefined ? updates.live_url : current.live_url,
      updates.title !== undefined ? updates.title : current.title,
      updates.description !== undefined ? updates.description : current.description,
      updates.is_live !== undefined ? updates.is_live : current.is_live,
      updates.platform !== undefined ? updates.platform : current.platform,
      updates.channel_name !== undefined ? updates.channel_name : current.channel_name,
      updates.viewers_count !== undefined ? updates.viewers_count : (current.viewers_count || 0)
    ]);

    return res.rows[0];
  }
};
