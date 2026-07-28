import React, { useEffect } from 'react';
import { PageHeader, Section } from '../components/PageLayout';
import Programs from '../components/Programs';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

function ProgramsActivitiesPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('ProgramsActivitiesPage');
  }, [trackPageViewEvent]);

  return (
    <PageWrapper>
      <PageHeader 
        title="Programs & Activities"
        subtitle="Explore our community programs"
      />
      <Section>
        <Programs />
      </Section>
    </PageWrapper>
  );
}

export default ProgramsActivitiesPage;
