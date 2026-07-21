# NAACUS Website — Structure Documentation

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 21, 2026 | [← Docs Index](../readme.md)

---

## 1. Overview

The NAACUS website is a **React 19** single-page application (SPA) built with:

| Technology | Purpose |
|---|---|
| **React 19 + React Router 6** | UI framework & client-side routing |
| **Fluent UI v9** (`@fluentui/react-components`) | Design system / component library |
| **i18next** | Internationalization (English & French) |
| **MSAL / Microsoft Graph** | Microsoft 365 authentication & integration |
| **Microsoft Copilot Studio** | AI chatbot assistant |
| **Google Analytics 4** | Analytics & tracking |
| **Azure Static Web Apps** | Hosting & deployment |

---

## 2. Top-Level Repository Layout

```
/
├── docs/                          # Project documentation (see docs/readme.md)
│   ├── engineering/               # Developer & IT guides
│   ├── project/                   # Project management & trackers
│   └── stakeholders/              # Board & community-facing docs
├── naacus-website/                # Main React application
│   ├── public/                    # Static assets served as-is
│   ├── server/                    # Local API server (Node.js)
│   ├── src/                       # Application source code
│   ├── build/                     # Production build output
│   └── package.json
├── website-backend/               # Java backend (Maven project)
│   └── target/                    # Compiled classes
├── staticwebapp.config.json       # Azure Static Web Apps config
├── package.json                   # Root package.json
├── API_IMPLEMENTATION_GUIDE.md
├── BACKEND_API_CONTRACT.md
├── STRIPE_INTEGRATION_GUIDE.md
├── deployment.md
└── readme.md
```

---

## 3. Frontend Application (`naacus-website/`)

### 3.1 Entry Points

| File | Description |
|---|---|
| `src/index.js` | ReactDOM render entry, imports `App` and `i18n` |
| `src/App.js` | Root component — sets up `FluentProvider`, `Router`, analytics, global layout, and locale-driven route metadata (title/description) |
| `src/i18n.js` | i18next initialization (language detection, HTTP backend for JSON translations) |

### 3.2 Routes (defined in `App.js`)

| Path | Page Component | Description |
|---|---|---|
| `/` | `HomePage` | Landing page with hero carousel, benefits, testimonials, gallery, newsletter, contact |
| `/about` | `AboutPage` | About the organization |
| `/leadership` | `LeadershipPage` | Leadership team profiles |
| `/fellowship-ministries` | `FellowshipMinistriesPage` | Ministries overview |
| `/ministries/:id` | `MinistryDetail` | Individual ministry details (dynamic route) |
| `/programs-activities` | `ProgramsActivitiesPage` | Programs & activities listing |
| `/2025` | `Event2025Page` | NAACUS 2025 conference event page |
| `/events` | `EventsPage` | All events listing |
| `/membership` | `MembershipPage` | Membership registration & plans |
| `/volunteer` | `VolunteerPage` | Volunteer sign-up |
| `/donation` | `DonationPage` | Donation / giving page |
| `/resources` | `ResourcesPage` | Downloadable resources |
| `/newsletters` | `NewslettersPage` | Newsletter archive |
| `/contact` | `ContactPage` | Contact form |
| `/feedback` | `FeedbackPage` | Feedback submission |
| `/faq` | `FAQPage` | Frequently asked questions |
| `/privacy` | `PrivacyPage` | Privacy policy |
| `*` | `NotFoundPage` | 404 catch-all |

### 3.3 Global Layout Components

These components render on **every page** (outside `<Routes>`):

- **`Header`** — Top navigation bar with language switcher and search
- **`Footer`** — Site-wide footer with links and branding
- **`BackToTop`** — Scroll-to-top floating button
- **`ChatWidget`** — AI chatbot (Copilot Studio integration)
- **`CookieConsent`** — GDPR cookie consent banner
- **`ErrorBoundary`** — React error boundary wrapping the entire app

---

## 4. Source Code Organization (`src/`)

