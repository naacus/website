# NAACUS Website — Features & User Stories

> **Last updated:** February 25, 2026

---

## How to Read This Document

Each **feature** groups related functionality. Under each feature, **user stories** describe what a specific person needs to do and why. Stories follow the format:

> *As a [role], I want to [action] so that [benefit].*

### Roles

| Role | Description |
|---|---|
| **Visitor** | Anyone browsing the website (not logged in) |
| **Member** | A registered NAACUS member |
| **Donor** | Someone making a financial contribution |
| **Volunteer** | Someone offering to volunteer |
| **Admin** | NAACUS staff managing content and operations |
| **Developer** | Technical team maintaining the codebase |

### Story Status

| Status | Meaning |
|---|---|
| **Done** | Fully implemented and functional in production |
| **Live (3rd-party)** | Working via external service (e.g., Stripe Buy Button) |
| **UI Done — Backend Needed** | Frontend complete, needs server-side work to persist data |
| **Scaffolded** | Code structure exists but not functional end-to-end |
| **Not Started** | No implementation yet |

---

## Feature 1: Public Website & Navigation

### F1.1 — Site Navigation
| ID | User Story | Status |
|---|---|---|
| F1.1-01 | As a visitor, I want to see a navigation bar with all major sections so that I can quickly find what I need. | **Done** |
| F1.1-02 | As a mobile visitor, I want a hamburger menu so that I can navigate the site on my phone. | **Done** |
| F1.1-03 | As a visitor, I want the current page highlighted in the navigation so that I know where I am. | **Done** |
| F1.1-04 | As a visitor, I want a "Back to Top" button so that I can quickly scroll back up on long pages. | **Done** |
| F1.1-05 | As a visitor, I want a 404 page with helpful links so that I can find my way if I reach a broken link. | **Done** |

### F1.2 — Home Page
| ID | User Story | Status |
|---|---|---|
| F1.2-01 | As a visitor, I want to see a hero banner with a rotating slideshow so that I get an immediate sense of the organization. | **Done** |
| F1.2-02 | As a visitor, I want to see membership benefits on the home page so that I understand the value of joining. | **Done** |
| F1.2-03 | As a visitor, I want to read testimonials from real members so that I feel confident about the community. | **Done** |
| F1.2-04 | As a visitor, I want to see a photo gallery so that I can see the community in action. | **Done** |
| F1.2-05 | As a visitor, I want a conference teaser on the home page so that I'm aware of the next big event. | **Done** |

### F1.3 — Informational Pages
| ID | User Story | Status |
|---|---|---|
| F1.3-01 | As a visitor, I want to read about NAACUS's mission, what we do, who we serve, and objectives so that I understand the organization. | **Done** |
| F1.3-02 | As a visitor, I want to see leadership profiles with photos and bios so that I know who leads the organization. | **Done** |
| F1.3-03 | As a visitor, I want to browse ministries and click into any one for details so that I can find one that interests me. | **Done** |
| F1.3-04 | As a visitor, I want to see programs and activities so that I know how to get involved. | **Done** |
| F1.3-05 | As a visitor, I want to read the privacy policy so that I understand how my data is handled. | **Done** |

---

## Feature 2: Internationalization (i18n)

| ID | User Story | Status |
|---|---|---|
| F2-01 | As a French-speaking visitor, I want to switch the entire site to French so that I can read everything in my language. | **Done** |
| F2-02 | As a returning visitor, I want the site to remember my language preference so that I don't have to switch every time. | **Done** |
| F2-03 | As a visitor, I want the site to auto-detect my browser language so that it defaults to the right language. | **Done** |

---

## Feature 3: Search

| ID | User Story | Status |
|---|---|---|
| F3-01 | As a visitor, I want to search the entire site from the header so that I can find information quickly. | **Done** |
| F3-02 | As a visitor, I want search results grouped by category (events, FAQs, resources, ministries) so that I can scan results efficiently. | **Done** |
| F3-03 | As a visitor, I want matching text highlighted in search results so that I can see why each result matched. | **Done** |

---

## Feature 4: Events

