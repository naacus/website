# Website Review Feedback — Technical Tracker

> **Category:** 📋 Project Management | **Audience:** Developers & IT Team | [← Docs Index](../readme.md)
> **Companion:** [Stakeholder version](../stakeholders/feedback_tracker_stakeholders.md)
> **Source:** Pre-Launch Website Review Survey | **Branch:** `develop` | **Last Updated:** July 21, 2026

---

## Status Legend

| Symbol | Status |
|--------|--------|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Completed — deployed to `develop` |
| 🔒 | Blocked — awaiting content/assets |

---

## High Priority — Must Fix Before Go-Live

### Leadership Page

- 🔒 **[FB-03]** Update board members list *(Sally Stovall — Dec 26, 2025)*  
  **Blocked:** Need updated list from shared drive.  
  **File to edit:** `src/data/leadershipData.js`

- 🔒 **[FB-07a]** Remove leaders who did not provide photos and bios *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Awaiting confirmation from president on which entries to remove.  
  **Temporary mitigation applied:** Leadership page now hides incomplete profiles (open entries or missing photo/bio) from public rendering.  
  **File to edit:** `src/data/leadershipData.js`

- 🔒 **[FB-07b]** Fix profile pictures — adjust to fit or remove those that don't fit *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Awaiting replacement image files.  
  **Temporary mitigation applied:** Incomplete profiles are filtered out in UI until corrected images are provided.  
  **File to edit:** `src/components/Leadership.js` — review `img` sizing styles.

- ✅ **[FB-07c]** Remove Maame as Young Adults Coordinator *(Sally Stovall — Jun 25, 2026)*  
  `leadershipData.js` → `ministryCoordinations`: entry replaced with `{ name: 'Open', title: 'Young Adults Ministry Coordinator' }`.

- ✅ **[FB-07d]** Add Juliet Njoku as Youth Coordinator *(Sally Stovall — Jun 25, 2026)*  
  Already in `leadershipData.js` with full bio.  
  **Still needed:** Photo file → place at `public/images/leadership/youth-coordinator.png`.

- ✅ **[FB-07e]** Add Stella Bello as Fundraising Coordinator *(Sally Stovall — Jun 25, 2026)*  
  Added to `leadershipData.js` with email `stella.bello@naacus.org`.  
  **Still needed:** Photo → `public/images/leadership/fundraising-coordinator.png` and bio text.

- ✅ **[FB-07f]** Remove Faustina as Marketing Coordinator *(Sally Stovall — Jun 25, 2026)*  
  Not found anywhere in codebase — no action required.

- ✅ **[FB-07g]** Add Mary Monney as Media Coordinator *(Sally Stovall — Jun 25, 2026)*  
  Added to `leadershipData.js` with email `mary.monney@naacus.org`. Also set as coordinator in `ministriesData.js`.  
  **Still needed:** Photo → `public/images/leadership/media-coordinator.png` and bio text.

---

### Programs & Activities Page

- ✅ **[FB-04a]** "Biannual" → "Biennial" *(Kwame Frimpong — Dec 26, 2025)*  
  **Files changed:**
  - `public/locales/en/translation.json` → key `naacus2025.scheduleDescription`
  - `src/data/naacus2025EventsData.js` → JSDoc comment on line 3

---

### 2025 Conference Page

- ✅ **[FB-04b]** Conference location "Columbus, OH" *(Kwame Frimpong — Dec 26, 2025)*  
  Already correct in `public/locales/en/translation.json` key `naacus2025.location` — no change needed.

- ✅ **[FB-13]** Replace placeholder 2025 conference schedule with official program *(Jul 15, 2026)*  
  Previous data file contained 12 generic placeholder events. Replaced with 28 sessions from the official program (Friday–Sunday), including correct presenters, times, locations, and parallel workshop tracks.  
  **Files changed:**
  - `src/data/naacus2025EventsData.js` → full schedule replaced (28 events across 3 days)
  - `public/locales/en/translation.json` → `naacus2025.dates`, `naacus2025.location`, `naacus2025.scheduleTitle`, `naacus2025.scheduleDescription` updated
  - `public/locales/fr/translation.json` → French equivalents updated

---

### Membership Page

- ✅ **[FB-04c]** Membership form fields *(Kwame Frimpong — Dec 26, 2025)*  
  **Files changed:**
  - `public/locales/en/translation.json` → `membership.diocese` renamed to `"(Arch)Diocese"`; `membership.community` key added
  - `public/locales/fr/translation.json` → same
  - `src/pages/MembershipPage.js` → `community` field added to `formData` state; `Input` rendered inside Parish Information card using `styles.formGridWithTopMargin`

---

### Design / Branding (Entire Site)

