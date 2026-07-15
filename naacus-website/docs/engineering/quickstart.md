# Quick Start Guide

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 15, 2026 | [← Docs Index](../readme.md)

---

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

- **Full project structure:** [website_structure.md](website_structure.md)
- **Analytics:** [ga4_analytics.md](ga4_analytics.md)
- **Payments:** [payments.md](payments.md)
- **Deployment:** [deployment.md](deployment.md)
- **Backend API:** [backend_api.md](backend_api.md)
