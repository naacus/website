# Recommended Branch Protection for `develop`

Apply these settings in GitHub repository settings:

## Required Status Checks
Require these checks to pass before merge:
- `Quality Gate Job` (from Azure Static Web Apps CI/CD workflow)
- `Build and Deploy Job` (optional to require, usually not required for PR merge)
- `Analyze (JavaScript/TypeScript)`
- `Secret Scan (Gitleaks)`
- `Dependency Review`
- `NPM Audit Gate`
- `Trivy Filesystem Scan`
- `OSSF Scorecard`

## Pull Request Rules
- Require a pull request before merging.
- Require at least 1 approval.
- Dismiss stale pull request approvals when new commits are pushed.
- Require conversation resolution before merging.

## Additional Safety
- Require branches to be up to date before merging.
- Restrict who can push directly to `develop`.
- Include administrators (recommended for consistency).

## Notes
- The `close_pull_request_job` in the Static Web Apps workflow is event-driven for closed PRs and should not be a required status check.
- If workflow/job names change, update the required status checks accordingly.
