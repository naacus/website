import React, { useEffect } from 'react';
import PrayerLibrary from '../components/PrayerLibrary';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

export default function PrayerLibraryPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('PrayerLibraryPage');
  }, [trackPageViewEvent]);
  return (
    <PageWrapper>
      <PrayerLibrary />
    </PageWrapper>
  );
}