- ✅ **[FB-04d / FB-05]** NAACUS logo colors *(Kwame Frimpong & Sr. Maddy Takyala)*  
  **File changed:** `src/config/theme.js`  
  - `colors.primary`: updated to royal/cobalt blue (`#1428A0`, `#0d196b`, `#1e38c4`)  
  - `colors.green` added: bright `#76D000`, main `#4a9900`, light `#e6f5d0`, muted `#3d8200`  
  - `colors.gold` added: main `#C8A000`, light `#f7edd0`  
  - `colors.button.primary` → `#1428A0`  
  - `gradients.primaryHero` → blue-to-green gradient  
  - New Fluent tokens: `colorGreenBright`, `colorGreenMain`, `colorGreenLight`, `colorGreenMuted`, `colorGoldMain`, `colorGoldLight`

---

### Events Page

- ✅ **[FB-11]** Update 2027 convention dates *(Sally Stovall — Jun 25, 2026)*  
  Updated from Save the Date flyer details (NAACUS + ACCCRUS, Baltimore, July 27-August 1, 2027, contact email).  
  **Files changed:**
  - `public/locales/en/translation.json` → `conference2027.*` content updated
  - `public/locales/fr/translation.json` → French equivalents updated
  - `src/components/Conference2027Teaser.js` → added schedule/contact lines and flyer display slot with graceful fallback

---

## Medium Priority — Should Fix Soon

### 2025 Conference Page

- ✅ **[FB-08]** Add 2025 photo gallery link *(Sally Stovall — Jun 25, 2026)*  
  **Files changed:**
  - `src/components/naacus2025/Naacus2025Accomplishments.js` → added `gallerySection`, `galleryTitle`, `galleryDescription`, `galleryButton` styles + JSX block with external link to `https://www.sikapalens.com/kwame-frimpong---family--kids-birthday-graduation`
  - `public/locales/en/translation.json` → keys `naacus2025.galleryTitle`, `naacus2025.galleryDescription`, `naacus2025.galleryButton` added

---

### About / Membership Page

- ✅ **[FB-09a]** "Years in United States" → optional *(Sally Stovall — Jun 25, 2026)*  
  **Files changed:**
  - `public/locales/en/translation.json` → `membership.yearsInUS` = `"Years in United States (Optional)"`
  - `public/locales/fr/translation.json` → `membership.yearsInUS` = `"Années aux États-Unis (Optionnel)"`

- ✅ **[FB-09b]** Disclose membership dues *(Sally Stovall — Jun 25, 2026)*  
  **File changed:** `src/pages/MembershipPage.js`  
  Pricing callout card added above the form using `makeStyles` classes: `pricingCard`, `pricingTitle`, `pricingList`, `pricingRow`, `pricingLabel`, `pricingAmount`, `pricingNote`.

---

### Home Page — Testimonials

- ✅ **[FB-12a]** Make testimonial placeholders consistent for Dr. Obii Aguocha and Mrs. Gertrude Udoutun *(Sally Stovall — Jul 15, 2026)*  
  Updated both entries to use the same placeholder behavior as other testimonials (`photo: null`).  
  **File changed:** `src/data/testimonialData.js`

- 🔒 **[FB-12b]** Add Young Adults reflections/photos to testimonials *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Need text and photos from Young Adults members.  
  **File to edit:** `src/data/testimonialData.js` → add new entries.

---

### Home Page — CTA & Engagement (Young Adults feedback — Jul 15, 2026)

- ✅ **[FB-14]** Simplify homepage to one primary CTA *(Jul 15, 2026)*  
  Secondary buttons converted to inline ghost text links; "Join Community" is now the single dominant CTA.  
  **File changed:** `src/components/Hero.js` — replaced `secondaryActions`/`secondaryButton` with `secondaryLinks`/`ghostLink`/`linkDivider` styles.

- 🔒 **[FB-15]** Add "Our Impact" / "By the Numbers" block to homepage *(Young Adults member — Jul 15, 2026)*  
  **Blocked:** Need real statistics from leadership (e.g., number of members, parishes, states, years active).  
  **File to create:** New component `src/components/ImpactStats.js` + wire into `src/pages/HomePage.js`.

- 🔒 **[FB-16]** Add authentic member/family/community/event photos throughout homepage *(Young Adults member — Jul 15, 2026)*  
  **Blocked:** Need photo assets from community (families, youth, events, parish gatherings).  
  **File to edit:** `src/components/Hero.js`, `src/components/WhoWeServe.js`, `src/components/WhatWeDo.js`.

---

### About Page

