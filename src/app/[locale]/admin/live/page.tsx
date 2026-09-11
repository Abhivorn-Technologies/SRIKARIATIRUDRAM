'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Radio, Save, CheckCircle2, Video, Play, ExternalLink, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminLivePage() {
  const [liveConfig, setLiveConfig] = useState({
    live_url: '',
    title: '',
    description: '',
    is_live: false,
    channel_name: 'Srikari Ati Rudram Official'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/live');
      const json = await res.json();
      if (json.success) {
        setLiveConfig(json.data);
      } else {
        setError(json.error || 'Failed to load live stream settings');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/live', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveConfig)
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(json.error || 'Failed to update live stream');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to get embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Live Stream Broadcast Controller
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Real-time control of public website live stream feeds and telecast statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveConfig}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Update Live Stream'}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Live feed URL updated in Supabase! Public website stream is updated immediately.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-ivory border-b border-gold/15 pb-2">
              Broadcast Settings
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-ivory/70 block mb-1">Live Broadcast Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_live"
                      checked={liveConfig.is_live === true}
                      onChange={() => setLiveConfig({ ...liveConfig, is_live: true })}
                      className="accent-gold"
                    />
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                      ON AIR / BROADCASTING LIVE
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_live"
                      checked={liveConfig.is_live === false}
                      onChange={() => setLiveConfig({ ...liveConfig, is_live: false })}
                      className="accent-gold"
                    />
                    <span className="text-zinc-400 font-medium">OFFLINE / STANDBY</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">YouTube Live Stream URL *</label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={liveConfig.live_url || ''}
                  onChange={(e) => setLiveConfig({ ...liveConfig, live_url: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Live Telecast Title *</label>
                <Input
                  value={liveConfig.title || ''}
                  onChange={(e) => setLiveConfig({ ...liveConfig, title: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Channel / Organisation Name</label>
                <Input
                  value={liveConfig.channel_name || ''}
                  onChange={(e) => setLiveConfig({ ...liveConfig, channel_name: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Stream Description</label>
                <textarea
                  value={liveConfig.description || ''}
                  onChange={(e) => setLiveConfig({ ...liveConfig, description: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2.5 text-xs h-24"
                />
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Screen */}
        <div className="space-y-4">
          <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold text-gold uppercase">
                Live Feed Preview
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  liveConfig.is_live
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                    : 'border-zinc-500/40 text-zinc-400'
                }`}
              >
                {liveConfig.is_live ? 'LIVE NOW' : 'OFFLINE'}
              </Badge>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-gold/20 flex items-center justify-center">
              {liveConfig.live_url ? (
                <iframe
                  src={getEmbedUrl(liveConfig.live_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-ivory/40 text-xs p-4">
                  <Video className="w-8 h-8 text-gold/40 mx-auto mb-2" />
                  Enter a YouTube Live URL to preview stream
                </div>
              )}
            </div>

            <div className="pt-2 text-xs">
              <p className="font-bold text-ivory truncate">{liveConfig.title || 'Live Stream Title'}</p>
              <p className="text-[11px] text-ivory/60 mt-1">{liveConfig.channel_name}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
