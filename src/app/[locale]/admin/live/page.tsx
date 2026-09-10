'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Radio, Save, CheckCircle2, Video, Play, ExternalLink, Sparkles } from 'lucide-react';

export default function AdminLivePage() {
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [streamTitle, setStreamTitle] = useState('Srikari Ati Rudra Mahayagnam • Live Telecast (4K Ultra HD)');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              BROADCAST STUDIO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-gold" />
            Live Stream Broadcast Controller
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage active YouTube Live stream feeds, stream titles, and live telecast status on public /live pages.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="gold"
          size="sm"
          className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Update Live Stream
        </Button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Live feed URL updated! Public website stream is now live.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-5">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2 border-b border-gold/20 pb-3">
              <Video className="w-4 h-4 text-gold" />
              Active Feed Configuration
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-light">Broadcast Headline / Title</label>
                <Input
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-light">YouTube Live Video URL or Embed ID</label>
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory font-mono"
                />
                <p className="text-[10px] text-ivory/50">
                  Accepts YouTube Live URL, standard watch URL, or raw 11-character Video ID.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ivory">Broadcast Status: Live Indicator</p>
                  <p className="text-[11px] text-ivory/60">Toggle &quot;LIVE&quot; pulsing badge on navbar and home page</p>
                </div>
                <input
                  type="checkbox"
                  checked={isLiveActive}
                  onChange={(e) => setIsLiveActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Live Stream Status Card */}
        <div className="space-y-6">
          <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-4">
            <span className="text-xs font-cinzel font-bold text-gold-light uppercase tracking-wider">
              Channel Telecast Monitor
            </span>

            <div className="p-4 rounded-xl bg-burgundy-dark/80 border border-gold/20 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto animate-pulse">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-ivory">{streamTitle}</h4>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                ON AIR
              </span>
            </div>

            <div className="pt-2 text-[11px] text-ivory/60 space-y-1">
              <p className="flex justify-between">
                <span>Estimated Viewers:</span>
                <strong className="text-gold-light">3,200 concurrent</strong>
              </p>
              <p className="flex justify-between">
                <span>Audio Quality:</span>
                <strong className="text-gold-light">Stereo 320kbps</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
