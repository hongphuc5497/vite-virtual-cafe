# Directory Structure & Organization

## Project Root Layout
```
vite-virtual-cafe/
├── app/                          # Remix app directory (all source code)
├── public/                       # Static assets (if present)
├── build/                        # Output directory (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── .planning/                    # GSD project planning (newly created)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite configuration (inferred)
├── tailwind.config.js           # Tailwind configuration (inferred)
├── postcss.config.js            # PostCSS configuration (inferred)
├── server.js                    # Express server entry point
├── README.md                    # Project documentation
└── .gitignore                   # Git ignore rules
```

## App Directory Structure
```
app/
├── entry.server.tsx             # Server-side rendering entry
├── entry.client.tsx             # Client-side hydration entry
├── root.tsx                     # Root component / layout wrapper
│
├── routes/                      # File-based routes (Remix convention)
│   ├── _index.tsx              # Home page (/)
│   ├── journal.tsx             # Journal route (/journal)
│   └── relax.tsx               # Relax route (/relax)
│
├── components/                  # Reusable React components
│   ├── BackdropOverlay.tsx      # Overlay visual effects
│   ├── RoomMixControls.tsx      # Audio room/ambience mixing
│   ├── SessionTimer.tsx         # Session timing display component
│   ├── SoundBoard.tsx           # Main audio playback interface
│   ├── Timer.tsx                # Timer UI component
│   ├── TrackControl.tsx         # Individual track control UI
│   ├── VibeSelector.tsx         # Vibe/atmosphere selection
│   └── VisualScene.tsx          # Visual background/scene
│
├── hooks/                       # Custom React hooks
│   ├── useSessionTimer.ts       # Session timing logic hook
│   └── usePersistentState.ts    # localStorage persistence hook
│
├── constants/                   # Application constants
│   └── audioConfig.ts           # Audio configuration, tracks, moods
│
└── types/                       # TypeScript type definitions
    └── audio.ts                 # Audio-related types
```

## Key Locations by Feature

### Audio System
- **Config**: `app/constants/audioConfig.ts`
- **Types**: `app/types/audio.ts`
- **UI Components**:
  - `app/components/SoundBoard.tsx` (main interface)
  - `app/components/RoomMixControls.tsx` (mixing)
  - `app/components/TrackControl.tsx` (individual tracks)

### Session Management
- **Logic**: `app/hooks/useSessionTimer.ts`
- **Persistence**: `app/hooks/usePersistentState.ts`
- **Display**: `app/components/SessionTimer.tsx` + `app/components/Timer.tsx`

### Routes / Pages
- **Home**: `app/routes/_index.tsx`
- **Journal**: `app/routes/journal.tsx`
- **Relax**: `app/routes/relax.tsx`

### Visual & UI
- **Backdrop**: `app/components/BackdropOverlay.tsx`
- **Scene**: `app/components/VisualScene.tsx`
- **Vibe Selection**: `app/components/VibeSelector.tsx`

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `SoundBoard.tsx`, `SessionTimer.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePersistentState.ts`)
- **Routes**:
  - Index route: `_index.tsx` (Remix convention for folder root)
  - Named routes: kebab-case-inspired (e.g., `journal.tsx`, `relax.tsx`)
- **Types**: camelCase (e.g., `audio.ts`)
- **Constants**: camelCase (e.g., `audioConfig.ts`)

### Imports
- Path alias: `~/` maps to `app/` (from tsconfig.json)
- Example: `import { SoundBoard } from "~/components/SoundBoard"`

## Build Output
```
build/
├── server/                      # Server bundle (Node.js)
│   └── index.js
└── client/                      # Client bundle (browser)
    ├── index.[hash].js
    ├── assets/
    └── ...
```

## Asset Organization
- **Audio files**: Referenced in `audioConfig.ts` (location not visible, likely `public/` or bundled)
- **Images**: Likely in `public/` (if present)
- **Fonts**: Via Tailwind + default system fonts (if no custom fonts detected)

## Scalability Notes
- ✓ Components well-organized by type (components, hooks, types, constants)
- ✓ Routes separate (easier to add new pages)
- ✓ Type definitions co-located with features
- ⚠️ No `utils/` or `services/` directory yet (may be needed if business logic grows)
- ⚠️ No test directory detected (could add `__tests__/` or `.test.ts` alongside source)
- ⚠️ No configuration management (env files, feature flags)
