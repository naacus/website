/**
 * Analytics Service - Track user CTAs and interactions
 * Purpose: Collect data on user behavior to understand conversion paths
 * Integrates with Google Analytics 4 for cloud analytics
 * Also stores locally in localStorage for backup/offline tracking
 * Usage: Import and use useAnalytics hook in components
 * 
 * NOTE: M365 integration disabled on localhost due to CORS/OAuth limitations
 * M365 requires backend implementation. Will be re-enabled when backend is ready.
 */

import {
  trackCTAInGA,
  trackPageViewInGA,
  trackFormInGA,
  trackDownloadInGA,
  trackScrollInGA,
  trackMinistryInterest,
} from './googleAnalyticsService';

import {
  trackCTAInM365,
  trackPageViewInM365,
  trackFormInM365,
  trackDownloadInM365,
  trackScrollInM365,
  isM365AnalyticsAvailable,
} from './m365AnalyticsService';

// Feature flag: Disable M365 until backend is implemented
// Client Credentials OAuth cannot work in browser (CORS + security issues)
const ENABLE_M365_ANALYTICS = false;

// CTA Categories
export const CTA_CATEGORIES = {
  MEMBERSHIP: 'membership',
  VOLUNTEER: 'volunteer',
  EVENT: 'event',
  CONTACT: 'contact',
  RESOURCE: 'resource',
  MINISTRY: 'ministry',
  NEWSLETTER: 'newsletter',
  NAVIGATION: 'navigation',
  DONATION: 'donation',
  OTHER: 'other',
};

// Event types
export const EVENT_TYPES = {
  CTA_CLICK: 'cta_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  PAGE_VIEW: 'page_view',
  SCROLL_TO_SECTION: 'scroll_to_section',
  DOWNLOAD: 'download',
  PAGE_REFRESH: 'page_refresh',
  SCROLL_DEPTH: 'scroll_depth',
};

/**
 * Track a CTA event
 * @param {string} category - CTA category from CTA_CATEGORIES
 * @param {string} action - Specific action (button text, link text, etc.)
 * @param {string} label - Additional label (page, section, destination)
 * @param {object} metadata - Additional metadata (optional)
 */
export const trackCTAEvent = async (category, action, label, metadata = {}) => {
  // Send to Google Analytics
  trackCTAInGA(category, action, label);

  // Send to M365 SharePoint (if configured and enabled)
  if (ENABLE_M365_ANALYTICS && isM365AnalyticsAvailable()) {
    try {
      await trackCTAInM365(category, action, label, metadata);
    } catch (error) {
      console.error('📊 Error sending CTA to M365:', error);
    }
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 CTA Event:', {
      category,
      action,
      label,
      url: window.location.pathname,
    });
  }
};

/**
 * Track page view
 * @param {string} pageName - Name of the page/section
 */
export const trackPageView = async (pageName) => {
  // Send to Google Analytics
  trackPageViewInGA(pageName);

  // Send to M365 SharePoint (if configured and enabled)
  if (ENABLE_M365_ANALYTICS && isM365AnalyticsAvailable()) {
    try {
      await trackPageViewInM365(pageName, document.title);
    } catch (error) {
      console.error('📊 Error sending page view to M365:', error);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📄 Page View:', pageName);
  }
};

/**
 * Track scroll to section
 * @param {string} sectionId - ID of the section scrolled to
 */
export const trackScrollToSection = async (sectionId) => {
  await trackCTAEvent(
    CTA_CATEGORIES.NAVIGATION,
    'scroll_to_section',
    sectionId,
    { sectionId }
  );
  // Also send directly to GA
  trackScrollInGA(sectionId);
  
  // Send to M365 SharePoint (if configured and enabled)
  if (ENABLE_M365_ANALYTICS && isM365AnalyticsAvailable()) {
    try {
      await trackScrollInM365(sectionId);
    } catch (error) {
      console.error('📊 Error sending scroll to M365:', error);
    }
  }
};

/**
 * Track resource download
 * @param {string} resourceName - Name of the resource being downloaded
 * @param {string} resourceType - Type of resource (pdf, doc, image, etc.)
 */
export const trackDownload = async (resourceName, resourceType = '') => {
  // Send to Google Analytics
  trackDownloadInGA(resourceName, resourceType);

  // Send to M365 SharePoint (if configured and enabled)
  if (ENABLE_M365_ANALYTICS && isM365AnalyticsAvailable()) {
    try {
      await trackDownloadInM365(resourceName, resourceType);
    } catch (error) {
      console.error('📊 Error sending download to M365:', error);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📥 Download Event:', resourceName, resourceType);
  }
};

/**
 * Track form interaction
 * @param {string} formName - Name of the form
 * @param {string} eventType - 'start' or 'submit'
 * @param {object} formData - Form data (optional, sanitized)
 */
export const trackFormEvent = async (formName, eventType, formData = {}) => {
  // Send to Google Analytics
  trackFormInGA(formName, eventType);

  // Send to M365 SharePoint (if configured and enabled)
  if (ENABLE_M365_ANALYTICS && isM365AnalyticsAvailable()) {
    try {
      await trackFormInM365(formName, eventType === 'start' ? EVENT_TYPES.FORM_START : EVENT_TYPES.FORM_SUBMIT);
    } catch (error) {
      console.error('📊 Error sending form event to M365:', error);
    }
  }

  // Only log form_submit events to avoid console spam from form_start
  if (process.env.NODE_ENV === 'development' && eventType === 'submit') {
    console.log('📝 Form Event:', eventType === 'start' ? 'form_start' : 'form_submit', formName);
  }
};



/**
 * Track page refresh/reload
 */
export const trackPageRefresh = async () => {
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_refresh', {
      page_path: window.location.pathname,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Page Refresh:', window.location.pathname);
  }
};

/**
 * Track scroll depth (25%, 50%, 75%, 100%)
 */
let scrollDepthTracked = new Set();

export const trackScrollDepth = async () => {
  const scrollPercentage = Math.round(
    ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
  );

  const milestones = [25, 50, 75, 100];
  const milestone = milestones.find(
    m => scrollPercentage >= m && !scrollDepthTracked.has(m)
  );

  if (milestone) {
    scrollDepthTracked.add(milestone);

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'scroll_depth', {
        page_path: window.location.pathname,
        scroll_depth: milestone,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📜 Scroll Depth:', milestone + '%');
    }
  }
};

/**
 * Reset scroll depth tracking (call when page changes)
 */
export const resetScrollDepthTracking = () => {
  scrollDepthTracked.clear();
};

/**
 * Track ministry interest
 * @param {string} ministryName - Name of the ministry
 * @param {string} action - Action taken (view, email_click, etc.)
 */
export const trackMinistryEvent = (ministryName, action = 'view') => {
  trackMinistryInterest(ministryName, action);

  if (process.env.NODE_ENV === 'development') {
    console.log('🏛️ Ministry Interest:', ministryName, action);
  }
};








