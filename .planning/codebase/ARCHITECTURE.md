<!-- refreshed: 2026-04-29 -->
# Architecture

**Analysis Date:** 2026-04-29

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Remix Router (Client Hydration)             │     │
│  │              app/entry.client.tsx                        │     │
│  └─────────────────────┬────────────────────────────────────┘     │
│                        │                                          │
│                        ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                   Route Pages (2 routes)                  │     │
│  │  ┌──────────────────────┐  ┌──────────────────────┐      │     │
│  │  │   _index.tsx (/)     │  │  relax.tsx (/relax)   │      │     │
│  │  │   (Focus Timer)      │  │  (Ambient Only)       │      │     │
│  │  └─────────┬────────────┘  └───────────┬──────────┘      │     │
│  └────────────┼───────────────────────────┼─────────────────┘     │
│               │                           │                        │
│               ▼                           ▼                        │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                  Presentational Components                │     │
│  │  app/components/  (6 components + ui/ subdir)             │     │
│  │  SessionTimer  VibeSelector  RoomMixControls              │     │
│  │  TrackControl  CelebrationOverlay  BackdropOverlay        │     │
│  │  ui/button.tsx (shadcn)                                   │     │
│  └──────────┬──────────────────────────────────────────────┘     │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                    Hooks (State Logic)                    │     │
│  │  app/hooks/                                              │     │
│  │  useAudioManager  useSessionTimer                        │     │
│  │  usePersistentState  useKeyboardShortcuts                 │     │
│  └─────────────────────┬───────────────────────────────────┘     │
│                        │                                          │
│                        ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Persistence + Utility Layer                  │     │
│  │  app/lib/session.ts     app/lib/utils.ts                  │     │
│  └─────────────────────┬───────────────────────────────────┘     │
│                        │                                          │
│                        ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │               External Audio Sources                     │     │
│  │   imissmycafe.com MP3s (via HTMLAudioElement)            │     │
│  └─────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Express Server (server.js)                     │
│  - Vite HMR middleware (dev) or static file serving (prod)       │
│  - Remix request handler (all routes, catch-all)                  │
│  - compression + morgan middleware                               │
│  - port 3000 (default)                                           │
└──────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `Index` | Focus timer page: timer lifecycle, celebrations, keyboard shortcuts, localStorage prefs sync | `app/routes/_index.tsx` |
| `Relax` | Ambient-only page: no timer, audio mixer + vibe selector only | `app/routes/relax.tsx` |
| `App` / `AppNav` | Root layout with sticky nav bar (Focus/Relax links), Meta/Links/Outlet shell | `app/root.tsx` |
| `SessionTimer` | Circular SVG progress ring, duration presets (25/45/60/90m), custom number input, start/pause/reset buttons | `app/components/SessionTimer.tsx` |
| `RoomMixControls` | Master sound enable/disable button, renders list of `TrackControl` components | `app/components/RoomMixControls.tsx` |
| `TrackControl` | Per-track volume slider (range input), play/pause toggle, retry button on error, Material icon | `app/components/TrackControl.tsx` |
| `VibeSelector` | 4 vibe presets (Lo-fi Beats, Rainy Day, Jazz Night, Nature), each sets all 8 track volumes at once | `app/components/VibeSelector.tsx` |
| `CelebrationOverlay` | Post-session modal showing duration/vibe/mood from `SessionEntry`; dismiss on click | `app/components/CelebrationOverlay.tsx` |
| `BackdropOverlay` | Scene-tinted gradient + sunlight-driven glow overlay on cafe background | `app/components/BackdropOverlay.tsx` |
| `button` (shadcn) | Base button component (scaffolded but not yet consumed by any route) | `app/components/ui/button.tsx` |

## Pattern Overview

**Overall:** Client-rendered single-page application (SPA) with a Remix SSR shell. Two routes, all state is local React state. No server loaders or actions -- the Express server is a thin shell.

**Key Characteristics:**

- All rendering and state management is client-side (hooks + React state)
- No Remix `loader` or `action` exports in any route file
- No API endpoints -- Express only has the Remix catch-all handler
- All persistence goes to browser localStorage directly from `useEffect`
- Audio managed imperatively via `useRef<Map<string, HTMLAudioElement>>`
- SSR streaming splits bots (isbot, `onAllReady`) from browsers (`onShellReady`)

## Layers

**Route Pages:**

- Purpose: Wire hooks to component props, manage page-level state, handle lifecycle side-effects
- Location: `app/routes/`
- Contains: Default-exported page components composing hooks + presentational components
- Depends on: All hooks, all components, constants, types
- Used by: Remix Router

