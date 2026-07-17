# AI-First Evaluation Guide

> **Category:** Engineering | **Audience:** Developers, product owners, QA
> **Last Updated:** July 17, 2026 | [<- Docs Index](../readme.md)

---

## Purpose

This guide defines how to verify the website is implementing AI-first intent correctly:

- Intent framework is implicit (not visibly rendered to visitors)
- Whole-site structure supports journey and trust
- Navigation and route model support understand/connect/act paths
- Assistant behavior remains context-aware by route and language
- Users are guided to meaningful next actions across the entire site

---

## Local Evaluation Command

Run from `naacus-website/`:

```bash
npm run eval:ai-first
npm run eval:ai-first:html
npm run check:ai-first:thresholds:example
```

This command generates:

- `reports/ai-first-eval.json`
- `reports/ai-first-eval.md`
- `reports/ai-first-eval.html` (when using `eval:ai-first:html`)

The command exits with non-zero status when checks fail.

Mission threshold checker command:

```bash
npm run check:ai-first:thresholds
```

This command expects `reports/ai-first-metrics.json` (analytics-derived mission metrics input).

---

## What Is Evaluated

The evaluator validates whole-website AI-first guarantees:

1. No visible intent framework UI is rendered in the app shell.
2. Core website shell is present (header, main route system, footer, consent, error boundary).
3. Consent-aware analytics and trust instrumentation are active.
4. Assistant layer receives route/language context and supports next-step navigation.
5. Assistant service uses context-aware greeting/no-match behavior and quick actions.
6. Intent coverage includes every navigable route.
7. Trust pages and mission navigation pathways are present in routing/navigation.
8. Each EN/FR route intent block defines valid next-step metadata.
9. Next-step model covers core action pathways (membership/contact/donation/events/volunteer).

---

## CI/CD Integration

`npm run eval:ai-first` is executed in GitHub Actions quality gate workflow for pull requests to `develop`.

CI runs `npm run eval:ai-first:html` and uploads JSON/Markdown/HTML reports as workflow artifacts.

CI also runs mission threshold checks when `reports/ai-first-metrics.json` is provided.

Sample metrics input fixture: `scripts/fixtures/ai-first-metrics.example.json`

If this check fails, the pipeline fails and the PR must be fixed before merge.

---

## Operational Review (Weekly)

In addition to structural CI checks, review mission outcomes weekly:

1. Understand: FAQ/About/Leadership engagement and AI answer usefulness.
2. Connect: contact/newsletter/event conversion rates.
3. Act: membership/volunteer/donation starts and completions.
4. Trust: return visits, human handoff rate, EN/FR parity.

Use the generated eval report as a release checklist artifact.
