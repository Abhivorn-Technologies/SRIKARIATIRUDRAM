'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { RefreshCw } from 'lucide-react';

export default function DevoteeAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useDevoteeAuth();

  // Public un-authenticated pages under /account
  const isPublicAuthPage =
    pathname.includes('/account/login') ||
    pathname.includes('/account/verify-otp');

  useEffect(() => {
    if (!isLoading && !session && !isPublicAuthPage) {
      router.push('/account/login');
    }
  }, [isLoading, session, isPublicAuthPage, router]);

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

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 py-16">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
        <p className="font-cinzel text-xs font-bold text-gold-light">Redirecting to Sign In / Sign Up...</p>
      </div>
    );
  }

  return <>{children}</>;
}
