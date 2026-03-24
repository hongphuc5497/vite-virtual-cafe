# Quick Reference: Hooks & Components Breakdown

## Custom Hooks to Extract

### 1️⃣ useSessionTimer
**File:** `app/hooks/useSessionTimer.ts`

**Current code locations:**
- State: `timeLeft`, `isRunning` (lines 67-68)
- Effect: Timer countdown (lines 154-175)
- Handlers: `handleToggleTimer()`, `handleReset()` (lines 361-378)
- Utility: `formatTime()` (line 231)

**Dependencies:**
- None (no external props needed, but needs `durationMinutes` parameter)

**Usage in _index.tsx:**
```typescript
const timer = useSessionTimer(appliedDurationMinutes);
// Replace: timeLeft, isRunning, formatTime, handleToggleTimer, handleReset
```

---

### 2️⃣ useAudioManager
**File:** `app/hooks/useAudioManager.ts`

**Current code locations:**
- State: `soundEnabled`, `pausedTracks` (lines 59-60)
- Refs: `audioElementsRef`, `initializedAudioRef` (lines 70-71)
- Effect: Audio playback sync (lines 176-185)
- Effect: Audio cleanup (lines 187-198)
- Handlers: `initializeAudio()`, `handleToggleSound()`, `handleTrackPauseToggle()` (lines 237-358)

**Dependencies:**
- tracks (pass as param)
- SOUND_URLS, TRACK_BASE_VOLUME (from constants)
- DEFAULT_TRACKS (from constants)

**Usage in _index.tsx:**
```typescript
const audio = useAudioManager(tracks);
// Replace: soundEnabled, pausedTracks, initializeAudio, handleToggleSound, handleTrackPauseToggle
// Also pass audio.toggleSound to RoomMixControls
// Pass audio.pausedTracks to RoomMixControls
```

---

### 3️⃣ usePersistentState
**File:** `app/hooks/usePersistentState.ts`

**Current code locations:**
- Effect: Load from localStorage (lines 75-111)
- Effect: Save to localStorage (lines 113-136)

**Dependencies:**
- STORAGE_KEY (from constants)
- SavedPreferences type

**Usage in _index.tsx:**
```typescript
// Wrap existing state or call directly for persistence
const { state, setState } = usePersistentState<SavedPreferences>(
  STORAGE_KEY, 
  { /* defaults */ }
);
```

---

### 4️⃣ useKeyboardShortcuts
**File:** `app/hooks/useKeyboardShortcuts.ts`

**Current code locations:**
- Effect: Keyboard event listeners (lines 200-229)

**Dependencies:**
- Callbacks as parameters

**Usage in _index.tsx:**
```typescript
useKeyboardShortcuts({
  onTogglePlay: () => timer.start(),
  onVolumeIncrease: () => audio.increaseVolume(),
  onVolumeDecrease: () => audio.decreaseVolume(),
});
```

---

## Components to Extract

### 1️⃣ VirtualCafeIntro
**File:** `app/components/VirtualCafeIntro.tsx`

**Current code locations:**
- JSX: Lines 419-443

**Props:**
```typescript
interface VirtualCafeIntroProps {
  roomMood: string;
  dominantTrack: string;
}
```

**What to keep:**
- Title, description, tags
- roomMood and dominantTrack values calculated in parent

**What to omit:**
- Session Timer (will be separate component)

---

### 2️⃣ SessionTimer
**File:** `app/components/SessionTimer.tsx`

**Current code locations:**
- JSX: Lines 444-476

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

**Extract as-is from JSX, convert to controlled component**

---

### 3️⃣ TrackControl (New Component)
**File:** `app/components/TrackControl.tsx`

**Current code locations:**
- JSX: Lines 507-564 (one item from .map)

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

**Create from the mapped item in RoomMixControls**

---

### 4️⃣ RoomMixControls
**File:** `app/components/RoomMixControls.tsx`

**Current code locations:**
- JSX: Lines 478-564

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

**Key change:**
- Extract track mapping into TrackControl component
- Keep header and sound button in this component

---

### 5️⃣ BackdropOverlay
**File:** `app/components/BackdropOverlay.tsx`

**Current code locations:**
- JSX: Lines 391-394 (the gradient div)

**Props:**
```typescript
interface BackdropOverlayProps {
  backdropGlow: number;
}
```

**Very simple, just styling**

---

## Constants to Extract

**File:** `app/constants/audioConfig.ts`

**Move these lines:**
- Lines 17-30: Sound URLs
- Lines 20-28: DEFAULT_TRACKS
- Lines 31-47: SOUND_URLS
- Lines 49-56: TRACK_BASE_VOLUME
- Lines 18: DEFAULT_DURATION_MINUTES
- Lines 19: STORAGE_KEY

**Also:**
- Line 31-33: DEFAULT_PAUSED_TRACKS (computed, move logic here)