- 🔒 **[FB-17]** Add NAACUS founding story and break up long text blocks *(Young Adults member — Jul 15, 2026)*  
  **Blocked:** Need founding narrative from leadership (year founded, how it started, growth milestones).  
  **File to edit:** `public/locales/en/translation.json` → `about.*` keys; `public/locales/fr/translation.json`; `src/components/About.js`.

---

### Programs & Activities / Ministries Page

- ✅ **[FB-18]** Add "Get Involved" CTA to each ministry card *(Jul 15, 2026)*  
  A pill-shaped "Get Involved →" button added at the bottom of every ministry card, linking to `/volunteer`.  
  **Files changed:** `src/components/Ministries.js` — added `ministryCardCTA`/`ministryGetInvolvedBtn` styles + JSX button; `public/locales/en/translation.json` + `public/locales/fr/translation.json` → `ministries.getInvolved` key added.

---

### Events & Gallery Page

- ✅ **[FB-19]** Feature upcoming events more prominently *(Jul 15, 2026)*  
  Added a count badge on the Upcoming Events tab showing the number of upcoming events; "Upcoming" tab is already the default.  
  **File changed:** `src/components/events/Events.js` — added `tabBadge` style + badge span inside the Upcoming tab button.

- 🔒 **[FB-20]** Organize photo galleries by event with short captions *(Young Adults member — Jul 15, 2026)*  
  **Blocked:** Need per-event photo sets and caption text from the media team / photographer.  
  **Temporary mitigation applied:** Gallery section is hidden from Home page until event-grouped media and captions are available.  
  **File to edit:** `src/components/Gallery.js` + photo asset organisation in `public/images/`.

---

### Site-Wide

- ✅ **[FB-21]** Ensure every page ends with a clear next-step CTA; reduce dense text blocks *(Young Adults member — Jul 15, 2026)*  
  Added explicit bottom CTA sections for Programs, Resources, and Leadership pages with clear next actions (membership and volunteer).  
  **Files changed:**
  - `src/components/Programs.js` → added end-of-page CTA block + navigation actions
  - `src/components/Resources.js` → added end-of-page CTA block + navigation actions
  - `src/components/Leadership.js` → added end-of-page CTA block + navigation actions
  - `public/locales/en/translation.json` + `public/locales/fr/translation.json` → added page-specific CTA keys for `programs`, `resourcesPage`, and `leadership`
- ✅ **[FB-21a]** Add end-of-page CTA to About page *(Jul 15, 2026)*  
  "Ready to Join?" CTA section added at the bottom of About, linking to `/membership`.  
  **Files changed:** `src/components/About.js` — added `ctaSection`/`ctaTitle`/`ctaText`/`ctaButton` styles + JSX section; `public/locales/en/translation.json` + `public/locales/fr/translation.json` → `about.ctaTitle`, `about.ctaText`, `about.ctaButton` keys added.  

- ✅ **[FB-22]** Ad Grants destination-quality remediation *(Jul 21, 2026)*  
  Improved reliability and destination quality for key landing pages while preserving locale and CMS workflows.  
  **Files changed:**
  - `src/services/countryService.js` → added fallback country dataset + graceful API failure fallback for membership form reliability.
  - `src/pages/ResourcesPage.js` and `src/pages/EventsPage.js` → added richer top/bottom value sections and clear next-step CTAs, now sourced from locale keys.
  - `src/App.js` → route title/meta description now resolve from locale keys (EN/FR) for consistent localization; missing routes (`/leadership`, `/fellowship-ministries`, `/programs-activities`, `/dues-registration`, `/2025`) wired in; dynamic `/ministries/:id` route handled with regex match.
  - `package.json` + `package-lock.json` → added `react-snap` pre-render step (`postbuild`) to generate static HTML snapshots for high-value routes without SSR migration.
  - `public/locales/en/pages/resources-newsletters-support.json` + `public/locales/fr/pages/resources-newsletters-support.json` → new `resourcesPage.landing.*` keys.
  - `public/locales/en/pages/events-prayer-library.json` + `public/locales/fr/pages/events-prayer-library.json` → new `events.landing.*` and `events.support.*` keys.
  - `public/locales/en/pages/website-shell.json` + `public/locales/fr/pages/website-shell.json` → new `meta.*` route metadata keys for all routes including `leadership`, `fellowshipMinistries`, `programsActivities`, `duesRegistration`, `naacus2025`, `ministryDetail`.  
  **Validation:** Production build succeeded and no compile errors in modified files.

- ✅ **[FB-22a]** Ad Grants submitted-domain crawl signal alignment *(Jul 21, 2026)*  
  Aligned crawl discovery files to match submitted review domain `https://test.naacus.org` to remove domain mismatch risk during Google for Nonprofits/Ad Grants review.  
  **Files changed:**
  - `public/sitemap.xml` → added route sitemap with `https://test.naacus.org/*` URLs.
  - `public/robots.txt` → added and aligned `Sitemap: https://test.naacus.org/sitemap.xml`.

