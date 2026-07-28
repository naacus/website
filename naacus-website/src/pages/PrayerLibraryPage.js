import React, { useEffect } from 'react';
import { PageHeader, Section } from '../components/PageLayout';
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
      <PageHeader 
        title="Prayer Library"
        subtitle="Spiritual resources and guided prayers"
      />
      <Section>
        <PrayerLibrary />
      </Section>
    </PageWrapper>
  );
}