---

## Types to Extract

**File:** `app/types/audio.ts`

**Move these:**
- Lines 3-5: MixerTrack type
- Lines 7-14: SavedPreferences type

---

## Refactored _index.tsx Structure (100 lines)

```typescript
import { useSessionTimer } from '~/hooks/useSessionTimer';
import { useAudioManager } from '~/hooks/useAudioManager';
import { usePersistentState } from '~/hooks/usePersistentState';
import { useKeyboardShortcuts } from '~/hooks/useKeyboardShortcuts';
import { VirtualCafeIntro } from '~/components/VirtualCafeIntro';
import { SessionTimer } from '~/components/SessionTimer';
import { RoomMixControls } from '~/components/RoomMixControls';
import { BackdropOverlay } from '~/components/BackdropOverlay';
import { DEFAULT_TRACKS, DEFAULT_DURATION_MINUTES } from '~/constants/audioConfig';

export default function Index() {
  // Initialize hooks
  const timer = useSessionTimer(DEFAULT_DURATION_MINUTES);
  const audio = useAudioManager(DEFAULT_TRACKS);
  
  // Persist state
  usePersistentState('prefs', { /* state */ });
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: timer.toggle,
    onVolumeUp: audio.increaseAll,
    onVolumeDown: audio.decreaseAll,
  });
  
  // Computed values
  const strongestTrack = [...audio.tracks].sort(...)[0];
  const sunlightLevel = audio.tracks.find(t => t.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;
  const roomMood = sunlightLevel >= 50 ? "soft daylight" : "after dark";
  
  // Render
  return (
    <main className="...">
      <BackdropOverlay backdropGlow={backdropGlow} />
      <div className="...">
        <section>
          <VirtualCafeIntro 
            roomMood={roomMood} 
            dominantTrack={strongestTrack.label} 
          />
          <SessionTimer 
            {...timer}
            onStart={timer.start}
            // ... other timer props
          />
        </section>
        <RoomMixControls 
          {...audio}
          onToggleSound={audio.toggleSound}
          // ... other audio props
        />
      </div>
    </main>
  );
}
```

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create `app/hooks/` directory
- [ ] Create `app/components/` directory
- [ ] Create `app/constants/` directory
- [ ] Create `app/types/` directory

### Phase 2: Extract Constants & Types
- [ ] Create `app/types/audio.ts` with MixerTrack, SavedPreferences
- [ ] Create `app/constants/audioConfig.ts` with all config

### Phase 3: Extract Hooks
- [ ] Create `useSessionTimer` hook
  - [ ] Extract timer logic
  - [ ] Test timer works
- [ ] Create `useAudioManager` hook
  - [ ] Extract audio logic
  - [ ] Test audio works
- [ ] Create `usePersistentState` hook
  - [ ] Extract persistence logic
  - [ ] Test data saves/loads
- [ ] Create `useKeyboardShortcuts` hook
  - [ ] Extract keyboard logic
  - [ ] Test shortcuts work

### Phase 4: Extract Components
- [ ] Create `VirtualCafeIntro.tsx`
- [ ] Create `SessionTimer.tsx`
- [ ] Create `TrackControl.tsx`
- [ ] Create `RoomMixControls.tsx`
- [ ] Create `BackdropOverlay.tsx`

### Phase 5: Refactor Main Component
- [ ] Update _index.tsx to use hooks & components
- [ ] Remove old code
- [ ] Test everything still works

### Phase 6: Polish
- [ ] TypeScript checks pass
- [ ] No unused imports
- [ ] Consistent formatting
- [ ] Comments where needed

---

## Git Commit Strategy

```bash
# Phase 2
git commit -m "refactor: extract constants and types"

# Phase 3
git commit -m "refactor: extract useSessionTimer hook"
git commit -m "refactor: extract useAudioManager hook"
git commit -m "refactor: extract usePersistentState hook"
git commit -m "refactor: extract useKeyboardShortcuts hook"

# Phase 4
git commit -m "refactor: extract VirtualCafeIntro component"
git commit -m "refactor: extract SessionTimer component"
git commit -m "refactor: extract TrackControl component"
git commit -m "refactor: extract RoomMixControls component"
git commit -m "refactor: extract BackdropOverlay component"

# Phase 5
git commit -m "refactor: consolidate into composed _index.tsx"
```

Each commit should be testable/reviewable!

---

## Key Files by Phase

| Phase | Files to Create | LOC | Effort |
|-------|-----------------|-----|--------|
| 1 | Directories | 0 | 2 min |
| 2 | audio.ts, audioConfig.ts | 50 | 10 min |
| 3 | 4 hooks | 200 | 90 min |
| 4 | 5 components | 195 | 60 min |
| 5 | Refactored _index.tsx | 100 | 30 min |
| **Total** | **11 files** | **~545** | **~4 hours** |