```
src/
├── App.js                  # Root component, routing, analytics
├── App.css                 # Global styles
├── i18n.js                 # i18next configuration
├── index.js                # React DOM entry point
├── index.css               # Base CSS reset
├── components/             # Reusable UI components
├── config/                 # App configuration files
├── data/                   # Static data files
├── hooks/                  # Custom React hooks
├── pages/                  # Page-level components (one per route)
├── services/               # API & business logic services
└── utils/                  # Utility functions
```

### 4.1 Components (`src/components/`)

#### Core UI Components

| Component | Purpose |
|---|---|
| `Hero.js` | Hero banner / carousel slide |
| `Conference2027Teaser.js` | Conference 2027 teaser carousel slide |
| `Conference.js` | Conference section |
| `MemberBenefits.js` | Membership benefits showcase |
| `Testimonials.js` | Testimonials carousel/section |
| `Gallery.js` | Photo gallery |
| `Newsletter.js` | Newsletter sign-up section |
| `Contact.js` | Contact form section |
| `About.js` | About section |
| `Leadership.js` | Leadership team display |
| `Ministries.js` | Ministries grid |
| `MinistryDetail.js` | Individual ministry detail view |
| `Objectives.js` | Organization objectives |
| `Programs.js` | Programs listing |
| `Resources.js` | Resources listing |
| `WhatWeDo.js` | What-we-do section |
| `WhoWeServe.js` | Who-we-serve section |
| `ParishFinder.js` | Parish/church finder tool |

#### Interactive / Dialog Components

| Component | Purpose |
|---|---|
| `DonationDialog.js` | Donation form dialog |
| `RegistrationDialog.js` | Event registration dialog |
| `SearchModal.js` | Full-screen search modal |
| `SearchInput.js` | Search input field |

#### Payment Components

| Component | Purpose |
|---|---|
| `StripeCheckout.js` | Stripe checkout form |
| `StripeDonateButton.js` | Stripe donation button |
| `PaymentMethodSelector.js` | Multi-provider payment method selector |

#### Layout / Utility Components

| Component | Purpose |
|---|---|
| `Header.js` | Site header / navigation |
| `Footer.js` | Site footer |
| `BackToTop.js` | Scroll-to-top button |
| `ChatWidget.js` | AI chatbot widget |
| `CookieConsent.js` | Cookie consent banner |
| `ErrorBoundary.js` | Error boundary wrapper |
| `LanguageSwitcher.js` | EN/FR language toggle |
| `PageWrapper.js` | Common page layout wrapper |
| `Newsletters.js` | Newsletter archive list |

#### Sub-directories

| Directory | Contents |
|---|---|
| `components/events/` | `Events.js`, `EventCard.js`, `FeaturedEventCard.js` — Event listing components |
| `components/naacus2025/` | `Naacus2025Accomplishments.js`, `index.js` — 2025 conference-specific components |

### 4.2 Pages (`src/pages/`)

Each file corresponds to a route listed in §3.2:

| Page | File |
|---|---|
| Home | `HomePage.js` |
| About | `AboutPage.js` |
| Leadership | `LeadershipPage.js` |
| Fellowship & Ministries | `FellowshipMinistriesPage.js` |
| Programs & Activities | `ProgramsActivitiesPage.js` |
| Events | `EventsPage.js` |
| NAACUS 2025 Event | `Event2025Page.js` |
| Membership | `MembershipPage.js` |
| Volunteer | `VolunteerPage.js` |
| Donation | `DonationPage.js` |
| Resources | `ResourcesPage.js` |
| Newsletters | `NewslettersPage.js` |
| Contact | `ContactPage.js` |
| Feedback | `FeedbackPage.js` |
| FAQ | `FAQPage.js` |
| Privacy Policy | `PrivacyPage.js` |
| Analytics Dashboard | `AnalyticsDashboard.js` |
| 404 Not Found | `NotFoundPage.js` |

### 4.3 Configuration (`src/config/`)