### F4.1 — Event Browsing
| ID | User Story | Status |
|---|---|---|
| F4.1-01 | As a visitor, I want to browse upcoming and past events so that I can plan my participation. | **Done** |
| F4.1-02 | As a visitor, I want to see featured events highlighted so that I notice the most important ones. | **Done** |
| F4.1-03 | As a visitor, I want a dedicated NAACUS 2025 page with photos, videos, and testimonials so that I can relive or learn about the conference. | **Done** |

### F4.2 — Event Registration
| ID | User Story | Status |
|---|---|---|
| F4.2-01 | As a visitor, I want to register for an event by filling out a form (name, email, phone) so that I can confirm my attendance. | **UI Done — Backend Needed** |
| F4.2-02 | As a visitor, I want to receive a confirmation after registering so that I know my registration was received. | **UI Done — Backend Needed** |
| F4.2-03 | As an admin, I want event registrations saved to SharePoint so that I can track attendees. | **Scaffolded** |

### F4.3 — Event Administration
| ID | User Story | Status |
|---|---|---|
| F4.3-01 | As an admin, I want to create, update, and delete events so that the events page stays current. | **UI Done — Backend Needed** |
| F4.3-02 | As an admin, I want to manage event registrations (view, approve, reject) so that I can control attendance. | **UI Done — Backend Needed** |

---

## Feature 5: Membership

### F5.1 — Membership Information
| ID | User Story | Status |
|---|---|---|
| F5.1-01 | As a visitor, I want to see membership plans and pricing so that I can decide which plan fits me. | **Done** |
| F5.1-02 | As a visitor, I want to understand the benefits of each membership tier so that I can make an informed choice. | **Done** |

### F5.2 — Membership Registration
| ID | User Story | Status |
|---|---|---|
| F5.2-01 | As a visitor, I want to fill out a multi-step membership form (personal info, parish, payment) so that I can join NAACUS. | **Done** |
| F5.2-02 | As a visitor, I want to select my parish using a ZIP code finder so that my membership is linked to my local community. | **Done** (live API) |
| F5.2-03 | As a visitor, I want to select my country from a dropdown so that my address information is complete. | **Done** (live API) |
| F5.2-04 | As a visitor, I want to choose a payment method (card or manual) during registration so that I can pay in my preferred way. | **Done** |
| F5.2-05 | As a visitor, I want my membership submitted to SharePoint so that the NAACUS team receives it. | **Scaffolded** (needs Azure credentials) |

### F5.3 — Membership Administration
| ID | User Story | Status |
|---|---|---|
| F5.3-01 | As an admin, I want to view all membership registrations so that I can manage the member roster. | **UI Done — Backend Needed** |
| F5.3-02 | As an admin, I want to approve or reject membership applications so that I can vet new members. | **UI Done — Backend Needed** |
| F5.3-03 | As an admin, I want to search and filter memberships so that I can find specific members quickly. | **UI Done — Backend Needed** |

---

## Feature 6: Donations & Payments

### F6.1 — Quick Donations
| ID | User Story | Status |
|---|---|---|
| F6.1-01 | As a donor, I want a "Donate" button always visible in the header so that I can give at any time. | **Done** (live Stripe Buy Button) |
| F6.1-02 | As a donor, I want to complete my donation through Stripe's secure checkout so that my payment is safe. | **Live (3rd-party)** |

### F6.2 — Multi-Method Donations
| ID | User Story | Status |
|---|---|---|
| F6.2-01 | As a donor, I want to choose from preset donation amounts ($25, $50, $100, etc.) or enter a custom amount so that giving is easy. | **UI Done — Backend Needed** |
| F6.2-02 | As a donor, I want to pay by credit/debit card so that I can donate using my card. | **Scaffolded** (needs Stripe backend) |
| F6.2-03 | As a donor, I want to pay via PayPal so that I can use my PayPal account. | **Scaffolded** (demo mode) |
| F6.2-04 | As a donor, I want to pay via Apple Pay so that I can donate with one tap on my iPhone. | **Scaffolded** (needs Stripe backend) |
| F6.2-05 | As a donor, I want to pay via Google Pay so that I can donate with one tap on Android. | **Scaffolded** (needs Stripe backend) |
| F6.2-06 | As a donor, I want to donate via bank transfer so that I can give directly from my bank. | **Scaffolded** (demo mode) |
| F6.2-07 | As a donor, I want to donate via cryptocurrency (BTC, ETH, USDC) so that I can give using digital assets. | **Scaffolded** (demo mode) |
| F6.2-08 | As a donor, I want to donate via Cash App so that I can use my preferred mobile payment. | **Scaffolded** (demo mode) |

