import React, { useEffect } from 'react';
import { Section } from '../components/PageLayout';
import Ministries from '../components/Ministries';
import { useAnalytics } from '../hooks/useAnalytics';

export default function FellowshipMinistriesPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('FellowshipMinistriesPage');
  }, [trackPageViewEvent]);

  return (
    <Section>
      <Ministries />
    </Section>
  );
}