| File | Purpose |
|---|---|
| `theme.js` | **Source of truth** for colors, typography, spacing, Fluent UI custom theme |
| `designTokens.js` | Legacy shim re-exporting from `theme.js` for backward compatibility |
| `apiConfig.js` | Backend API base URL, headers, request helper |
| `authConfig.js` | MSAL / Azure AD auth configuration |
| `msalConfig.js` | MSAL instance configuration |
| `copilotStudioConfig.js` | Copilot Studio Direct Line bot integration settings |
| `membershipPricingConfig.js` | Membership plan definitions & pricing (Individual, Group Small, Group Large) |
| `siteLinks.js` | External URLs (YouTube channel, calendar link) |

### 4.4 Data (`src/data/`)

Static data files consumed by components:

| File | Data |
|---|---|
| `activitiesData.js` | Programs and activities |
| `eventsData.js` | General events |
| `naacus2025EventsData.js` | 2025 conference events |
| `faqData.js` | FAQ questions & answers |
| `galleryData.js` | Photo gallery items |
| `leadershipData.js` | Leadership team profiles |
| `memberBenefitsData.js` | Membership benefit descriptions |
| `ministriesData.js` | Ministry directory |
| `newslettersData.js` | Newsletter archive entries |
| `resourcesData.js` | Downloadable resources |
| `resourcesQuickLinks.js` | Quick-link resources |
| `testimonialData.js` *(deprecated)* | Member testimonials *(moved to Decap CMS)* |

### 4.5 Services (`src/services/`)

Business logic and API integration layer:

#### Entity CRUD Services (mock data stores until backend integration)

| Service | Domain |
|---|---|
| `membershipService.js` | Membership registration |
| `volunteerService.js` | Volunteer sign-ups |
| `newsletterService.js` | Newsletter subscriptions |
| `contactService.js` | Contact form submissions |
| `donationService.js` | Donation processing |
| `eventService.js` | Event management |
| `faqService.js` | FAQ data access |
| `mockData.js` | In-memory mock data stores |

#### Payment Services

| Service | Provider |
|---|---|
| `stripePaymentService.js` | Stripe payments |
| `stripeService.js` | Stripe API integration |
| `bankTransferPaymentService.js` | Bank transfer payments |
| `cashAppPaymentService.js` | Cash App payments |
| `cryptoPaymentService.js` | Cryptocurrency payments |

#### Integration Services

| Service | Integration |
|---|---|
| `chatbotService.js` | Chatbot messaging |
| `copilotStudioService.js` | Microsoft Copilot Studio Direct Line |
| `m365Service.js` | Microsoft 365 / Graph API |
| `m365AnalyticsService.js` | M365 analytics |
| `googleAnalyticsService.js` | Google Analytics 4 initialization |
| `analyticsService.js` | Custom analytics (page views, scroll depth, refresh tracking) |

#### Utility Services

| Service | Purpose |
|---|---|
| `navigationService.js` | Programmatic navigation helpers |
| `searchService.js` | Site-wide search |
| `parishService.js` | Parish finder data |
| `countryService.js` | Country list / lookup |
| `dataService.js` | Generic data fetch helpers |
| `index.js` | Central re-export barrel file |

### 4.6 Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useAnalytics.js` | Analytics tracking (page views, events) |
| `useParishFinder.js` | Parish finder state & logic |

### 4.7 Utilities (`src/utils/`)

| File | Purpose |
|---|---|
| `highlightUtils.js` | Text highlighting for search results |

---

## 5. Static Assets (`public/`)

```
public/
├── index.html                 # HTML shell (SPA entry)
├── manifest.json              # PWA manifest
├── robots.txt                 # Search engine directives
├── backend-api-contract.html  # API contract documentation
├── favicon.ico                # Favicon
├── *.png                      # Favicon variants (Android, Apple, 16x16, 32x32, 512x512)
├── icons/                     # App icons
├── images/
│   ├── hero/                  # Hero banner images
│   ├── leadership/            # Leadership team photos
│   └── naacus-logo.png        # Organization logo
├── locales/
│   ├── en/translation.json    # Generated English translation bundle
│   ├── en/pages/*.json        # English page-section source files (CMS-editable)
│   ├── fr/translation.json    # Generated French translation bundle
│   └── fr/pages/*.json        # French page-section source files (CMS-editable)
└── naacus2025/
    ├── photos/                # 2025 conference photos
    ├── testimonials/          # 2025 testimonial media
    └── videos/                # 2025 conference videos
```