### F6.3 — Donation Management
| ID | User Story | Status |
|---|---|---|
| F6.3-01 | As an admin, I want to view all donations with amounts and donor details so that I can track giving. | **UI Done — Backend Needed** |
| F6.3-02 | As an admin, I want donation statistics (total amount, average, count) so that I can report on fundraising. | **UI Done — Backend Needed** |
| F6.3-03 | As a donor, I want a donation receipt/confirmation so that I have a record for tax purposes. | **Not Started** |

---

## Feature 7: Volunteering

| ID | User Story | Status |
|---|---|---|
| F7-01 | As a visitor, I want to sign up to volunteer by selecting ministries, availability, and skills so that I can contribute my time. | **Done** |
| F7-02 | As a visitor, I want to consent to a background check during sign-up so that the process is transparent. | **Done** |
| F7-03 | As a visitor, I want my volunteer application submitted to SharePoint so that the NAACUS team receives it. | **Scaffolded** (needs Azure credentials) |
| F7-04 | As an admin, I want to view and manage volunteer applications so that I can coordinate volunteers. | **UI Done — Backend Needed** |

---

## Feature 8: Contact & Communication

### F8.1 — Contact Form
| ID | User Story | Status |
|---|---|---|
| F8.1-01 | As a visitor, I want to submit a contact form so that I can reach the NAACUS team. | **UI Done — Backend Needed** |
| F8.1-02 | As an admin, I want contact submissions saved and trackable so that no inquiry is missed. | **UI Done — Backend Needed** |

### F8.2 — Newsletter
| ID | User Story | Status |
|---|---|---|
| F8.2-01 | As a visitor, I want to subscribe to the newsletter by entering my email so that I receive updates. | **UI Done — Backend Needed** |
| F8.2-02 | As a subscriber, I want to unsubscribe or update my preferences so that I control what I receive. | **UI Done — Backend Needed** |
| F8.2-03 | As a visitor, I want to browse past newsletters so that I can catch up on news I missed. | **Done** |

### F8.3 — Feedback
| ID | User Story | Status |
|---|---|---|
| F8.3-01 | As a visitor, I want to submit feedback about the website or organization so that my voice is heard. | **Done** (Microsoft Forms) |

---

## Feature 9: AI Chat Assistant

| ID | User Story | Status |
|---|---|---|
| F9-01 | As a visitor, I want to ask the chatbot questions and get instant answers so that I can find information without browsing. | **Done** (local FAQ matching) |
| F9-02 | As a visitor, I want the chatbot to answer questions about NAACUS, membership, events, and ministries. | **Done** (local FAQ matching) |
| F9-03 | As a visitor, I want the chat assistant powered by AI (Copilot Studio) for more natural, intelligent conversations. | **Scaffolded** (needs Copilot Studio credentials) |
| F9-04 | As an admin, I want chat conversations logged to SharePoint so that I can review common questions. | **Not Started** |

---

## Feature 10: Analytics & Tracking

| ID | User Story | Status |
|---|---|---|
| F10-01 | As an admin, I want page views tracked in Google Analytics so that I know which pages are popular. | **Done** (live GA4) |
| F10-02 | As an admin, I want button clicks and form submissions tracked so that I understand user behavior. | **Done** |
| F10-03 | As an admin, I want scroll depth tracked so that I know how far visitors read on each page. | **Done** |
| F10-04 | As an admin, I want an in-app analytics dashboard so that I can see key metrics without leaving the site. | **Done** (localStorage-based) |
| F10-05 | As an admin, I want to export analytics data as CSV so that I can analyze it in Excel or other tools. | **Done** |

---

## Feature 11: Cookie Consent & Privacy

| ID | User Story | Status |
|---|---|---|
| F11-01 | As a visitor, I want to see a cookie consent banner on my first visit so that I can choose whether to allow tracking. | **Done** |
| F11-02 | As a visitor, I want analytics disabled if I reject cookies so that my privacy is respected. | **Done** |
| F11-03 | As a visitor, I want to change my cookie settings later via the footer so that I can update my preference. | **Done** |

---

## Feature 12: Resources & Content

