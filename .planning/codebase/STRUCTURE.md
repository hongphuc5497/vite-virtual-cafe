# Codebase Structure

**Analysis Date:** 2026-04-29

## Directory Layout

```
vite-virtual-cafe/
├── app/                              # All application source code
│   ├── components/                   # Presentational React components
│   │   ├── ui/                       # shadcn/ui component primitives
│   │   │   └── button.tsx            # Base button (shadcn scaffolded, 3.1K)
│   │   ├── BackdropOverlay.tsx       # Scene-tinted gradient overlay
│   │   ├── CelebrationOverlay.tsx    # Post-session achievement modal
│   │   ├── RoomMixControls.tsx       # Master mixer (renders TrackControl list)
│   │   ├── SessionTimer.tsx          # Circular SVG countdown + duration controls
│   │   ├── TrackControl.tsx          # Single track volume slider + pause/retry
│   │   └── VibeSelector.tsx          # 4 vibe preset buttons (also holds VIBES data)
│   ├── constants/                    # Configuration constants
│   │   └── audioConfig.ts            # DEFAULT_TRACKS, SOUND_URLS, base volumes, defaults
│   ├── hooks/                        # Custom React hooks (stateful logic)
│   │   ├── useAudioManager.ts        # HTMLAudioElement lifecycle, volume, errors
│   │   ├── useKeyboardShortcuts.ts   # Space/ArrowUp/ArrowDown key bindings
│   │   ├── usePersistentState.ts     # Generic localStorage-backed useState
│   │   └── useSessionTimer.ts        # setInterval-based countdown timer
│   ├── lib/                          # Utility and domain logic (no React deps)
│   │   ├── session.ts                # SessionEntry type, vibe/mood detection, localStorage writes
│   │   └── utils.ts                  # cn() class-merging (clsx + tailwind-merge)
│   ├── routes/                       # Remix file-convention route pages
│   │   ├── _index.tsx                # Focus timer page (/) -- 254 lines
│   │   └── relax.tsx                 # Ambient page (/relax) -- 140 lines
│   ├── types/                        # TypeScript type definitions
│   │   └── audio.ts                  # MixerTrack, SceneId, SavedPreferences
│   ├── entry.client.tsx              # Client hydration (hydrateRoot + StrictMode)
│   ├── entry.server.tsx              # SSR streaming entry (bot/browser split)
│   ├── root.tsx                      # Root layout: AppNav, Links, Meta, Outlet
│   └── tailwind.css                  # Global CSS: Tailwind directives, shadcn tokens, custom classes
├── .claude/                          # AI runtime config (gitignored)
│   └── skills/gitnexus/              # GitNexus code intelligence skills (6 skill dirs)
├── .planning/                        # Planning and analysis documents (gitignored by convention)
│   └── codebase/                     # Codebase mapping output (this directory)
├── public/                           # Static assets (served at web root)
│   ├── cafe-background.jpg           # Hero background image for all pages
│   └── favicon.*                     # Browser favicon
├── .gitignore                        # Git ignore rules
├── .nvmrc                            # Node version manager config
├── CLAUDE.md                         # Project instructions for AI coding assistant
├── components.json                   # shadcn/ui v4 configuration (style: base-nova)
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Lockfile
├── postcss.config.js                 # PostCSS (Tailwind + Autoprefixer)
├── server.js                         # Express server entry point (52 lines)
├── tailwind.config.ts                # Tailwind theme (custom M3-like palette, fonts, radii)
├── tsconfig.json                     # TypeScript strict config (ES2022, Bundler)
└── vite.config.ts                    # Vite + Remix plugin + tsconfig paths
```

## Directory Purposes

**`app/components/`:**
- Purpose: All presentational React components. No state management logic (except local UI states). Props-driven only.
- Contains: 6 components, one per file
- Key files: `SessionTimer.tsx`, `RoomMixControls.tsx`, `TrackControl.tsx`, `VibeSelector.tsx`, `CelebrationOverlay.tsx`, `BackdropOverlay.tsx`

**`app/components/ui/`:**
- Purpose: shadcn/ui primitives scaffolded via `shadcn add` CLI. Single-file components with full variants.
- Contains: `button.tsx` (the only one currently)
- Generated: Yes (via CLI)
- Committed: Yes

**`app/hooks/`:**
- Purpose: Custom React hooks encapsulating browser-only stateful logic. One concern per hook.
- Contains: 4 hooks
- Key files: `useAudioManager.ts` (most complex, ~191 lines), `useSessionTimer.ts`, `usePersistentState.ts`, `useKeyboardShortcuts.ts`

