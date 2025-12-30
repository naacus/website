// Microsoft 365 Analytics Service
// Stores analytics events to SharePoint Lists for historical tracking and audit
// Uses Application-Level Authentication (no user sign-in required)

import { Client } from '@microsoft/microsoft-graph-client';

let graphClient = null;
let tokenCache = null;
let tokenExpiresAt = null;

const hasM365Config = !!(
  process.env.REACT_APP_AZURE_CLIENT_ID &&
  process.env.REACT_APP_AZURE_TENANT_ID &&
  process.env.REACT_APP_AZURE_CLIENT_SECRET &&
  process.env.REACT_APP_ANALYTICS_LIST_ID
);

/**
 * Get access token using Client Credentials flow (no user sign-in required)
 */
async function getAccessToken() {
  // Return cached token if still valid (with 5 min buffer)
  if (tokenCache && tokenExpiresAt && Date.now() < tokenExpiresAt - 300000) {
    return tokenCache;
  }

  try {
    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}/oauth2/v2.0/token`;

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.REACT_APP_AZURE_CLIENT_ID,
        client_secret: process.env.REACT_APP_AZURE_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('📊 M365 token error:', error);
      return null;
    }

    const data = await response.json();
    tokenCache = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 M365 access token obtained');
    }

    return tokenCache;
  } catch (error) {
    console.error('📊 Error getting M365 access token:', error);
    return null;
  }
}

/**
 * Initialize Microsoft Graph client for analytics
 */
async function initializeGraphClient() {
  if (!hasM365Config) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ M365 analytics not configured. Set REACT_APP_AZURE_CLIENT_ID, REACT_APP_AZURE_TENANT_ID, REACT_APP_AZURE_CLIENT_SECRET, and REACT_APP_ANALYTICS_LIST_ID');
    }
    return null;
  }

  if (graphClient) {
    return graphClient;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return null;
    }

    graphClient = Client.init({
      authProvider: async (done) => {
        const token = await getAccessToken();
        done(null, token);
      },
    });

    return graphClient;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('📊 Error initializing M365 analytics:', error);
    }
    return null;
  }
}

/**
 * Get SharePoint site ID from site URL
 */
async function getSiteId(client, siteUrl) {
  try {
    // Format: domain.sharepoint.com/sites/sitename
    const site = await client.api(`/sites/${siteUrl}`).get();
    return site.id;
  } catch (error) {
    console.error('📊 Error getting SharePoint site ID:', error);
    return null;
  }
}

/**
 * Send analytics event to SharePoint Analytics List
 */
export async function sendToM365Analytics(eventData) {
  if (!hasM365Config) {
    return { success: false, reason: 'M365 not configured' };
  }

  try {
    const client = await initializeGraphClient();

    if (!client) {
      // M365 not available (token retrieval failed)
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 M365 analytics: Skipping (token unavailable)');
      }
      return { success: false, reason: 'M365 client not initialized' };
    }

    const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE_URL;
    if (!siteUrl) {
      return { success: false, reason: 'SharePoint site URL not configured' };
    }

    const siteId = await getSiteId(client, siteUrl);
    if (!siteId) {
      return { success: false, reason: 'Cannot resolve SharePoint site' };
    }

    // Prepare list item for analytics
    const listItem = {
      fields: {
        Title: `${eventData.eventType} - ${eventData.timestamp}`,
        EventType: eventData.eventType, // cta_click, form_start, form_submit, page_view, scroll_to_section, download
        EventTimestamp: eventData.timestamp,
        Category: eventData.category || '',
        Action: eventData.action || '',
        Label: eventData.label || '',
        PageURL: eventData.pageUrl || window.location.pathname,
        PageTitle: eventData.pageTitle || document.title,
        UserAgent: eventData.userAgent || navigator.userAgent,
        SessionId: eventData.sessionId || '',
        UserId: eventData.userId || '', // Optional: user identifier if available
        FormName: eventData.formName || '', // For form events
        ResourceName: eventData.resourceName || '', // For download events
        ResourceType: eventData.resourceType || '', // For download events
        SectionId: eventData.sectionId || '', // For scroll events
        CustomData: eventData.customData ? JSON.stringify(eventData.customData) : '', // Any additional data
        ReferrerURL: eventData.referrer || document.referrer || '',
      },
    };

    // Add item to SharePoint Analytics list
    const response = await client
      .api(`/sites/${siteId}/lists/${process.env.REACT_APP_ANALYTICS_LIST_ID}/items`)
      .post(listItem);

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event sent to M365:', eventData.eventType, response.id);
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('📊 Error sending to M365 analytics:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Track CTA click in M365
 */
export async function trackCTAInM365(category, action, label, metadata = {}) {
  const eventData = {
    eventType: 'cta_click',
    timestamp: new Date().toISOString(),
    category,
    action,
    label,
    pageUrl: window.location.pathname,
    pageTitle: document.title,
    userAgent: navigator.userAgent,
    customData: metadata,
  };

  return sendToM365Analytics(eventData);
}

/**
 * Track page view in M365
 */
export async function trackPageViewInM365(pageName, pageTitle) {
  const eventData = {
    eventType: 'page_view',
    timestamp: new Date().toISOString(),
    label: pageName,
    pageUrl: window.location.pathname,
    pageTitle: pageTitle || document.title,
    userAgent: navigator.userAgent,
  };

  return sendToM365Analytics(eventData);
}

/**
 * Track form event in M365
 */
export async function trackFormInM365(formName, eventType) {
  const eventData = {
    eventType: eventType, // form_start or form_submit
    timestamp: new Date().toISOString(),
    formName,
    pageUrl: window.location.pathname,
    pageTitle: document.title,
    userAgent: navigator.userAgent,
  };

  return sendToM365Analytics(eventData);
}

/**
 * Track download in M365
 */
export async function trackDownloadInM365(resourceName, resourceType) {
  const eventData = {
    eventType: 'download',
    timestamp: new Date().toISOString(),
    resourceName,
    resourceType,
    pageUrl: window.location.pathname,
    pageTitle: document.title,
    userAgent: navigator.userAgent,
  };

  return sendToM365Analytics(eventData);
}

/**
 * Track scroll event in M365
 */
export async function trackScrollInM365(sectionId) {
  const eventData = {
    eventType: 'scroll_to_section',
    timestamp: new Date().toISOString(),
    sectionId,
    pageUrl: window.location.pathname,
    pageTitle: document.title,
    userAgent: navigator.userAgent,
  };

  return sendToM365Analytics(eventData);
}

/**
 * Batch send multiple analytics events to M365 (for performance)
 */
export async function batchSendToM365(eventDataArray) {
  try {
    const client = await initializeGraphClient();
    if (!client) {
      return { success: false, reason: 'M365 client not initialized', failed: eventDataArray.length };
    }

    const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE_URL;
    if (!siteUrl) {
      return { success: false, reason: 'SharePoint site URL not configured', failed: eventDataArray.length };
    }

    const siteId = await getSiteId(client, siteUrl);
    if (!siteId) {
      return { success: false, reason: 'Cannot resolve SharePoint site', failed: eventDataArray.length };
    }

    let successCount = 0;
    let failureCount = 0;

    for (const eventData of eventDataArray) {
      try {
        const listItem = {
          fields: {
            Title: `${eventData.eventType} - ${eventData.timestamp}`,
            EventType: eventData.eventType,
            EventTimestamp: eventData.timestamp,
            Category: eventData.category || '',
            Action: eventData.action || '',
            Label: eventData.label || '',
            PageURL: eventData.pageUrl || window.location.pathname,
            PageTitle: eventData.pageTitle || document.title,
            UserAgent: eventData.userAgent || navigator.userAgent,
          },
        };

        await client
          .api(`/sites/${siteId}/lists/${process.env.REACT_APP_ANALYTICS_LIST_ID}/items`)
          .post(listItem);

        successCount++;
      } catch (itemError) {
        console.error('Error sending batch item to M365:', itemError);
        failureCount++;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 M365 batch send: ${successCount} success, ${failureCount} failed`);
    }

    return { success: successCount > 0, successCount, failureCount };
  } catch (error) {
    console.error('Error in batch M365 send:', error);
    return { success: false, error: error.message, failed: eventDataArray.length };
  }
}

/**
 * Check if M365 analytics is configured and available
 */
export function isM365AnalyticsAvailable() {
  return hasM365Config;
}

/**
 * Get M365 configuration status
 */
export function getM365ConfigStatus() {
  return {
    configured: hasM365Config,
    clientIdSet: !!process.env.REACT_APP_AZURE_CLIENT_ID,
    tenantIdSet: !!process.env.REACT_APP_AZURE_TENANT_ID,
    clientSecretSet: !!process.env.REACT_APP_AZURE_CLIENT_SECRET,
    analyticsListIdSet: !!process.env.REACT_APP_ANALYTICS_LIST_ID,
    siteUrlSet: !!process.env.REACT_APP_SHAREPOINT_SITE_URL,
  };
}

const m365AnalyticsService = {
  sendToM365Analytics,
  trackCTAInM365,
  trackPageViewInM365,
  trackFormInM365,
  trackDownloadInM365,
  trackScrollInM365,
  batchSendToM365,
  isM365AnalyticsAvailable,
  getM365ConfigStatus,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default m365AnalyticsService;
