'use client';

import React, { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A0003] text-[#FFF8E8] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md bg-[#2D0008] border border-[#C99A3D]/40 p-8 rounded-2xl shadow-2xl">
        <span className="text-5xl font-bold text-[#C99A3D]">⚠️</span>
        <h2 className="text-2xl font-bold font-serif text-[#FFE082]">Something went wrong</h2>
        <p className="text-sm text-[#FFF8E8]/70">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-[#C99A3D] text-[#1A0003] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#E5B558] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#3D0A14] text-[#FFF8E8] border border-[#C99A3D]/40 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#4E0E1B] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
