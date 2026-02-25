# NAACUS Website — Release Schedule

> **Last updated:** February 25, 2026

---

## Release Strategy

The website will be delivered in **6 releases** over approximately **6 months**. Each release ships a coherent set of user stories that deliver real value on their own. Earlier releases focus on connecting existing frontend work to a real backend, while later releases add new capabilities.

### Principles

1. **Ship what's visible first** — The frontend is already built; connect it to real services before building new UI.
2. **One payment provider at a time** — Get Stripe fully working before adding PayPal, crypto, etc.
3. **Progressive backend buildout** — Start with the highest-impact API endpoints (contact, newsletter, membership).
4. **Test as you go** — Each release includes testing stories for the features it ships.
5. **Admin tools come last** — Self-service admin requires a stable backend foundation.

---

## Release 1 — Foundation & Quick Wins

**Theme:** Connect high-traffic forms to real backend services; protect the site with basic tests.

**Target:** Month 1 (Weeks 1–4)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F8.1-01 | Contact form submissions saved to backend | Contact | High |
| F8.1-02 | Admin can track contact submissions | Contact | High |
| F8.2-01 | Newsletter subscription connected to backend | Newsletter | High |
| F8.2-02 | Unsubscribe / update preferences works end-to-end | Newsletter | Medium |
| F14-03 | REST API for contact submissions | Backend | High |
| F14-04 | REST API for newsletter subscriptions | Backend | High |
| F15-01 | Unit tests for contact and newsletter services | Testing | Medium |
| F9-01 | Chatbot FAQ matching (already done — verify) | Chat | Low |
| F9-02 | Chatbot answers about NAACUS topics (already done — verify) | Chat | Low |

**Deliverables:**
- Backend API endpoints: `POST/GET /api/v1/contacts`, `POST/DELETE /api/v1/newsletters`
- Newsletter component connected to `newsletterService` (currently only `console.log`)
- Contact form connected to backend (currently mock)
- 10+ new unit tests

**Definition of Done:**
- Visitor submits contact form → data persists in database → admin can retrieve it
- Visitor subscribes to newsletter → email stored in database
- All new code has unit tests

---

## Release 2 — Membership & Registration

**Theme:** Enable end-to-end membership registration with real payment and data persistence.

**Target:** Month 2 (Weeks 5–8)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F5.2-01 | Multi-step membership form (already done — verify) | Membership | High |
| F5.2-05 | Membership submitted to backend/SharePoint | Membership | High |
| F14-01 | REST API for memberships (CRUD) | Backend | High |
| F6.2-02 | Credit/debit card payment via Stripe (full flow) | Payments | High |
| F14-07 | Stripe webhook handling for payment confirmation | Backend | High |
| F5.3-01 | Admin can view all membership registrations | Membership Admin | Medium |
| F5.3-02 | Admin can approve/reject membership applications | Membership Admin | Medium |
| F5.3-03 | Admin can search and filter memberships | Membership Admin | Medium |
| F15-02 | Component tests for membership form | Testing | Medium |
| F13-01 | Membership registrations saved to SharePoint (if Azure credentials available) | M365 | Low |

**Deliverables:**
- Backend API endpoints: `POST/GET/PUT/DELETE /api/v1/memberships`
- Stripe payment intent creation + webhook handler
- Membership form → Stripe payment → database record (complete flow)
- 15+ new tests (unit + component)

**Definition of Done:**
- Visitor completes membership form → pays via Stripe → membership saved to database
- Admin can view/approve/reject memberships via API
- Stripe webhook confirms payment status

---

## Release 3 — Donations & Volunteer

**Theme:** Enable multi-method donations and connect volunteer applications to the backend.

