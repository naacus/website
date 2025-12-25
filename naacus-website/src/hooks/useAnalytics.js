/**
 * useAnalytics Hook - Easy CTA tracking for React components
 * Usage: const { trackCTA, trackForm } = useAnalytics();
 *        trackCTA('membership', 'join_button_click', 'hero_section');
 */

import { useCallback } from 'react';
import {
  trackCTAEvent,
  trackFormEvent,
  trackScrollToSection,
  trackPageView,
  trackDownload,
  trackMinistryEvent,
  CTA_CATEGORIES,
} from '../services/analyticsService';

export const useAnalytics = () => {
  /**
   * Track a CTA click
   * @param {string} category - CTA category
   * @param {string} action - Button/link text or action name
   * @param {string} label - Page or section name
   * @param {object} metadata - Additional data
   */
  const trackCTA = useCallback((category, action, label, metadata = {}) => {
    trackCTAEvent(category, action, label, metadata);
  }, []);

  /**
   * Track membership-related CTAs
   */
  const trackMembershipCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.MEMBERSHIP, action, label);
    },
    [trackCTA]
  );

  /**
   * Track volunteer-related CTAs
   */
  const trackVolunteerCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.VOLUNTEER, action, label);
    },
    [trackCTA]
  );

  /**
   * Track event-related CTAs
   */
  const trackEventCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.EVENT, action, label);
    },
    [trackCTA]
  );

  /**
   * Track contact CTAs
   */
  const trackContactCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.CONTACT, action, label);
    },
    [trackCTA]
  );

  /**
   * Track ministry CTAs
   */
  const trackMinistryCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.MINISTRY, action, label);
    },
    [trackCTA]
  );

  /**
   * Track resource CTAs
   */
  const trackResourceCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.RESOURCE, action, label);
    },
    [trackCTA]
  );

  /**
   * Track newsletter CTAs
   */
  const trackNewsletterCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.NEWSLETTER, action, label);
    },
    [trackCTA]
  );

  /**
   * Track donation CTAs
   */
  const trackDonationCTA = useCallback(
    (action, label) => {
      trackCTA(CTA_CATEGORIES.DONATION, action, label);
    },
    [trackCTA]
  );

  /**
   * Track form interactions
   */
  const trackForm = useCallback((formName, eventType, formData = {}) => {
    trackFormEvent(formName, eventType, formData);
  }, []);

  /**
   * Track scroll navigation
   */
  const trackScroll = useCallback((sectionId) => {
    trackScrollToSection(sectionId);
  }, []);

  /**
   * Track resource downloads
   */
  const trackResourceDownload = useCallback((resourceName, resourceType = '') => {
    trackDownload(resourceName, resourceType);
  }, []);

  /**
   * Track page view
   */
  const trackPageViewEvent = useCallback((pageName) => {
    trackPageView(pageName);
  }, []);

  /**
   * Track ministry interest
   */
  const trackMinistry = useCallback((ministryName, action = 'view') => {
    trackMinistryEvent(ministryName, action);
  }, []);

  return {
    trackCTA,
    trackMembershipCTA,
    trackVolunteerCTA,
    trackEventCTA,
    trackContactCTA,
    trackMinistryCTA,
    trackResourceCTA,
    trackNewsletterCTA,
    trackDonationCTA,
    trackForm,
    trackScroll,
    trackResourceDownload,
    trackPageViewEvent,
    trackMinistry,
  };
};
