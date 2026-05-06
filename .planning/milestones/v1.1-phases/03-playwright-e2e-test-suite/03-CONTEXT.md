# Phase 3: Playwright E2E Test Suite - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Automated Playwright E2E tests covering all 4 user flows against the migrated JS codebase. Tests validate: focus timer countdown → celebration → localStorage logging; audio mixer play/pause/volume/error/retry; relax page ambient-only mode with pausedTracks restore; navigation + scene switching + keyboard shortcuts. Test infrastructure is CI-ready — Phase 4 wires it into GitHub Actions.
</domain>

<decisions>
## Implementation Decisions

### Test Structure & Organization
- **Per-flow test files** — `tests/timer.spec.js`, `tests/audio.spec.js`, `tests/relax.spec.js`, `tests/navigation.spec.js`. Match ROADMAP plan structure.
- **Shared page-object helpers** — `tests/helpers/mainPage.js`, `tests/helpers/relaxPage.js` with common selectors and actions.
- **Central constants file** — `tests/constants.js` with CSS selectors, text labels, timeouts, URLs. Single source of truth.
- **Manual `test.beforeEach` setup** — no custom fixture complexity. Navigate, seed localStorage if needed.

### Test Server & Port Management
- **`webServer` in `playwright.config.js`** — Playwright auto-starts `npm run dev`, waits for port 3000, kills on test end.
- **Port 3000** — same as dev. No separate test port.
- **`baseURL: 'http://localhost:3000'`** — all tests use relative paths (`page.goto('/')`).
- **Playwright default readiness** — waits for `webServer.url` to respond, no custom health check.

### Selector Strategy & Assertions
- **`data-testid` attributes** — add to key interactive elements (timer display, play buttons, volume sliders). Refactor-safe.
- **Polled text assertions** — `expect(locator).toContainText(...)` with generous timeout for timer ticks.
- **Visibility assertion for celebration** — `expect(overlay).toBeVisible()` + check `localStorage` for session entry.
- **Stub/mock audio** — inject `page.route()` to intercept MP3 requests and return short silent audio blob. Avoids network/CORS issues.

### CI Readiness & Browser Matrix
- **Chromium only locally** — fastest feedback. Firefox + WebKit added in CI (Phase 4).
- **Add `data-testid` in test plans (03-02, 03-03)** — each plan adds the attributes it needs to components.
- **30s per test, 2min per suite** — generous timeouts. Audio stubbing means no real-audio waits.
- **Screenshots on failure** — `screenshot: 'only-on-failure'` in config, saved to `test-results/`.

### Canonical Constraints (from prior phases)
- Playwright config must use `.js` not `.ts` (Phase 2 decision — TypeScript removed)
- Audio is browser-only, remote MP3s may lack CORS headers (PROJECT.md constraint)

### Claude's Discretion
- Exact Playwright config structure and options within the decided patterns
- `data-testid` naming conventions and placement in components
- Page object helper API design
- Audio stub implementation details (silent WAV blob, route pattern matching)
- localStorage seeding approach for tests needing prior state
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Routes**: `app/routes/_index.jsx` (main page — timer, mixer, vibe, scene), `app/routes/relax.jsx` (ambient-only)
- **Components**: `CelebrationOverlay.jsx`, `RoomMixControls.jsx`, `SessionTimer.jsx`, `TrackControl.jsx`, `VibeSelector.jsx`, `BackdropOverlay.jsx`
- **Hooks**: `useAudioManager.js` (audio state + playback), `useSessionTimer.js` (countdown + completion), `useKeyboardShortcuts.js`, `usePersistentState.js`
- **Constants**: `app/constants/audioConfig.ts` — DEFAULT_TRACKS, vibe presets, durations

### Established Patterns
- All state is client-side localStorage (no backend)
- Audio via native HTMLAudioElement (not Howler.js)
- Tailwind v3 for all styling
- No test runner currently exists — starting from scratch

### Integration Points
- `server.js` — Express + Vite dev server, must be running for tests
- `package.json` — `npm run dev` starts the server
- Port 3000 — hardcoded in server.js
</code_context>

<specifics>
## Specific Ideas

No specific user requirements beyond ROADMAP success criteria. Standard Playwright E2E patterns apply.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>
