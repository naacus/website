# NAACUS Homepage Review and Implementation Plan

**Date:** August 2026  
**Audience:** NAACUS leadership, content owners, IT, and website contributors  
**Source:** *NAACUS Website Review Feedback - Homepage, August 2026*  
**Repository reviewed:** `naacus/website`  
**Status:** Decision-ready implementation plan; required confirmations are listed below

> **Purpose:** Establish a shared source of truth for what the homepage should communicate, what already exists, what IT can implement safely, what owners still need to provide, and how completion will be accepted.

## Executive Summary

The current NAACUS homepage already has a strong technical and content foundation:

- The official-looking NAACUS logo is used in the global header.
- The hero headline is already **Together with Christ**.
- The Convention 2027 feature is already directly below the hero.
- Membership benefits, testimonials, newsletter, contact, donation, ministries, events, and a substantial footer already exist.

The requested work is therefore a targeted reorganization and content improvement, not a complete rebuild.

Implementation can begin for confirmed structural and copy changes. Where facts, assets, links, or integrations are unavailable, IT should retain verified content, hide incomplete elements, or render only configured items. IT must not invent statistics, dates, social accounts, testimonials, photographs, ministry ownership, or successful form delivery.

### What success looks like

- Visitors immediately understand what NAACUS is and why they should participate.
- The homepage presents a clear journey from welcome to convention, mission, membership, ministries, stories, and action.
- No unverified attendance, membership, geographic, or impact claims are published.
- Every displayed event, link, form, testimonial, and photograph is complete and trustworthy.
- English and French content remain aligned and editable through the existing content-management approach.

### Responsibility model

| Role | Primary responsibility |
|---|---|
| Owner / leadership | Approve organizational facts, wording, priorities, public claims, and responsible content owners. |
| Communications / content owners | Supply final copy, photographs, captions, testimonials, event details, translations, and social links. |
| IT | Implement approved structure and functionality, enforce safe defaults, connect services, test, and release. |
| Finance / authorized payment owner | Approve donation language and confirm the existing donation flow remains the intended destination. |

## Current Homepage Assessment

The current homepage composition in `src/pages/HomePage.js` is:

1. Hero
2. Convention 2027 teaser
3. Membership benefits
4. Testimonials
5. Gallery, currently feature-flagged off
6. Newsletter
7. Contact
8. Global footer

| Area | Current status | Requested change | Readiness |
|---|---|---|---|
| Logo | Circular NAACUS logo is used in the global header. | Confirm it is the approved master and add an appropriate footer treatment. | Mostly ready |
| Hero | Headline is already **Together with Christ**; subtitle and actions are generic. The copy includes an unsupported "thousands" claim. | Explain NAACUS clearly and use Membership, Ministries, and Convention actions. | Ready to implement |
| Convention 2027 | Already directly below the hero. The teaser and flyer show July 27-August 1, 2027. | Create one canonical date/link source and remove unsupported claims. | Needs factual confirmation |
| Mission / Why Join | Strong material exists on the About page, but not as dedicated homepage sections. | Add concise, non-duplicative homepage versions. | Ready to implement |
| Membership benefits | Six CMS-backed benefit cards exist. | Replace unsupported counters and scale claims with qualitative statements. | Ready to implement |
| Ministries | Rich CMS-backed content exists on the ministries page. | Add a curated homepage preview with useful descriptions and links. | Mostly ready |
| Testimonials | Seven named testimonials exist, concentrated in Women's Ministry, with no portraits. | Add approved young-adult and broader voices. | Partially ready |
| Events | Events UI and data exist, but no homepage preview. Some records conflict with the review or are incomplete. | Add a date-aware homepage events section using verified records only. | Partially ready |
| Gallery | Component exists but is disabled and displays generic icon placeholders. | Replace placeholders with approved, captioned photographs before enabling. | Not content-ready |
| Newsletter | A visible form logs locally and claims confirmation behavior that is not integrated. | Connect a real endpoint or avoid success claims. | Integration needed |
| Contact | A visible form alerts and logs rather than reliably delivering. | Connect a real endpoint and expose direct contact alternatives. | Integration needed |
| Donation | Donation route, Stripe flow, and header CTA already exist. | Add a homepage mission-support callout linking to the existing flow. | Ready to implement |
| Footer / social | A broad footer exists; only YouTube is configured. | Reorganize the footer and render only verified social platforms. | Partially ready |

