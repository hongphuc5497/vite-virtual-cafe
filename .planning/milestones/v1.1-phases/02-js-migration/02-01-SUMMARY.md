---
phase: 02-js-migration
plan: 01
type: execute
wave: 1
depends_on: []
subsystem: codebase-conversion
tags: [typescript, javascript, migration, type-stripping]
requires:
  - MIGR-01 (convert all .ts/.tsx to .js/.jsx, strip types, preserve logic)
provides:
  - All 21 JS/JSX files with zero TypeScript syntax
  - vite.config.js with resolve.alias for path mapping
  - tailwind.config.js with updated content glob
  - Deleted app/types/audio.ts (empty after type stripping)
affects:
  - All source files (.ts .tsx → .js .jsx)
  - Build toolchain (vite-tsconfig-paths replaced by resolve.alias)
tech-stack:
  added: []
  patterns:
    - "resolve.alias in vite.config.js for ~ path mapping"
    - "No JSDoc type annotations (D-05)"
key-files:
  created:
    - app/constants/audioConfig.js
    - app/lib/session.js
    - app/lib/utils.js
    - app/hooks/useAudioManager.js
    - app/hooks/useSessionTimer.js
    - app/hooks/usePersistentState.js
    - app/hooks/useKeyboardShortcuts.js
    - app/components/BackdropOverlay.jsx
    - app/components/CelebrationOverlay.jsx
    - app/components/RoomMixControls.jsx
    - app/components/SessionTimer.jsx
    - app/components/TrackControl.jsx
    - app/components/VibeSelector.jsx
    - app/components/ui/button.jsx
    - app/routes/_index.jsx
    - app/routes/relax.jsx
    - app/entry.client.jsx
    - app/entry.server.jsx
    - app/root.jsx
    - vite.config.js
    - tailwind.config.js
  deleted:
    - app/types/audio.ts
    - app/types/ (empty directory)
decisions:
  - D-01: Manual per-file type stripping — line-by-line review, no tsc emit
  - D-02: Convert in dependency order
  - D-03: Batch by plan structure (all source files first, infra removal second)
  - D-04: resolve.alias in vite.config.js instead of vite-tsconfig-paths
  - D-05: Strip all type annotations completely — no JSDoc
metrics:
  duration: ~15 minutes
  completed_date: 2026-05-06
---

# Phase 2 Plan 1: TypeScript to JavaScript Conversion

**One-liner:** Full codebase TS-to-JS conversion — 22 original .ts/.tsx files become 21 .js/.jsx files with zero TypeScript syntax and zero runtime logic changes; vite.config.js configured with resolve.alias for path mapping.

## Tasks

| # | Name | Type | Commit | Files |
|---|------|------|--------|-------|
| 1 | Convert types layer, constants, lib, and all hooks | auto | d8a5552 | 7 JS files created, 7 TS files deleted, types/audio.ts deleted |
| 2 | Convert all components (.tsx -> .jsx) | auto | 670f207 | 7 JSX files created, 7 TSX files deleted |
| 3 | Convert routes, entry points, root layout, and config files | auto | bafac3d | 7 JS/JSX files created, 7 TS/TSX files deleted |

## Verification Results

| Check | Result |
|-------|--------|
| 21 JS/JSX files exist | PASS |
| No .ts/.tsx files remain in app/ | PASS |
| app/types/audio.ts deleted | PASS |
| vite.config.ts deleted | PASS |
| tailwind.config.ts deleted | PASS |
| No `satisfies` in any .js/.jsx file | PASS |
| No `as const` in any .js/.jsx file | PASS |
| No `import type` in any .js/.jsx file | PASS |
| No `declare module` in any .js/.jsx file | PASS |
| entry.server.jsx has `no-unused-vars` comment | PASS |
| entry.server.jsx has `_loadContext` parameter | PASS |
| vite.config.js has resolve.alias for `~` | PASS |
| tailwind.config.js content glob uses {js,jsx} | PASS |

## Deviations from Plan

None — plan executed exactly as written. All files were manually converted line-by-line with type annotations stripped, `import type` lines removed, `as`/`satisfies`/`as const` keywords removed, `declare module` blocks deleted, and file extensions changed from .ts/.tsx to .js/.jsx.

## Threat Surface Scan

No new threat surface introduced. All changes are syntactic (type stripping only) with zero runtime behavior changes.

- T-02-01 (Tampering): Mitigated — manual line-by-line conversion with verification
- T-02-02 (satisfies): Mitigated — zero `satisfies` instances remain
- T-02-03 (declare module): Mitigated — zero `declare module` instances remain
- T-02-04 (ESLint comment): Accepted — updated to `no-unused-vars` as planned

## Post-Conversion Notes

- The empty `app/types/` directory was removed (contained only `audio.ts` which exported only types)
- All converted files pass `node --check` syntax validation (for .js files; .jsx files are handled by Vite bundler)
- Build verification (npm run build) will be performed in Plan 02-02 after TypeScript infrastructure is removed
- Git detected renames for most files (files kept the same relative path with only extension change)
