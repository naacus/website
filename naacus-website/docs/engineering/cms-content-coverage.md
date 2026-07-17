# Decap CMS Content Coverage (Canonical)

> **Category:** Engineering | **Audience:** Developers, content admins
> **Status:** Canonical source of truth for Decap-managed content scope
> **Last Updated:** July 16, 2026 | [<- Docs Index](../readme.md)

---

## Goal

Make **all website text and images** editable through Decap CMS, with a PR-based editorial workflow and predictable deployment to `develop`.

---

## Current State

Decap CMS is enabled at `/admin` and currently manages a subset of content:

- Advanced locale text via section-based entries in Decap:
	- One entry per top-level section per locale (EN/FR)
	- Examples: `Header - English`, `Membership - English`, `Header - Francais`, `Membership - Francais`
	- Writes to `public/locales/en/translation.json` and `public/locales/fr/translation.json`
- Hero text (EN/FR)
- FAQ page text (EN/FR)
- Hero slideshow image list

Authentication is handled via DecapBridge PKCE + git-gateway.

---

## Target State

All user-facing text and all website images are managed content, not hardcoded implementation details.

### Text scope

- Home page and section copy
- CTA labels and button text
- Navigation labels and footer copy
- Page-level headings and descriptions
- Locale translations (`en`, `fr`, and future locales)

### Image scope

- Hero and section images
- Ministry/program visuals
- Conference galleries and photo assets
- Shared marketing visuals and upload-managed assets

## Delivery Plan Split

To reduce risk, delivery is split into two PRs:

1. **Text PR (this phase):** full text coverage through locale/content JSON in Decap.
2. **Images PR (next phase):** expanded image collections, upload rules, and image-domain rollout.

## Decap Organization (Editor Friendly)

Decap collections are organized to keep non-technical editing simple:

1. **Common Text (English)**
	- Home Page - Hero Text (EN)
	- FAQ Page Text (EN)
2. **Common Text (Francais)**
	- Page d'accueil - Texte Hero (FR)
	- Page FAQ - Texte (FR)
3. **Advanced Locale JSON (EN/FR) - By Section**
	- One entry per top-level locale section (EN and FR)
	- Section labels are editor-friendly and locale-specific (for example, `Events - English`, `Events - Francais`)
	- Uses grouped section/object fields with focused editing scope per section
4. **Media Assets**
	- Image-focused collections (expanded in image PR)

Editors should start with **Common Text** collections first, then use **Advanced Locale JSON (EN/FR) - By Section** for targeted section updates across the website.

---

## Canonical Rules

1. No new hardcoded user-facing strings in React components.
2. All user-facing strings must resolve from Decap-managed JSON content.
3. All new content images must be stored through CMS-managed paths.
4. Content updates must flow through CMS PRs and branch protection checks.
5. Deployment to live/test happens only after merge to `develop`.

---

## Content Architecture

### Source directories

- `naacus-website/public/content/`: structured content JSON files
- `naacus-website/public/locales/`: translation JSON files by locale
- `naacus-website/public/images/uploads/`: CMS-uploaded image assets

### Component contract

Components should consume content from structured JSON (or i18n translations) with graceful fallback behavior only.

---

## Implementation Plan

### Phase 1: Inventory and mapping

1. Inventory all user-facing strings in `src/`.
2. Inventory image references across components/pages/data.
3. Produce source-to-content-file mapping before refactors.

### Phase 2: Externalize text

1. Move hardcoded strings into locale/content JSON.
2. Refactor components to read from content sources.
3. Keep stable keys to avoid translation drift.

### Phase 3: Externalize images

1. Replace static component image constants with content-driven paths.
2. Move editor-managed assets into `public/images/uploads/`.
3. Keep fallback image references for resilience.

### Phase 4: Decap collection expansion

1. Expand `admin/config.yml` collections to cover all content files.
2. Group collections by domain (home, ministries, programs, conference, shared UI).
3. Keep field schemas explicit for non-technical editors.

### Phase 5: Validation and release

1. Verify CMS save -> PR -> merge -> deploy loop for each domain.
2. Validate EN/FR rendering and missing-key behavior.
3. Update docs and handoff notes for editors.

---

## Acceptance Criteria

1. No remaining hardcoded user-facing text in React component files.
2. No editor-owned images referenced outside CMS-managed paths.
3. Editors can update all text/image domains from Decap without code edits.
4. Each CMS change produces a PR and deploys only after merge to `develop`.

---

## Operational Notes

- If login works but save fails with token errors, validate DecapBridge Git token scopes and org SSO authorization.
- If `/admin/config.yml` fails to load on Azure SWA, verify routing excludes and `/admin -> /admin/` redirect policy.

---

## Ownership

- Engineering owns schema design and content-loading contracts.
- Content admins own editorial updates through Decap workflow.
- Release owners own PR review and merge controls.