## Approved Homepage Flow

The homepage should follow this order:

1. **Hero** - identity, welcome, and the three primary actions
2. **Convention 2027** - the featured national gathering
3. **Mission** - a concise explanation of NAACUS's purpose
4. **Why Join NAACUS** - the value of belonging
5. **Membership Benefits** - detailed outcomes and opportunities
6. **Ministries** - pathways for connection and service
7. **Testimonials** - representative member voices
8. **Photo Gallery / Community Impact** - authentic visual evidence
9. **Upcoming Events** - only complete and current records
10. **Newsletter Signup** - connected to a real subscription service
11. **Contact & Donate** - clear communication and support actions
12. **Footer** - identity, direct links, contact information, and verified social channels

> **Content rule:** Each section must have a distinct purpose. The welcome, mission, Why Join, benefits, motto, and vision should not repeat the same paragraphs in adjacent sections.

## Section-by-Section Requirements

### Hero

**Owner intent:** Welcome visitors, identify NAACUS, and invite participation.

**IT implementation:**

- Keep **Together with Christ** as the single homepage `h1`.
- Replace unsupported scale language with a concise explanation of NAACUS.
- Provide direct actions for:
  - **Become a Member** -> `/membership`
  - **Explore Our Ministries** -> `/fellowship-ministries`
  - **Convention 2027** -> the canonical Convention section or destination
- Continue using authentic community imagery, subject to rights and context confirmation.

**Acceptance criteria:**

- The first viewport identifies NAACUS clearly.
- The page contains exactly one `h1`.
- All three primary actions lead to valid destinations.
- No unverified scale or geographic claim appears.

### Convention 2027

**Owner intent:** Feature the convention immediately after the hero.

**IT implementation:**

- Keep the section in its current position.
- Consolidate teaser and event data into one canonical Convention record.
- Use the flyer-supported schedule as working content, subject to final owner confirmation:
  - July 27-29, 2027: ACCCRUS Clergy and Religious Gathering
  - July 29-August 1, 2027: NAACUS and ACCCRUS National Convention
- Use an updates action until a real registration destination exists.
- Remove unsupported attendance and "largest event" claims.

**Acceptance criteria:**

- Dates, schedule, location, title, and CTA come from one source.
- Displayed details match the approved flyer and owner decision.
- No `#` registration link or unsupported attendance claim remains.

### Mission

**Owner intent:** Place a brief statement of purpose near the top.

**IT implementation:**

- Add a focused homepage Mission section after Convention 2027.
- Use concise approved wording and link to the full About page.
- Keep the complete Motto and Vision on the About page.

**Acceptance criteria:**

- Mission appears before Why Join and Membership Benefits.
- It is concise and does not duplicate the full About page.
- It contains no unsupported claims.

### Why Join NAACUS

**Owner intent:** Explain the value of belonging to NAACUS.

**IT implementation:**

- Add a separate Why Join section between Mission and Membership Benefits.
- Focus on outcomes: faith, connection, heritage, leadership, and service.
- Avoid repeating every benefit-card description.

**Acceptance criteria:**

- The section answers why a visitor should participate.
- It is distinct from Mission and Membership Benefits.
- Its CTA leads to the membership journey.

### Membership Benefits

**Owner intent:** Present meaningful outcomes of membership without unsupported statistics.

**IT implementation:**

- Retain the six existing benefit cards.
- Replace the hard-coded counters:
  - `10,000+ Active Members`
  - `50+ Communities Nationwide`
  - `100+ Annual Events`
  - `25+ States Represented`
- Use qualitative indicators instead.
- Remove unsupported "thousands" and "all 50 states" wording from localized content.

**Acceptance criteria:**

- No unverified numeric or geographic claims remain.
- Benefits remain specific and actionable.
- Membership and volunteer actions still work.

### Ministries

