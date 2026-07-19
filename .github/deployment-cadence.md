# Deployment Cadence

This document is the canonical source for deployment rhythm, timing, and release windows.

## Environments

- development
- staging
- production

## Cadence Summary

- Continuous integration: feature work merges into develop.
- Weekly release cut: every Monday at 13:00 UTC, a release branch is cut from develop by the scheduled workflow.
- Staging validation: each release branch is validated in staging for 1 week.
- Production promotion: manual promotion to production after staging sign-off.
- Hotfix path: hotfix branches can be promoted to production when urgent fixes are needed.

## Branch To Environment Mapping

- develop -> development
- release/* -> staging
- release/* and hotfix/* -> production (manual workflow)

## Operational Flow

1. Merge tested feature branches into develop.
2. Weekly scheduler creates release/YYYY-MM-DD from develop.
3. Pushes on release/* run quality gates and deploy to staging.
4. Team performs one-week stabilization in staging.
5. Owner manually runs production release workflow using source_ref from release/* or hotfix/*.
6. After production deployment, create release tag and merge any release-only fixes back to develop.

## Required Gates

- Translation parity gate
- Accessibility checks
- Security checks
- Release checklist completion
- Production environment approval

## Cadence Ownership

- Primary owner: release manager
- Backup owner: engineering lead

## Change Control For Cadence

Any cadence change must update all of the following in one pull request:

1. This document.
2. .github/release-management.md
3. Relevant workflows in .github/workflows/
4. .github/ISSUE_TEMPLATE/release-checklist.md if process steps change.

## Related Workflows

- .github/workflows/azure-static-web-apps-polite-pebble-0f00f890f.yml
- .github/workflows/release-to-staging.yml
- .github/workflows/production-release.yml
- .github/workflows/biweekly-release-reminder.yml
