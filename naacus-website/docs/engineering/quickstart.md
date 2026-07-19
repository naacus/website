# Quick Start Guide

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 15, 2026 | [← Docs Index](../readme.md)

---

## Setup

### Prerequisites
- Node.js 16+ (v18 LTS recommended)
- npm or yarn

### Install & Run

```bash
cd naacus-website
npm install
npm start
```

Visit http://localhost:3000

## Day 0 to Day 2 Onboarding (Start from Zero)

Use this path when a new teammate has no prior context about NAACUS, the codebase, or AI-first standards.

### Day 0: Understand the Project

1. Read project overview and structure:
	- `docs/stakeholders/website_overview.md`
	- `docs/engineering/website_structure.md`
2. Read AI-first expectations:
	- `docs/engineering/ai-first-evaluation.md`
	- `docs/engineering/ai-first-kpi-spec.md`
	- `docs/engineering/ga4-ai-first-event-map.md`
3. Read deployment and secret handling:
	- `docs/engineering/deployment.md`
	- `docs/engineering/environment-variables.md`
	- `docs/engineering/github-azure-secrets-setup.md`

### Day 1: Run the App and Baseline Checks

Run from `naacus-website/`:

```bash
npm install
npm start
npm run check:translations
npm run eval:ai-first
npm run eval:ai-first:html
```

Review:
- `reports/ai-first-eval.json`
- `reports/ai-first-eval.md`
- `reports/ai-first-eval.html`

### Day 2: Submit a Safe First Change

1. Make a docs-only or low-risk UI copy update.
2. Re-run required checks.
3. Open a PR with:
	- What changed
	- Why it changed
	- Which checks passed
4. Confirm security baseline before merge:
	- Stripe key is never stored in CMS/locale content.
	- CI resolves Stripe key from Azure Key Vault first.
	- CI falls back to GitHub secrets only if Azure path is unavailable.
	- If no valid key is available, CI reports warning status and deploys with Stripe buy buttons disabled.

## AI-First Onboarding (New Team Members)

Use this checklist on day one so every change starts from AI-first expectations.

1. Read the mission guardrails:
	- `docs/engineering/ai-first-evaluation.md`
	- `docs/engineering/ai-first-kpi-spec.md`
	- `docs/engineering/ga4-ai-first-event-map.md`
2. Run baseline checks locally from `naacus-website/`:

```bash
npm run check:translations
npm run eval:ai-first
npm run eval:ai-first:html
```

3. Review generated reports before opening a PR:
	- `reports/ai-first-eval.json`
	- `reports/ai-first-eval.md`
	- `reports/ai-first-eval.html`
4. Confirm payment key strategy (security baseline):
	- Stripe public key must not be stored in CMS or locale content.
	- CI resolves key in this order: Azure Key Vault, then GitHub Secrets fallback.
	- If no valid key is available, Stripe buy buttons are disabled and fallback buttons are used.
5. Open PRs only after AI-first checks pass locally.

### Build for Production

```bash
npm run build
```

## Key Services

| Service | Purpose |
|---------|---------|
| `googleAnalyticsService.js` | GA4 event tracking |
| `analyticsService.js` | High-level analytics wrapper |
| `m365Service.js` | SharePoint data storage |
| `dataService.js` | Mock data (ministries, events, etc.) |

## Common Tasks

**Add a new page:**
1. Create `src/pages/NewPage.js`
2. Add route in `App.js`

**Track an event:**
```javascript
const { trackCTA } = useAnalytics();
trackCTA('donation', 'button_click', 'hero_section');
```

**Modify ministries:**
Edit `src/data/ministriesData.js`

**Check EN/FR translation parity:**
```bash
npm run check:translations
```

## Deployment

Auto-deploys to **Azure Static Web Apps** on push to `develop` branch.

Quality gates on `develop` include translation parity, AI-first evaluation, accessibility checks,
and Stripe key source validation for secure payment initialization.

## More Documentation

- **Full project structure:** [website_structure.md](website_structure.md)
- **Analytics:** [ga4_analytics.md](ga4_analytics.md)
- **Payments:** [payments.md](payments.md)
- **Deployment:** [deployment.md](deployment.md)
- **Backend API:** [backend_api.md](backend_api.md)
