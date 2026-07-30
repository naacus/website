import React, { useEffect } from 'react';
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
      <Programs />
    </PageWrapper>
  );
}

export default ProgramsActivitiesPage;
