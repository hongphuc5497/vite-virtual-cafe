# Architecture & Design Patterns

## High-Level Architecture
**Client-Heavy Full-Stack SSR App** with Remix meta-framework:
```
Browser ←→ Express Server (Remix)
              ├─ SSR Rendering (React on server)
              ├─ Static file serving (Vite bundled assets)
              └─ Minimal API logic
```

## Pattern: Remix Full-Stack with Component Composition

### Entry Points
1. **Server-side entry**: `app/entry.server.tsx`
   - Handles server rendering
   - Configures request handling

2. **Client-side entry**: `app/entry.client.tsx`
   - Hydrates React on browser
   - Client-side routing setup

3. **Root component**: `app/root.tsx`
   - Main app layout wrapper
   - Global styles and context

### Routing Architecture
- **File-based routing** (Remix convention):
  - `app/routes/` directory contains route segments
  - Named files map to URL paths
  - Examples: `journal.tsx`, `relax.tsx` (inferred from commits)
  - Layout wrapping handled by `root.tsx`

### Component Architecture
- **Functional components** with hooks (React 18)
- **Custom hooks** for state management:
  - `useSessionTimer` — Session duration tracking
  - `usePersistentState` — Browser localStorage persistence
- **UI components** organized in `app/components/`:
  - `SoundBoard.tsx` — Audio playback interface
  - `VibeSelector.tsx` — Vibe/atmosphere selection UI
  - `RoomMixControls.tsx` — Audio mixing controls
  - `Timer.tsx` — Session timer display
  - `SessionTimer.tsx` — Session timing logic component
  - `TrackControl.tsx` — Individual track controls
  - `VisualScene.tsx` — Visual backdrop/scene component
  - `BackdropOverlay.tsx` — Overlay effects

### Type System
- **TypeScript** with strict mode
- **Type definitions** in `app/types/`:
  - `audio.ts` — Audio-related types (Howler config, track schema)
- **Component props** typed individually per component

### State Management
- **React hooks** (useState, useEffect) as primary state mechanism
- **Custom hooks** for shared logic extraction:
  - Session timer state
  - Persistent storage abstraction
- **No centralized state library** (Redux, Zustand, etc.)
- **Local component state** for UI toggles/UX

### Data Flow
1. **Client-initiated**: User interacts with UI
2. **Component state update**: Hook manages state
3. **Persistent storage**: usePersistentState writes to localStorage
4. **Re-render**: React updates DOM
5. **No server queries**: Currently all client-side

### Audio System Architecture
- **Howler.js wrapper** manages Web Audio API
- **Audio configuration** centralized in `app/constants/audioConfig.ts`
- **Track schema** includes mood, vibe, duration, visual effects
- **Room mixing** allows layered audio (ambient + main track)

## Key Abstractions
1. **Custom hooks as boundaries**:
   - Session timing logic extracted to `useSessionTimer`
   - Persistence abstraction in `usePersistentState`
   - Makes testing and reuse easier

2. **Component composition** for UI complexity:
   - Timer display separate from timing logic
   - Controls separate from playback
   - Visual effects (BackdropOverlay, VisualScene) composable

3. **Constants & configuration**:
   - Audio config centralized (not scattered in components)
   - Mood icons and colors defined once
   - Reusable across multiple components

## Data Persistence
- **Browser localStorage** via custom hook
- **Session data persists across page reloads**
- No backend persistence currently

## Styling Approach
- **Tailwind CSS** utility-first
- **No CSS-in-JS** detected
- **Component-level styling** (classes on elements)
- **Responsive design** via Tailwind media queries

## Error Handling
- **No explicit error boundaries** detected
- **No error state management** for failed audio loads or network
- Could improve with:
  - React Error Boundaries
  - Error state in custom hooks
  - User feedback for audio failures

## Scalability Considerations
- ✓ Component composition scales well
- ✓ Custom hooks pattern is maintainable
- ⚠️ No global state library (ok for small app, may need refactor for large feature set)
- ⚠️ No API client abstraction (would need for backend integration)
- ⚠️ No error handling pattern (should formalize as features grow)
