'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

const YOUTUBE_SONG_ID = 'gFzfO-Uyt7M';

export function BackgroundAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (!isLoaded) return null;

  // YouTube embed URL with infinite loop (loop=1&playlist=VIDEO_ID)
  const embedUrl = `https://www.youtube.com/embed/${YOUTUBE_SONG_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_SONG_ID}&enablejsapi=1&controls=0&mute=${isMuted ? 1 : 0}`;

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50">
      {/* Hidden YouTube Iframe for Infinite Background Audio */}
      {isPlaying && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Sacred Background Chanting"
          allow="autoplay; encrypted-media"
          className="w-0 h-0 opacity-0 pointer-events-none absolute"
        />
      )}

      {/* Floating Sacred Audio Player Widget */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-burgundy-deep/95 border border-gold/40 shadow-gold-md backdrop-blur-md text-ivory transition-all hover:border-gold">
        {/* Equalizer / Music Icon */}
        <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold flex items-center justify-center shrink-0">
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 w-4 h-4">
              <span className="w-0.5 h-3 bg-gold animate-pulse" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 h-4 bg-gold-light animate-pulse" style={{ animationDuration: '0.4s' }} />
              <span className="w-0.5 h-2 bg-gold animate-pulse" style={{ animationDuration: '0.8s' }} />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-gold-light" />
          )}
        </div>

        {/* Title */}
        <div className="hidden sm:block text-left">
          <p className="text-[11px] font-bold text-gold-light tracking-wide uppercase font-cinzel leading-none">
            Sacred Devotional Chant
          </p>
          <p className="text-[9px] text-ivory/70 font-sans mt-0.5">Continuous Infinite Playback</p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-gold/20 text-gold-light transition-colors"
          title={isPlaying ? 'Pause Background Audio' : 'Play Background Audio'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-gold-light" />}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-gold/20 text-gold-light transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
}