**Owner intent:** Show useful descriptions rather than links alone.

**IT implementation:**

- Reuse existing CMS-backed ministry data.
- Add a curated homepage preview with approved short descriptions and links to detail pages.
- Include representative pathways such as Women's, Youth and Young Adult, and Men's ministries.
- Confirm whether Clergy and Religious is a NAACUS ministry, an ACCCRUS partnership, or Convention audience copy before presenting it as a ministry.

**Acceptance criteria:**

- Displayed ministries have approved descriptions.
- Every card has a valid detail or get-involved destination.
- Organizational ownership is accurate.

### Testimonials

**Owner intent:** Show diverse experiences, including young adults.

**IT implementation:**

- Retain approved existing testimonials.
- Add previously submitted young-adult testimonials when supplied and approved.
- Add attribution, location, optional portrait, and consent metadata.
- Present a balanced selection rather than replacing one concentrated set with another.

**Acceptance criteria:**

- The homepage includes broader representation, including young adults.
- Every quotation has approved attribution and publication consent.
- Missing portraits do not produce broken imagery.

### Photo Gallery / Community Impact

**Owner intent:** Show authentic convention, prayer, youth, cultural, leadership, and family activity.

**IT implementation:**

- Replace icon placeholders with CMS-backed photographs.
- Require image, category, caption, meaningful alt text, source, and permission.
- Seek 2025 Convention photographs from the identified content owner.
- Keep the gallery disabled until a publication-ready set is available.
- Use qualitative impact stories rather than unverified numeric impact claims.

**Acceptance criteria:**

- No placeholder gallery cards remain.
- Every published image is authentic, optimized, captioned, accessible, sourced, and permissioned.
- Gallery activation is content-driven, not deadline-driven.

### Upcoming Events

**Owner intent:** Promote current NAACUS events, including the proposed September 2026 Praise and Worship Concert, December 2026 African Mass, and Women's prayer meetings.

**IT implementation:**

- Add a compact homepage events section backed by canonical event data.
- Show future and approved recurring events only.
- Support recurrence metadata for weekly and monthly meetings.
- Do not create event cards from event names alone.

**Acceptance criteria:**

- Every event has an exact date or recurrence, time zone, location/access method, organizer, and valid participation link where applicable.
- Past one-time events do not remain under Upcoming Events.
- Recurring events follow an explicit public/private access policy.

### Newsletter

**Owner intent:** Let visitors subscribe for news and Convention updates.

**IT implementation:**

- Connect the form to an approved production subscription service.
- Add loading, success, duplicate, validation, and error states.
- Align consent and privacy language with actual behavior.
- Do not claim confirmation email delivery until it is implemented.

**Acceptance criteria:**

- A successful response represents a persisted subscription.
- Errors are visible and actionable.
- Status updates are accessible to assistive technology.

### Contact & Donate

**Owner intent:** Make communication and financial support easy.

**IT implementation:**

- Connect Contact to a real delivery endpoint with spam protection.
- Keep direct email alternatives visible.
- Add a donation callout linking to the existing `/donation` flow.
- Do not embed a second payment implementation on the homepage.

**Acceptance criteria:**

- Contact success means the inquiry was actually accepted for delivery.
- Failures are surfaced rather than replaced by mock success.
- Donate reaches the existing secure donation page.

### Social Links and Footer

**Owner intent:** Provide visible social validation and a stronger organizational footer.

**IT implementation:**

- Add a reusable social-links component driven by verified configuration.
- Render only configured platforms.
- Reorganize the existing footer rather than append a second footer block.
- Include:
  - A concise NAACUS description
  - `info@naacus.org`
  - `baltimore2027@naacus.org`
  - Donate
  - Ministries
  - Convention 2027
  - Newsletter
  - Volunteer
  - Verified social destinations
- Correct the current Newsletter footer destination, which routes to Contact.

**Acceptance criteria:**

- No placeholder or dead social destination is displayed.
- Both supplied email addresses are usable mail links.
- Requested destinations are direct and valid.
- Footer identity and navigation remain readable on mobile.

## Content Ready for Implementation

The following is working English source copy. It remains subject to final organizational review, length editing, French translation, and removal of duplication.

