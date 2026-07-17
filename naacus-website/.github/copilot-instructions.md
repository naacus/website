# Copilot Instructions

## Project Scope

- This instruction file applies to the `naacus-website` project.
- Prefer making changes inside `naacus-website/` unless the user explicitly asks to modify files outside this project.

## Code Style and Safety

- Keep changes focused and minimal; do not refactor unrelated code.
- Preserve existing naming, component patterns, and folder structure.
- Do not introduce new hardcoded user-facing copy when existing i18n keys are available.

## Localization and Content Rules

- Treat `public/locales/en/translation.json` and `public/locales/fr/translation.json` as canonical locale files.
- Keep locale key structure aligned between English and French when adding or moving keys.
- For CMS-facing text/schema changes, also update engineering docs under `docs/engineering/`.

## CMS Configuration Rules

- For Decap CMS updates, edit `public/admin/config.yml` carefully and preserve valid YAML structure.
- Keep editor labels clear and section-oriented for non-technical content editors.
- When changing locale collection schemas, ensure both EN and FR editor entries are updated consistently.

## Commit/Push Gate

- When the user asks to commit or push, run ESLint first using `npm run lint` from the `naacus-website` project root.
- Only proceed with `git commit` or `git push` if ESLint completes successfully.
- If ESLint fails, stop and report the lint errors before attempting commit/push.

## Recommended Validation

- For JavaScript/React changes: run `npm run lint` and relevant tests.
- For accessibility-related updates: run `npm run check:a11y` when feasible.
- For `public/admin/config.yml` changes: validate YAML syntax before commit.
