# Release Train Board

This board is the human-readable release train view for planning and stakeholder visibility.

Use this together with:

- .github/deployment-cadence.md for cadence policy
- .github/release-management.md for process and controls

## Current Rules Snapshot

- Weekly release branch cut from develop on Monday at 13:00 UTC
- One week of staging validation before production promotion
- Production deploy is manual and requires production environment approval

## Train Timeline (Rolling 6 Weeks)

Update this table every Monday after the release branch is cut.

| Train ID | Release Branch | Cut Date (UTC) | Staging Window | Planned Production Window | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-2026-07-20 | release/2026-07-20 | 2026-07-20 | 2026-07-20 to 2026-07-27 | 2026-07-27 to 2026-07-31 | Planned | Release Manager | Initial placeholder row |
| T-2026-07-27 | release/2026-07-27 | 2026-07-27 | 2026-07-27 to 2026-08-03 | 2026-08-03 to 2026-08-07 | Planned | Release Manager |  |
| T-2026-08-03 | release/2026-08-03 | 2026-08-03 | 2026-08-03 to 2026-08-10 | 2026-08-10 to 2026-08-14 | Planned | Release Manager |  |
| T-2026-08-10 | release/2026-08-10 | 2026-08-10 | 2026-08-10 to 2026-08-17 | 2026-08-17 to 2026-08-21 | Planned | Release Manager |  |
| T-2026-08-17 | release/2026-08-17 | 2026-08-17 | 2026-08-17 to 2026-08-24 | 2026-08-24 to 2026-08-28 | Planned | Release Manager |  |
| T-2026-08-24 | release/2026-08-24 | 2026-08-24 | 2026-08-24 to 2026-08-31 | 2026-08-31 to 2026-09-04 | Planned | Release Manager |  |

## Status Values

- Planned
- In Staging
- Ready for Production
- Released
- Delayed
- Hotfix

## Weekly Update Checklist

1. Confirm release branch was cut by workflow.
2. Add the newest row and drop the oldest row to keep a 6-week view.
3. Update status and dates for active trains.
4. Link the release checklist issue in Notes.
5. Mark production completion date when released.

## Hotfix Tracking

| Hotfix Branch | Trigger Date | Target Train | Production Date | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| hotfix/example | YYYY-MM-DD | T-YYYY-MM-DD | YYYY-MM-DD | Planned | Replace with real hotfix entries |
