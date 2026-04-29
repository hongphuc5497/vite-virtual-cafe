# The Analog Sanctuary

## What This Is

A virtual café ambiance and focus-timer web app. Users mix layered ambient soundscapes (barista, rain, fireplace, chatter) while running a Pomodoro-style countdown timer. When a session ends, the app celebrates completion with a full-viewport overlay and logs the session. Built with Remix v2 on Express + Vite + Tailwind CSS v3.

## Core Value

A focus timer that feels rewarding to complete — pleasant ambient sounds while working, a satisfying end-of-session celebration, and a lightweight record of focus time.

## Current State

**Shipped v1.0** — 2,007 LOC TypeScript, 5 requirements satisfied, 3 plans executed.

- Timer completion triggers celebration overlay with fade-in animation and session logging to localStorage
- Session entries capture date, duration, vibe, and auto-detected mood (5-mood heuristic)
- Per-track audio error surfacing with badge indicators and retry buttons in mixer UI
- Paused tracks restored on relax page load via localStorage with save-effect guard
- Dead `/session` route removed
- 8-track audio mixer with individual volume/mute (pre-existing)
- Vibe presets (Lo-fi, Rainy Day, Jazz, Nature) with threshold-based detection
- Focus timer with 25/45/60/90 min presets and custom duration
- Relax mode (ambient-only, no timer)
- Backdrop scene selector with gradient overlays
- Keyboard shortcuts (Space play/pause, arrows volume)
- localStorage persistence for volumes, timer, scene
- Responsive two-column layout

**Build:** `npm run build`, `typecheck`, `lint` — all clean.

## Requirements

### Validated

- ✓ 8-track audio mixer with individual volume/mute — v1.0 (pre-existing)
- ✓ Vibe presets (Lo-fi, Rainy Day, Jazz, Nature) — v1.0 (pre-existing)
- ✓ Focus timer with 25/45/60/90 min presets — v1.0 (pre-existing)
- ✓ Relax mode (ambient-only, no timer) — v1.0 (pre-existing)
- ✓ Backdrop scene selector with gradient overlays — v1.0 (pre-existing)
- ✓ Keyboard shortcuts (Space play/pause, arrows volume) — v1.0 (pre-existing)
- ✓ localStorage persistence for volumes, timer, scene — v1.0 (pre-existing)
- ✓ Responsive two-column layout — v1.0 (pre-existing)
- ✓ Session completion — timer end triggers celebration UI and session logging — v1.0
- ✓ Audio error handling — surface playback failures per-track with retry — v1.0
- ✓ Restore pausedTracks state on relax page load — v1.0
- ✓ Remove dead `/session` route — v1.0

### Active

*(None — define requirements for next milestone via `/gsd-new-milestone`)*

### Out of Scope

- Journal page — removed; session logging is simple localStorage, no browse UI needed yet
- Settings page — removed; scene selection available on main pages
- User accounts / auth — single-user local app
- Sound notification on session end — out of scope for now
- Cross-fade transitions — out of scope
- Server-side persistence — everything is localStorage
- Tests, CI, error boundaries — not yet

## Context

- Remix v2 on Express, Vite 6, Tailwind v3, TypeScript strict
- Audio from remote `imissmycafe.com` MP3s via HTMLAudioElement (no Howler.js)
- All state is client-side localStorage, no backend database
- shadcn/ui v4 partially configured (button component exists, full design system not applied)
- Git repo exists, 20 commits in milestone v1.0
- `.planning/codebase/` has architecture and stack docs from prior codebase map

## Constraints

- **Runtime**: Node.js ≥ 20, Express server on port 3000
- **Audio**: Browser-only, never server-side. Remote MP3s may lack CORS headers
- **State**: localStorage only — no server DB, no API
- **CSS**: Tailwind v3 (not v4) — shadcn semantic colors mapped in config

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stripped Journal UI | Reduce surface area; log sessions to localStorage only | ✓ Good |
| Stripped Settings page | Reduce surface area; scene selection on main pages | ✓ Good |
| Removed Howler.js for native Audio | One less dependency, simpler | ✓ Good |
| No backend persistence | Single-user local app, no auth needed | ✓ Good |
| Threshold-based vibe detection (MATCH_THRESHOLD=5) | Prevents "Custom" label on minor track adjustments | ✓ Good |
| CelebrationOverlay with `<button>` backdrop | Semantic a11y — keyboard dismiss via Enter/Space | ✓ Good |
| trackErrors as Record<string, boolean> with functional updates | Prevents stale closures in audio error handling | ✓ Good |
| loadedRef guard for save-effect protection | Prevents localStorage overwrite of restored pausedTracks | ✓ Good |

---
*Last updated: 2026-04-29 after v1.0 milestone*