### Hero headline

> Together with Christ

### Hero supporting statement

> The National Association of African Catholics in the United States (NAACUS) brings together individuals, families, clergy, religious, and communities to grow in faith, celebrate our rich cultural heritage, develop leaders, and serve the Church and society.

### Mission

> NAACUS exists to unite African Catholics across the United States through faith formation, leadership development, cultural celebration, evangelization, and service to the Church and society.

### Why Join

> Become part of a vibrant national community of African Catholics dedicated to growing in faith, supporting one another, and serving the Church.

### Qualitative community indicators

- National Network of African Catholic Communities
- Growing Membership Across the United States
- Regional and National Events
- Ministries for All Ages

### Donation

**Heading:** Support the Mission of NAACUS

> Together, we can inspire faith, strengthen communities, and transform lives through Christ.

### Motto

> **Together with Christ** - Guided by Christ, we unite African Catholics across the United States through faith, fellowship, leadership, cultural celebration, and service, building welcoming communities that strengthen the Church and advance the common good.

### Vision

> A vibrant, united, and visible community of African Catholics in the United States, growing together in faith, celebrating our rich heritage, developing leaders, and contributing our gifts in service to the Church and society.

### Membership benefits

- Deepen Catholic faith through prayer, Bible study, and faith formation.
- Connect with African Catholic communities across the United States.
- Build lasting friendships and meaningful relationships.
- Access conferences, retreats, leadership training, and special events.
- Celebrate and preserve African Catholic traditions and cultural heritage.
- Support youth, young adults, families, clergy, and religious ministries.
- Discover opportunities for service, evangelization, and community outreach.
- Develop leadership skills while serving parish and community.

## Owner Decisions and Missing Inputs

Missing inputs do not need to block the entire project. IT should implement confirmed structure and use the safe behavior below until each input is approved.

| Input needed | Owner / content action | Safe IT behavior until supplied | Priority |
|---|---|---|---|
| Logo master and variants | Confirm the current logo and provide horizontal or light variants if available. | Continue using the existing deployed logo; make replacement configurable. | Medium |
| Convention record | Confirm title, July 27-August 1 schedule, destination link, and registration status. | Use flyer-supported dates as working content; remove conflicting data, attendee count, and placeholder link. | High |
| Photographs | Provide approved images with category, caption, alt text, source, and consent. | Reuse current approved site imagery where appropriate; keep gallery disabled. | High |
| Young-adult testimonials | Provide approved text, attribution, optional portrait, and consent. | Keep existing testimonials and prepare the data model for additional voices. | High |
| September and December events | Provide exact date, time zone, location, organizer, and public link. | Do not publish incomplete event cards. | High |
| Prayer meetings | Provide recurrence, time zone, audience, and public/private access policy. | Build recurrence support but do not fabricate occurrences. | High |
| Social accounts | Provide official Facebook, Instagram, WhatsApp, LinkedIn, and confirmed YouTube URLs. | Render only verified and configured platforms. | Medium |
| Clergy and Religious | Confirm whether this is a NAACUS ministry, ACCCRUS partnership, or Convention audience. | Do not label it a NAACUS ministry until confirmed. | Medium |
| Newsletter endpoint | Select service, consent language, confirmation behavior, and owner. | Do not claim subscription or confirmation email success; hide or disable submission if necessary. | High |
| Contact endpoint | Confirm delivery service, recipient, spam protection, privacy, and error handling. | Show direct email options; do not claim delivery from logging or mock behavior. | High |
| French approval | Assign a reviewer for revised French content. | Keep locale structures aligned and hold revised translations for review before publication. | Medium |

> **Publication safeguard:** Unavailable content must be omitted or conditionally rendered. IT will not invent dates, attendance, social accounts, testimonials, photographs, ministry ownership, or successful form delivery.

## Ordered Implementation Phases and Acceptance Criteria

### Phase 0 - Content and evidence gate

**Work:**

- Reconcile Convention dates and actions.
- Remove unsupported numerical and geographic claims.
- Create a content decision register for events, media, testimonials, social accounts, and integrations.

