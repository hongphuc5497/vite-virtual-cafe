# Requirements: The Analog Sanctuary

**Defined:** 2026-04-29
**Core Value:** A focus timer that feels rewarding to complete

## v1 Requirements

### Timer

- [ ] **TIMER-01**: When countdown reaches 0:00, show a completion celebration (visual feedback) and write session entry to localStorage
- [ ] **TIMER-02**: Session entry includes: date, duration, vibe, mood (auto-detected from active vibe)

### Audio

- [ ] **AUDIO-01**: When an audio track fails to load or play, surface the error in the UI (toast or inline indicator) instead of silently failing
- [ ] **AUDIO-02**: Restore pausedTracks from localStorage on relax page load, matching the behavior on the focus page

### Routes

- [ ] **ROUTE-01**: Remove the dead `/session` route that only redirects to `/`

## Out of Scope

| Feature | Reason |
|---------|--------|
| Journal browse UI | Removed — session data is write-only localStorage for now |
| Settings page | Removed — scene selection lives on main pages |
| Sound notification on session end | Defer to post-MVP |
| Cross-fade transitions | Defer to post-MVP |
| User accounts / auth | Single-user local app |
| Server-side persistence | localStorage only |
| Tests / CI / error boundaries | Not yet |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TIMER-01 | Phase 1 | Pending |
| TIMER-02 | Phase 1 | Pending |
| AUDIO-01 | Phase 1 | Pending |
| AUDIO-02 | Phase 1 | Pending |
| ROUTE-01 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0

---
*Requirements defined: 2026-04-29*
