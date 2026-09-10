'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Video, Image as ImageIcon, Save } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-gold-lighter flex items-center gap-2">
            <Video className="w-5 h-5 text-gold" />
            Live Stream & Media Controller
          </h1>
          <p className="text-xs text-ivory/70 font-sans">
            Update active YouTube Live Stream links and manage gallery media assets.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
          <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Update Live Stream
        </Button>
      </div>

      <Card variant="gold-border" className="p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <h3 className="font-cinzel text-base font-bold text-gold-lighter">
          YouTube Live Broadcast Configuration
        </h3>
        <div className="space-y-2 max-w-xl">
          <label className="text-xs font-semibold text-gold-light">Active YouTube Video ID / Live URL</label>
          <Input
            defaultValue="https://youtube.com/live/..."
            placeholder="e.g. dQw4w9WgXcQ"
            className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
          />
          <p className="text-[11px] text-ivory/60 font-sans">
            Updating this dynamically updates the live video player on the public <code>/live</code> page.
          </p>
        </div>
      </Card>
    </div>
  );
}
