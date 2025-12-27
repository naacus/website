import React, { useEffect } from 'react';
import { Events } from '../components/events/Events';
import { useAnalytics } from '../hooks/useAnalytics';

function EventsPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('EventsPage');
  }, [trackPageViewEvent]);
  return <Events />;
}

export default EventsPage;
