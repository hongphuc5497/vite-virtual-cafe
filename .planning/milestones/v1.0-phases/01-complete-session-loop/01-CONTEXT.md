# Phase 1: Complete the Session Loop - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Timer end triggers a stats-focused celebration overlay and writes a session entry to localStorage. Audio errors are surfaced inline per track. Dead `/session` route is removed. Relax page restores pausedTracks from saved preferences.
</domain>

<decisions>
## Implementation Decisions

### Celebration UX
- **D-01:** Animated overlay on timer completion — fade-in transition, stats-focused content, tap anywhere to dismiss. No visible dismiss button needed.
- **D-02:** Overlay displays: session duration, vibe preset name, and auto-detected mood label. "Great work!" style congratulatory message.
- **D-03:** Session log entry is written to localStorage immediately when the overlay appears (save on show). Prevents data loss if user closes tab before dismissing.

### Session Log Structure
- **D-04:** Use a separate localStorage key (e.g., `virtual-cafe-sessions`) — not the existing `virtual-cafe-home-prefs` key. Keeps UI prefs and session history independent.
- **D-05:** Each session entry: `{ date: ISO string, durationMinutes: number, vibe: string, mood: string, tracksSnapshot: Record<string, number> }`.
- **D-06:** Keep all sessions — no cap. Entries are small (~200 bytes each). 5MB localStorage limit means thousands of entries before any concern.
- **D-07:** Mood is auto-detected via track-composition heuristic — top tracks by volume determine the mood label. Exact mood labels and trigger thresholds defined during planning.

### Audio Error Surfacing
- **D-08:** Inline error per track — each TrackControl row shows a red error icon badge when its audio fails.
- **D-09:** Flag both initial load failures and mid-playback failures. Show a retry button alongside the error badge.
- **D-10:** Error clears when retry succeeds or user toggles the track pause off/on.

### Relax Page Fix (AUDIO-02)
- **D-11:** Restore pausedTracks from localStorage on relax page load, matching _index.tsx behavior. Pass into useAudioManager as initial paused state.

### Dead Route Removal (ROUTE-01)
- **D-12:** Remove the `/session` route. If the route file doesn't exist on disk, verify no imports or links reference it.

### Claude's Discretion
- Overlay animation curve, exact typography, and layout within the card
- localStorage key name for session log
- Mood detection rules (specific moods, threshold values, track combinations)
- Error icon choice and exact TrackControl layout with retry button
- How to thread initial pausedTracks into useAudioManager
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — Vision, constraints (localStorage-only, browser-only audio), key decisions
- `.planning/REQUIREMENTS.md` — Five v1 requirements mapped to Phase 1 (TIMER-01, TIMER-02, AUDIO-01, AUDIO-02, ROUTE-01)

### Codebase maps
- `.planning/codebase/CONVENTIONS.md` — Component patterns, Tailwind styling, error handling approach
- `.planning/codebase/STRUCTURE.md` — File layout, key locations by feature
- `.planning/codebase/STACK.md` — Runtime, dependencies, audio approach (native HTMLAudioElement, not Howler.js per PROJECT.md decision)

No external specs — requirements are fully captured in REQUIREMENTS.md and decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **SessionTimer** (`app/components/SessionTimer.tsx`) — Already shows "Session Complete" badge when `timeLeft === 0`. Timer ring completes (progress=1). The overlay should appear alongside/instead of this badge state.
- **TrackControl** (`app/components/TrackControl.tsx`) — Individual track row with icon, volume slider, pause toggle. Error badge and retry button would extend this component.
- **useSessionTimer** (`app/hooks/useSessionTimer.ts`) — Auto-stops at 0 (`setIsRunning(false)`). Timer completion is detectable via `timeLeft === 0 && !isRunning`.
- **useAudioManager** (`app/hooks/useAudioManager.ts`) — Currently swallows errors silently in catch blocks. Needs to expose per-track error state.
- **RoomMixControls** (`app/components/RoomMixControls.tsx`) — Passes tracks and pausedTracks to TrackControl. Would need to thread error state through.

### Established Patterns
- Frosted glass cards: `background: rgba(255,255,255,0.88)`, `backdropFilter: blur(12px)`, rounded-2xl
- Tailwind utility classes with inline style overrides for brand colors (#f8f4db, #8f4a00, #1d1c0d)
- React.FC with explicit Props interfaces
- localStorage read in useEffect, write on dependency change
- Custom hooks for stateful logic extraction

### Integration Points
- **Timer completion detection:** `_index.tsx` line 55 — `timer.timeLeft === 0` condition already exists in `handleToggleTimer`. Celebration overlay triggers from here.
- **Session log write:** New hook or inline in `_index.tsx` useEffect watching `timer.timeLeft` reaching 0.
- **Audio error state:** `useAudioManager` return value — add `trackErrors: Record<string, boolean>`.
- **Relax pausedTracks:** `relax.tsx` line 32 — `useAudioManager(tracks)` call. Need initial paused state from localStorage.
</code_context>

<specifics>
## Specific Ideas

- Celebration should feel rewarding but not disruptive — the user just finished a focus session, don't yank them out of flow
- Fade-in overlay that respects the existing warm/cafe aesthetic (cream tones, not flashy)
- Error states should be visible but not alarming — audio is ambiance, not mission-critical

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 01-complete-session-loop*
*Context gathered: 2026-04-29*
