# Architecture Comparison

## Current Structure (Before Refactoring)

```
_index.tsx (650 lines)
│
├─ Types
│  └─ MixerTrack, SavedPreferences
│
├─ Constants (all in one file)
│  ├─ DEFAULT_DURATION_MINUTES
│  ├─ STORAGE_KEY
│  ├─ DEFAULT_TRACKS
│  ├─ SOUND_URLS
│  └─ TRACK_BASE_VOLUME
│
├─ State Management (3 useState, 3 useRef)
│  ├─ tracks
│  ├─ pausedTracks
│  ├─ timeLeft
│  ├─ isRunning
│  ├─ soundEnabled
│  ├─ draftDurationMinutes
│  ├─ appliedDurationMinutes
│  ├─ intervalRef
│  ├─ audioElementsRef
│  └─ initializedAudioRef
│
├─ Effects (5 useEffect)
│  ├─ [1] Load preferences from localStorage
│  ├─ [2] Save preferences to localStorage
│  ├─ [3] Handle timer countdown
│  ├─ [4] Manage audio playback
│  └─ [5] Setup keyboard shortcuts
│
├─ Utility Functions
│  └─ formatTime()
│
├─ Audio Management
│  ├─ initializeAudio()
│  ├─ handleToggleSound()
│  └─ handleTrackPauseToggle()
│
├─ Timer Management
│  ├─ handleToggleTimer()
│  └─ handleReset()
│
├─ Computed Values
│  ├─ strongestTrack
│  ├─ sunlightLevel
│  ├─ backdropGlow
│  └─ roomMood
│
└─ JSX Render (400 lines)
   ├─ BackdropOverlay
   ├─ Section[0]: Virtual Cafe Intro + Session Timer
   ├─ Section[1]: Empty (for backdrop on lg screens)
   └─ Aside: Room Mix Controls
      └─ Track Controls (8 instances)
```

**Problems:**
- ❌ All logic in one file
- ❌ Hard to test
- ❌ Not reusable
- ❌ Difficult to maintain
- ❌ Side effects scattered
- ❌ Mixed concerns

---

## Proposed Structure (After Refactoring)

```
app/
│
├─ routes/
│  └─ _index.tsx (100 lines - ORCHESTRATOR)
│     │
│     ├─ Compose hooks
│     ├─ Calculate derived values
│     ├─ Layout & composition
│     └─ Pass props to components
│
├─ hooks/ (BUSINESS LOGIC)
│  │
│  ├─ useSessionTimer.ts (50 lines)
│  │  ├─ timeLeft state
│  │  ├─ isRunning state
│  │  ├─ Timer interval
│  │  ├─ formatTime()
│  │  └─ Actions: start, pause, reset
│  │
│  ├─ useAudioManager.ts (80 lines)
│  │  ├─ soundEnabled state
│  │  ├─ pausedTracks state
│  │  ├─ Audio elements ref
│  │  ├─ Volume calculations
│  │  └─ Actions: initAudio, toggle, pause
│  │
│  ├─ usePersistentState.ts (40 lines)
│  │  ├─ Generic state hook
│  │  ├─ localStorage sync
│  │  └─ Type-safe serialization
│  │
│  └─ useKeyboardShortcuts.ts (30 lines)
│     ├─ Event listeners
│     ├─ Callback injection
│     └─ Cleanup handling
│
├─ components/ (PRESENTATIONAL UI)
│  │
│  ├─ VirtualCafeIntro.tsx (30 lines)
│  │  └─ Header, title, tags
│  │
│  ├─ SessionTimer.tsx (60 lines)
│  │  ├─ Time display
│  │  ├─ Duration input
│  │  └─ Start/Reset buttons
│  │
│  ├─ TrackControl.tsx (40 lines)
│  │  ├─ Single track item
│  │  ├─ Volume slider
│  │  └─ Play/Pause button
│  │
│  ├─ RoomMixControls.tsx (50 lines)
│  │  ├─ Header
│  │  ├─ Enable sound button
│  │  └─ Track list (uses TrackControl)
│  │
│  └─ BackdropOverlay.tsx (15 lines)
│     └─ Gradient overlay
│
├─ constants/
│  └─ audioConfig.ts (40 lines)
│     ├─ DEFAULT_DURATION_MINUTES
│     ├─ DEFAULT_TRACKS
│     ├─ SOUND_URLS
│     ├─ TRACK_BASE_VOLUME
│     └─ STORAGE_KEY
│
└─ types/
   └─ audio.ts (10 lines)
      ├─ MixerTrack
      └─ SavedPreferences
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Highly testable
- ✅ Reusable hooks & components
- ✅ Easy to maintain & extend
- ✅ Self-documenting code
- ✅ Better TypeScript support

---

## Data Flow Comparison

### Before Refactoring
```
_index.tsx
  ├─ State updates scattered
  ├─ Effects interdependent
  ├─ JSX mixed with logic
  └─ Hard to trace data flow
