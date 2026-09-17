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
  const [archives, setArchives] = useState<any[]>([]);
  const [selectedArchive, setSelectedArchive] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userClickedPlay, setUserClickedPlay] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { user: 'Srinivas R.', text: 'ఓం నమః శివాయ! హర హర మహాదేవ!', time: '10:42 AM' },
    { user: 'Lakshmi P.', text: 'Har Har Mahadev from California 🙏', time: '10:43 AM' },
    { user: 'Ramesh Sharma', text: 'Bolo Sambho Mahadeva!', time: '10:45 AM' },
  ]);

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/live/chat', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setMessages(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch live chats:', err);
    }
  };

  useEffect(() => {
    fetch('/api/live')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setLiveData(json.data);
        }
      })
      .catch(e => console.warn('Failed to fetch live status:', e))
      .finally(() => setLoading(false));

    fetch('/api/live/archives')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setArchives(json.data);
        }
      })
      .catch(e => console.warn('Failed to fetch live archives:', e));

    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const msgText = chatMessage.trim();
    const senderName = userName.trim() || 'Devotee';
    setChatMessage('');

    // Optimistic UI insert
    const tempMsg = {
      user: senderName,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch('/api/live/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: senderName, text: msgText })
      });
      fetchChats();
    } catch (err) {
      console.error('Failed to post chat message:', err);
    }
  };

  const isLive = Boolean(liveData?.is_live && liveData?.live_url);
  const liveUrl = liveData?.live_url || '';

  const extractYouTubeId = (input: string) => {
    if (!input) return '';
    const str = input.trim();
    if (str.startsWith('live_day') || str === 'live_stream_placeholder') return '';
    const match = str.match(/(?:v=|\/v\/|embed\/|youtu\.be\/|live\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      return str;
    }
    return '';
  };
  
  const getEmbedUrl = (url: string) => {
    const id = extractYouTubeId(url);
    if (!id) return '';
    return `https://www.youtube.com/embed/${id}`;
  };

  const mainEmbedUrl = getEmbedUrl(liveUrl);
  const shouldPlayLive = (isLive || userClickedPlay) && Boolean(mainEmbedUrl);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Live Stream Main Player & Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player Box */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gold/50 bg-black shadow-gold-lg flex items-center justify-center group">
            {shouldPlayLive ? (
              <iframe
                src={`${mainEmbedUrl}?autoplay=1&rel=0`}
                title={liveData?.title || 'Srikari Ati Rudram Live Telecast'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              /* Live Overlay Header */
              <div
                onClick={() => setUserClickedPlay(true)}
                className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-black/40 to-black/80 flex flex-col justify-between p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={isLive ? "live" : "outline"} size="md" className={!isLive ? "border-gold/40 text-gold" : ""}>
                    {isLive ? t('liveNow') : 'STANDBY / RECORDED'}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-ivory/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>{liveData?.viewers_count || '14,200'} Devotees</span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-gold/30 border-2 border-gold flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-gold-lighter fill-gold-lighter ml-1" />
                  </div>
                  <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-light">
                    {liveData?.title || t('currentRitual')}
                  </h3>
                  <p className="text-xs text-ivory/70">Click to Play Broadcast Stream</p>
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
                <MessageSquare className="w-4 h-4 text-gold" /> Live Devotee Prayers
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Chat
              </span>
            </div>

            {/* Chat message list */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs font-sans scrollbar-thin scrollbar-thumb-gold/30"
            >
              {messages.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-burgundy-deep/70 border border-gold/15 space-y-0.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gold-lighter">{m.user}</span>
                    <span className="text-[10px] text-ivory/40">{m.time}</span>
                  </div>
                  <p className="text-ivory/90 leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-gold/20 space-y-2">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-burgundy-deep/80 border border-gold/20 rounded-lg px-2.5 py-1 text-[11px] text-ivory/90 placeholder:text-ivory/40 focus:outline-none focus:border-gold/60"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('chatPlaceholder') || 'Send a prayer / message...'}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-burgundy-deep border border-gold/30 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold"
                />
                <Button type="submit" variant="gold" size="sm" className="px-3 shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
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
            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-gold/40 shadow-2xl flex items-center justify-center">
              {getEmbedUrl(selectedArchive.youtube_id || selectedArchive.url) ? (
                <iframe
                  src={`${getEmbedUrl(selectedArchive.youtube_id || selectedArchive.url)}?autoplay=1&rel=0`}
                  title={selectedArchive.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Play className="w-10 h-10 text-gold/50" />
                  <p className="text-sm font-bold text-gold-light">YouTube Video Link Required</p>
                  <p className="text-xs text-ivory/70 max-w-sm">
                    Please paste a valid YouTube broadcast link or video ID for Day {selectedArchive.day} in the Admin Panel.
                  </p>
                </div>
              )}
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

