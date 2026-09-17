'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { RefreshCw } from 'lucide-react';

export default function DevoteeAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useDevoteeAuth();

  // Public un-authenticated pages under /account
  const isPublicAuthPage =
    pathname.includes('/account/login') ||
    pathname.includes('/account/verify-otp');

  if (isPublicAuthPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 py-16">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
        <p className="font-cinzel text-xs font-bold text-gold-light">Loading Devotee Portal...</p>
      </div>
    );
  }

  return <>{children}</>;
}
