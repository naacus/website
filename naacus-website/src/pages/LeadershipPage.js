import React, { useEffect } from 'react';
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
      <Leadership />
    </PageWrapper>
  );
}
