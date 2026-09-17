'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { Radio, Save, CheckCircle2, Video, Play, RefreshCw, AlertCircle, Plus, Trash2, X, Edit3, Eye, EyeOff } from 'lucide-react';

interface ArchiveRecord {
  id: string;
  day: number;
  title: string;
  title_te?: string;
  duration?: string;
  views?: string;
  youtube_id?: string;
  published?: boolean;
}

export default function AdminLivePage() {
  const { showToast } = useToast();
  const [liveConfig, setLiveConfig] = useState({
    live_url: '',
    title: '',
    description: '',
    is_live: false,
    channel_name: 'Srikari Ati Rudram Official'
  });

  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Archive Modal State
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [editingArchive, setEditingArchive] = useState<ArchiveRecord | null>(null);
  const [deletingArchive, setDeletingArchive] = useState<ArchiveRecord | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [archiveForm, setArchiveForm] = useState({
    day: 1,
    title: '',
    title_te: '',
    duration: '3h 45m',
    views: '15.2K',
    youtube_id: '',
    published: true,
  });
  const [savingArchive, setSavingArchive] = useState(false);

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

      const arcRes = await fetch('/api/admin/live/archives');
      const arcJson = await arcRes.json();
      if (arcJson.success) {
        setArchives(arcJson.data || []);
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

  const handleOpenAddArchive = () => {
    setEditingArchive(null);
    setArchiveForm({
      day: archives.length + 1,
      title: '',
      title_te: '',
      duration: '3h 45m',
      views: '15.2K',
      youtube_id: '',
      published: true,
    });
    setShowArchiveModal(true);
  };

  const handleOpenEditArchive = (arc: ArchiveRecord) => {
    setEditingArchive(arc);
    setArchiveForm({
      day: arc.day || 1,
      title: arc.title || '',
      title_te: arc.title_te || '',
      duration: arc.duration || '3h 45m',
      views: arc.views || '15.2K',
      youtube_id: arc.youtube_id || '',
      published: arc.published !== false,
    });
    setShowArchiveModal(true);
  };

  const handleTogglePublishArchive = async (arc: ArchiveRecord) => {
    const newPublished = !arc.published;
    try {
      const res = await fetch(`/api/admin/live/archives/${arc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished })
      });
      const json = await res.json();
      if (json.success) {
        setArchives((prev) =>
          prev.map((item) => (item.id === arc.id ? { ...item, published: newPublished } : item))
        );
        showToast(
          newPublished ? 'Archive recording is now PUBLIC on website' : 'Archive recording is HIDDEN from website',
          'success'
        );
      } else {
        showToast(json.error || 'Failed to update visibility', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

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
        showToast('Live stream settings updated successfully!', 'success');
        setTimeout(() => setSaved(false), 3000);
      } else {
        showToast(json.error || 'Failed to update live stream', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

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

  const handleSaveArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archiveForm.title.trim()) {
      showToast('Recording title is required', 'error');
      return;
    }
    setSavingArchive(true);
    try {
      const cleanYoutubeId = extractYouTubeId(archiveForm.youtube_id);
      const payload = {
        ...archiveForm,
        youtube_id: cleanYoutubeId,
        duration: archiveForm.duration.trim() || 'Full Recording',
      };

      if (editingArchive) {
        const res = await fetch(`/api/admin/live/archives/${editingArchive.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setShowArchiveModal(false);
          showToast('Archive recording updated successfully!', 'success');
          fetchLiveConfig();
        } else {
          showToast(json.error || 'Failed to update archive', 'error');
        }
      } else {
        const res = await fetch('/api/admin/live/archives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setShowArchiveModal(false);
          showToast('New archive recording added successfully!', 'success');
          fetchLiveConfig();
        } else {
          showToast(json.error || 'Failed to save archive', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSavingArchive(false);
    }
  };

  const confirmDeleteArchive = async () => {
    if (!deletingArchive) return;
    try {
      setDeletingLoading(true);
      const res = await fetch(`/api/admin/live/archives/${deletingArchive.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setArchives((prev) => prev.filter((a) => a.id !== deletingArchive.id));
        showToast('Recording archive deleted successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to delete archive', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setDeletingLoading(false);
      setDeletingArchive(null);
    }
  };

  // Helper to get embed URL
  const getEmbedUrl = (url: string) => {
    const id = extractYouTubeId(url);
    if (!id) return '';
    return `https://www.youtube-nocookie.com/embed/${id}`;
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

      {/* Archives Section */}
      <Card className="p-6 bg-[#240006]/90 border-gold/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div>
            <h3 className="font-cinzel text-base font-bold text-ivory flex items-center gap-2">
              <Play className="w-4 h-4 text-gold" />
              Past Day Yagnam Broadcast Archives ({archives.length})
            </h3>
            <p className="text-xs text-ivory/60">
              Manage past day recorded broadcasts displayed on the public live stream page.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleOpenAddArchive}
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Day Archive
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {archives.map((arc) => (
            <Card key={arc.id} className="p-4 bg-burgundy-deep/80 border-gold/20 space-y-3 flex flex-col justify-between group hover:border-gold/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="gold" size="sm" className="text-[10px]">
                      Day {arc.day}
                    </Badge>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        arc.published !== false
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                          : 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                      }`}
                    >
                      {arc.published !== false ? 'PUBLIC' : 'HIDDEN'}
                    </span>
                  </div>
                  <span className="text-[10px] text-ivory/50">{arc.duration || '3h 45m'}</span>
                </div>
                <h4 className="font-bold text-ivory text-xs line-clamp-1">{arc.title}</h4>
                {arc.title_te && <p className="text-[10px] text-ivory/60 truncate">{arc.title_te}</p>}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                <span className="text-[10px] text-gold-light">{arc.views || '15K'} views</span>
                <div className="flex items-center gap-1">
                  {/* Hide / Unhide Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublishArchive(arc)}
                    title={arc.published !== false ? 'Hide from public website' : 'Make public on website'}
                    className={`h-7 px-2 text-xs flex items-center gap-1 ${
                      arc.published !== false
                        ? 'text-emerald-400 hover:bg-emerald-950/40'
                        : 'text-amber-400 hover:bg-amber-950/40'
                    }`}
                  >
                    {arc.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{arc.published !== false ? 'Public' : 'Hidden'}</span>
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditArchive(arc)}
                    title="Edit Archive"
                    className="h-7 w-7 p-0 text-gold hover:bg-gold/10"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingArchive(arc)}
                    title="Delete Archive"
                    className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add / Edit Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveArchive} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">
                {editingArchive ? 'Edit Broadcast Recording Archive' : 'Add Broadcast Recording Archive'}
              </h3>
              <button type="button" onClick={() => setShowArchiveModal(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/80 font-medium block mb-1">Yagnam Day Number *</label>
                  <select
                    value={archiveForm.day}
                    onChange={(e) => setArchiveForm({ ...archiveForm, day: Number(e.target.value) })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-ivory/80 font-medium block mb-1">Recording Duration</label>
                  <Input
                    placeholder="e.g. 3h 45m"
                    value={archiveForm.duration}
                    onChange={(e) => setArchiveForm({ ...archiveForm, duration: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Recording Title (English) *</label>
                <Input
                  placeholder="e.g. Day 6 - Sarpa Sukta Homam & Yajna Kundam"
                  value={archiveForm.title}
                  onChange={(e) => setArchiveForm({ ...archiveForm, title: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Recording Title (Telugu)</label>
                <Input
                  placeholder="e.g. రోజు 6 - సర్ప సూక్త హోమం & యజ్ఞ కుండం"
                  value={archiveForm.title_te}
                  onChange={(e) => setArchiveForm({ ...archiveForm, title_te: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/80 font-medium block mb-1">YouTube Video Link / ID</label>
                  <Input
                    placeholder="e.g. https://youtu.be/... or video ID"
                    value={archiveForm.youtube_id}
                    onChange={(e) => setArchiveForm({ ...archiveForm, youtube_id: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>

                <div>
                  <label className="text-ivory/80 font-medium block mb-1">View Count Display</label>
                  <Input
                    placeholder="e.g. 18.5K"
                    value={archiveForm.views}
                    onChange={(e) => setArchiveForm({ ...archiveForm, views: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="archive-published"
                  checked={archiveForm.published}
                  onChange={(e) => setArchiveForm({ ...archiveForm, published: e.target.checked })}
                  className="rounded border-gold/40 text-gold focus:ring-gold bg-[#1A0004]"
                />
                <label htmlFor="archive-published" className="text-xs text-ivory font-medium cursor-pointer">
                  Publicly visible on website live page
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setShowArchiveModal(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={savingArchive} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {savingArchive ? 'Saving...' : editingArchive ? 'Save Changes' : 'Add Recording'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Archive Modal */}
      <ConfirmModal
        isOpen={!!deletingArchive}
        onClose={() => setDeletingArchive(null)}
        onConfirm={confirmDeleteArchive}
        title="Delete Broadcast Recording"
        message={`Are you sure you want to delete the recording for "${deletingArchive?.title}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingLoading}
      />
    </div>
  );
}

