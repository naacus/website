# NAACUS Website — Documentation Index

All project documentation is organized into three categories below.  
Last updated: July 16, 2026

---

## 🔧 Engineering
*For developers and IT contributors.*

| Document | Description |
|----------|-------------|
| [quickstart.md](engineering/quickstart.md) | Local setup, install, and run instructions |
| [website_structure.md](engineering/website_structure.md) | Folder layout, components, and data flow |
| [backend_api.md](engineering/backend_api.md) | API contracts and backend integration guide |
| [data_persistence.md](engineering/data_persistence.md) | How data is stored, fetched, and managed |
| [deployment.md](engineering/deployment.md) | Build, deploy, and hosting configuration |
| [cms-content-coverage.md](engineering/cms-content-coverage.md) | Canonical plan and rules for Decap coverage of all text and images |
| [ga4_analytics.md](engineering/ga4_analytics.md) | Google Analytics 4 setup and event tracking |
| [payments.md](engineering/payments.md) | Stripe payment integration guide |
| [accessibility-audit.md](engineering/accessibility-audit.md) | WCAG 2.1 a11y audit and remediation roadmap |

---

## 📋 Project Management
*For the IT team and project leads.*

| Document | Description |
|----------|-------------|
| [features_and_user_stories.md](project/features_and_user_stories.md) | Feature inventory and user stories |
| [release_schedule.md](project/release_schedule.md) | Milestones, release plan, and go-live checklist |
| [feedback_tracker_technical.md](project/feedback_tracker_technical.md) | Pre-launch review feedback — technical implementation status |

---

## 👥 Stakeholders
*For board members, ministry leads, and community leaders.*

| Document | Description |
|----------|-------------|
| [website_overview.md](stakeholders/website_overview.md) | Plain-language overview of the website and its sections |
| [feedback_tracker_stakeholders.md](stakeholders/feedback_tracker_stakeholders.md) | What's been fixed, what still needs your input, and what's planned |

---

## Quick Links

- 🌐 Test site: https://test.naacus.org
- 📦 Repository: https://github.com/naacus/website
- 📧 IT contact: celestin.mbuyamba@naacus.org

---

## 📝 Markdown File Conventions

All documentation files follow these standards:

| Aspect | Standard | Example |
|--------|----------|---------|
| **Location** | `docs/` directory with category subdirectories | `docs/engineering/`, `docs/project/`, `docs/stakeholders/` |
| **Naming** | `kebab-case.md` (lowercase with hyphens) | `accessibility-audit.md`, `features-and-user-stories.md` |
| **Index files** | Root of each category is `readme.md` | `docs/readme.md`, `docs/engineering/` |
| **Cross-references** | Use relative paths for portability | `[link text](../engineering/deployment.md)` |
| **Frontmatter** | None required (keep files Git-friendly) | Plain markdown only |

**When adding a new doc:**
1. Choose the correct category folder (`engineering/`, `project/`, or `stakeholders/`)
2. Name it `kebab-case-descriptive-name.md`
3. Add entry to the category's index in [readme.md](#-naacus-website--documentation-index)
4. Commit with message: `docs: add [file name] to [category]`
