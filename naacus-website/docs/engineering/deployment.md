# Deployment Guide

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 16, 2026 | [← Docs Index](../readme.md)

---

**Live Site:** https://polite-pebble-0f00f890f.4.azurestaticapps.net

## Prerequisites

- Node.js 16+ (v18 LTS recommended)
- Azure account (for Microsoft 365 integration)
- Hosting platform account (Azure, Netlify, or Vercel)
- Domain name (optional but recommended)

## Local Development Setup

1. Clone and install:
   ```bash
   git clone https://github.com/naacus/website.git
   cd Daily-Meditation-Reminder/naacus-website
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000

---

## Option 1: Azure Static Web Apps (Recommended)

Auto-deploys on push to `develop` branch.

PR gate model:

- Security and quality workflows run on pull requests targeting `develop`.
- Deployment runs only after merge, on `push` to `develop`.
- Enforce this by marking PR checks as required in GitHub branch protection.

### Non-Developer Content Editing (Decap CMS)

This project includes a lightweight CMS at `/admin` so authorized editors can
update website images and selected text without touching code.

Current editable content:

- Hero slideshow images (`public/content/hero-images.json`)
- Hero text (EN/FR)
- FAQ page headline/search text (EN/FR)

How it works:

1. Editor opens `/admin` on the deployed site.
2. Editor authenticates with GitHub.
3. Changes are saved through editorial workflow (PR-based).
4. Maintainer reviews and merges PR, then deploy runs from `develop`.

Azure Static Web Apps routing note:

- Ensure `staticwebapp.config.json` excludes `/admin/*` (and `/*.yml`) from SPA
   fallback rewrites so Decap can load `/admin/config.yml` as YAML, not HTML.
- Add an explicit redirect from `/admin` to `/admin/` to prevent Decap from
   requesting `/config.yml` at the site root.

### Create Azure Static Web App

1. Sign in to [Azure Portal](https://portal.azure.com)
2. Create a resource → search "Static Web Apps" → Create
3. Configure:
   - **Resource Group**: Create new or select existing
   - **Name**: `naacus-website`
   - **Region**: Choose closest to Maryland
   - **Source**: GitHub
   - **Repository**: Select your repository
   - **Branch**: develop
   - **Build Presets**: React
   - **App location**: `/naacus-website`
   - **Output location**: `build`
4. Click "Review + create" → "Create"

### Custom Domain (Optional)

1. In Azure Static Web Apps → "Custom domains" → "Add"
2. Enter your domain name
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### Check Deployment Status

1. Visit https://github.com/naacus/website → **Actions** tab
2. Green ✅ = deployed, Red ❌ = failed

### GitHub Actions Runtime Note

To avoid GitHub Actions Node 20 action-runtime deprecation warnings, workflows
use `actions/setup-node@v5` (while project runtime can remain Node 20 for app
build/test compatibility).

### GitHub Advanced Security / Scorecard Note

The DevSecOps baseline workflow uploads SARIF for Trivy and Scorecard. To keep
Code Scanning configuration identity stable between feature branches and
develop:

- Trivy uses default workflow/job configuration identity (no custom category)
- Scorecard uses explicit category `scorecard`

Scorecard SARIF upload runs on non-PR events (`schedule`,
`workflow_dispatch`) to avoid PR-specific branch protection signal mismatch in
Code Scanning comparisons.

If you see a warning like "configuration not found" in a PR, ensure the branch
contains the latest `.github/workflows/devsecops-baseline.yml` and rerun checks.

### Manual Deploy

If auto-deploy fails:
1. Push to `develop` branch again
2. Or visit Azure Portal → Static Web Apps → Re-deploy

---

## Option 2: Netlify

### Quick Deploy

```bash
npm install -g netlify-cli
cd naacus-website
npm run build
netlify deploy --prod --dir=build
```

### GitHub Integration

1. Sign in to [Netlify](https://netlify.com) → "New site from Git"
2. Connect to GitHub and select repository
3. Configure:
   - **Base directory**: `naacus-website`
   - **Build command**: `npm run build`
   - **Publish directory**: `naacus-website/build`
4. Add environment variables in Site settings → Build & deploy → Environment

---

## Option 3: Vercel

### Quick Deploy

```bash
npm install -g vercel
cd naacus-website
vercel
```

### GitHub Integration

1. Sign in to [Vercel](https://vercel.com) → "Import Project"
2. Import from GitHub
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `naacus-website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

---

## Environment Variables

Add to `.env.local` (local) or your hosting platform's configuration:

```bash
# Azure AD Configuration
REACT_APP_AZURE_CLIENT_ID=<your-azure-ad-client-id>
REACT_APP_AZURE_TENANT_ID=<your-azure-ad-tenant-id>
REACT_APP_REDIRECT_URI=<your-deployment-url>

# Microsoft Copilot Studio (AI Chatbot)
REACT_APP_COPILOT_DIRECT_LINE_SECRET=<your-direct-line-secret>
REACT_APP_COPILOT_BOT_ID=<your-bot-id>

# M365 Integration
REACT_APP_ENABLE_M365_AUTH=false
REACT_APP_M365_CLIENT_ID=<your-client-id>
REACT_APP_M365_TENANT_ID=<your-tenant-id>

# SharePoint (Optional)
REACT_APP_SHAREPOINT_SITE_URL=<sharepoint-site-url>
REACT_APP_MEMBERSHIP_LIST_ID=<membership-list-id>
REACT_APP_VOLUNTEER_LIST_ID=<volunteer-list-id>

# Payments & Analytics
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_GA_MEASUREMENT_ID=G-0PWQTGEVJ6

# Optional
REACT_APP_GRAPH_API_ENDPOINT=https://graph.microsoft.com/v1.0
REACT_APP_APPINSIGHTS_CONNECTION_STRING=<app-insights-connection>
```

See `.env.example` for the complete list.

---

## Microsoft 365 Integration Setup

### Step 1: Register App in Azure AD

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click **New registration**
3. Configure:
   - **Name**: NAACUS Website
   - **Supported account types**: Multi-tenant
   - **Redirect URI**: Single-page application (SPA) → your deployment URL
4. Click **Register**
5. Note the **Application (client) ID** and **Directory (tenant) ID**

### Step 2: Configure API Permissions

1. In your app registration → **API permissions** → **Add a permission**
2. Select **Microsoft Graph** → **Delegated permissions**
3. Add: `User.Read`, `Mail.Send`, (optional) `Calendars.ReadWrite`, `Files.ReadWrite`
4. Click **Grant admin consent** (if you have admin rights)

### Step 3: Configure Authentication

1. In **Authentication** section, enable:
   - ✓ Access tokens
   - ✓ ID tokens
2. Add redirect URIs for all deployment URLs:
   - `http://localhost:3000`
   - `https://your-azure-app.azurestaticapps.net`
   - `https://your-custom-domain.com`

### Step 4: Update Application Code

The `src/config/authConfig.js` reads from environment variables automatically:
```javascript
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
  },
};
```

---

## Microsoft Copilot Studio (AI Chatbot)

1. Create bot at https://copilotstudio.microsoft.com
2. Enable Direct Line channel and get secret key
3. Set `REACT_APP_COPILOT_DIRECT_LINE_SECRET` environment variable
4. (Optional) Configure Azure AD for M365 authentication

The chatbot automatically falls back to local FAQ if Copilot Studio is not configured.

---

## Pre-Deployment Checklist

- [ ] Local development tested and working
- [ ] Build completes without errors (`npm run build`)
- [ ] All required environment variables configured
- [ ] Azure AD app registration complete (if using M365)
- [ ] Redirect URIs added for all deployment URLs
- [ ] All translations working (English/French)
- [ ] ChatWidget tested (both Copilot Studio and fallback modes)
- [ ] No sensitive data in source code
- [ ] Git repository clean and pushed to correct branch

## Post-Deployment Testing

1. Visit deployed URL
2. Verify all sections load (Header, Hero, About, Leadership, Programs, Gallery, Footer, Chat)
3. Test responsive design (desktop, tablet, mobile)
4. Test navigation and language switcher (EN/FR)
5. Test chatbot (click widget → send "Hello")
6. Test contact form submission

## Build Output

Static files built to `naacus-website/build/`
- Served from Azure CDN
- Cached globally

---

## Troubleshooting

### Build Fails
- Check Node.js version (v16+ required, v18 LTS recommended)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Verify all environment variables are set

### Deployment Stuck
- Check GitHub Actions for errors
- Ensure `naacus-website/package.json` exists

### Site Not Updating After Push
- Wait 5-10 minutes for deployment
- Clear browser cache (Ctrl+Shift+Del)

### Authentication Issues
- Verify client ID and tenant ID are correct
- Check redirect URIs match deployment URLs
- Ensure API permissions are granted

### Chatbot Not Responding
- Check console for "✅ Copilot Studio connected" or "⚠️ Using local FAQ fallback"
- Verify `REACT_APP_COPILOT_DIRECT_LINE_SECRET` is set
- Ensure bot is published (not in draft mode)

---

## Maintenance

- Regularly update dependencies: `npm audit && npm update`
- Monitor Azure AD sign-in logs
- Review API permission usage
- Use Azure Monitor / Netlify / Vercel dashboards for monitoring

---

Last Updated: December 2025
