'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { liveArchives as defaultArchives } from '@/data/gallery';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Radio, Users, MessageSquare, Play, Send, Volume2 } from 'lucide-react';

export function LiveStreamViewer() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('live');

  const [liveData, setLiveData] = useState<any>(null);
  const [archives, setArchives] = useState<any[]>(defaultArchives);
  const [selectedArchive, setSelectedArchive] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { user: 'Srinivas R.', text: 'ఓం నమః శివాయ! హర హర మహాదేవ!', time: '10:42 AM' },
    { user: 'Lakshmi P.', text: 'Har Har Mahadev from California 🙏', time: '10:43 AM' },
    { user: 'Ramesh Sharma', text: 'Bolo Sambho Mahadeva!', time: '10:45 AM' },
  ]);

  useEffect(() => {
    fetch('/api/live')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setLiveData(json.data);
        }
      })
      .catch(e => console.warn('Failed to fetch live status:', e));

    fetch('/api/live/archives')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setArchives(json.data);
        }
      })
      .catch(e => console.warn('Failed to fetch live archives:', e));
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([...messages, { user: 'You', text: chatMessage, time: 'Just now' }]);
    setChatMessage('');
  };

  const isLive = liveData?.is_live ?? true;
  const liveUrl = liveData?.live_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (!url.startsWith('http')) {
      return `https://www.youtube-nocookie.com/embed/${url}`;
    }
    return url;
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Live Stream Main Player & Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player Box */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gold/50 bg-black shadow-gold-lg flex items-center justify-center group">
            {isLive ? (
              <iframe
                src={`${getEmbedUrl(liveUrl)}?autoplay=1&mute=0`}
                title={liveData?.title || 'Srikari Ati Rudram Live Telecast'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              /* Live Overlay Header */
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-black/40 to-black/80 flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <Badge variant="live" size="md">
                    {t('liveNow')}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-ivory/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>{liveData?.viewers_count || '3,482'} Watching</span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-gold/30 border-2 border-gold flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-gold-lighter fill-gold-lighter ml-1" />
                  </div>
                  <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-light">
                    {liveData?.title || t('currentRitual')}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-ivory/80">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-gold-light" /> High Audio Quality (Vedic Chanting)
                  </span>
                  <span>1080p 60fps HD</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-gold-lighter">
              {liveData?.title || 'Srikari Ati Rudra Mahayagnam — Live Broadcast'}
            </h2>
            <p className="text-xs md:text-sm text-ivory/80 font-sans">
              {liveData?.description || '121 Vedic Scholars performing continuous Maha Homa Kunda Aradhana at Srikari Kshetram.'}
            </p>
          </div>
        </div>

        {/* Live Devotee Chat Box */}
        <div className="lg:col-span-4">
          <Card variant="sacred" className="h-[460px] flex flex-col justify-between p-4 border-gold/30">
            <div className="border-b border-gold/20 pb-3 flex items-center justify-between">
              <span className="font-cinzel text-sm font-bold text-gold-light flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Live Devotee Prayers
              </span>
              <span className="text-[10px] text-ivory/60">Real-time</span>
            </div>

            {/* Chat message list */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs font-sans scrollbar-none">
              {messages.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-burgundy-deep/70 border border-gold/15 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gold-lighter">{m.user}</span>
                    <span className="text-[10px] text-ivory/40">{m.time}</span>
                  </div>
                  <p className="text-ivory/90">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-gold/20 flex gap-2">
              <input
                type="text"
                placeholder={t('chatPlaceholder')}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-burgundy-deep border border-gold/30 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold"
              />
              <Button type="submit" variant="gold" size="sm" className="px-3">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Archives / Past Days */}
      <div className="space-y-6 pt-6">
        <h3 className="font-cinzel text-xl md:text-2xl font-bold text-gold-lighter">
          {t('viewRecordings')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((rec, idx) => (
            <Card
              key={rec.id || rec.day || idx}
              variant="sacred"
              interactive
              onClick={() => setSelectedArchive(rec)}
              className="p-4 border-gold/25 group cursor-pointer"
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-burgundy-deep mb-3 relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-gold-lighter fill-gold-lighter ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/80 px-2 py-0.5 rounded text-ivory">
                  {rec.duration || '3h 45m'}
                </span>
              </div>
              <h4 className="font-cinzel text-sm font-bold text-ivory group-hover:text-gold-light line-clamp-1">
                {isTe ? (rec.title_te || rec.titleTe || rec.title) : (rec.title || rec.titleTe || rec.title)}
              </h4>
              <span className="text-xs text-ivory/60 font-sans mt-1 block">
                {rec.views || '15K'} views • Recorded
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Archive Recording Playback Modal */}
      <Modal
        isOpen={!!selectedArchive}
        onClose={() => setSelectedArchive(null)}
        maxWidth="xl"
      >
        {selectedArchive && (
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-gold/40 shadow-2xl">
              <iframe
                src={`${getEmbedUrl(selectedArchive.youtube_id || selectedArchive.url)}?autoplay=1`}
                title={selectedArchive.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="space-y-1 text-center">
              <Badge variant="gold" size="sm" className="mb-1">
                Day {selectedArchive.day} Recording Archive
              </Badge>
              <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-light">
                {isTe ? (selectedArchive.title_te || selectedArchive.titleTe || selectedArchive.title) : (selectedArchive.title || selectedArchive.titleTe || selectedArchive.title)}
              </h3>
              <p className="text-xs text-ivory/70 font-sans">
                Duration: {selectedArchive.duration || '3h 45m'} • {selectedArchive.views || '15K'} Views
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

