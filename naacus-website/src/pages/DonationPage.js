import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * DonationPage - A redirect page for Google Ads campaigns
 * Automatically navigates to the home page and triggers the donation dialog
 */
function DonationPage() {
  const navigate = useNavigate();
  const { trackCTA } = useAnalytics();

  useEffect(() => {
    // Track the donation page visit from campaign
    trackCTA('campaign_landing', 'Donation Page Visit', 'donation_campaign');

    // Trigger the donation dialog on home page
    // We'll navigate to home with a query parameter to signal opening the dialog
    navigate('/?openDonation=true', { replace: true });
  }, [navigate, trackCTA]);

  return null; // No UI needed as we immediately redirect
}

export default DonationPage;
