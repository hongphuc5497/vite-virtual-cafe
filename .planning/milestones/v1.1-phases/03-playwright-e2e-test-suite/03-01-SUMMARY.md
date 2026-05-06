---
phase: 3
plan: 03-01
plan_name: Install Playwright and create base test infrastructure
requirements: [TEST-01, TEST-02, TEST-03, TEST-04]
duration: 15 min
completed: 2026-05-07
key-files:
  created:
    - playwright.config.js
    - tests/constants.js
    - tests/helpers/mainPage.js
    - tests/helpers/relaxPage.js
  modified:
    - package.json
    - .gitignore
---

# Phase 3 Plan 03-01: Install Playwright and create base test infrastructure — Summary

Installed Playwright as devDependency with Chromium browser, created config with webServer auto-start on port 3000, and wrote shared test constants and page-object helpers.

## What Was Built

- `playwright.config.js` — webServer auto-starts `npm run dev`, Chromium-only, 30s timeout, screenshot on failure
- `tests/constants.js` — shared selectors (data-testid based), timeouts, localStorage keys, track/vibe/preset references
- `tests/helpers/mainPage.js` — MainPage class with goto, startTimer, waitForCelebration
- `tests/helpers/relaxPage.js` — RelaxPage class with goto, ambient player checks, localStorage helpers
- `package.json` — added `test` and `test:debug` scripts
- `.gitignore` — added test-results/ and playwright-report/

## Deviations

None — plan executed exactly as written.

## Self-Check: PASSED