---

## Low Priority — Nice to Have

### Home / Resources / Community Sections

- ✅ **[FB-02a]** Make calendar/event area interactive *(Sr. Maddy Takyala — Dec 26, 2025)*  
  Added an interactive "View Calendar" secondary link in the Home hero that routes users to the Events page and jumps to upcoming events, with analytics tracking.  
  **Files changed:**
  - `src/components/Hero.js` → added `handleViewCalendarClick` and hero CTA link to `/events#more-upcoming-events`
  - `public/locales/en/translation.json` + `public/locales/fr/translation.json` → added `heroButtons.viewCalendar`

- ✅ **[FB-02b]** Add resource links (women/youth/men leaders, suicide prevention, prayer app) *(Sr. Maddy Takyala — Dec 26, 2025)*  
  Added actionable quick links for Women/Youth/Men ministry contacts, suicide prevention support (988), and a Catholic prayer app in the Resources section.  
  **Files changed:**
  - `src/data/resourcesData.js` → added new resource items with route/section/external action metadata
  - `src/components/Resources.js` → implemented action-aware click handling for route, section scroll, and external links

- ⬜ **[FB-02c]** Add NAACUS YouTube channel link *(Sr. Maddy Takyala — Dec 26, 2025)*  
  **Blocked:** Need YouTube channel URL.  
  **File to edit:** `src/components/Footer.js` or Resources section.

- ✅ **[FB-02d]** Surface Spiritual Director contact info *(Sr. Maddy Takyala — Dec 26, 2025)*  
  Added a dedicated Spiritual Director contact row in the Contact section using Rev. Fr. Benoit Mukamba's existing data (name, email, phone).  
  **Files changed:**
  - `src/components/Contact.js` → imported `leadershipData`, rendered Spiritual Director contact card with mailto/tel links
  - `public/locales/en/translation.json` + `public/locales/fr/translation.json` → `contact.spiritualDirectorLabel` key added

---

### Fellowship & Ministries Page

- ✅ **[FB-10]** Add Media and Fundraising ministries *(Sally Stovall — Jun 25, 2026)*  
  **Files changed:**
  - `src/data/ministriesData.js` → two new entries: `id: 'media'` and `id: 'fundraising'`
  - `src/components/Ministries.js` → `iconMap` updated: `fundraising: <Mail24Regular />`

---

### Leadership Page

- ✅ **[FB-13]** Add Training Programs section under Leadership *(Tess — Jun 29, 2026)*  
  Added a dedicated Training Programs section shell under Leadership. Per canonical docs, detailed program content is pending official leadership input.  
  **Files changed:**
  - `src/data/leadershipData.js` → added `trainingPrograms` array placeholder
  - `src/services/dataService.js` → added `getLeadershipTrainingPrograms()`
  - `src/components/Leadership.js` → rendered Training Programs section with pending-details fallback
  - `public/locales/en/translation.json` + `public/locales/fr/translation.json` → added neutral `leadership.trainingPrograms*` pending-content keys

---

## Asset Checklist — Waiting on Board

| Asset | For | Where to place |
|-------|-----|----------------|
| Photo — Juliet Njoku | Youth Coordinator | `public/images/leadership/youth-coordinator.png` |
| Photo — Stella Bello | Fundraising Coordinator | `public/images/leadership/fundraising-coordinator.png` |
| Bio — Stella Bello | Fundraising Coordinator | `src/data/leadershipData.js` → `bio` field |
| Photo — Mary Monney | Media Coordinator | `public/images/leadership/media-coordinator.png` |
| Bio — Mary Monney | Media Coordinator | `src/data/leadershipData.js` → `bio` field |
| Updated board list | Executive Board | `src/data/leadershipData.js` → `executiveBoard` array |
| 2027 Save the Date flyer image file | Events / 2027 Teaser | ✅ Received and uploaded at `public/images/naacus2027/save-the-date.jpg` |
| Replacement testimonial photos (optional) | Home page | `src/data/testimonialData.js` → `photo` fields |
| Young Adults testimonials + photos | Home page | `src/data/testimonialData.js` → new entries |
| YouTube channel URL | Footer / Resources | TBD |
| NAACUS founding story + key milestones | About page | `public/locales/en/translation.json` → `about.*` keys |
| Impact statistics (members, parishes, states, years active) | Homepage — By the Numbers block | New `src/components/ImpactStats.js` |
| Member / family / community event photos | Homepage, About, Who We Serve | `public/images/community/` (new folder) |
| Per-event photo sets + captions | Gallery page | `public/images/` organised by event subfolder |
