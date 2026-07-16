<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - Principle 1: Security-First Changes (expanded with enforceable PR conditions)
  - Principle 2: CI Reliability Is a Merge Gate (expanded with named required checks)
- Added sections:
  - Governance > Required Checks Baseline
- Removed sections: None
- Templates requiring updates:
  - ⚠ pending: N/A (no downstream templates in this repository require constitution coupling)
- Deferred TODOs:
  - None
-->

# Project Constitution

## Metadata

- Project: NAACUS Website Workspace
- Constitution Version: 1.1.0
- Ratification Date: 2026-07-16
- Last Amended Date: 2026-07-16
- Default Branch: develop

## Principle 1: Security-First Changes

All changes MUST preserve or improve security posture. Contributors MUST keep secret
material out of source control, follow the repository security reporting policy, and
ensure security checks remain enabled and passing for mergeable pull requests.

At minimum for pull requests to develop, the following security checks MUST pass or
be waived by a maintainer with written rationale in the PR thread:

- Secret Scan (Gitleaks)
- Dependency Review
- NPM Audit Gate
- Trivy Filesystem Scan
- Analyze (JavaScript/TypeScript)

Rationale: The site is public-facing and processes donor and community interactions,
so security regressions carry reputational and operational risk.

## Principle 2: CI Reliability Is a Merge Gate

Pull requests MUST keep core CI workflows green on the default branch path,
including quality gate, build/deploy checks, and security scans. Workflow changes
MUST be validated in pull requests before merge, and failures MUST be addressed or
explicitly justified.

For pull requests targeting develop, the required baseline checks are:

- Quality Gate Job
- Build and Deploy Job
- Analyze (JavaScript/TypeScript)
- Trivy Filesystem Scan
- OSSF Scorecard
- Secret Scan (Gitleaks)
- Dependency Review (PR events)
- NPM Audit Gate

Rationale: Reliable automation prevents regressions and limits manual firefighting.

## Principle 3: Documentation as a Required Artifact

Any change that affects setup, behavior, architecture, deployment, or operations MUST
update relevant documentation in the workspace and app docs. At minimum,
contributors SHOULD update one or more of the docs index, engineering guides, or
project status trackers when behavior or process changes.

Rationale: This repository is used by mixed technical and non-technical audiences,
and current docs are required for effective handoff.

## Principle 4: Accessibility and UX Baseline

User-facing changes MUST preserve responsive behavior and SHOULD include accessibility
validation for impacted flows. Contributors MUST avoid introducing regressions that
reduce keyboard, screen-reader, or mobile usability in existing pages.

Rationale: The website serves a broad community audience and must remain inclusive.

## Principle 5: Small, Traceable, Reversible Changes

Contributors SHOULD keep pull requests focused and atomic, prefer explicit commit
messages, and avoid unrelated refactors in the same change. Dependency and CI updates
SHOULD be isolated when possible to simplify review and rollback.

Rationale: Focused changes reduce review risk and accelerate incident response.

## Governance

### Amendment Process

1. Propose constitution changes in a pull request.
2. Describe the reason, impact, and proposed version bump.
3. Obtain approval from at least one maintainer before merge.
4. Update Ratification/Last Amended metadata as applicable.

### Versioning Policy

Constitution versions follow semantic versioning:

- MAJOR: Breaking governance changes or principle removals/redefinitions.
- MINOR: New principle or materially expanded policy.
- PATCH: Clarifications or non-semantic wording improvements.

### Compliance Review

- Pull request review MUST include a constitution compliance check.
- Pull requests to develop MUST have at least one maintainer approval before merge.
- Non-compliant changes MUST be remediated or explicitly waived with rationale.
- Quarterly review of this constitution SHOULD be performed to keep it current.

### Required Checks Baseline

- This constitution treats the check names in Principle 2 as the baseline branch
  protection set for develop.
- If workflow names or check names change, contributors MUST update this document in
  the same pull request that introduces the workflow change.
