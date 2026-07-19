# Weekly Release Management

This repository uses a weekly release-train model with three environments:

- development
- staging
- production

- every week: cut a `release/YYYY-MM-DD` branch from `develop` and deploy it to staging.
- after one week of validation in staging: manually promote to production.

## Branch Roles

- develop: integration branch for daily feature work; merges deploy to `development`.
- main: production source branch.
- release/YYYY-MM-DD: weekly stabilization branch cut from develop and deployed to `staging`.
- hotfix/*: emergency fixes (for development and/or production), merged back to main and develop.

## Weekly Flow

1. Development window (continuous)
- Merge tested feature branches into develop.
- Validate integration on develop.

2. Release cut
- Create release branch from develop using date naming, for example release/2026-08-01.
- Deploy release branch automatically to staging.
- Stop feature merges into the release branch after cut.

3. Staging stabilization (1 week)
- Allow only bug fixes, config fixes, and documentation updates on the release branch.
- Re-run required checks and smoke tests in staging.

4. Production promotion
- Open PR from release branch into main.
- Require approvals and required checks.
- Manually trigger production promotion workflow after staging sign-off.
- Deploy via the `production` environment approval gate.
- Tag release after successful deploy, for example v1.14.0.

5. Back-merge
- Merge release branch back to develop to keep branches aligned.

6. Hotfix model
- If bugs are found in staging: fix on the release branch.
- If bugs are found in production: cut `hotfix/*` from main, deploy to production, and back-merge to develop.
- If both staging and production are affected: apply fix in hotfix, cherry-pick or merge into active release branch.

## Required Gates Before Production

- Staging quality gate job
- Translation parity gate
- Accessibility gate
- Security scans
- Release checklist completed

## Rollback

- Roll back using the previous production tag.
- Create a hotfix branch from main if needed.
- Merge hotfix back to both main and develop.

## Required Repository Settings

- Protect main and develop from direct pushes.
- Require pull requests and approvals.
- Configure environment protection for production (required reviewers).
- Configure development/staging/production environments with required protections.
- Require status checks before merge.
