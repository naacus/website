# Data Persistence Guide (`src/data`)

This document defines the recommended persistence strategy for the current React app data files, assuming Microsoft technologies (Azure).

## Assumptions

- Frontend: React app
- Hosting: Azure Static Web Apps
- API Layer: Azure Functions (HTTP APIs)
- Persistence: Azure SQL, Azure Cosmos DB, Azure Blob Storage, Azure App Configuration
- Optional search/semantic retrieval: Azure AI Search

## File-by-File Persistence Strategy

| Data File | Content Nature | Change Frequency | Best Azure Persistence | Suggested Data Model | React API Pattern | Caching Guidance |
|---|---|---|---|---|---|---|
| `activitiesData.js` | Mission/objectives/program text | Low-Medium | Cosmos DB or Dataverse | `content_pages` with section arrays | `GET /api/content/activities` | 1-6h |
| `eventsData.js` | Multi-year events (upcoming/past) | Medium-High | Azure SQL Database | `events` table (`id`, `title`, `startUtc`, `endUtc`, `status`) | `GET /api/events?type=upcoming` | 5-15m |
| `faqData.js` | FAQ + keywords + defaults | Medium | Cosmos DB (+ optional AI Search) | `faq_items` documents with `keywords[]` | `GET /api/faq`, `GET /api/faq/search?q=` | 15-60m |
| `galleryData.js` | Gallery metadata/categories | Medium | SQL/Cosmos for metadata + Blob for media | `gallery_items`, `media_assets` | `GET /api/gallery` | Metadata 15m; media via CDN |
| `leadershipData.js` | Leadership bios + contact info | Medium | Azure SQL Database | `people`, `roles`, `groups` | `GET /api/leadership` | 15-60m |
| `memberBenefitsData.js` | Small enum-like list | Very Low | Keep in code or App Configuration | key/value JSON | Optional `GET /api/config/member-benefits` | 24h+ |
| `ministriesData.js` | Long-form ministry content | Medium | Dataverse or Cosmos DB | `ministries` documents | `GET /api/ministries`, `GET /api/ministries/:id` | 30-60m |
| `naacus2025EventsData.js` | Conference schedule sessions | Medium | Azure SQL (same events domain) | `conference_sessions` linked to `events` | `GET /api/conferences/2025/sessions` | 5-15m |
| `newslettersData.js` | Issue/article metadata | Medium | SQL/Dataverse + Blob for assets | `newsletter_issues`, `newsletter_articles` | `GET /api/newsletters` | 30-60m |
| `prayerLibraryData.js` | Prayer types/languages/countries/submissions | Medium-High | Azure SQL + Blob + optional AI Search | normalized tables (`prayer_types`, `languages`, `entries`, `submissions`) | `GET /api/prayers`, `POST /api/prayers/submissions` | 5-30m |
| `resourcesData.js` | Resource cards + partner list | Low-Medium | Dataverse or Cosmos DB | `resources`, `partners` | `GET /api/resources`, `GET /api/partners` | 1-6h |
| `resourcesQuickLinks.js` | Quick links and helplines | Medium | Azure App Configuration | key/value JSON by section | `GET /api/config/quick-links` | 1-24h |
| `testimonialData.js` | Testimonials with publish workflow | Medium | Azure SQL (or Dataverse) + Blob for photos | `testimonials` (`approved`, `consent`, `publishedAt`) | `GET /api/testimonials` | 30-60m |

## Recommended Target Stack

- `Azure Static Web Apps` for React frontend
- `Azure Functions` for API endpoints
- `Azure SQL Database` for relational/business records
- `Azure Cosmos DB` for flexible/editorial JSON docs
- `Azure Blob Storage` + `Azure CDN/Front Door` for media delivery
- `Azure App Configuration` for quick links/constants/feature flags
- `Azure Key Vault` for secrets
- Optional: `Azure AI Search` for FAQ/prayer retrieval

## Suggested Migration Order

1. Migrate `eventsData.js` and `naacus2025EventsData.js` to Azure SQL + API.
2. Migrate `leadershipData.js` and `testimonialData.js` (governance and moderation).
3. Migrate `prayerLibraryData.js` (largest structural benefit).
4. Migrate editorial files (`ministriesData.js`, `activitiesData.js`, `resourcesData.js`, `faqData.js`, `newslettersData.js`).
5. Move quick configuration to App Configuration (`resourcesQuickLinks.js`, optionally `memberBenefitsData.js`).

## Implementation Notes for React

- Replace direct data imports with service calls under `src/services/*`.
- Use TanStack Query (React Query) for caching/retries/stale data handling.
- Keep a local fallback only for development/offline scenarios.
- Add admin workflow for content requiring approval (`testimonials`, `prayer submissions`).
