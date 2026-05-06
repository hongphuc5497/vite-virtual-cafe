# Requirements: The Analog Sanctuary

**Defined:** 2026-04-29
**Core Value:** A focus timer that feels rewarding to complete

## v1.1 Requirements

### Migration

- [ ] **MIGR-01**: Convert all .ts/.tsx files to .js/.jsx, stripping all type annotations while preserving all logic identically
- [ ] **MIGR-02**: Remove TypeScript dependencies (typescript, @types/*), delete tsconfig.json, drop typecheck script
- [ ] **MIGR-03**: Update ESLint config for JavaScript — remove @typescript-eslint parser/plugins, keep strict rules
- [ ] **MIGR-04**: Verify server.js and all configs work with JS-only codebase (no TS imports remain)

### Testing

- [ ] **TEST-01**: Focus timer E2E — set timer, verify countdown, celebration overlay appears, session logged to localStorage
- [ ] **TEST-02**: Audio mixer E2E — play/pause tracks, volume slider, error badge on failure, retry button, vibe preset selection
- [ ] **TEST-03**: Relax page E2E — navigate to /relax, play ambient tracks, verify no timer present, pausedTracks restored from localStorage
- [ ] **TEST-04**: Navigation + scenes E2E — route switching, backdrop scene selector, keyboard shortcuts (Space, arrows)

### CI

- [ ] **CI-01**: GitHub Actions workflow running Playwright tests on push/PR, with multi-browser matrix

## Out of Scope

| Feature | Reason |
|---------|--------|
| Journal browse UI | Removed — session data is write-only localStorage |
| Settings page | Removed — scene selection lives on main pages |
| Sound notification on session end | Defer to post-v1.1 |
| Cross-fade transitions | Defer to post-v1.1 |
| User accounts / auth | Single-user local app |
| Server-side persistence | localStorage only |
| Visual regression tests | E2E functional only for now |
| Unit tests | Playwright E2E covers all flows |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | Phase 2 | Pending |
| MIGR-02 | Phase 2 | Pending |
| MIGR-03 | Phase 2 | Pending |
| MIGR-04 | Phase 2 | Pending |
| TEST-01 | Phase 3 | Pending |
| TEST-02 | Phase 3 | Pending |
| TEST-03 | Phase 3 | Pending |
| TEST-04 | Phase 3 | Pending |
| CI-01 | Phase 4 | Pending |

**Coverage:**
- v1.1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0

---
*Requirements defined: 2026-04-29*