**Dependencies:** Owner access and source documents.

**Acceptance criteria:**

- Canonical facts are recorded.
- Every incomplete item has an explicit owner and safe interim behavior.
- No unsupported claim is approved for publication.

### Phase 1 - Canonical data foundation

**Work:**

- Centralize Convention and event records.
- Create structured gallery and testimonial metadata.
- Centralize social URLs and conditional rendering.
- Extend English and French locale and CMS schemas together.

**Dependencies:** Phase 0 factual decisions.

**Acceptance criteria:**

- One data source feeds each feature.
- Required fields are validated.
- Convention teaser and Events use the same record.
- Locale and CMS structures remain aligned.

### Phase 2 - Hero through membership

**Work:**

- Refine hero copy and the three primary actions.
- Keep and correct the Convention banner.
- Add Mission and Why Join sections.
- Replace unsupported counters and claims in Membership Benefits.

**Dependencies:** Approved core copy and canonical Convention record.

**Acceptance criteria:**

- The top of the homepage follows the approved order.
- Visitors can identify NAACUS and take the three intended actions.
- No unsupported scale, attendance, or geographic claim appears.

### Phase 3 - Ministries, events, and testimonials

**Work:**

- Add a curated ministries preview.
- Add future and recurring event filtering with homepage cards.
- Prepare and populate diversified testimonials when approved content is available.

**Dependencies:** Approved ministry ownership, complete event records, and testimonial content.

**Acceptance criteria:**

- All cards have complete data and valid destinations.
- Homepage events are current and participation-ready.
- Broader testimonial representation is visible when supplied.

### Phase 4 - Gallery and engagement

**Work:**

- Replace gallery placeholders and enable only with approved media.
- Connect newsletter and contact services.
- Add the donation mission callout.

**Dependencies:** Approved media rights and production form endpoints.

**Acceptance criteria:**

- Published media is accessible and permissioned.
- Forms persist real submissions and report honest outcomes.
- Donate reaches the existing secure flow.

### Phase 5 - Footer, social, About, and localization

**Work:**

- Reorganize the footer and add supplied contact details.
- Add verified social destinations.
- Update the complete Motto and Vision on About.
- Complete English and French content parity.

**Dependencies:** Verified social URLs and approved translations.

**Acceptance criteria:**

- Footer information is accurate and complete.
- Only verified platforms display.
- Full Motto and Vision remain on About without homepage duplication.
- English and French structures match.

### Phase 6 - Release validation

**Work:**

- Run component, integration, accessibility, localization, image, lint, and build checks.
- Review mobile, tablet, and desktop layouts.
- Complete factual and link verification.

**Dependencies:** All publishable phases complete.

**Acceptance criteria:**

- Automated checks pass.
- The owner approves the final factual and content review.
- No blocked content is accidentally rendered.

## Technical Change Map

### Homepage composition and existing components

- `src/pages/HomePage.js`
- `src/components/Hero.js`
- `src/components/Conference2027Teaser.js`
- `src/components/MemberBenefits.js`
- `src/components/Testimonials.js`
- `src/components/Gallery.js`
- `src/components/Newsletter.js`
- `src/components/Contact.js`
- `src/components/Footer.js`

### Likely new focused components

- `src/components/HomeMission.js`
- `src/components/WhyJoin.js`
- `src/components/HomeMinistries.js`
- `src/components/HomeEvents.js`
- `src/components/DonationCallout.js`
- `src/components/SocialLinks.js`

Names may be adjusted to match repository conventions during implementation.

### Content, localization, and CMS

- `public/locales/en/pages/home-page.json`
- `public/locales/fr/pages/home-page.json`
- `public/locales/en/pages/website-shell.json`
- `public/locales/fr/pages/website-shell.json`
- `public/locales/en/pages/about-leadership.json`
- `public/locales/fr/pages/about-leadership.json`
- `public/content/testimonials.json`
- `public/content/ministries.json`
- `public/content/member-benefits.json`
- `public/content/hero-images.json`
- Proposed `public/content/events.json`
- Proposed `public/content/home-gallery.json`
- `public/admin/config.yml`

### Data, configuration, and services