| ID | User Story | Status |
|---|---|---|
| F12-01 | As a member, I want to browse and download resources (documents, guides) so that I can access helpful materials. | **Done** |
| F12-02 | As a visitor, I want quick-link resources so that I can find the most important documents fast. | **Done** |
| F12-03 | As a visitor, I want to browse FAQs by category and search within them so that I can find answers quickly. | **Done** |
| F12-04 | As a visitor, I want to deep-link to a specific FAQ so that I can share the answer with someone. | **Done** |

---

## Feature 13: Microsoft 365 Integration

| ID | User Story | Status |
|---|---|---|
| F13-01 | As an admin, I want membership registrations saved to a SharePoint list so that data is centralized in our M365 tenant. | **Scaffolded** (code complete, needs credentials) |
| F13-02 | As an admin, I want volunteer applications saved to SharePoint so that I can manage them alongside other records. | **Scaffolded** (code complete, needs credentials) |
| F13-03 | As an admin, I want event registrations saved to SharePoint via the API server so that I can track attendees. | **Scaffolded** (server code exists, needs credentials) |
| F13-04 | As a visitor, I want to sign in with my Microsoft 365 account so that my identity is verified. | **Scaffolded** (MSAL configured, needs Azure app registration) |
| F13-05 | As an admin, I want M365-based analytics (usage reports) so that I can see metrics from our Microsoft tenant. | **Scaffolded** (feature-flagged OFF; CORS issues prevent browser use) |

---

## Feature 14: Backend API

| ID | User Story | Status |
|---|---|---|
| F14-01 | As a developer, I want a REST API for memberships (CRUD) so that registrations are persisted in a database. | **Not Started** |
| F14-02 | As a developer, I want a REST API for donations so that payments are recorded server-side. | **Not Started** |
| F14-03 | As a developer, I want a REST API for contact submissions so that messages are stored and can trigger email notifications. | **Not Started** |
| F14-04 | As a developer, I want a REST API for newsletter subscriptions so that subscriber lists are maintained. | **Not Started** |
| F14-05 | As a developer, I want a REST API for events (CRUD) so that admins can manage events from a CMS or admin panel. | **Not Started** |
| F14-06 | As a developer, I want a REST API for volunteer applications so that applications are persisted. | **Not Started** |
| F14-07 | As a developer, I want Stripe webhook handling so that payment confirmations are processed server-side. | **Not Started** |
| F14-08 | As a developer, I want PayPal server-side order verification so that donations via PayPal are confirmed. | **Not Started** |

---

## Feature 15: Testing & Quality

| ID | User Story | Status |
|---|---|---|
| F15-01 | As a developer, I want unit tests for all services so that changes don't break existing functionality. | **Partial** (3 test files out of 40+ source files) |
| F15-02 | As a developer, I want component tests for forms (membership, volunteer, contact, donation) so that form validation is verified. | **Not Started** |
| F15-03 | As a developer, I want integration tests for payment flows so that end-to-end payment works correctly. | **Not Started** |
| F15-04 | As a developer, I want accessibility tests so that the site meets WCAG standards. | **Not Started** |
| F15-05 | As a developer, I want automated E2E tests so that critical user journeys are verified before each release. | **Not Started** |

---

## Feature 16: Administration & Content Management

| ID | User Story | Status |
|---|---|---|
| F16-01 | As an admin, I want a secure admin panel so that I can manage content without editing code. | **Not Started** |
| F16-02 | As an admin, I want to update hero banner images so that the home page stays fresh. | **Not Started** (requires code change) |
| F16-03 | As an admin, I want to add/edit/remove events from an admin interface so that I don't need developer help. | **Not Started** |
| F16-04 | As an admin, I want to manage newsletter content and send campaigns so that I can communicate with subscribers. | **Not Started** |
| F16-05 | As an admin, I want to update FAQ content without code changes so that answers stay current. | **Not Started** |
| F16-06 | As an admin, I want to upload and manage gallery photos so that the gallery reflects recent events. | **Not Started** |

---

## Summary Counts

| Status | Count |
|---|---|
| **Done** | 42 |
| **Live (3rd-party)** | 1 |
| **UI Done — Backend Needed** | 16 |
| **Scaffolded** | 14 |
| **Not Started** | 21 |
| **Total User Stories** | **94** |
