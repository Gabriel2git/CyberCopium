'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initPostHog, capturePageView } from '@/lib/posthog';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    const query = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
    const url = query ? `${pathname}?${query}` : pathname;

    capturePageView({
      pathname,
      url,
    });
  }, [pathname]);

  return null;
}