- `src/data/eventsData.js`
- `src/data/galleryData.js`
- `src/services/dataService.js`
- `src/utils/staticDataLoader.js`
- `src/config/siteLinks.js`
- `src/config/featureFlags.js`
- `src/services/newsletterService.js`
- `src/services/contactService.js`
- Approved backend and API configuration

### Tests

- Update `src/a11y/App.a11y.test.js`, which currently asserts the old hero subtitle.
- Add focused tests for:
  - Homepage section order
  - Hero CTA destinations
  - Convention record consistency
  - Event filtering and recurrence
  - Newsletter and contact states
  - Footer and social destinations
  - Gallery metadata
  - Accessibility
  - Locale and CMS parity

## Validation Checklist

### Content and behavior

- [ ] Homepage sections appear in the approved order.
- [ ] **Together with Christ** is the only homepage `h1`.
- [ ] Membership, Ministries, and Convention actions work.
- [ ] Convention dates and actions match the approved canonical record.
- [ ] No unverified numerical, geographic, attendance, or "largest event" claims remain.
- [ ] Mission, Why Join, benefits, motto, and vision do not unnecessarily repeat one another.
- [ ] Only complete future or approved recurring events appear.
- [ ] Only verified social platforms render.
- [ ] Every published photograph has meaningful alt text, caption, source, and permission.
- [ ] Newsletter and contact forms report real delivery outcomes.
- [ ] Donation actions use the existing secure donation route.
- [ ] Owner completes final factual and content approval.

### Accessibility and responsive behavior

- [ ] Heading hierarchy is logical and contains one `h1`.
- [ ] Keyboard navigation and focus behavior work throughout.
- [ ] Forms have visible labels and accessible status messages.
- [ ] CTA names clearly describe their destinations.
- [ ] Decorative background images remain empty-alt and hidden from assistive technology.
- [ ] Gallery images use meaningful alt text.
- [ ] Mobile, tablet, and desktop layouts remain usable.

### Localization and CMS

- [ ] English and French structures and content keys remain aligned.
- [ ] New Decap fields map to runtime content keys.
- [ ] `npm run check:translations` passes.
- [ ] CMS content can be edited without changing application code.

### Media and performance

- [ ] `npm run optimize:images:check` passes.
- [ ] Images use appropriate responsive dimensions and optimized formats.
- [ ] Below-the-fold media loads lazily.
- [ ] Only the initial hero image receives high fetch priority.
- [ ] Image dimensions prevent avoidable layout shift.

### Automated and manual validation

- [ ] Targeted Jest and React Testing Library tests pass.
- [ ] Existing accessibility tests pass.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `/`, `/about`, `/events`, `/fellowship-ministries`, `/donation`, and `/contact` are reviewed.
- [ ] Every internal route, email address, event link, and social URL is verified.

## Feedback Not to Implement Literally

- Do **not** replace an unverified `5,000` attendees with an equally unverified `1,000`; omit attendance until evidence exists.
- Do **not** publish September, December, weekly, or monthly event names without exact dates or recurrence, time zones, locations, and participation details.
- Do **not** display Facebook, Instagram, WhatsApp, or LinkedIn icons without official destinations.
- Do **not** claim "thousands," "all 50 states," "largest conference," or similar scale without support.
- Do **not** duplicate the full welcome, mission, Why Join, benefits, motto, and vision text across adjacent sections.
- Do **not** label Clergy and Religious as a NAACUS ministry until organizational ownership is confirmed.
- Do **not** report newsletter or contact success while current behavior only logs, stores locally, or falls back to mock data.
- Do **not** retain the conflicting July 1-5 Convention record or a placeholder registration link.
- Do **not** activate the gallery merely to satisfy section order when approved media and metadata are unavailable.
- Do **not** introduce a second donation payment implementation when the secure donation route already exists.

## Recommended Approval

Authorize IT to begin **Phases 0-3** using the safe-content rules in this document.

Phases involving new media, testimonials, event publication, social accounts, or production form delivery should activate only as their required inputs are approved. This allows the confirmed homepage structure and messaging improvements to proceed without publishing incomplete or unverified content.
