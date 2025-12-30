// Microsoft 365 Integration Service
// Handles storing form data to SharePoint Lists or OneDrive Excel

import { PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { msalConfig, sharePointScopes, sharePointConfig } from '../config/msalConfig';

// App-only Graph client (no user prompt) for public submissions
let appGraphClient = null;
let appTokenCache = null;
let appTokenExpiresAt = null;

// Check if Azure AD is configured
const hasAzureConfig = !!(
  process.env.REACT_APP_AZURE_CLIENT_ID && 
  process.env.REACT_APP_AZURE_TENANT_ID
);

// Initialize MSAL instance only if configured
let msalInstance = null;
let msalInitPromise = null;

if (hasAzureConfig) {
  msalInstance = new PublicClientApplication(msalConfig);
  msalInitPromise = msalInstance.initialize().catch((error) => {
    console.error('Error initializing MSAL:', error);
    throw error;
  });
}

async function ensureMsalInitialized() {
  if (!hasAzureConfig) {
    throw new Error('Azure AD is not configured. Please set REACT_APP_AZURE_CLIENT_ID and REACT_APP_AZURE_TENANT_ID environment variables.');
  }
  if (msalInitPromise) {
    await msalInitPromise;
  }
}

/**
 * Get an authenticated Microsoft Graph client
 */
async function getGraphClient() {
  try {
    // Ensure MSAL is initialized
    await ensureMsalInitialized();
    
    // Get the account
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length === 0) {
      // No user signed in, perform interactive login
      const loginResponse = await msalInstance.loginPopup(sharePointScopes);
      const account = loginResponse.account;
      
      // Acquire token silently
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...sharePointScopes,
        account: account,
      });
      
      // Create Graph client with access token
      return Client.init({
        authProvider: (done) => {
          done(null, tokenResponse.accessToken);
        },
      });
    } else {
      // User already signed in
      const account = accounts[0];
      
      // Acquire token silently
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...sharePointScopes,
        account: account,
      });
      
      // Create Graph client with access token
      return Client.init({
        authProvider: (done) => {
          done(null, tokenResponse.accessToken);
        },
      });
    }
  } catch (error) {
    console.error('Error getting Graph client:', error);
    throw error;
  }
}