```

### After Refactoring
```
_index.tsx (Orchestrator)
  │
  ├─ useSessionTimer → SessionTimer Component
  ├─ useAudioManager → RoomMixControls → TrackControl
  ├─ usePersistentState → (wraps above hooks)
  ├─ useKeyboardShortcuts → (connects to hooks)
  │
  └─ Composed into layout
     ├─ BackdropOverlay
     ├─ VirtualCafeIntro
     ├─ SessionTimer
     └─ RoomMixControls
```

**Clear data flow:**
- Props down
- Callbacks up
- Derived values computed in orchestrator
- Hooks manage side effects

---

## Component Reusability

### Before
- ❌ SessionTimer only works in this route
- ❌ Audio control tied to this specific UI
- ❌ Timer logic can't be used elsewhere

### After
- ✅ `useSessionTimer` can be imported into any component
- ✅ `TrackControl` can be styled/used independently
- ✅ `useAudioManager` works with any UI
- ✅ `usePersistentState` is generic

Example: Using hooks in a different route
```typescript
// dashboard.tsx
import { useSessionTimer } from '~/hooks/useSessionTimer';

export default function Dashboard() {
  const timer = useSessionTimer(25);
  
  return <>Timer: {timer.formatTime(timer.timeLeft)}</>;
}
```

---

## Testing Improvements

### Before
```
❌ Can't test timer without rendering entire page
❌ Can't test audio without mocking HTMLAudioElement globally
❌ Can't test localStorage without side effects
❌ Components not unit testable
```

### After
```
✅ Test useSessionTimer independently
  describeit('useSessionTimer', () => {
    it('should countdown when running', () => { /* hook test */ });
  });

✅ Test useAudioManager independently
  describe('useAudioManager', () => {
    it('should initialize audio elements', () => { /* hook test */ });
  });

✅ Test components without business logic
  describe('SessionTimer', () => {
    it('should display time correctly', () => { /* component test */ });
  });

✅ Integration test for full page
  describe('Index route', () => {
    it('should load and interact', () => { /* e2e test */ });
  });
```

---

## Migration Safety

### No Breaking Changes
- Same route `/`
- Same functionality
- Same UI/UX
- Same data persistence

### Backward Compatible
- All localStorage keys remain the same
- API signatures allow gradual migration
- Can refactor in phases
- Can revert easily with git

### Testing Strategy
1. Verify current behavior works (baseline)
2. Extract hooks → test hooks match original behavior
3. Extract components → test components render correctly
4. Combine → test full page works as before
5. Done! ✅

---

## Performance Impact

### Potential Improvements
- Smaller initial bundle (code splitting)
- Easier to memoize (prevent re-renders)
- Lazy load components if needed
- Better tree-shaking with modular code

### No Regressions
- Same number of state updates
- Same number of effects
- Same DOM structure
- Same event handling

---

## Estimated Lines of Code

| Before | After | Savings |
|--------|-------|---------|
| _index.tsx: 650 | _index.tsx: 100 | 550 lines |
| N/A | hooks/: 200 | new files |
| N/A | components/: 195 | new files |
| N/A | constants/: 40 | new files |
| N/A | types/: 10 | new files |
| **Total: 650** | **Total: 545** | **13% reduction** |

Plus:
- Much easier to read (average file: 50 lines)
- Better organized
- More maintainable
- More testable

---

## Next Steps

1. **Review this plan** - Is the architecture aligned with your vision?
2. **Approve scope** - Should we include all 4 hooks or fewer?
3. **Choose phase** - Start with Phase 1, or start directly with hooks?
4. **Execution** - Ready to implement?

See `REFACTORING_PLAN.md` for detailed implementation guide.
