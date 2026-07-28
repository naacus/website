import React, { useEffect } from 'react';
import { PageHeader, Section } from '../components/PageLayout';
import Leadership from '../components/Leadership';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

export default function LeadershipPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('LeadershipPage');
  }, [trackPageViewEvent]);

  return (
    <PageWrapper>
      <PageHeader 
        title="Leadership"
        subtitle="Meet the NAACUS leadership team"
      />
      <Section>
        <Leadership />
      </Section>
    </PageWrapper>
  );
}
