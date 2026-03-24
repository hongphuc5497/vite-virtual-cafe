# Refactoring Plan: _index.tsx Component Decomposition

## Current State Analysis

**File Size:** ~650 lines  
**Complexity:** High - Mix of state, audio, timer, keyboard, localStorage, and UI logic  
**Main Issues:**
- All logic contained in one component
- Difficult to test individual features
- Hard to reuse timer or audio logic elsewhere
- Large dependency graph
- Multiple side effects bundled together

---

## Proposed Architecture

### Layer 1: Custom Hooks (Business Logic)

Extract core logic into reusable hooks to manage state and side effects.

#### 1.1 `useSessionTimer`
**Purpose:** Timer countdown logic  
**Responsibilities:**
- Manage timer state (`timeLeft`, `isRunning`)
- Handle countdown interval
- Format time display
- Reset functionality

**Location:** `app/hooks/useSessionTimer.ts`

**Props:**
```typescript
export function useSessionTimer(initialDurationMinutes: number) {
  return {
    timeLeft: number;
    isRunning: boolean;
    formatTime: (seconds: number) => string;
    start: () => void;
    pause: () => void;
    stop: () => void;
    reset: (durationMinutes: number) => void;
    setTimeLeft: (seconds: number) => void;
  };
}
```

#### 1.2 `useAudioManager`
**Purpose:** Audio playback and track management  
**Responsibilities:**
- Audio element initialization
- Play/pause/stop functionality
- Volume control
- Track state management

**Location:** `app/hooks/useAudioManager.ts`

**Props:**
```typescript
export function useAudioManager(tracks: MixerTrack[]) {
  return {
    soundEnabled: boolean;
    pausedTracks: Record<string, boolean>;
    initializeAudio: () => Promise<boolean>;
    toggleSound: () => Promise<void>;
    toggleTrackPause: (label: string) => Promise<void>;
    updateTrackVolume: (label: string, value: number) => void;
    setTracks: (tracks: MixerTrack[]) => void;
  };
}
```

#### 1.3 `usePersistentState`
**Purpose:** LocalStorage persistence  
**Responsibilities:**
- Load saved preferences on mount
- Save state changes to localStorage
- Type-safe serialization/deserialization

**Location:** `app/hooks/usePersistentState.ts`

**Props:**
```typescript
export function usePersistentState<T>(
  key: string,
  initialState: T,
  serialize?: (state: T) => string,
  deserialize?: (json: string) => T
) {
  return {
    state: T;
    setState: (state: T) => void;
  };
}
```

#### 1.4 `useKeyboardShortcuts`
**Purpose:** Keyboard event handling  
**Responsibilities:**
- Listen for Space, Up, Down keys
- Trigger appropriate callbacks
- Clean up listeners

**Location:** `app/hooks/useKeyboardShortcuts.ts`

**Props:**
```typescript
export function useKeyboardShortcuts(callbacks: {
  onTogglePlay?: () => void;
  onVolumeIncrease?: () => void;
  onVolumeDecrease?: () => void;
}) {
  // Handles setup and cleanup
}
```

---

### Layer 2: Presentational Components (UI)

Break the JSX into logical, reusable components.

#### 2.1 `VirtualCafeIntro`
**Purpose:** Header section with intro text  
**Path:** `app/components/VirtualCafeIntro.tsx`

**Props:**
```typescript
interface VirtualCafeIntroProps {
  roomMood: string;
  dominantTrack: string;
}
```

**Children:** Static intro text

#### 2.2 `SessionTimer`
**Purpose:** Timer display with controls  
**Path:** `app/components/SessionTimer.tsx`

**Props:**
```typescript
interface SessionTimerProps {
  timeLeft: number;
  isRunning: boolean;
  draftDurationMinutes: number;
  onStart: () => void;
  onReset: () => void;
  onDurationChange: (minutes: number) => void;
  formatTime: (seconds: number) => string;
}
```

#### 2.3 `TrackControl`
**Purpose:** Individual track slider + controls  
**Path:** `app/components/TrackControl.tsx`

**Props:**
```typescript
interface TrackControlProps {
  label: string;
  value: number;
  isPaused: boolean;
  onVolumeChange: (value: number) => void;
  onTogglePause: () => void;
}
```

#### 2.4 `RoomMixControls`
**Purpose:** Sound button + all tracks  
**Path:** `app/components/RoomMixControls.tsx`

**Props:**
```typescript
interface RoomMixControlsProps {
  soundEnabled: boolean;
  tracks: MixerTrack[];
  pausedTracks: Record<string, boolean>;
  onToggleSound: () => void;
  onTrackVolumeChange: (label: string, value: number) => void;
  onTrackPauseToggle: (label: string) => void;
}
```

#### 2.5 `BackdropOverlay`
**Purpose:** Animated gradient overlay  
**Path:** `app/components/BackdropOverlay.tsx`

**Props:**
```typescript
interface BackdropOverlayProps {
  backdropGlow: number;
}
```

---

### Layer 3: Main Route Component (Orchestrator)

The refactored `_index.tsx` will coordinate hooks and components.

**Size:** ~100 lines (vs. 650 lines)

**Responsibilities:**
- Compose custom hooks
- Calculate derived values (roomMood, strongestTrack)
- Layout composition
- Pass props to child components

---

### Layer 4: Shared Utilities & Constants

#### 4.1 Constants file
**Path:** `app/constants/audioConfig.ts`

Extract:
- `DEFAULT_DURATION_MINUTES`
- `DEFAULT_TRACKS`
- `SOUND_URLS`
- `TRACK_BASE_VOLUME`
- `STORAGE_KEY`

---

## Implementation Phases

### Phase 1: Set Up Infrastructure
- [ ] Create `app/hooks/` directory
- [ ] Create `app/components/` directory
- [ ] Create `app/constants/` directory
- [ ] Create `app/types/` directory (move types)

### Phase 2: Extract Custom Hooks (No UI changes)
1. [ ] Create `useSessionTimer` hook
2. [ ] Create `useAudioManager` hook
3. [ ] Create `usePersistentState` hook
4. [ ] Create `useKeyboardShortcuts` hook
5. [ ] Verify all logic still works in _index.tsx

### Phase 3: Extract Components (Incremental)
1. [ ] Extract `VirtualCafeIntro`
2. [ ] Extract `SessionTimer`
3. [ ] Extract `TrackControl`
4. [ ] Extract `RoomMixControls`
5. [ ] Extract `BackdropOverlay`
6. [ ] Test after each extraction

### Phase 4: Extract Constants
- [ ] Move all constants to `app/constants/audioConfig.ts`
- [ ] Import in hooks and components

### Phase 5: Refactor _index.tsx
- [ ] Remove hook logic (use custom hooks)
- [ ] Remove component JSX (use components)
- [ ] Reduce to ~100 lines orchestrator
- [ ] Final testing

---

## Dependency Graph

```
_index.tsx (Main Route)
├── useSessionTimer
├── useAudioManager
├── usePersistentState
├── useKeyboardShortcuts
├── VirtualCafeIntro
├── SessionTimer
├── RoomMixControls
│   ├── TrackControl (multiple instances)
├── BackdropOverlay
└── constants/audioConfig
```

---

## Benefits

### Reusability
- Hooks can be used in other components/routes
- UI components can be styled consistently

### Testability
- Each hook can be tested independently
- Components are easier to unit test

### Maintainability
- Single Responsibility Principle
- Easier to locate and fix bugs
- Clearer code organization

### Scalability
- Easy to add new features
- Can refactor further without affecting other layers
- Better TypeScript support with smaller files

### Performance
- Lazy load components if needed
- Optimize re-renders with memoization
- Easier to split code

---

## File Structure After Refactoring

```
app/
├── routes/
│   └── _index.tsx (100 lines orchestrator)
├── components/
│   ├── VirtualCafeIntro.tsx
│   ├── SessionTimer.tsx
│   ├── TrackControl.tsx
│   ├── RoomMixControls.tsx
│   └── BackdropOverlay.tsx
├── hooks/
│   ├── useSessionTimer.ts
│   ├── useAudioManager.ts
│   ├── usePersistentState.ts
│   └── useKeyboardShortcuts.ts
├── constants/
│   └── audioConfig.ts
├── types/
│   └── audio.ts
└── ... (existing files)
```

---

## Estimated Effort

- **Phase 1:** 15 minutes (folder creation)
- **Phase 2:** 1-1.5 hours (hook extraction)
- **Phase 3:** 1-1.5 hours (component extraction)
- **Phase 4:** 15 minutes (constant extraction)
- **Phase 5:** 30 minutes (final refactoring + testing)

**Total:** ~4 hours

---

## Risk Mitigation

- ✅ Use version control to track changes
- ✅ Test each phase before moving to next
- ✅ Keep git commits atomic (one feature per commit)
- ✅ Maintain backward compatibility
- ✅ No breaking changes to route/UI

---

## Notes

- Audio element refs will need to persist across re-renders (handle in hook)
- Timer state syncs with UI duration input (managed in hook)
- localStorage persistence should be opt-in (managed by usePersistentState)
- Keyboard shortcuts can be toggled if needed
