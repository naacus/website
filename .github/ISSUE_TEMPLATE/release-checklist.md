---
name: Release Checklist
about: Track weekly release readiness and staging to prod promotion
title: "Release YYYY-MM-DD"
labels: ["release"]
assignees: []
---

## Scope

- Release branch: 
- Target version/tag: 
- Planned production date: 

## Validation Gates

- [ ] Staging deployment successful from release branch
- [ ] Translation parity gate passed
- [ ] Accessibility checks passed
- [ ] Security checks passed
- [ ] Smoke tests passed in staging

## Change Review

- [ ] Changelog prepared
- [ ] Breaking changes documented
- [ ] Migration or config changes documented

## Deployment Readiness

- [ ] Prod environment approval obtained after 1 week staging validation
- [ ] Rollback version/tag identified
- [ ] Rollback owner assigned

## Release Actions

- [ ] Open/complete release sign-off PR from release branch into develop
- [ ] Run production release workflow
- [ ] Verify production smoke tests
- [ ] Create and publish release tag
- [ ] Merge any release-branch fixes into develop

## Hotfix Handling

- [ ] Staging-only bug fixed on release branch
- [ ] Production bug fixed on hotfix branch from release baseline
- [ ] Hotfix merged back to develop

## Post-Release Notes

- Known issues:
- Follow-up tasks:
