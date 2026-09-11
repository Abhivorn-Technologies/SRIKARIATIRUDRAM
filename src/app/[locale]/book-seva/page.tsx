'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function BookSevaRootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  useEffect(() => {
    const qs = searchParams.toString();
    const destination = qs ? `/${locale}/book-seva/date?${qs}` : `/${locale}/book-seva/date`;
    router.replace(destination);
  }, [locale, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#35030A] flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-[#D6A532] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-cinzel text-[#F2C14E] tracking-wider">
          Loading Seva Booking...
        </p>
      </div>
    </div>
  );
}
