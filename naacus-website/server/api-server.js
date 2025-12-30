/*
 * Local API server for event registrations (app-only Graph flow)
 * Run with: npm run start:api (separate terminal)
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createServer } = require('http');
const { URL } = require('url');

const PORT = process.env.API_PORT || 5001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function normalizeSiteUrl(siteUrl) {
  if (!siteUrl) return '';
  let url = siteUrl.trim();
  // Remove protocol: https://naacus.sharepoint.com/sites/naacus-2027 → naacus.sharepoint.com/sites/naacus-2027
  url = url.replace(/^https?:\/\//i, '');
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  // Convert to Graph API format: naacus.sharepoint.com/sites/naacus-2027 → naacus.sharepoint.com:/sites/naacus-2027
  url = url.replace('/sites/', ':/sites/');
  return url;
}

// Cache for site ID to avoid repeated lookups
let cachedSiteId = null;
let cachedListSchema = null;

async function getListSchema(accessToken, siteId, listId) {
  if (cachedListSchema) return cachedListSchema;

  const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get list schema: ${response.status} ${text}`);
  }

  const data = await response.json();
  cachedListSchema = data.value;
  console.log('SharePoint list columns:', data.value.map(c => ({ 
    name: c.name, 
    displayName: c.displayName, 
    type: c.columnGroup,
    dataType: c.text ? 'text' : c.dateTime ? 'dateTime' : c.number ? 'number' : c.choice ? 'choice' : 'other'
  })));
  return cachedListSchema;
}

async function getSiteId(accessToken, siteUrl) {
  if (cachedSiteId) return cachedSiteId;

  const normalizedPath = normalizeSiteUrl(siteUrl);
  const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${normalizedPath}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get site ID: ${response.status} ${text}`);
  }

  const site = await response.json();
  cachedSiteId = site.id;
  return cachedSiteId;
}

async function getAppAccessToken() {
  const { REACT_APP_AZURE_CLIENT_ID, REACT_APP_AZURE_CLIENT_SECRET, REACT_APP_AZURE_TENANT_ID } = process.env;
  if (!REACT_APP_AZURE_CLIENT_ID || !REACT_APP_AZURE_CLIENT_SECRET || !REACT_APP_AZURE_TENANT_ID) {
    throw new Error('Missing Azure app credentials for client credentials flow');
  }

  const tokenEndpoint = `https://login.microsoftonline.com/${REACT_APP_AZURE_TENANT_ID}/oauth2/v2.0/token`;
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: REACT_APP_AZURE_CLIENT_ID,
      client_secret: REACT_APP_AZURE_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token request failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function addEventRegistration(registration) {
  const requiredEnv = ['REACT_APP_SHAREPOINT_SITE_URL', 'REACT_APP_EVENT_REGISTRATION_LIST_ID'];
  for (const key of requiredEnv) {
    if (!process.env[key]) throw new Error(`Missing env var ${key}`);
  }

  const accessToken = await getAppAccessToken();
  const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE_URL;
  const listId = process.env.REACT_APP_EVENT_REGISTRATION_LIST_ID;

  // Get the site ID first (cached after first call)
  const siteId = await getSiteId(accessToken, siteUrl);
  
  // Fetch list schema to see available columns
  const schema = await getListSchema(accessToken, siteId, listId);

  // Map to SharePoint internal column names (case-sensitive)
  const fields = {
    Title: `${registration.firstName || ''} ${registration.lastName || ''}`.trim() || 'Registration',
  };

  // Add fields based on schema to ensure they exist and are the right type
  const columnMap = schema.reduce((acc, col) => {
    acc[col.name] = col;
    return acc;
  }, {});

  // Helper to parse date strings for DateTime columns
  function parseEventDate(dateStr) {
    if (!dateStr) return null;
    // Try to parse "June 30 - July 4, 2027" -> extract start date
    const match = dateStr.match(/([A-Za-z]+\s+\d+).*?(\d{4})/);
    if (match) {
      const [, datepart, year] = match;
      const parsed = new Date(`${datepart}, ${year}`);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
    // Try direct parse
    const direct = new Date(dateStr);
    return !isNaN(direct.getTime()) ? direct.toISOString() : null;
  }

  // Add optional fields only if they exist in the list schema
  if (registration.firstName && columnMap.FirstName) fields.FirstName = registration.firstName;
  if (registration.lastName && columnMap.LastName) fields.LastName = registration.lastName;
  if (registration.email && columnMap.Email) fields.Email = registration.email;
  if (registration.phone && columnMap.Phone) fields.Phone = registration.phone;
  if (registration.eventTitle && columnMap.EventTitle) fields.EventTitle = registration.eventTitle;
  
  // Handle EventDate - convert to ISO if it's a dateTime column
  if (registration.eventDate && columnMap.EventDate) {
    if (columnMap.EventDate.dateTime) {
      // DateTime column - convert to ISO
      const isoDate = parseEventDate(registration.eventDate);
      if (isoDate) fields.EventDate = isoDate;
    } else {
      // Text column - send as-is
      fields.EventDate = String(registration.eventDate);
    }
  }
  
  if (registration.message && columnMap.Message) fields.Message = registration.message;

  console.log('Sending fields to SharePoint:', JSON.stringify(fields, null, 2));

  // Use site ID instead of path for more reliable access
  const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Graph request failed: ${response.status} ${text}`);
  }

  return response.json();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
  });
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/event-registration') {
    try {
      const body = await parseBody(req);
      await addEventRegistration(body);
      return sendJson(res, 200, { success: true });
    } catch (error) {
      console.error('API error:', error.message);
      return sendJson(res, 500, { success: false, error: error.message });
    }
  }

  sendJson(res, 404, { error: 'Not found' });
}).listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