**Presentational Components:**

- Purpose: Pure rendering of UI with explicit prop interfaces
- Location: `app/components/`
- Contains: Leaf UI components with no external state dependencies
- Depends on: Types (`~/types/audio`)
- Used by: Route pages

**State/Logic Hooks:**

- Purpose: Encapsulate reusable stateful logic and browser-only APIs
- Location: `app/hooks/`
- Contains: Custom React hooks for audio, timer, persistence, keyboard
- Depends on: Constants, types, native browser APIs
- Used by: Route pages

**Constants & Configuration:**

- Purpose: Single source of truth for track config, URLs, defaults, vibe presets
- Location: `app/constants/audioConfig.ts` (audio), `app/components/VibeSelector.tsx` (VIBES array)
- Depends on: Types

**Utility/Persistence Library:**

- Purpose: Pure functions with no React dependency
- Location: `app/lib/`
- Contains: `session.ts` (session entry write + vibe/mood detection), `utils.ts` (`cn()`)

**Server Layer:**

- Purpose: HTTP server, middleware, SSR handler
- Location: `server.js`, `app/entry.server.tsx`
- Contains: Express app, Vite/static middleware, morgan, compression, Remix handler, SSR streaming

## Data Flow

### Primary Request Path (Focus Page)

1. Browser requests `/` -- Express passes to `remixHandler` (`server.js:46`)
2. Remix SSR renders `app/root.tsx` shell with `AppNav` and `<Outlet/>`
3. Route `_index.tsx` mounts on client, `useEffect` hydrates from localStorage (`_index.tsx:32-58`)
4. User selects duration via `SessionTimer` (preset buttons or custom number input)
5. User selects vibe preset via `VibeSelector` (calls `handleApplyVibe` which sets all track volumes)
6. User presses Start: `handleToggleTimer` (line 122) calls `timer.start()` and optionally `audio.initializeAudio()`
7. `useSessionTimer` runs a `setInterval` counting down each second
8. `useAudioManager` syncs `HTMLAudioElement.volume` in `useEffect` on `tracks`/`pausedTracks`/`soundEnabled` changes
9. Timer hits 0: `detectVibeName` + `detectMood` run (`session.ts`), `writeSessionEntry` saves to localStorage, `CelebrationOverlay` shown
10. Preference changes auto-persist to localStorage via `useEffect` (`_index.tsx:88-99`)

### Relax Page Flow

1. Route `relax.tsx` mounts, hydrates tracks + pausedTracks from localStorage
2. No timer -- only audio mixer and vibe selector
3. `useAudioManager` initializes audio on first "Enable" click (`toggleSound`)
4. Track volume/pause changes persist to `virtual-cafe-home-prefs` via `useEffect` (`relax.tsx:49-57`)

**State Management:**

- All state is local React state (`useState` + `useEffect`)
- No global state management (no Context, no Redux, no Zustand)
- State flows down via props; mutations flow up via callbacks
- Persistence synced in `useEffect` side-effects (not middleware/reducers)

## Key Abstractions

**MixerTrack:**

- Purpose: Single audio track with label and volume level (0-100)
- Type: `app/types/audio.ts`
- Usage: Default in `audioConfig.ts`, state in both routes, props throughout components

**SavedPreferences:**

- Purpose: Type for the `virtual-cafe-home-prefs` localStorage blob
- Type: `app/types/audio.ts`
- Fields: `draftDurationMinutes`, `appliedDurationMinutes`, `tracks`, `pausedTracks`, `soundEnabled`, `selectedScene`

**SceneId:**

- Purpose: Union type of 4 scene identifiers for backdrop tinting
- Type: `app/types/audio.ts`
- Values: `"misty-cabin" | "sunday-morning" | "midnight-archive" | "rainy-metro"`

**useAudioManager:**

- Purpose: Audio lifecycle management: init, play/pause per track, volume mapping with power curve (`Math.pow(value/100, 1.35)`), error tracking, retry, cleanup on unmount
- Location: `app/hooks/useAudioManager.ts`
- Returns: `{ soundEnabled, pausedTracks, trackErrors, initializeAudio, toggleSound, toggleTrackPause, retryTrack, setAllPausedTracks }`

**useSessionTimer:**

- Purpose: Countdown timer with start/pause/stop/reset, `setInterval`-based, auto-stops at 0, `formatTime` helper
- Location: `app/hooks/useSessionTimer.ts`

**detectVibeName / detectMood:**

