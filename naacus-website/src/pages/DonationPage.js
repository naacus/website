import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * DonationPage - A redirect page for Google Ads campaigns
 * Automatically navigates to the home page donation section
 */
function DonationPage() {
  const navigate = useNavigate();
  const { trackCTA } = useAnalytics();

  useEffect(() => {
    // Track the donation page visit from campaign
    trackCTA('campaign_landing', 'Donation Page Visit', 'donation_campaign');

    navigate('/#donate', { replace: true });
  }, [navigate, trackCTA]);

  return null; // No UI needed as we immediately redirect
}

export default DonationPage;
