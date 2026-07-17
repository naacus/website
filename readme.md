# NAACUS Website Workspace

This is the workspace-level README for the NAACUS project.

Use this file when you need:
- a quick start from the workspace root
- a map of where docs and app code live
- project-wide status context

For app-specific setup and scripts, use [naacus-website/readme.md](naacus-website/readme.md).

Related index: [naacus-website/docs/readme.md](naacus-website/docs/readme.md).

Official website for the National Association of African Catholics in the United States.

**Live:** https://polite-pebble-0f00f890f.4.azurestaticapps.net

---

## Quick Start (Workspace Root)

```bash
cd naacus-website
npm install
npm start
```

Visit http://localhost:3000

---

## Documentation

Primary docs index: [readme.md](naacus-website/docs/readme.md)

Repository governance: [constitution.md](constitution.md)

### For Everyone

| Document | Description |
|---|---|
| [website_overview.md](naacus-website/docs/stakeholders/website_overview.md) | Non-technical overview of the website — pages, features, and how it all works |
| [features_and_user_stories.md](naacus-website/docs/project/features_and_user_stories.md) | Feature inventory and user stories with status |
| [release_schedule.md](naacus-website/docs/project/release_schedule.md) | Phased delivery plan with timelines and priorities |

### For Developers

| Document | Description |
|---|---|
| [quickstart.md](naacus-website/docs/engineering/quickstart.md) | Dev environment setup and local development |
| [website_structure.md](naacus-website/docs/engineering/website_structure.md) | Technical architecture: routes, components, services, config |
| [deployment.md](naacus-website/docs/engineering/deployment.md) | Deployment options and environment configuration |
| [ga4_analytics.md](naacus-website/docs/engineering/ga4_analytics.md) | GA4 configuration and event tracking reference |
| [payments.md](naacus-website/docs/engineering/payments.md) | Payment integration details |
| [backend_api.md](naacus-website/docs/engineering/backend_api.md) | REST API contracts and implementation notes |
| [data_persistence.md](naacus-website/docs/engineering/data_persistence.md) | Data storage and persistence approach |

### Other

| Document | Description |
|---|---|
| [readme.md (frontend app)](naacus-website/readme.md) | App-level setup, scripts, architecture, and deployment notes |

---

## At a Glance

- Frontend is production-ready and deployed on Azure Static Web Apps.
- Primary app implementation details live in [naacus-website/readme.md](naacus-website/readme.md).
- Technical architecture and operational guidance live in [naacus-website/docs/engineering/](naacus-website/docs/engineering/).
- Delivery progress and scope tracking live in [naacus-website/docs/project/](naacus-website/docs/project/).

---

## Project Status

| Area | Status |
|---|---|
| Frontend UI (all 17 pages) | **Complete** |
| Internationalization (EN/FR) | **Complete** |
| Google Analytics | **Complete (live)** |
| Site search | **Complete** |
| Cookie consent | **Complete** |
| Stripe Buy Button (donations) | **Complete (live)** |
| Local FAQ chatbot | **Complete** |
| Multi-method payment UI | **UI complete — backend needed** |
| Membership / Volunteer / Contact forms | **UI complete — backend needed** |
| Backend REST API | **Not started** |
| Admin panel | **Not started** |
| Test coverage | **Minimal (3 test files)** |

See [features_and_user_stories.md](naacus-website/docs/project/features_and_user_stories.md) for the full breakdown and [release_schedule.md](naacus-website/docs/project/release_schedule.md) for the delivery plan.

---

## Deploy

Auto-deploys on push to `develop` branch.

---

**Built with love for the NAACUS community**

*Together with Christ — Uniting African Catholic communities across the United States.*
