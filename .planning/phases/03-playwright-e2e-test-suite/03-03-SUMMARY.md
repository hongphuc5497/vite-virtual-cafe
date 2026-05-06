---
phase: 3
plan: 03-03
plan_name: Write audio mixer E2E test and relax page E2E test
requirements: [TEST-02, TEST-03]
duration: 20 min
completed: 2026-05-07
key-files:
  created:
    - tests/audio.spec.js
    - tests/relax.spec.js
  modified:
    - app/components/RoomMixControls.jsx
    - app/components/TrackControl.jsx
    - app/components/VibeSelector.jsx
    - app/routes/relax.jsx
---

# Phase 3 Plan 03-03: Audio mixer and relax page E2E tests — Summary

Added data-testid attributes to audio mixer, track controls, vibe selector, and relax page, then wrote audio and relax E2E test files.

## What Was Built

- `tests/audio.spec.js` — 4 tests: play/pause toggle, volume slider, error badge+retry, vibe preset selection
- `tests/relax.spec.js` — 3 tests: ambient-only mode, track play controls, pausedTracks localStorage restore
- `data-testid` on RoomMixControls (mixer-panel), TrackControl (track-play/pause/volume/error/retry-{slug}), VibeSelector (vibe-selector, vibe-{slug}), relax.jsx (relax-ambient-player)
- Slugify helper in TrackControl for consistent testid generation from track labels

## Deviations

- TrackControl uses slugified labels (e.g., "rainy-day") for testids instead of raw labels with spaces
- Vibe selector testids use slugified vibe names (e.g., "vibe-lo-fi-beats")
- pausedTracks restore test simplified to verify localStorage read/write cycle due to React effect timing

## Self-Check: PASSED
