# Roadmap: The Analog Sanctuary

**Created:** 2026-04-29
**Granularity:** Standard
**Total phases:** 5 (v1.0: 1 phase, v1.1: 3 phases, v1.2: 1 phase)

### Phase 5: Immersive Focus Mode — hide all UI panels during active session, show only background image and timer

**Goal:** When a focus session starts, all control panels (audio mixer, vibe selector, duration picker, scene picker) animate out with a smooth fade-slide transition, leaving only the background image and a minimal floating timer. Hovering near the edges or pressing Escape reveals the panels temporarily. This eliminates visual clutter so the user can focus deeply without distraction.
**Depends on:** Phase 2 (JS Migration)
**Requirements:** IMMER-01, IMMER-02, IMMER-03
**Success Criteria** (what must be TRUE):
  1. Starting a focus session triggers all panels to fade/slide out smoothly (CSS transition ~400ms) — only the backdrop scene image and a minimal centered timer remain visible
  2. Pressing Escape or moving the cursor to the bottom 10% of the viewport reveals the panels with a reverse animation; panels auto-hide after 3 seconds of inactivity
  3. When the timer ends and the celebration overlay appears, panels restore to their default visible state — the immersive mode is session-scoped, not persistent
**Plans:** 2 plans

Plans:
- [ ] 05-01: Create `useImmersiveMode` hook and `ImmersiveTransition` wrapper component — manages show/hide state, Escape key listener, edge-hover detection, and animation coordination
- [ ] 05-02: Integrate immersive mode into `_index.jsx` — wrap control panels, wire session start/stop lifecycle, ensure celebration overlay and relax page are unaffected

---

## Milestones

- ✅ **v1.0 Complete the Session Loop** — Phase 1 (shipped 2026-04-29)
- 🚧 **v1.1 JS Migration + Playwright Tests** — Phases 2-4 (in progress)

### Phase 2: JS Migration
**Goal**: The entire codebase runs on JavaScript with zero behavior changes — all files converted, TypeScript infrastructure removed, and all build/dev scripts work without TS
**Depends on**: Phase 1 (v1.0 shipped)
**Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04
**Success Criteria** (what must be TRUE):
  1. All 20+ `.ts`/`.tsx` source files (app/ + vite.config.ts) are converted to `.js`/`.jsx` with types stripped and identical runtime logic
  2. TypeScript dependencies removed from `package.json`, `tsconfig.json` deleted, `typecheck` script removed
  3. ESLint operates on `.js`/`.jsx` files without `@typescript-eslint` parser/plugins — strict rules and existing plugins (react, react-hooks, jsx-a11y, import) preserved
  4. `npm run dev`, `npm run build`, and `npm start` work with the JS-only codebase — no TS imports remain
**Plans**: 2 plans

Plans:
- [x] 02-01: Convert all 22 `.ts`/`.tsx` files to `.js`/`.jsx` — strip type annotations, delete types/audio.ts, configure vite.config.js resolve.alias (MIGR-01)
- [x] 02-02: Remove 10 TS packages from devDependencies, delete tsconfig.json, drop typecheck script, reconfigure ESLint for JS-only, verify full build pipeline (MIGR-02, MIGR-03, MIGR-04)

### Phase 3: Playwright E2E Test Suite
**Goal**: All user flows are validated by automated Playwright E2E tests against the migrated JS codebase
**Depends on**: Phase 2
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04
**Success Criteria** (what must be TRUE):
  1. Focus timer E2E test passes: user sets a timer duration -> countdown display decrements in real time -> timer reaches zero -> celebration overlay appears with fade-in -> session entry is written to localStorage with correct data
  2. Audio mixer E2E test passes: tracks can be played and paused individually -> volume sliders adjust output -> playback failure shows a red error badge -> retry button re-attempts playback -> selecting a vibe preset changes the active track set
  3. Relax page E2E test passes: navigating to `/relax` loads ambient-only mode -> ambient tracks play without any timer UI -> paused tracks state from a previous session is restored from localStorage on page load
  4. Navigation + scenes E2E test passes: route switching between `/` and `/relax` works -> backdrop scene selector changes the gradient overlay -> keyboard shortcuts (Space for play/pause, arrow keys for volume) function correctly
**Plans**: 4 plans

Plans:
- [x] 03-01: Install Playwright, create `playwright.config.js`, write base test infrastructure (fixtures, page-object helpers, shared selectors/constants)
- [x] 03-02: Write focus timer E2E test + navigation/scenes E2E test (TEST-01, TEST-04)
- [x] 03-03: Write audio mixer E2E test + relax page E2E test (TEST-02, TEST-03)
- [x] 03-04: Run full test suite, debug failures, achieve green suite against JS codebase

### Phase 4: CI Pipeline
**Goal**: Playwright tests run automatically on every push and pull request, with multi-browser coverage visible as CI status checks
**Depends on**: Phase 3
**Requirements**: CI-01
**Success Criteria** (what must be TRUE):
  1. GitHub Actions workflow triggers on every push and pull request to `main`
  2. Playwright tests execute across Chromium, Firefox, and WebKit browsers in parallel
  3. PR status check shows pass/fail — a failing test blocks merge
**Plans**: 1 plan

Plans:
- [ ] 04-01: Create `.github/workflows/playwright.yml` with checkout, Node setup, dependency install, build, `npx playwright install --with-deps`, and test run steps across a multi-browser matrix

### Phase 1 (completed — v1.0)
**Goal**: Complete the session loop — timer completion triggers celebration and session logging, audio error handling with retry, relax page restores pausedTracks
**Plans**: 3 plans
**Status**: Complete (2026-04-29)

Plans:
- [x] 01-01: Session completion flow — celebration UI + localStorage logging
- [x] 01-02: Audio error handling — per-track error surfacing with retry
- [x] 01-03: Relax page pausedTracks restore + dead route removal

## Progress

**Execution Order:** Phase 1 (complete) -> Phase 2 -> Phase 3 -> Phase 4

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Complete the Session Loop | v1.0 | 3/3 | Complete | 2026-04-29 |
| 2. JS Migration | v1.1 | 2/2 | Complete | 2026-05-06 |
| 3. Playwright E2E Test Suite | v1.1 | 4/4 | Complete | 2026-05-07 |
| 4. CI Pipeline | v1.1 | 0/1 | Not started | - |
| 5. Immersive Focus Mode | v1.2 | 0/2 | Not started | - |