**Target:** Month 3 (Weeks 9–12)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F6.2-01 | Preset and custom donation amounts | Donations | High |
| F6.2-03 | PayPal donations (full flow) | Payments | High |
| F6.2-04 | Apple Pay donations | Payments | Medium |
| F6.2-05 | Google Pay donations | Payments | Medium |
| F14-02 | REST API for donations | Backend | High |
| F14-08 | PayPal server-side order verification | Backend | High |
| F6.3-01 | Admin can view all donations | Donations Admin | Medium |
| F6.3-02 | Donation statistics (total, average, count) | Donations Admin | Medium |
| F6.3-03 | Donation receipt/confirmation for donors | Donations | Medium |
| F7-03 | Volunteer applications saved to backend | Volunteering | High |
| F14-06 | REST API for volunteer applications | Backend | High |
| F7-04 | Admin can view and manage volunteer applications | Volunteering Admin | Medium |
| F15-03 | Integration tests for payment flows | Testing | Medium |

**Deliverables:**
- Backend API endpoints: `POST/GET /api/v1/donations`, `POST/GET /api/v1/volunteers`
- PayPal order creation + capture + verification
- Apple Pay / Google Pay via Stripe Payment Request API
- Donation receipt generation (email or downloadable PDF)
- Volunteer form → backend persistence
- 15+ new tests

**Definition of Done:**
- Donor can give via Stripe card, PayPal, Apple Pay, or Google Pay → payment confirmed → receipt provided
- Volunteer submits application → saved to database → admin can view it
- End-to-end payment tests pass

---

## Release 4 — Events & M365 Integration

**Theme:** Full event lifecycle management and Microsoft 365 connectivity.

**Target:** Month 4 (Weeks 13–16)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F4.2-01 | Event registration form saves to backend | Events | High |
| F4.2-02 | Registration confirmation for attendees | Events | High |
| F4.2-03 | Event registrations saved to SharePoint | Events | Medium |
| F4.3-01 | Admin can create, update, delete events via API | Events Admin | High |
| F4.3-02 | Admin can manage event registrations (view, approve) | Events Admin | Medium |
| F14-05 | REST API for events (CRUD) | Backend | High |
| F13-02 | Volunteer applications saved to SharePoint | M365 | Medium |
| F13-03 | Event registrations saved to SharePoint via API server | M365 | Medium |
| F13-04 | Microsoft 365 sign-in (MSAL authentication) | M365 | Medium |
| F6.2-06 | Bank transfer donations | Payments | Low |
| F6.2-07 | Cryptocurrency donations | Payments | Low |
| F6.2-08 | Cash App donations | Payments | Low |

**Deliverables:**
- Backend API endpoints: `POST/GET/PUT/DELETE /api/v1/events`, `POST/GET /api/v1/event-registrations`
- SharePoint integration for memberships, volunteers, and event registrations
- MSAL sign-in flow for visitors with Microsoft accounts
- Bank transfer, crypto, and Cash App payment flows (stretch)
- 10+ new tests

**Definition of Done:**
- Admin creates event → visitor registers → confirmation sent → registration in database + SharePoint
- Visitors can sign in with Microsoft 365 account
- All SharePoint integrations working with real credentials

---

## Release 5 — AI Chat & Testing Hardening

**Theme:** Upgrade the chatbot to Copilot Studio and significantly increase test coverage.

**Target:** Month 5 (Weeks 17–20)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F9-03 | Copilot Studio AI chatbot (natural language) | Chat | High |
| F9-04 | Chat conversations logged to SharePoint | Chat | Medium |
| F13-05 | M365 analytics integration | M365 | Low |
| F15-01 | Unit tests for all remaining services | Testing | High |
| F15-02 | Component tests for all forms | Testing | High |
| F15-04 | Accessibility tests (WCAG compliance) | Testing | High |
| F15-05 | Automated E2E tests for critical journeys | Testing | Medium |

**Deliverables:**
- Copilot Studio bot connected via Direct Line API
- Chat conversation logging to SharePoint
- 50+ new tests across unit, component, accessibility, and E2E
- WCAG audit report with fixes

**Definition of Done:**
- Chatbot uses Copilot Studio for intelligent, context-aware answers
- All forms have component-level tests
- Site passes WCAG 2.1 AA automated checks
- E2E tests cover: home page load, membership registration, donation, event registration, contact form

