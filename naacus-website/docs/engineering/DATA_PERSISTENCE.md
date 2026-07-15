# Data Persistence Guide (`src/data`)

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 15, 2026 | [← Docs Index](../README.md)

---

This guide defines a Microsoft-first persistence strategy for the React app data under `naacus-website/src/data`, including when SharePoint is a good fit.

## Assumptions

- Frontend: React app
- Hosting: Azure Static Web Apps
- API Layer: Azure Functions (Node.js)
- Identity: Microsoft Entra ID (Azure AD)
- Data services in scope: Azure SQL, Dataverse, SharePoint Online, Cosmos DB, Blob Storage, App Configuration

## Quick Decision Rules

- Use SharePoint Lists/Libraries for editorial content managed by non-developers.
- Use Azure SQL or Dataverse for structured, relational, or workflow-heavy business data.
- Use Blob Storage or SharePoint Libraries for files/images/videos (metadata stays in a List/DB).
- Use App Configuration for small global settings and quick links.

## File-by-File Strategy (with SharePoint Fit)

| Data File | Content Type | SharePoint Fit | Primary Recommendation | Alternate Option | Why |
|---|---|---|---|---|---|
| `activitiesData.js` | Mission/objectives text blocks | High | SharePoint List (`SiteContent`) | Dataverse | Editorial content, simple structure, frequent copy edits.
| `eventsData.js` | Ongoing events with date filtering | Medium | Azure SQL (`events`) | SharePoint List (`Events`) for simple cases | SQL is better for sorting, filtering, and analytics at scale.
| `faqData.js` | FAQ Q/A + keywords | High | SharePoint List (`FAQ`) | Cosmos DB + AI Search | Business users can maintain FAQs directly in M365.
| `galleryData.js` | Gallery metadata and media grouping | High | SharePoint Library + List metadata | Blob + SQL/Cosmos metadata | SharePoint is strong for media libraries and tagging.
| `leadershipData.js` | People profiles and contact info | Medium | Dataverse or Azure SQL | SharePoint List with permissions | Structured data + governance requirements favor SQL/Dataverse.
| `memberBenefitsData.js` | Small enum-style values | Low | App Configuration | Keep in code | Tiny stable config; SharePoint is unnecessary overhead.
| `ministriesData.js` | Long-form ministry pages | High | SharePoint List (`Ministries`) | Dataverse | Rich editorial content and easy admin ownership.
| `naacus2025EventsData.js` | Conference sessions/schedule | Medium | Azure SQL (`conference_sessions`) | SharePoint List (`ConferenceSessions`) | Better to unify with events model rather than year-specific files.
| `newslettersData.js` | Newsletter issues + article metadata | Very High | SharePoint Library (`Newsletters`) + List metadata | Dataverse + Blob | SharePoint is ideal for document publishing and versioning.
| `prayerLibraryData.js` | Normalized types/languages/countries/submissions | Low-Medium | Azure SQL + Blob | Dataverse | Relationship-heavy and workflow-driven; SharePoint becomes complex quickly.
| `resourcesData.js` | Resource cards + partners | High | SharePoint List (`Resources`, `Partners`) | Dataverse | Simple list data with ownership by comms/content team.
| `resourcesQuickLinks.js` | Quick links and support links | High | App Configuration (primary) | SharePoint List (`QuickLinks`) if business-managed | App Configuration is fastest; SharePoint if non-dev ownership is required.
| `testimonialData.js` | Testimonials with approval needs | High | SharePoint List with Content Approval | Dataverse or SQL | SharePoint can handle submission + approval workflow well.

## Recommended Hybrid Architecture

### Tier 1: SharePoint-Managed Content

- `activitiesData.js`
- `faqData.js`
- `ministriesData.js`
- `resourcesData.js`
- `newslettersData.js`
- `galleryData.js`
- `testimonialData.js` (if moderation is simple)

### Tier 2: Structured Application Data

- `eventsData.js`
- `naacus2025EventsData.js`
- `leadershipData.js`
- `prayerLibraryData.js`

Store these in Azure SQL or Dataverse and expose via Functions API.

### Tier 3: Global Runtime Configuration

- `resourcesQuickLinks.js`
- `memberBenefitsData.js`

Use Azure App Configuration unless business users explicitly need SharePoint editing.

## Suggested SharePoint List Schemas

### `FAQ`

- `Title` (Single line)
- `Category` (Choice)
- `Question` (Single line)
- `Answer` (Multiple lines)
- `Keywords` (Multiple lines, comma-separated)
- `IsActive` (Yes/No)
- `SortOrder` (Number)

### `Resources`

- `Title` (Single line)
- `Description` (Multiple lines)
- `Type` (Choice: Document, Link, News)
- `Url` (Hyperlink)
- `ButtonText` (Single line)
- `IsActive` (Yes/No)

### `QuickLinks`

- `Title` (Single line)
- `Section` (Choice: Contacts, Support, Prayer)
- `LinkType` (Choice: Internal, External, Tel)
- `PathOrUrl` (Single line)
- `SectionId` (Single line, optional)
- `SortOrder` (Number)

### `Testimonials`

- `Title` (Single line)
- `TestimonialText` (Multiple lines)
- `AuthorName` (Single line)
- `Location` (Single line)
- `Photo` (Image)
- `ConsentReceived` (Yes/No)
- `Approval Status` (Built-in)

## React Integration Pattern

- Do not call SharePoint directly from browser for all scenarios.
- Preferred pattern: React -> Azure Functions -> Microsoft Graph/SQL.
- Benefits: secure tokens, stable response contracts, central validation.

Example endpoints:

- `GET /api/content/faq`
- `GET /api/content/resources`
- `GET /api/events?type=upcoming`
- `POST /api/testimonials/submit`

## Migration Order

1. Move high-value editorial files to SharePoint (`faq`, `resources`, `ministries`, `activities`).
2. Migrate newsletter and gallery assets to SharePoint Libraries.
3. Move event models to SQL and unify conference schedule shape.
4. Move prayer library to SQL + Blob with explicit moderation workflow.
5. Move quick links to App Configuration (or SharePoint if business-owned).

## Operational Notes

- Enable versioning and content approval in SharePoint Lists where needed.
- Use least-privilege Graph permissions for API app registrations.
- Cache read-mostly content at API level for 5-60 minutes.
- Add audit fields (`createdBy`, `updatedBy`, `publishedAt`) for publishable content.
