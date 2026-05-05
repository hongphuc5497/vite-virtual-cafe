# Phase 2: JS Migration - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Strip TypeScript from the entire codebase — all 20 `.ts`/`.tsx` source files converted to `.js`/`.jsx`, TypeScript infrastructure removed from `package.json` and build tooling, ESLint reconfigured for JS-only. Zero behavior changes — Phase 3 Playwright tests will validate against the JS output.
</domain>

<decisions>
## Implementation Decisions

### Conversion method
- **D-01:** Manual per-file type stripping — line-by-line review, no `tsc` emit. Safest approach for the zero-logic-change constraint. Every line is read and reviewed.
- **D-02:** Convert in dependency order: Types → Constants → Lib → Hooks → Components → Routes → Entry points → Config files (`vite.config.ts`, `tailwind.config.ts`). Each file's dependencies are already JS when it's converted.
- **D-03:** Batch by plan structure. Convert all source files first (Plan 02-01), then verify the full build and remove TS infrastructure (Plan 02-02). No per-file verification cycle — verify once at the end.

### Path alias resolution
- **D-04:** Configure `resolve.alias: { '~': path.resolve('app') }` directly in `vite.config.js`. Remove the `vite-tsconfig-paths` plugin and its dependency. Clean break from `tsconfig.json` — no config file needed for path resolution.

### Type annotations
- **D-05:** Strip all type annotations completely — no JSDoc. Clean JS with no TS-adjacent syntax. The codebase is small enough (20 files, ~2k LOC) that well-named variables and the Phase 1 context document provide sufficient documentation.

### Claude's Discretion
- Exact Vite `resolve.alias` configuration syntax and placement in `vite.config.js`
- ESLint config migration — which rules to keep, any JS-specific rules to add, whether to restructure the overrides
- `tailwind.config.ts` → `tailwind.config.js` conversion (straightforward type stripping)
- File-by-file conversion execution order within each dependency layer
- Whether to keep `React.FC` wrapping pattern or simplify to plain functions
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — MIGR-01 through MIGR-04 define the migration scope and acceptance criteria
- `.planning/PROJECT.md` — Constraints (Node.js ≥20, ES modules, browser-only audio, localStorage state) and existing decisions

### Codebase maps
- `.planning/codebase/STACK.md` — Full dependency list (TypeScript packages to remove: `typescript`, `@types/*`, `vite-tsconfig-paths`, `@typescript-eslint/*`)
- `.planning/codebase/STRUCTURE.md` — Complete file tree with all 20 `.ts`/`.tsx` files that need conversion
- `.planning/codebase/CONVENTIONS.md` — Import patterns, component structure, naming conventions to preserve

### Prior phase
- `.planning/phases/01-complete-session-loop/01-CONTEXT.md` — Decisions and patterns from Phase 1 that must be preserved through migration
</canonical_refs>

<code_context>
## Existing Code Insights

### Conversion scope
20 TypeScript files to convert:
- **Types:** `app/types/audio.ts`
- **Constants:** `app/constants/audioConfig.ts`
- **Lib:** `app/lib/session.ts`, `app/lib/utils.ts`
- **Hooks:** `app/hooks/useAudioManager.ts`, `app/hooks/useSessionTimer.ts`, `app/hooks/usePersistentState.ts`, `app/hooks/useKeyboardShortcuts.ts`
- **Components:** `app/components/BackdropOverlay.tsx`, `app/components/CelebrationOverlay.tsx`, `app/components/RoomMixControls.tsx`, `app/components/SessionTimer.tsx`, `app/components/TrackControl.tsx`, `app/components/VibeSelector.tsx`, `app/components/ui/button.tsx`
- **Routes:** `app/routes/_index.tsx`, `app/routes/relax.tsx`
- **Entry points:** `app/entry.client.tsx`, `app/entry.server.tsx`
- **Root:** `app/root.tsx`
- **Config:** `vite.config.ts`, `tailwind.config.ts`

### Infrastructure to remove
- `typescript`, `@types/*` packages from `package.json`
- `vite-tsconfig-paths` from `package.json` and `vite.config.ts`
- `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` from `package.json` and `.eslintrc.cjs`
- `tsconfig.json` — delete entirely
- `typecheck` script from `package.json`

### Established patterns
- `~/` path alias for all imports — never relative paths
- ES modules (`import`/`export`) — `"type": "module"` in `package.json`
- `.eslintrc.cjs` uses CommonJS (`module.exports`) — server.js also CJS-compatible
</code_context>

<specifics>
## Specific Ideas

- "Zero behavior changes" is the hard constraint — every conversion decision flows from this
- Migration should be auditable — the diff between `.ts` and `.js` files should show only type removal, no logic changes
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 02-js-migration*
*Context gathered: 2026-05-05*
