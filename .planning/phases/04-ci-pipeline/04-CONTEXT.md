# Phase 4: CI Pipeline - Context

**Gathered:** 2026-05-07
**Status:** Ready for execution
**Mode:** Auto-generated (scope well-defined by ROADMAP)

<domain>
## Phase Boundary

Create a GitHub Actions workflow that runs the Playwright E2E test suite automatically on every push and pull request to `main`. Tests execute across Chromium, Firefox, and WebKit in parallel. PR status check blocks merge on failure.
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices at Claude's discretion. Use ROADMAP phase goal and success criteria:
1. GitHub Actions triggers on push and PR to main
2. Playwright tests across Chromium, Firefox, WebKit in parallel
3. PR status check blocks merge on failure
</decisions>

<code_context>
## Existing Code Insights

- Playwright config: `playwright.config.js` at root, currently Chromium-only
- Test suite: 13 tests in `tests/`, `npm test` runs `npx playwright test`
- Node ≥ 20 required
- Dev server: `npm run dev` on port 3000
- Build: `npm run build`
</code_context>