**`app/constants/`:**
- Purpose: Single source of truth for configuration values that never change at runtime.
- Contains: `audioConfig.ts` with `DEFAULT_TRACKS`, `SOUND_URLS`, `TRACK_BASE_VOLUME`, `STORAGE_KEY`, `DEFAULT_DURATION_MINUTES`, `DEFAULT_SCENE`

**`app/lib/`:**
- Purpose: Pure utility functions with no React dependency. Can be tested without a DOM.
- Contains: `session.ts` (session persistence + detection), `utils.ts` (`cn()`)

**`app/routes/`:**
- Purpose: Remix file-convention route pages. Each file exports a default React component.
- Contains: 2 routes (`/` -> `_index.tsx`, `/relax` -> `relax.tsx`)
- Removed: `journal.tsx`, `settings.tsx` (deleted in recent commits)

**`app/types/`:**
- Purpose: Shared TypeScript type definitions.
- Contains: `audio.ts` with `MixerTrack`, `SceneId`, `SavedPreferences`

**`public/`:**
- Purpose: Unprocessed static assets served by Express at the web root.
- Contains: `cafe-background.jpg`, favicon files

## Key File Locations

**Entry Points:**
- `server.js`: Express server startup and middleware
- `app/entry.client.tsx`: Client-side React hydration
- `app/entry.server.tsx`: Server-side React SSR streaming

**Configuration:**
- `package.json`: Dependencies, scripts, engines
- `tsconfig.json`: TypeScript strict mode, `~/*` path alias
- `vite.config.ts`: Vite config with Remix plugin + 5 future flags
- `tailwind.config.ts`: M3-like color palette, newsreader/plus-jakarta fonts, border radii
- `postcss.config.js`: Tailwind + Autoprefixer
- `components.json`: shadcn/ui registry and style config

**Core Logic:**
- `app/hooks/useAudioManager.ts`: Audio engine (HTMLAudioElement lifecycle, volume curve, error recovery)
- `app/hooks/useSessionTimer.ts`: Timer engine (setInterval countdown)
- `app/lib/session.ts`: Session detection and persistence (vibe/mood algorithms)
- `app/constants/audioConfig.ts`: Track definitions, remote URLs, base volumes

**Root Layout:**
- `app/root.tsx`: App shell with AppNav, font preconnects, Outlet

## Naming Conventions

**Files:**
- PascalCase for React components: `SessionTimer.tsx`, `RoomMixControls.tsx`, `CelebrationOverlay.tsx`
- camelCase for hooks: `useAudioManager.ts`, `useSessionTimer.ts`, `usePersistentState.ts`, `useKeyboardShortcuts.ts`
- camelCase for utilities/config: `audioConfig.ts`, `session.ts`, `utils.ts`
- snake_case for Remix index route file: `_index.tsx` (Remix convention for index routes)

**Directories:**
- All lowercase, singular: `components/`, `hooks/`, `routes/`, `types/`, `lib/`, `constants/`
- `ui/` subdirectory for shadcn primitives

## Where to Add New Code

**New Route Page:**
- Route file: `app/routes/{name}.tsx`
- Page-level state and effects go here (not in components)
- Import path: `~/routes/{name}`

**New Presentational Component:**
- File: `app/components/{ComponentName}.tsx`
- Import path: `~/components/{ComponentName}` (not relative paths)
- Props: Define an exported interface `{ComponentName}Props`

**New shadcn Primitive:**
- Use: `npx shadcn add {component-name}` - places in `app/components/ui/`
- Import path: `~/components/ui/{component-name}`

**New Custom Hook:**
- File: `app/hooks/use{FeatureName}.ts`
- Import path: `~/hooks/useFeatureName`
- Rule: Keep browser-only API access inside `useEffect` or `useRef` for SSR safety

**New Utility Function:**
- File: `app/lib/{name}.ts`
- Import path: `~/lib/{name}`
- Rule: No React or DOM dependencies (enables future testing)

**New Constant/Config:**
- Audio-related: Add to `app/constants/audioConfig.ts`
- Generic: New file `app/constants/{name}.ts`
- Import path: `~/constants/{name}`

**New Type:**
- Audio-related: Add to `app/types/audio.ts`
- Domain-specific: New file `app/types/{domain}.ts`
- Import path: `~/types/{domain}`

**New Static Asset:**
- File: `public/{asset-name}`
- Referenced at root path: `/{asset-name}`

## Special Directories

**`build/`:**
- Purpose: Production build output (server bundle + client assets)
- Generated: Yes (by `npm run build`)
- Committed: No (gitignored)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`.claude/` and `.gitnexus/`:**
- Purpose: AI runtime configuration and code intelligence index
- Generated: Yes (`.gitnexus/` by `npx gitnexus analyze`)
- Committed: No (gitignored)

**`public/`:**
- Purpose: Static assets served at web root
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-29*
