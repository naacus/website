# Quick Start Guide

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
cd naacus-website
npm install
npm start
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

## Project Structure

```
naacus-website/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # Business logic (GA, payments, etc.)
│   ├── hooks/              # React hooks (useAnalytics)
│   ├── data/               # Mock data (ministries, events, etc.)
│   ├── App.js              # Main app
│   └── index.js            # Entry point
├── public/                 # Static assets
└── package.json            # Dependencies
```

## Key Services

| Service | Purpose |
|---------|---------|
| `googleAnalyticsService.js` | GA4 event tracking |
| `analyticsService.js` | High-level analytics wrapper |
| `paymentService.js` | Stripe, bank, crypto payments |
| `m365Service.js` | SharePoint data storage |
| `dataService.js` | Mock data (ministries, events, etc.) |

## Common Tasks

**Add a new page:**
1. Create `src/pages/NewPage.js`
2. Add route in `App.js`

**Track an event:**
```javascript
const { trackCTA } = useAnalytics();
trackCTA('donation', 'button_click', 'hero_section');
```

**Modify ministries:**
Edit `src/data/ministriesData.js`

## Deployment

Configured for **Azure Static Web Apps** on push to `develop` branch.
See `.github/workflows/azure-static-web-apps-*.yml`

## Need Help?

- Analytics: See `DOCS/GA4_SETUP.md`
- Payments: See `DOCS/PAYMENTS.md`
- Deployment: See `DOCS/DEPLOYMENT.md`