---

## Release 6 — Admin Panel & Content Management

**Theme:** Give non-technical admins self-service tools to manage the website.

**Target:** Month 6 (Weeks 21–24)

| ID | User Story | Feature | Priority |
|---|---|---|---|
| F16-01 | Secure admin panel with role-based access | Admin | High |
| F16-02 | Admin can update hero banner images | Admin | Medium |
| F16-03 | Admin can add/edit/remove events from UI | Admin | High |
| F16-04 | Admin can manage newsletter campaigns | Admin | Medium |
| F16-05 | Admin can update FAQ content without code changes | Admin | Medium |
| F16-06 | Admin can upload and manage gallery photos | Admin | Medium |

**Deliverables:**
- Admin panel (protected route, role-based access via MSAL)
- CRUD UI for events, FAQs, gallery, newsletters
- Image upload to Azure Blob Storage or OneDrive
- Content changes reflect on the public site immediately

**Definition of Done:**
- Admin logs in → manages events, FAQs, gallery, newsletters → changes visible on public site
- Non-technical team members can use the admin panel without developer assistance

---

## Release Timeline Summary

```
Month 1        Month 2        Month 3        Month 4        Month 5        Month 6
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Release 1│  │ Release 2│  │ Release 3│  │ Release 4│  │ Release 5│  │ Release 6│
│          │  │          │  │          │  │          │  │          │  │          │
│ Contact  │  │Membership│  │Donations │  │ Events   │  │ AI Chat  │  │ Admin    │
│Newsletter│  │ Stripe   │  │ PayPal   │  │ M365     │  │ Testing  │  │ Panel    │
│ Backend  │  │ Webhooks │  │ Volunteer│  │ Auth     │  │  WCAG    │  │ CMS      │
│ Tests    │  │  Tests   │  │  Tests   │  │ Alt Pay  │  │  E2E     │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## Story Count by Release

| Release | Stories | New | Already Done (verify) |
|---|---|---|---|
| **Release 1** — Foundation & Quick Wins | 9 | 7 | 2 |
| **Release 2** — Membership & Registration | 10 | 9 | 1 |
| **Release 3** — Donations & Volunteer | 13 | 13 | 0 |
| **Release 4** — Events & M365 Integration | 11 | 11 | 0 |
| **Release 5** — AI Chat & Testing Hardening | 7 | 7 | 0 |
| **Release 6** — Admin Panel & Content Management | 6 | 6 | 0 |
| **Total** | **56** | **53** | **3** |

> **Note:** 38 user stories with status "Done" or "Live" are already shipped and not included in the release schedule. The 94 total stories minus the 38 already done leaves 56 stories to schedule, plus 3 that need verification.

---

## Risk & Dependencies

| Risk | Impact | Mitigation |
|---|---|---|
| Azure credentials not available | Blocks M365 stories (Release 2, 4) | Proceed with standalone database; add SharePoint sync later |
| Stripe account not fully configured | Blocks payment stories (Release 2, 3) | Use Stripe test mode; switch to live keys at go-live |
| Copilot Studio license/setup delayed | Blocks AI chat upgrade (Release 5) | Local FAQ chatbot remains functional as fallback |
| No dedicated backend developer | Slows all releases | Prioritize Release 1–2 endpoints; consider serverless functions (Azure Functions) as alternative |
| Content updates require code changes | Frustrates admins until Release 6 | Provide admin with clear instructions for data file edits; accelerate Release 6 if needed |

---

## How to Use This Schedule

1. **Before each release:** Review the stories, confirm priorities, and adjust scope if needed.
2. **During each release:** Track stories using the project board (GitHub Issues or Azure DevOps).
3. **At release end:** Demo the completed features to stakeholders and gather feedback.
4. **Between releases:** Apply bug fixes and minor improvements as patches (e.g., v1.0.1, v1.0.2).

Each release should be tagged in Git (e.g., `v1.0.0`, `v2.0.0`) and deployed to the production Azure Static Web App.
