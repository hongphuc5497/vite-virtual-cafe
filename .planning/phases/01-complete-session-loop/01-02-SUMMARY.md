---
phase: 01-complete-session-loop
plan: 02
subsystem: audio
tags: [audio-error-handling, localStorage, react, typescript]

# Dependency graph
requires:
  - useAudioManager hook (audio state management)
  - TrackControl component (per-track UI)
  - RoomMixControls component (track list container)
  - SessionEntry type for session log entries (from 01-01)
  - CelebrationOverlay component (from 01-01)
provides:
  - Per-track error state (trackErrors) surfaced as red error badge on TrackControl
  - Retry button per failed track (calls retryTrack -> load() + play())
  - Error clearing on retry success or pause toggle (D-10)
  - PausedTracks restoration on relax page load from localStorage (D-11)
  - LoadedRef guard to prevent save effect overwrite on initial mount (Pitfall 4)
affects:
  - app/hooks/useAudioManager.ts
  - app/components/TrackControl.tsx
  - app/components/RoomMixControls.tsx
  - app/routes/_index.tsx
  - app/routes/relax.tsx

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Per-track error state propagation via props (useAudioManager -> RoomMixControls -> TrackControl)
    - Synchronous localStorage read before hook call for initial state injection
    - loadedRef guard pattern to prevent save-effect overwrite of restored state
    - Retry flow: audioElement.load() + audioElement.play() with per-track error clearing

key-files:
  created: []
  modified:
    - app/hooks/useAudioManager.ts (trackErrors state, retryTrack, initialPausedTracks param, setAllPausedTracks)
    - app/components/TrackControl.tsx (hasError/onRetry props, error badge, retry button)
    - app/components/RoomMixControls.tsx (trackErrors/onTrackRetry props threaded to TrackControl)
    - app/routes/_index.tsx (trackErrors and onTrackRetry wired to RoomMixControls)
    - app/routes/relax.tsx (initialPausedTracks from localStorage, loadedRef guard)

key-decisions:
  - "trackErrors uses Record<string, boolean> with functional state updates to avoid stale closures (Pitfall 3 mitigation)"
  - "audioElement.onerror assigned at creation time (in initializeAudio) for load-failure detection"
  - "toggleTrackPause clears trackErrors[label] on unpause, not on pause (D-10)"
  - "retryTrack guards against missing audio element (audioElement null check)"
  - "loadedRef guards save effect in relax.tsx, preventing initial-mount overwrite of restored pausedTracks (Pitfall 4 mitigation)"
  - "Synchronous localStorage read of initialPausedTracks before useState calls -- JavaScript variable, not hook, so SSR-safe with typeof window guard"

patterns-established:
  - "Error propagation: useAudioManager provides trackErrors state -> RoomMixControls receives it -> each TrackControl checks its own error flag"
  - "Retry handler chain: TrackControl.onRetry -> RoomMixControls.onTrackRetry -> useAudioManager.retryTrack"
  - "Initial state injection: synchronous localStorage read before hook call with SSR guard"

requirements-completed: [AUDIO-01, AUDIO-02]

# Metrics
duration: 4min
completed: 2026-04-29
---

# Phase 1 Plan 2: Audio error surfacing and relax page pausedTracks restoration

**HTMLAudioElement play() rejections and error events are captured per-track as Record<string, boolean> state, surfaced as red error icon badges with retry buttons on each TrackControl row. On the relax page, pausedTracks are read from localStorage synchronously before the useAudioManager call and passed as initialPausedTracks, with a loadedRef guard preventing the save effect from overwriting restored state on initial mount.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-29
- **Completed:** 2026-04-29
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Extended useAudioManager with per-track error state, error clearing on retry success/pause toggle, optional initialPausedTracks parameter, and setAllPausedTracks wrapper
- Added inline error badge (material "error", #ba1a1a, absolute positioned on track icon) and retry button (material "refresh", #877366 / hover #8f4a00) to TrackControl per UI-SPEC
- Extended RoomMixControls to accept and thread trackErrors and onTrackRetry to each TrackControl
- Wired trackErrors and retryTrack to RoomMixControls in both _index.tsx and relax.tsx
- Implemented pausedTracks restoration in relax.tsx via synchronous localStorage read with SSR guard and loadedRef save-effect protection

## Task Commits

Each task was committed atomically:

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Extend useAudioManager with trackErrors, retryTrack, initialPausedTracks, setAllPausedTracks | 457460d | app/hooks/useAudioManager.ts |
| 2 | Update TrackControl and RoomMixControls for error display and retry | a824e11 | app/components/TrackControl.tsx, app/components/RoomMixControls.tsx |
| 3 | Thread error props in _index.tsx and restore pausedTracks in relax.tsx | 8f630d0 | app/routes/_index.tsx, app/routes/relax.tsx |

**Plan metadata:** No metadata commit yet (STATE.md unavailable)

## Files Modified

- `app/hooks/useAudioManager.ts` -- Extended with initialPausedTracks? param, trackErrors state, audioElement.onerror, per-track play() error handling, retryTrack function, setAllPausedTracks wrapper; all new items exposed in return
- `app/components/TrackControl.tsx` -- Added hasError: boolean and onRetry: () => void props; icon wrapped in relative div with absolute-positioned error badge (material "error", #ba1a1a, 14px); retry button (material "refresh", text-outline/hover:text-primary) rendered conditionally alongside pause button in flex container
- `app/components/RoomMixControls.tsx` -- Added trackErrors and onTrackRetry props; threads hasError and onRetry to each TrackControl
- `app/routes/_index.tsx` -- Added trackErrors={audio.trackErrors} and onTrackRetry prop to RoomMixControls invocation
- `app/routes/relax.tsx` -- Added useRef import; synchronous localStorage read of pausedTracks with SSR guard; loadedRef useRef(false) for save-effect guard; loadedRef.current = true in load effect completion; initialPausedTracks passed to useAudioManager; trackErrors and onTrackRetry wired to RoomMixControls

## Decisions Made
- Error badge uses absolute positioning (-right-1 -top-1) relative to the track icon, per UI-SPEC layout
- Both onerror event and play() promise rejection set trackErrors, covering load failures and playback failures respectively (D-09)
- Error clears on retryTrack success (load() + play() resolves) AND on pause toggle unpause (D-10)
- retryTrack calls audioElement.load() then .play(); on success the sync-volume useEffect adjusts volume on next render
- relax.tsx reads initialPausedTracks synchronously at function top (before useState), not inside useEffect, so useAudioManager gets correct initial state from first render

## Deviations from Plan

None - plan executed exactly as written.

**Auto-fixed Issues:** None

## Issues Encountered
- **Pre-existing build failure:** `npm run build` fails due to `text-foreground` class not found in `app/tailwind.css` (shadcn CSS layer issue). This is unrelated to this plan's changes -- logged in deferred-items.md.
- All three tasks passed `npm run typecheck` and `npm run lint` with zero errors.

## Threat Flags

None. All threat surface is within expected scope:
- T-02-01 (DoS): Mitigated via error badge + retry button (non-blocking per-track)
- T-02-02 (Tampering): Accepted -- pausedTracks is ephemeral UI preference
- T-02-03 (Spoofing): Accepted -- retry is convenience operation

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Audio error handling fully wired through useAudioManager -> RoomMixControls -> TrackControl
- PausedTracks restored on relax page load
- Next plan (01-03): Dead route removal (session.tsx) builds on this foundation

---
*Phase: 01-complete-session-loop*
*Completed: 2026-04-29*