- Purpose: Threshold-based (MATCH_THRESHOLD=5) vibe preset detection + mood labeling from track composition
- Location: `app/lib/session.ts`

## Entry Points

**Express Server:**

- Location: `server.js`
- Triggers: `npm run dev` / `npm start`
- Responsibilities: Vite dev server or static file serving, compression, morgan logging, Remix SSR handler

**Client Hydration:**

- Location: `app/entry.client.tsx`
- Triggers: Browser page load after SSR
- Responsibilities: Hydrate React app with `StrictMode` via `hydrateRoot`

**SSR Request Handler:**

- Location: `app/entry.server.tsx`
- Triggers: Each HTTP request needing HTML
- Responsibilities: Stream HTML via `renderToPipeableStream`, split bot vs browser strategy, 5s abort delay

## Architectural Constraints

- **Threading:** Single-threaded event loop (Node.js). Audio is non-blocking via native `HTMLAudioElement` API.
- **Global state:** No module-level singletons. All state is React-local or ref-local. `audioElementsRef` is isolated per `useAudioManager` instance.
- **Circular imports:** None detected. Dependency direction: routes -> hooks -> constants/types; components -> types only.
- **SSR safety:** All `window`/`localStorage`/`document` access is guarded inside `useEffect` or `typeof window !== "undefined"` checks (`relax.tsx:11-12`). Audio hooks never run during SSR.
- **Path alias:** `~/*` maps to `./app/*` via `vite-tsconfig-paths`. All imports use `~/` prefix.
- **No test infrastructure:** No test runner, no test files, no test scripts in `package.json`.

## Anti-Patterns

### Duplicate localStorage hydration logic

**What happens:** Both `app/routes/_index.tsx:32-58` and `app/routes/relax.tsx:27-45` read/parse `virtual-cafe-home-prefs` from localStorage in `useEffect` blocks with nearly identical logic (parse, map DEFAULT_TRACKS, set scene).
**Why it's wrong:** Two copies of the same hydration logic. Adding a new preference field requires updating both routes.
**Do this instead:** Wrap the read/parse/map logic into a shared `usePreferences` hook or upgrade the existing `usePersistentState` hook.

### Module-level localStorage read in relax.tsx

**What happens:** `relax.tsx:11-21` reads `localStorage.getItem` during render-time initialization (not inside `useEffect`) to compute `initialPausedTracks`.
**Why it's wrong:** While guarded by `typeof window !== "undefined"`, reading localStorage during render violates SSR compatibility conventions and could cause hydration mismatches.
**Do this instead:** Read initial pausedTracks inside a `useEffect` + `useState`, consistent with how `_index.tsx` handles it.

### Magic number volume curve exponent

**What happens:** `useAudioManager.ts:28` hardcodes `Math.pow(value / 100, 1.35)` to map slider 0-100 to volume 0-1.
**Why it's wrong:** The rationale for the exponent 1.35 is undocumented. Adjusting requires finding the literal value.
**Do this instead:** Extract to a named constant `VOLUME_CURVE_EXPONENT` in `audioConfig.ts` with a comment explaining the perceptual mapping intent.

## Error Handling

**Strategy:** Localized per-feature error handling. `app/root.tsx` does not define a Remix `ErrorBoundary`.

**Patterns:**

- Audio track errors tracked via `trackErrors` state in `useAudioManager`. `HTMLAudioElement.onerror` and `play()` catch blocks set per-track error flags.
- `TrackControl` renders error icon (`error` Material Symbol) + retry (`refresh`) button per track with `hasError`.
- Retry calls `el.load()` + `el.play()` to recover (`useAudioManager.ts:164-175`).
- localStorage parse errors caught with `try/catch`, falling back to clearing or ignoring the key.
- SSR streaming errors logged via `console.error` in `entry.server.tsx`.

## Cross-Cutting Concerns

**Logging:** `morgan("tiny")` for HTTP request logging on server. No structured or client-side logging.
**Validation:** No server-side validation. Client-side: session duration clamped to `Math.max(1, ...)` in `SessionTimer`. Track volumes bounded 0-100 by HTML range input.
**Authentication:** None. No user accounts.
**Accessibility:** `aria-label`, `aria-pressed`, `aria-valuemin/max/now` on interactive elements. `role="none"` on overlay click-catcher. Focus-visible outlines in CSS. Skip-links and landmarks: not yet present.
**Icons:** Material Symbols Outlined (Google Fonts) used throughout for consistent iconography. No Lucide React icons used yet despite the dependency.

---

*Architecture analysis: 2026-04-29*