---

## 6. Local API Server (`server/`)

| File | Description |
|---|---|
| `api-server.js` | Node.js HTTP server for event registrations via Microsoft Graph API (app-only flow). Handles SharePoint list operations for conference registration data. |

**Run with:** `npm run start:api` (port 5001 by default)

---

## 7. Backend (`website-backend/`)

A **Java/Maven** backend project (under development). The compiled output lives in `target/`. See `BACKEND_API_CONTRACT.md` for the planned API endpoints.

---

## 8. Deployment & Hosting

| Concern | Detail |
|---|---|
| **Platform** | Azure Static Web Apps |
| **Config** | `staticwebapp.config.json` — SPA fallback rewrite to `index.html`, MIME types, path exclusions |
| **Build Command** | `npm run build` (creates `build/` directory and copies `staticwebapp.config.json`) |
| **Dev Server** | `npm start` (Create React App dev server, port 3000) |
| **API Server** | `npm run start:api` (local Node.js server, port 5001) |

---

## 9. Internationalization (i18n)

- Runtime translations load from `public/locales/<lang>/translation.json`.
- Canonical editable locale sources are page files under `public/locales/<lang>/pages/*.json` (Decap-managed).
- `npm run sync:locale-sections` rebuilds `translation.json` from page-section source files and runs automatically in `prestart` and `prebuild`.
- Supported locales: English (`en`) and French (`fr`).
- Language preference is stored in localStorage.
- **Detection:** `localStorage` → browser `navigator` language
- **Switcher:** `LanguageSwitcher` component in the header

---

## 10. Theming & Design System

- **UI Library:** Fluent UI v9 (`@fluentui/react-components`)
- **Custom Theme:** Defined in `src/config/theme.js`
  - Colors: royal/cobalt blue (`#1428A0`), leafy green (`#4a9900` / `#76D000`), gold (`#C8A000`)
  - Typography scales
  - Spacing system
  - Border radii, shadows, gradients
- **Legacy Compat:** `src/config/designTokens.js` re-exports from `theme.js`

---

## 11. Authentication & Integrations

| Integration | Config File | Description |
|---|---|---|
| **Azure AD / MSAL** | `authConfig.js`, `msalConfig.js` | Microsoft 365 sign-in and Graph API access |
| **Copilot Studio** | `copilotStudioConfig.js` | AI chatbot via Direct Line API |
| **Stripe** | `paymentConfig.js` | Credit/debit, Apple Pay, Google Pay |
| **Google Analytics 4** | `googleAnalyticsService.js` | Event tracking, page views |

---

## 12. Membership Plans

| Plan | Price | Billing |
|---|---|---|
| Individual | $20 | Annual |
| Group (2–100 members) | $200 | One-time |
| Group (100+ members) | $300 | One-time |

---

## 13. NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `start` | `react-scripts start` | Start dev server |
| `build` | `react-scripts build && cp staticwebapp.config.json build/` | Production build |
| `test` | `react-scripts test` | Run test suite |
| `lint` | `eslint src/**/*.js` | Lint source files |
| `start:api` | `node server/api-server.js` | Start local API server |

---

## 14. Related Documentation

| Document | Description |
|---|---|
| [quickstart.md](quickstart.md) | Getting started guide |
| [deployment.md](deployment.md) | Deployment instructions |
| [payments.md](payments.md) | Payment integration details |
| [ga4_analytics.md](ga4_analytics.md) | Google Analytics 4 setup |
| [backend_api.md](backend_api.md) | Backend API guide |
