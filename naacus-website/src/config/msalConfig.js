// Microsoft Authentication Library (MSAL) Configuration
// This file contains the configuration for authenticating with Microsoft 365

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || '', // Azure App Registration Client ID
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || 'common'}`, // Azure AD Tenant ID
    redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin, // Redirect URI after authentication
  },
  cache: {
    cacheLocation: 'sessionStorage', // Store tokens in session storage
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge
  },
};

// Permissions (scopes) required for Microsoft Graph API
export const loginRequest = {
  scopes: ['User.Read'], // Basic user profile read
};

// Scopes for SharePoint List operations
export const sharePointScopes = {
  scopes: [
    'Sites.ReadWrite.All', // Read and write to SharePoint sites
    'User.Read', // Read user profile
  ],
};

// Scopes for OneDrive Excel operations
export const oneDriveScopes = {
  scopes: [
    'Files.ReadWrite.All', // Read and write files in OneDrive
    'User.Read', // Read user profile
  ],
};

// Microsoft Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphSitesEndpoint: 'https://graph.microsoft.com/v1.0/sites',
};

// SharePoint configuration
export const sharePointConfig = {
  siteUrl: process.env.REACT_APP_SHAREPOINT_SITE_URL || '', // Your SharePoint site URL (e.g., 'contoso.sharepoint.com:/sites/naacus')
  membershipListId: process.env.REACT_APP_MEMBERSHIP_LIST_ID || '', // SharePoint List ID for membership
  volunteerListId: process.env.REACT_APP_VOLUNTEER_LIST_ID || '', // SharePoint List ID for volunteers
  eventRegistrationListId: process.env.REACT_APP_EVENT_REGISTRATION_LIST_ID || '', // SharePoint List ID for event registrations
  clientSecret: process.env.REACT_APP_AZURE_CLIENT_SECRET || '', // Client secret for app-only Graph calls (no user prompt)
};

// OneDrive Excel configuration (alternative to SharePoint Lists)
export const oneDriveConfig = {
  membershipFileId: process.env.REACT_APP_MEMBERSHIP_FILE_ID || '', // OneDrive Excel file ID for membership
  volunteerFileId: process.env.REACT_APP_VOLUNTEER_FILE_ID || '', // OneDrive Excel file ID for volunteers
  worksheetName: 'Submissions', // Default worksheet name
};
