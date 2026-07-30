import React, { useEffect } from 'react';
import Contact from '../components/Contact';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ContactPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('ContactPage');
  }, [trackPageViewEvent]);
  return (
    <PageWrapper>
      <Contact />
    </PageWrapper>
  );
}
