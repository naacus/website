# Quick Start Guide

## Setup

### Prerequisites
- Node.js 16+ (v18 LTS recommended)
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

Auto-deploys to **Azure Static Web Apps** on push to `develop` branch.

## More Documentation

- **Full project structure:** [WEBSITE_STRUCTURE.md](WEBSITE_STRUCTURE.md)
- **Analytics:** [GA4_SETUP.md](GA4_SETUP.md)
- **Payments:** [PAYMENTS.md](PAYMENTS.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Backend API:** [BACKEND_API.md](BACKEND_API.md)
