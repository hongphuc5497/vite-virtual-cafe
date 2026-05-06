---
status: testing
phase: 02-js-migration
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md
started: 2026-05-06T12:00:00Z
updated: 2026-05-06T12:00:00Z
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running dev server. Run `npm run build` then `npm start`. 
  Server boots without errors on port 3000. Opening http://localhost:3000 shows the virtual cafe homepage.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Run `npm run build` then `npm start`. Server boots without errors on port 3000. Opening http://localhost:3000 shows the virtual cafe homepage.
result: pending

### 2. Dev Server Hot Reload
expected: Run `npm run dev`. Server starts on port 3000. Homepage loads. Change a visible text in `app/routes/_index.jsx` — the page updates without manual browser refresh.
result: pending

### 3. Homepage Core UI
expected: Homepage at http://localhost:3000 shows all core components: BackdropOverlay (background), SessionTimer (timer display), TrackControl (volume sliders for each track), RoomMixControls (master controls), VibeSelector (preset vibe buttons).
result: pending

### 4. Audio Playback
expected: Clicking play on SessionTimer starts audio playback. Track volumes are adjustable via sliders. Clicking a vibe preset changes track volumes. Timer counts down and celebration overlay appears on completion.
result: pending

### 5. Relax Page
expected: Navigating to http://localhost:3000/relax renders the relax page with its own layout and components, distinct from the homepage.
result: pending

### 6. Production Build
expected: `npm run build` exits 0 with no errors. Output shows client modules bundled (~98) and SSR modules (~18). `npm start` serves the production build on port 3000.
result: pending

### 7. ESLint
expected: `npm run lint` runs without parser or plugin errors. May have code-style warnings (react/prop-types) but no fatal errors.
result: pending

## Summary

total: 7
passed: 0
issues: 0
pending: 7
skipped: 0

## Gaps

[none yet]
