import React, { useEffect } from 'react';
import { PageHeader, Section } from '../components/PageLayout';
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
      <PageHeader 
        title="Contact Us"
        subtitle="Get in touch with NAACUS"
      />
      <Section>
        <Contact />
      </Section>
    </PageWrapper>
  );
}
