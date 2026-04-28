# The Analog Sanctuary

## What This Is

A virtual café ambiance and focus-timer web app. Users mix layered ambient soundscapes (barista, rain, fireplace, chatter) while running a Pomodoro-style countdown timer. When a session ends, the app celebrates completion and logs the session. Built with Remix v2 on Express + Vite + Tailwind CSS v3.

## Core Value

A focus timer that feels rewarding to complete — pleasant ambient sounds while working, a satisfying end-of-session experience, and a lightweight record of focus time.

## Requirements

### Validated

- ✓ 8-track audio mixer with individual volume/mute — existing
- ✓ Vibe presets (Lo-fi, Rainy Day, Jazz, Nature) — existing
- ✓ Focus timer with 25/45/60/90 min presets and custom duration — existing
- ✓ Relax mode (ambient-only, no timer) — existing
- ✓ Backdrop scene selector with gradient overlays — existing
- ✓ Keyboard shortcuts (Space play/pause, arrows volume) — existing
- ✓ localStorage persistence for volumes, timer, scene — existing
- ✓ Responsive two-column layout — existing

### Active

- [ ] Session completion — timer end triggers celebration UI and session logging
- [ ] Audio error handling — surface playback failures to the user
- [ ] Restore pausedTracks state on relax page load
- [ ] Remove dead `/session` route

### Out of Scope

- Journal page — removed; session logging is simple localStorage, no browse UI needed yet
- Settings page — removed; scene selection available on main pages
- User accounts / auth — single-user local app
- Sound notification on session end — out of scope for now
- Cross-fade transitions — out of scope
- Server-side persistence — everything is localStorage
- Tests, CI, error boundaries — not yet

## Context

- Existing Remix v2 app on Express, Vite 6, Tailwind v3, TypeScript strict
- Audio from remote `imissmycafe.com` MP3s via HTMLAudioElement (no Howler.js)
- All state is client-side localStorage, no backend database
- Journal and Settings routes were recently stripped to reduce scope
- `.planning/codebase/` has architecture and stack docs from prior codebase map
- Git repo exists, clean working tree

## Constraints

- **Runtime**: Node.js ≥ 20, Express server on port 3000
- **Audio**: Browser-only, never server-side. Remote MP3s may lack CORS headers
- **State**: localStorage only — no server DB, no API
- **Scope**: Tight MVP — complete the core session loop, nothing else

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stripped Journal UI | Reduce surface area; log sessions to localStorage only | — Pending |
| Stripped Settings page | Reduce surface area; scene selection on main pages | — Pending |
| Removed Howler.js for native Audio | One less dependency, simpler | ✓ Good |
| No backend persistence | Single-user local app, no auth needed | ✓ Good |

---
*Last updated: 2026-04-29 after initialization*
