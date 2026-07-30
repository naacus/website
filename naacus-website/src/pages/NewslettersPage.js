import React, { useEffect } from 'react';
import Newsletters from '../components/Newsletters';
import { useAnalytics } from '../hooks/useAnalytics';

function NewslettersPage() {
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('NewslettersPage');
  }, [trackPageViewEvent]);

  return <Newsletters />;
}

export default NewslettersPage;
