'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { Image as ImageIcon, Film, Upload, Trash2, Edit3, Plus, RefreshCw, X, AlertCircle } from 'lucide-react';

interface MediaAsset {
  id: string;
  name: string;
  title?: string;
  title_te?: string;
  description?: string;
  description_te?: string;
  media_type: 'image' | 'video';
  url: string;
  secure_url?: string;
  thumbnail_url?: string;
  category?: string;
  published: boolean;
}

export default function AdminGalleryPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter tabs: 'all', 'image', 'video'
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaAsset | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaAsset | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceMode, setSourceMode] = useState<'file' | 'link'>('file');

  const [formData, setFormData] = useState({
    title: '',
    title_te: '',
    description: '',
    description_te: '',
    media_type: 'image' as 'image' | 'video',
    url: '',
  });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/gallery', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      } else {
        setError(json.error || 'Failed to load gallery');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      title_te: '',
      description: '',
      description_te: '',
      media_type: 'image',
      url: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MediaAsset) => {
    setEditingItem(item);
    setSelectedFile(null);
    setFormData({
      title: item.title || item.name || '',
      title_te: item.title_te || '',
      description: item.description || '',
      description_te: item.description_te || '',
      media_type: item.media_type || 'image',
      url: item.secure_url || item.url || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Heading / Title is required', 'error');
      return;
    }

    try {
      setUploading(true);
      let fileUrl = formData.url;

      // Handle Direct File Upload (Convert file to data URL for MongoDB Atlas storage)
      if (selectedFile) {
        fileUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedFile);
        });
      }

      if (!fileUrl) {
        showToast('Please select a file to upload or enter a Media URL.', 'error');
        setUploading(false);
        return;
      }

      const payload = {
        name: formData.title,
        title: formData.title.trim(),
        title_te: formData.title_te.trim() || null,
        description: formData.description.trim() || null,
        description_te: formData.description_te.trim() || null,
        media_type: formData.media_type,
        category: 'general',
        url: fileUrl,
        secure_url: fileUrl,
        published: true,
      };

      if (editingItem) {
        const res = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          showToast('Media item updated successfully!', 'success');
          fetchGallery();
        } else {
          showToast(json.error || 'Failed to update media item', 'error');
        }
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          showToast('New media item added successfully!', 'success');
          fetchGallery();
        } else {
          showToast(json.error || 'Failed to add media item', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save media item', 'error');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeletingLoading(true);
      const res = await fetch(`/api/admin/gallery/${deletingItem.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
        showToast('Media item deleted successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to delete item', 'error');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setDeletingLoading(false);
      setDeletingItem(null);
    }
  };

  const filteredItems = items.filter((item) => {
    return mediaTypeFilter === 'all' || item.media_type === mediaTypeFilter;
  });

  const photoCount = items.filter((i) => i.media_type === 'image' || !i.media_type).length;
  const videoCount = items.filter((i) => i.media_type === 'video').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Photo & Video Gallery Manager
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Manage public website photo and video darshan cards (Heading, Subheading & File Upload).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGallery}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Photo / Video
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Media Type Filter Tabs */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mediaTypeFilter === 'all'
                ? 'bg-gold text-burgundy-dark border border-gold'
                : 'bg-burgundy-dark/60 text-ivory/70 border border-gold/20 hover:border-gold/40'
            }`}
          >
            All Media ({items.length})
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaTypeFilter === 'image'
                ? 'bg-gold text-burgundy-dark border border-gold'
                : 'bg-burgundy-dark/60 text-ivory/70 border border-gold/20 hover:border-gold/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos ({photoCount})
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mediaTypeFilter === 'video'
                ? 'bg-gold text-burgundy-dark border border-gold'
                : 'bg-burgundy-dark/60 text-ivory/70 border border-gold/20 hover:border-gold/40'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Videos ({videoCount})
          </button>
        </div>
      </Card>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item.id} className="bg-[#240006]/90 border-gold/20 overflow-hidden group hover:border-gold/50 transition-all flex flex-col justify-between">
              <div className="relative aspect-[4/3] w-full bg-black/60 overflow-hidden flex items-center justify-center">
                {item.media_type === 'video' ? (
                  <video
                    src={item.secure_url || item.url}
                    className="w-full h-full object-cover pointer-events-none"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.secure_url || item.url}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Media Type Badge */}
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-gold-lighter border border-gold/30 flex items-center gap-1">
                  {item.media_type === 'video' ? <Film className="w-3 h-3 text-gold" /> : <ImageIcon className="w-3 h-3 text-gold" />}
                  {item.media_type === 'video' ? 'VIDEO' : 'PHOTO'}
                </span>

              {/* Edit & Delete Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Item"
                    className="w-8 h-8 rounded-full bg-gold text-maroon font-bold flex items-center justify-center hover:bg-gold-light shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    title="Remove Item"
                    className="w-8 h-8 rounded-full bg-red-950 border border-red-500/50 text-red-300 flex items-center justify-center hover:bg-red-800 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Heading & Subheading matching Public Website */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-cinzel font-bold text-sm text-ivory group-hover:text-gold-light transition-colors">
                  {item.title || item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-ivory/70 line-clamp-2 font-sans">
                    {item.description}
                  </p>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ivory/50 italic bg-burgundy-deep/40 rounded-xl border border-gold/10">
            {loading ? 'Loading gallery media from database...' : 'No media items found.'}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">
                {editingItem ? 'Edit Gallery Item' : 'Add New Photo or Video'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Media Type Selector (Photo vs Video) */}
              <div>
                <label className="text-ivory/90 font-bold block mb-1.5">1. Select Media Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_type: 'image' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.media_type === 'image'
                        ? 'bg-gold text-maroon border-gold shadow-md font-black'
                        : 'bg-[#1A0004] text-ivory/70 border-gold/30 hover:border-gold/60'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Photo / Image
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_type: 'video' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.media_type === 'video'
                        ? 'bg-gold text-maroon border-gold shadow-md font-black'
                        : 'bg-[#1A0004] text-ivory/70 border-gold/30 hover:border-gold/60'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    Video
                  </button>
                </div>
              </div>

              {/* 2. Media Source Option (Choose File vs Direct Link) */}
              <div>
                <label className="text-ivory/90 font-bold block mb-1.5">2. Choose Upload Method *</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSourceMode('file')}
                    className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      sourceMode === 'file'
                        ? 'bg-gold/20 text-gold-lighter border-gold font-bold'
                        : 'bg-[#1A0004] text-ivory/60 border-gold/20 hover:border-gold/40'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Choose File (Upload)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceMode('link')}
                    className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      sourceMode === 'link'
                        ? 'bg-gold/20 text-gold-lighter border-gold font-bold'
                        : 'bg-[#1A0004] text-ivory/60 border-gold/20 hover:border-gold/40'
                    }`}
                  >
                    URL Link
                  </button>
                </div>

                {sourceMode === 'file' ? (
                  <div className="p-3 bg-[#1A0004] border border-dashed border-gold/40 rounded-xl space-y-2 text-center">
                    <input
                      type="file"
                      id="file-upload-input"
                      accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30 text-xs font-bold transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      {selectedFile ? selectedFile.name : `Choose ${formData.media_type === 'video' ? 'Video' : 'Photo'} File`}
                    </label>
                    <p className="text-[10px] text-ivory/60">
                      {selectedFile ? `Selected file: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)` : `Supported formats: ${formData.media_type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP'}`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Input
                      placeholder={formData.media_type === 'video' ? 'e.g. /assets/videos/v1.mp4 or https://...' : 'e.g. /assets/gallary/g1.png or https://...'}
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    />
                  </div>
                )}
              </div>

              {/* 3. Heading & Subheading Inputs */}
              <div>
                <label className="text-ivory/80 font-medium block mb-1">Heading / Title (English) *</label>
                <Input
                  required
                  placeholder="e.g. Sacred Yagasala & Kalasa Sthapana"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Heading / Title (Telugu)</label>
                <Input
                  placeholder="e.g. పవిత్ర యాగశాల & కలశ స్థాపన"
                  value={formData.title_te}
                  onChange={(e) => setFormData({ ...formData, title_te: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Subheading / Description (English)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sacred fire invocation and Kalasa Sthapana by Vedic Acharyas."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Subheading / Description (Telugu)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. వేద పండితులచే కలశ స్థాపన మరియు పవిత్ర అగ్ని ఆవాహన."
                  value={formData.description_te}
                  onChange={(e) => setFormData({ ...formData, description_te: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {uploading ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Media Item"
        message={`Are you sure you want to permanently delete "${deletingItem?.title || deletingItem?.name}" from the gallery?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingLoading}
      />
    </div>
  );
}



