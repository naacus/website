import React, { useEffect } from 'react';
import { PageHeader, Section } from '../components/PageLayout';
import Newsletters from '../components/Newsletters';
import { useAnalytics } from '../hooks/useAnalytics';

function NewslettersPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('NewslettersPage');
  }, [trackPageViewEvent]);

  return (
    <>
      <PageHeader 
        title="Newsletters"
        subtitle="Stay connected with NAACUS updates"
      />
      <Section>
        <Newsletters />
      </Section>
    </>
  );
}

export default NewslettersPage;
