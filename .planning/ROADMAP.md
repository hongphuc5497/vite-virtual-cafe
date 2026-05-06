# Roadmap: The Analog Sanctuary

**Created:** 2026-04-29
**Last updated:** 2026-05-07

## Milestones

- ✅ **v1.0 Complete the Session Loop** — Phase 1 (shipped 2026-04-29)
- ✅ **v1.1 JS Migration + Playwright Tests** — Phases 2-4 (shipped 2026-05-07)
- 🚧 **v1.2 Immersive Focus Mode** — Phase 5 (in progress)

## Phases

<details>
<summary>✅ v1.0 Complete the Session Loop (Phase 1) — SHIPPED 2026-04-29</summary>

- [x] Phase 1: Complete the Session Loop (3/3 plans) — completed 2026-04-29

See: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 JS Migration + Playwright Tests (Phases 2-4) — SHIPPED 2026-05-07</summary>

- [x] Phase 2: JS Migration (2/2 plans) — completed 2026-05-06
- [x] Phase 3: Playwright E2E Test Suite (4/4 plans) — completed 2026-05-07
- [x] Phase 4: CI Pipeline (1/1 plan) — completed 2026-05-07

See: `.planning/milestones/v1.1-ROADMAP.md`

</details>

### 🚧 v1.2 Immersive Focus Mode

### Phase 5: Immersive Focus Mode — hide all UI panels during active session, show only background image and timer

**Goal:** When a focus session starts, all control panels (audio mixer, vibe selector, duration picker, scene picker) animate out with a smooth fade-slide transition, leaving only the background image and a minimal floating timer. Hovering near the edges or pressing Escape reveals the panels temporarily. This eliminates visual clutter so the user can focus deeply without distraction.
**Depends on:** Phase 2 (JS Migration)
**Requirements:** IMMER-01, IMMER-02, IMMER-03
**Success Criteria** (what must be TRUE):
  1. Starting a focus session triggers all panels to fade/slide out smoothly (CSS transition ~400ms) — only the backdrop scene image and a minimal centered timer remain visible
  2. Pressing Escape or moving the cursor to the bottom 10% of the viewport reveals the panels with a reverse animation; panels auto-hide after 3 seconds of inactivity
  3. When the timer ends and the celebration overlay appears, panels restore to their default visible state — the immersive mode is session-scoped, not persistent
**Plans:** 2 plans
**Status:** Implemented — human validation passed 2026-05-07

Plans:
- [x] 05-01: Create `useImmersiveMode` hook and `ImmersiveTransition` wrapper component — manages show/hide state, Escape key listener, edge-hover detection, and animation coordination
- [x] 05-02: Integrate immersive mode into `_index.jsx` — wrap control panels, wire session start/stop lifecycle, ensure celebration overlay and relax page are unaffected

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Complete the Session Loop | v1.0 | 3/3 | Complete | 2026-04-29 |
| 2. JS Migration | v1.1 | 2/2 | Complete | 2026-05-06 |
| 3. Playwright E2E Test Suite | v1.1 | 4/4 | Complete | 2026-05-07 |
| 4. CI Pipeline | v1.1 | 1/1 | Complete | 2026-05-07 |
| 5. Immersive Focus Mode | v1.2 | 2/2 | Complete | 2026-05-07 |
