# NAACUS Website

Official website for the **National Association of African Catholics in the United States**.

**Live:** https://polite-pebble-0f00f890f.4.azurestaticapps.net

---

## Quick Start

```bash
cd naacus-website
npm install
npm start
```

Visit http://localhost:3000

---

## Documentation

### For Everyone

| Document | Description |
|---|---|
| [Website Overview](DOCS/WEBSITE_OVERVIEW.md) | Non-technical overview of the website — pages, features, and how it all works |
| [Features & User Stories](DOCS/FEATURES_AND_USER_STORIES.md) | All 94 user stories organized by feature, with current status |
| [Release Schedule](DOCS/RELEASE_SCHEDULE.md) | 6-release phased delivery plan with timelines and priorities |

### For Developers

| Document | Description |
|---|---|
| [Quick Start Guide](DOCS/QUICKSTART.md) | Dev environment setup and local development |
| [Website Structure](DOCS/WEBSITE_STRUCTURE.md) | Full technical architecture — routes, components, services, config |
| [Deployment Guide](DOCS/DEPLOYMENT.md) | Azure/Netlify/Vercel deployment, M365 integration, env vars |
| [Google Analytics Setup](DOCS/GA4_SETUP.md) | GA4 configuration and event tracking reference |
| [Payments Guide](DOCS/PAYMENTS.md) | All payment methods — Stripe, PayPal, bank, crypto, Cash App |
| [Backend API Guide](DOCS/BACKEND_API.md) | REST API spec, endpoints, Dataverse schema, implementation checklist |
| [Data Persistence Guide](DOCS/DATA_PERSISTENCE_GUIDE.md) | Azure persistence recommendations for all `naacus-website/src/data` files |

### Other

| Document | Description |
|---|---|
| [Frontend App README](naacus-website/README.md) | Create React App documentation |

---

## Key Features

- Multi-language support (English / French)
- 17 pages covering About, Leadership, Ministries, Events, Membership, Volunteering, Donations, Resources, Newsletters, FAQ, and more
- Donation system with 7 payment methods (Stripe, PayPal, Apple Pay, Google Pay, bank transfer, crypto, Cash App)
- AI chat assistant (local FAQ matching + Copilot Studio ready)
- Google Analytics 4 tracking with in-app dashboard
- Event registration and management
- Membership registration with parish finder
- Volunteer sign-up forms
- Global site search with relevance scoring
- Cookie consent and privacy compliance
- Responsive design (desktop, tablet, mobile)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 6 |
| **UI Library** | Fluent UI v9 |
| **i18n** | i18next |
| **Analytics** | Google Analytics 4 |
| **Payments** | Stripe, PayPal, Apple Pay, Google Pay |
| **AI Chat** | Microsoft Copilot Studio (Direct Line) |
| **Auth** | MSAL / Azure AD |
| **Backend** | Node.js API server (event registration) |
| **Hosting** | Azure Static Web Apps |

---

## Project Status

| Area | Status |
|---|---|
| Frontend UI (all 17 pages) | **Complete** |
| Internationalization (EN/FR) | **Complete** |
| Google Analytics | **Complete (live)** |
| Site search | **Complete** |
| Cookie consent | **Complete** |
| Stripe Buy Button (donations) | **Complete (live)** |
| Local FAQ chatbot | **Complete** |
| Multi-method payment UI | **UI complete — backend needed** |
| Membership / Volunteer / Contact forms | **UI complete — backend needed** |
| Backend REST API | **Not started** |
| Admin panel | **Not started** |
| Test coverage | **Minimal (3 test files)** |

See [Features & User Stories](DOCS/FEATURES_AND_USER_STORIES.md) for the full breakdown and [Release Schedule](DOCS/RELEASE_SCHEDULE.md) for the delivery plan.

---

## Deploy

Auto-deploys on push to `develop` branch.

---

**Built with love for the NAACUS community**

*Together with Christ — Uniting African Catholic communities across the United States.*
