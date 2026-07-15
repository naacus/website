# Website Review Feedback — Technical Tracker

> **Audience:** Engineers / Developers  
> **Non-technical version:** See `FEEDBACK_TRACKER_STAKEHOLDERS.md`  
> **Source:** Pre-Launch Website Review Survey  
> **Last Updated:** July 15, 2026  
> **Branch:** `develop`

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
  **File to edit:** `src/data/leadershipData.js`

- 🔒 **[FB-07b]** Fix profile pictures — adjust to fit or remove those that don't fit *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Awaiting replacement image files.  
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

- 🔒 **[FB-11]** Update 2027 convention dates *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Need dates from the Save the Date flyer.  
  **File to edit:** `public/locales/en/translation.json` → keys `conference2027.whenValue`, `conference2027.whereValue`, `conference2027.title`, `conference2027.subtitle`  
  Also update `public/locales/fr/translation.json` with French equivalents.

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

- 🔒 **[FB-12a]** Replace photos for Dr. Obii Aguocha and Mrs. Gertrude Udoutun *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Need photo files from the board.  
  **File to edit:** `src/data/testimonialData.js` → update `photo` fields.

- 🔒 **[FB-12b]** Add Young Adults reflections/photos to testimonials *(Sally Stovall — Jun 25, 2026)*  
  **Blocked:** Need text and photos from Young Adults members.  
  **File to edit:** `src/data/testimonialData.js` → add new entries.

---

## Low Priority — Nice to Have

### Home / Resources / Community Sections

- ⬜ **[FB-02a]** Make calendar/event area interactive *(Sr. Maddy Takyala — Dec 26, 2025)*  
  **File to investigate:** `src/components/Hero.js` or dedicated event section component.

- ⬜ **[FB-02b]** Add resource links (women/youth/men leaders, suicide prevention, prayer app) *(Sr. Maddy Takyala — Dec 26, 2025)*  
  **File to edit:** `src/data/resourcesData.js` or `src/data/resourcesQuickLinks.js`

- ⬜ **[FB-02c]** Add NAACUS YouTube channel link *(Sr. Maddy Takyala — Dec 26, 2025)*  
  **Blocked:** Need YouTube channel URL.  
  **File to edit:** `src/components/Footer.js` or Resources section.

- ⬜ **[FB-02d]** Surface Spiritual Director contact info *(Sr. Maddy Takyala — Dec 26, 2025)*  
  Rev. Fr. Benoit Mukamba already in `leadershipData.js` with phone/email. Decide where to surface (Resources page? Contact page?).

---

### Fellowship & Ministries Page

- ✅ **[FB-10]** Add Media and Fundraising ministries *(Sally Stovall — Jun 25, 2026)*  
  **Files changed:**
  - `src/data/ministriesData.js` → two new entries: `id: 'media'` and `id: 'fundraising'`
  - `src/components/Ministries.js` → `iconMap` updated: `fundraising: <Mail24Regular />`

---

### Leadership Page

- ⬜ **[FB-13]** Add Training Programs section under Leadership *(Tess — Jun 29, 2026)*  
  **File to edit:** `src/components/Leadership.js` + `src/data/leadershipData.js` (add `trainingPrograms` array).

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
| 2027 Save the Date flyer | Events / 2027 Teaser | `public/locales/en/translation.json` → `conference2027.*` |
| Testimonial photos (Obii Aguocha, Gertrude Udoutun) | Home page | `src/data/testimonialData.js` → `photo` fields |
| Young Adults testimonials + photos | Home page | `src/data/testimonialData.js` → new entries |
| YouTube channel URL | Footer / Resources | TBD |
