# Copilot Instructions

## Commit/Push Gate

- When the user asks to commit or push, run ESLint first using `npm run lint` from the `naacus-website` project root.
- Only proceed with `git commit` or `git push` if ESLint completes successfully.
- If ESLint fails, stop and report the lint errors before attempting commit/push.