// Get app-only access token using client credentials (no user login)
async function getAppAccessToken() {
  if (appTokenCache && appTokenExpiresAt && Date.now() < appTokenExpiresAt - 300000) {
    return appTokenCache;
  }

  const hasSecretConfig = !!(
    process.env.REACT_APP_AZURE_CLIENT_ID &&
    process.env.REACT_APP_AZURE_TENANT_ID &&
    sharePointConfig.clientSecret
  );

  if (!hasSecretConfig) {
    throw new Error('Azure app credentials not configured for app-only access.');
  }

  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}/oauth2/v2.0/token`;
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.REACT_APP_AZURE_CLIENT_ID,
      client_secret: sharePointConfig.clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error getting app-only token:', error);
    throw new Error('Unable to get app-only token for SharePoint');
  }

  const data = await response.json();
  appTokenCache = data.access_token;
  appTokenExpiresAt = Date.now() + data.expires_in * 1000;
  return appTokenCache;
}

async function getAppGraphClient() {
  if (appGraphClient) return appGraphClient;

  await getAppAccessToken();
  appGraphClient = Client.init({
    authProvider: async (done) => {
      try {
        const refreshedToken = await getAppAccessToken();
        done(null, refreshedToken);
      } catch (error) {
        done(error, null);
      }
    },
  });

  return appGraphClient;
}

/**
 * Get SharePoint site ID from site URL
 */
async function getSiteId(graphClient, siteUrl) {
  try {
    const site = await graphClient
      .api(`/sites/${siteUrl}`)
      .get();
    return site.id;
  } catch (error) {
    console.error('Error getting site ID:', error);
    throw error;
  }
}

/**
 * Submit membership form data to SharePoint List
 */
export async function submitMembershipToSharePoint(formData) {
  try {
    // Validate configuration
    if (!process.env.REACT_APP_AZURE_CLIENT_ID || !process.env.REACT_APP_AZURE_TENANT_ID) {
      return {
        success: false,
        error: 'Azure credentials not configured. Please set REACT_APP_AZURE_CLIENT_ID and REACT_APP_AZURE_TENANT_ID environment variables.',
      };
    }

    if (!sharePointConfig.siteUrl || !sharePointConfig.membershipListId) {
      return {
        success: false,
        error: 'SharePoint configuration not set. Please set REACT_APP_SHAREPOINT_SITE_URL and REACT_APP_MEMBERSHIP_LIST_ID environment variables.',
      };
    }

    const graphClient = await getGraphClient();
    const siteId = await getSiteId(graphClient, sharePointConfig.siteUrl);

    // Prepare list item data
    const listItem = {
      fields: {
        Title: `${formData.firstName} ${formData.lastName}`,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        DateOfBirth: formData.dateOfBirth || null,
        Street: formData.street,
        City: formData.city,
        State: formData.state,
        ZipCode: formData.zipCode,
        Country: formData.country,
        ParishName: formData.parishName,
        Diocese: formData.diocese || '',
        ParishCity: formData.parishCity || '',
        ParishState: formData.parishState || '',
        CountryOfOrigin: formData.countryOfOrigin || '',
        YearsInUS: formData.yearsInUS || '',
        Occupation: formData.occupation || '',
        Skills: formData.skills || '',
        MembershipType: formData.membershipType,
        MinistryInterests: formData.ministryInterests.join('; '),
        EmergencyContactName: formData.emergencyName || '',
        EmergencyRelationship: formData.emergencyRelationship || '',
        EmergencyPhone: formData.emergencyPhone || '',
        CommunicationPreferences: formData.communicationPreferences.join('; '),
        HearAboutUs: formData.hearAbout || '',
        WhyJoin: formData.whyJoin || '',
        SubmissionDate: new Date().toISOString(),
      },
    };

    // Add item to SharePoint list
    const response = await graphClient
      .api(`/sites/${siteId}/lists/${sharePointConfig.membershipListId}/items`)
      .post(listItem);

    return { success: true, data: response };
  } catch (error) {
    console.error('Error submitting to SharePoint:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit volunteer form data to SharePoint List
 */
export async function submitVolunteerToSharePoint(formData) {
  try {
    const graphClient = await getGraphClient();
    const siteId = sharePointConfig.siteUrl ? await getSiteId(graphClient, sharePointConfig.siteUrl) : null;
    
    if (!siteId || !sharePointConfig.volunteerListId) {
      console.error('SharePoint site or list not configured');
      return { success: false, error: 'SharePoint not configured' };
    }

    // Prepare list item data
    const listItem = {
      fields: {
        Title: `${formData.firstName} ${formData.lastName}`,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        City: formData.city,
        State: formData.state,
        ZipCode: formData.zipCode || '',
        LanguagesSpoken: formData.languagesSpoken || '',
        Skills: formData.skills || '',
        VolunteerInterests: formData.volunteerInterests.join('; '),
        Availability: formData.availability.join('; '),
        TimePreference: formData.timePreference || '',
        HoursPerMonth: formData.hoursPerMonth,
        PreviousExperience: formData.previousExperience || '',
        PreferredRole: formData.preferredRole || '',
        SpecialSkills: formData.specialSkills || '',
        BackgroundCheckConsent: formData.backgroundCheckConsent,
        EmergencyContactName: formData.emergencyName || '',
        EmergencyPhone: formData.emergencyPhone || '',
        WhyVolunteer: formData.whyVolunteer,
        SubmissionDate: new Date().toISOString(),
      },
    };

    // Add item to SharePoint list
    const response = await graphClient
      .api(`/sites/${siteId}/lists/${sharePointConfig.volunteerListId}/items`)
      .post(listItem);

    return { success: true, data: response };
  } catch (error) {
    console.error('Error submitting to SharePoint:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit event registration data to SharePoint List
 */
export async function submitEventRegistrationToSharePoint(formData) {
  try {
    if (!process.env.REACT_APP_AZURE_CLIENT_ID || !process.env.REACT_APP_AZURE_TENANT_ID || !sharePointConfig.clientSecret) {
      return {
        success: false,
        error: 'Azure credentials not configured. Please set REACT_APP_AZURE_CLIENT_ID, REACT_APP_AZURE_TENANT_ID, and REACT_APP_AZURE_CLIENT_SECRET environment variables.',
      };
    }

    if (!sharePointConfig.siteUrl || !sharePointConfig.eventRegistrationListId) {
      return {
        success: false,
        error: 'SharePoint configuration not set. Please set REACT_APP_SHAREPOINT_SITE_URL and REACT_APP_EVENT_REGISTRATION_LIST_ID environment variables.',
      };
    }

    const graphClient = await getAppGraphClient();
    const siteId = await getSiteId(graphClient, sharePointConfig.siteUrl);

    const listItem = {
      fields: {
        Title: `${formData.firstName} ${formData.lastName} - ${formData.eventTitle}`,
        EventTitle: formData.eventTitle,
        EventDate: formData.eventDate || '',
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone || '',
        Message: formData.message || '',
        SubmittedAt: formData.submittedAt || new Date().toISOString(),
      },
    };

    const response = await graphClient
      .api(`/sites/${siteId}/lists/${sharePointConfig.eventRegistrationListId}/items`)
      .post(listItem);

    return { success: true, data: response };
  } catch (error) {
    console.error('Error submitting event registration to SharePoint:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Alternative: Submit data to OneDrive Excel file
 * This is useful if you prefer Excel over SharePoint Lists
 */
export async function submitToExcel(fileId, worksheetName, rowData) {
  try {
    const graphClient = await getGraphClient();
    
    // Add row to Excel table
    const response = await graphClient
      .api(`/me/drive/items/${fileId}/workbook/worksheets/${worksheetName}/tables/Table1/rows`)
      .post({
        values: [rowData],
      });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error submitting to Excel:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
}

/**
 * Sign in user
 */
export async function signIn() {
  try {
    const response = await msalInstance.loginPopup(sharePointScopes);
    return { success: true, account: response.account };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      await msalInstance.logoutPopup({ account: accounts[0] });
    }
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
}
