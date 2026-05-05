# Phase 2: JS Migration - Research

**Researched:** 2026-05-05
**Domain:** TypeScript-to-JavaScript codebase migration for Vite + Remix + React project
**Confidence:** HIGH

## Summary

This phase converts 22 TypeScript files to JavaScript by stripping all type annotations, removing TypeScript infrastructure, and reconfiguring ESLint for JS-only operation. The codebase uses TypeScript only for type safety -- no TypeScript-only runtime features (decorators, enums, parameter properties, etc.) are present. Every TS construct in this codebase (interfaces, type aliases, generics, type assertions, `as const`, `satisfies`, `declare module`) is a compile-time annotation with zero runtime impact.

The migration follows a predictable pattern: strip all type imports, remove type annotations from variables/parameters/returns, drop generic angle brackets, remove `as`/`satisfies` keywords, delete `declare module` blocks, and convert file extensions. The empty `app/types/audio.ts` is deleted entirely (it exports only types).

**Primary recommendation:** Manual per-file type stripping in dependency order (types first, then lib/constants, hooks, components, routes, entry points, config) with a single end-to-end verification. No code transformation tools (ts-to-js converters) needed at this scale -- the type patterns are simple and consistent.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Manual per-file type stripping -- line-by-line review, no `tsc` emit. Safest approach for the zero-logic-change constraint.
- **D-02:** Convert in dependency order: Types -> Constants -> Lib -> Hooks -> Components -> Routes -> Entry points -> Config files.
- **D-03:** Batch by plan structure. Convert all source files first (Plan 02-01), then verify the full build and remove TS infrastructure (Plan 02-02). No per-file verification cycle -- verify once at the end.
- **D-04:** Configure `resolve.alias: { '~': path.resolve('app') }` directly in `vite.config.js`. Remove the `vite-tsconfig-paths` plugin.
- **D-05:** Strip all type annotations completely -- no JSDoc. Clean JS with no TS-adjacent syntax.

### Claude's Discretion
- Exact Vite `resolve.alias` configuration syntax and placement in `vite.config.js`
- ESLint config migration -- which rules to keep, any JS-specific rules to add, whether to restructure the overrides
- `tailwind.config.ts` -> `tailwind.config.js` conversion (straightforward type stripping)
- File-by-file conversion execution order within each dependency layer
- Whether to keep `React.FC` wrapping pattern or simplify to plain functions

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIGR-01 | Convert all .ts/.tsx files to .js/.jsx, stripping all type annotations while preserving all logic identically | 22 files identified with exhaustive type patterns catalogued. All TS constructs present are compile-time only. See conversion patterns below. |
| MIGR-02 | Remove TypeScript dependencies (typescript, @types/*), delete tsconfig.json, drop typecheck script | 8 TS-related packages identified: `typescript`, `@types/*` (4), `@typescript-eslint/*` (2), `vite-tsconfig-paths`, `eslint-import-resolver-typescript`. All to be removed from package.json. |
| MIGR-03 | Update ESLint config for JavaScript | Remove @typescript-eslint parser/plugins, collapse TypeScript override into React override, import plugin preserved with node resolver |
| MIGR-04 | Verify server.js and all configs work with JS-only codebase | No TS imports remain. server.js already JS. Vite dev/build/start verified against JS-only output. |
</phase_requirements>

## Architectural Responsibility Map

This phase is a syntactic migration -- no architectural tier boundaries change. Every file retains its exact location, responsibility, and role in the system. The only transformation is the removal of TypeScript type annotations from source code.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Codebase conversion | Local build toolchain | -- | All files convert in-place; no runtime differences |
| Path alias resolution | Vite config | -- | `resolve.alias` replaces `vite-tsconfig-paths` + `tsconfig.json` paths |
| Linting | ESLint config | -- | Parser/plugin switch from TS-aware to JS-only |
| Module resolution | Node.js (ESM) | -- | `package.json` `"type": "module"` already set; no change needed |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | ^6.4.1 | Build tool & dev server HMR | Configure `resolve.alias` for `~` path; remove `vite-tsconfig-paths` plugin |
| ESLint | ^8.38.0 | Linting | JS-only: `@typescript-eslint/parser` removed, `espree` default used |
| Tailwind CSS | ^3.4.19 | Utility-first CSS | Config file converts `.ts` -> `.js` with type info stripped |

### Packages to Remove from `package.json`
| Package | Type | Reason |
|---------|------|--------|
| `typescript` | devDependency | No TS compilation needed |
| `@types/compression` | devDependency | No TS type checking |
| `@types/express` | devDependency | No TS type checking |
| `@types/morgan` | devDependency | No TS type checking |
| `@types/react` | devDependency | No TS type checking |
| `@types/react-dom` | devDependency | No TS type checking |
| `@typescript-eslint/eslint-plugin` | devDependency | No TS files to lint |
| `@typescript-eslint/parser` | devDependency | No TS to parse |
| `vite-tsconfig-paths` | devDependency | Replaced by `resolve.alias` in vite.config.js |
| `eslint-import-resolver-typescript` | devDependency | Replaced by node resolver |

**Total packages removed:** 10
**Net to uninstall:** `npm uninstall typescript @types/compression @types/express @types/morgan @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser vite-tsconfig-paths eslint-import-resolver-typescript`

## Architecture Patterns

### Recommended Project Structure
No structural changes. All files remain in their current locations with new extensions:
```
app/                          # (identical directory tree)
  types/
    audio.ts                  # DELETE (exports types only)
  constants/
    audioConfig.ts -> .js     
  lib/
    session.ts -> .js         
    utils.ts -> .js           
  hooks/
    useAudioManager.ts -> .js 
    useKeyboardShortcuts.ts -> .js
    usePersistentState.ts -> .js
    useSessionTimer.ts -> .js 
  components/
    BackdropOverlay.tsx -> .jsx
    CelebrationOverlay.tsx -> .jsx
    RoomMixControls.tsx -> .jsx
    SessionTimer.tsx -> .jsx  
    TrackControl.tsx -> .jsx  
    VibeSelector.tsx -> .jsx  
    ui/
      button.tsx -> .jsx      
  routes/
    _index.tsx -> .jsx        
    relax.tsx -> .jsx         
  entry.client.tsx -> .jsx    
  entry.server.tsx -> .jsx    
  root.tsx -> .jsx            
vite.config.ts -> .js         
tailwind.config.ts -> .js     
tsconfig.json -> DELETE       
```

### Conversion Pattern 1: Type Erasure

**What:** Remove all TypeScript-specific syntax without changing runtime behavior.

**Type annotations (variable, parameter, return):**
```typescript
// TS
const x: string = "hello";
function fn(x: number): string { return x.toString(); }
useState<SceneId>(DEFAULT_SCENE);
const ref = useRef<HTMLAudioElement | null>(null);
```
```javascript
// JS
const x = "hello";
function fn(x) { return x.toString(); }
useState(DEFAULT_SCENE);
const ref = useRef(null);
```

**Type imports and interfaces:**
```typescript
// TS
import type { MixerTrack, SceneId } from "~/types/audio";
export interface Props { title: string; }
```
```javascript
// JS
// (import line removed entirely)
// (interface block removed entirely)
```

**Mixed imports (type + value):**
```typescript
// TS
import { clsx, type ClassValue } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
```
```javascript
// JS
import { clsx } from "clsx";
import { cva } from "class-variance-authority";
```

**Type assertions (`as`) and `satisfies`:**
```typescript
// TS
const parsed = JSON.parse(saved) as SavedPreferences;
JSON.stringify({ ... } satisfies SavedPreferences);
```
```javascript
// JS
const parsed = JSON.parse(saved);
JSON.stringify({ ... });
```

**`as const`:**
```typescript
// TS
const DURATION_PRESETS = [25, 45, 60, 90] as const;
const DEFAULT_SCENE = "misty-cabin" as const;
export const VIBES = [ ... ] as const;
```
```javascript
// JS
const DURATION_PRESETS = [25, 45, 60, 90];
const DEFAULT_SCENE = "misty-cabin";
export const VIBES = [ ... ];
```

**Generic type parameters on components/React hooks:**
```typescript
// TS
const [lastSession, setLastSession] = useState<SessionEntry | null>(null);
const [pausedTracks, setPausedTracks] = useState<Record<string, boolean>>(
  initialPausedTracks ?? Object.fromEntries(tracks.map((t) => [t.label, false]))
);
function Button({ ... }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
```
```javascript
// JS
const [lastSession, setLastSession] = useState(null);
const [pausedTracks, setPausedTracks] = useState(
  initialPausedTracks ?? Object.fromEntries(tracks.map((t) => [t.label, false]))
);
function Button({ ... }) {
```

**`declare module` (ambient module augmentation):**
```typescript
// TS - in vite.config.ts
declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}
```
```javascript
// JS - REMOVE entirely (no runtime effect)
```

**Inline type annotation on function params:**
```typescript
// TS
export function Layout({ children }: { children: React.ReactNode }) {
```
```javascript
// JS
export function Layout({ children }) {
```

**`React.FC<T>` pattern:**
```typescript
// TS (if any component uses React.FC)
const Component: React.FC<Props> = (props) => { }
```
```javascript
// JS
function Component(props) { }
```

**`React.CSSProperties` type assertion on style object:**
```typescript
// TSX
style={{ "--track-fill": `${value}%` } as React.CSSProperties}
```
```jsx
// JSX
style={{ "--track-fill": `${value}%` }}
```

**`eslint-disable-next-line @typescript-eslint/*`:**
```typescript
// TS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
loadContext: AppLoadContext
```
```javascript
// JS
// Must change to `// eslint-disable-next-line no-unused-vars`
// or rename parameter to `_loadContext` (no-unused-vars ignores `_`-prefixed params)
loadContext
```

### Pattern 2: Vite Config with `resolve.alias`

**What:** Replace `vite-tsconfig-paths` plugin with inline `resolve.alias` configuration.
**Source:** Context7 docs for Vite `/vitejs/vite` [VERIFIED]

```javascript
// vite.config.js
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
});
```

### Pattern 3: ESLint Config for JS-Only

**What:** Remove `@typescript-eslint/parser`, `@typescript-eslint` plugin, TypeScript-specific override block. Preserve `react`, `react-hooks`, `jsx-a11y`, `import` plugins. Switch import resolver to node.

```javascript
// .eslintrc.cjs
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client", "build/"],

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx}"],
      plugins: ["react", "jsx-a11y", "import"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          node: {
            extensions: [".js", ".jsx"],
          },
        },
        "import/internal-regex": "^~/",
      },
    },

    // Node
    {
      files: [".eslintrc.cjs", "server.js"],
      env: {
        node: true,
      },
    },
  ],
};
```

### Pattern 4: Tailwind Config

**What:** Strip type import and `satisfies` keyword, update content glob.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { /* ... identical to current ... */ },
      fontFamily: { /* ... identical to current ... */ },
      borderRadius: { /* ... identical to current ... */ },
    },
  },
  plugins: [],
};
```

Changes from `.ts`:
- Remove `import type { Config } from "tailwindcss"`
- Optionally add `/** @type {import('tailwindcss').Config} */` JSDoc for IDE support
- Remove `satisfies Config` suffix after the export object
- Update `content` glob from `*.{js,jsx,ts,tsx}` to `*.{js,jsx}`

### Pattern 5: Deleting `app/types/audio.ts`

**What:** This file exports only type definitions with zero runtime code. After stripping types, it becomes empty. The file and all `import type` references to it are removed.

**Impacted files** (each has at least one `import type { ... } from "~/types/audio"` line to remove):
- `app/constants/audioConfig.ts` -> `.js`
- `app/lib/session.ts` -> `.js`
- `app/hooks/useAudioManager.ts` -> `.js`
- `app/components/BackdropOverlay.tsx` -> `.jsx`
- `app/components/RoomMixControls.tsx` -> `.jsx`
- `app/components/VibeSelector.tsx` -> `.jsx`
- `app/routes/_index.tsx` -> `.jsx`
- `app/routes/relax.tsx` -> `.jsx`

### Pattern 6: `components.json` Update

The shadcn components.json config references `"tsx": true` and `"tailwind.config": "tailwind.config.ts"`. These are metadata for the shadcn CLI. Update:
```json
{
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js"
  }
}
```

This is optional (no build impact) but correct for maintenance tidiness.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TS-to-JS file conversion | Custom transformer tool | Manual per-file type stripping | Codebase is ~2k LOC across 22 files. Every TS construct is simple type annotation -- no enums, decorators, parameter properties, or other TS-only runtime features that would need code transformation. Automated tools (ts-to-js, ts-blank-space, babel) add risk of silently dropping code. |
| Path alias resolution | Custom `resolve.alias` setup | Reuse Vite's built-in `resolve.alias` | The `~` -> `./app` mapping is a single entry in the `resolve.alias` object. No plugin needed. |

**Key insight:** This codebase's TypeScript usage is remarkably simple: only type annotations, interfaces, generics, `as const`, `as`, `satisfies`, and `declare module`. Zero TS runtime features. The conversion is mechanically predictable -- every line of TS syntax maps to an identical JS equivalent with the type syntax removed. Automated tools add risk disproportionate to the simplicity of the task.

## Common Pitfalls

### Pitfall 1: Forgetting to Remove `satisfies` Keyword
**What goes wrong:** `satisfies` is a TS-only keyword. If left in JS, it causes `SyntaxError: Unexpected identifier`.
**Files affected:** `app/routes/_index.tsx` (line 97: `} satisfies SavedPreferences)`); `tailwind.config.ts` (line 91: `} satisfies Config;`)
**How to avoid:** After converting each file, grep for `satisfies` -- there are exactly 2 instances.

### Pitfall 2: `import type` Leaves Broken Module Paths
**What goes wrong:** After removing `import type { ... } from "~/types/audio"` from all files, the file `app/types/audio.ts` still exists but is empty. Its parent `app/types/` directory may retain stale references.
**How to avoid:** Delete `app/types/audio.ts` entirely. Removing the only file in `app/types/` makes the directory empty. The `import type` references are gone, so no runtime import fails.

### Pitfall 3: TS-Specific ESLint Disable Comments Become Stale
**What goes wrong:** `// eslint-disable-next-line @typescript-eslint/no-unused-vars` references a rule that no longer exists. ESLint 8 may warn about unused disable directives (if `reportUnusedDisableDirectives` is enabled).
**Location:** `app/entry.server.tsx` line 24
**How to avoid:** Change to `// eslint-disable-next-line no-unused-vars` or rename the unused `loadContext` parameter to `_loadContext` (the `no-unused-vars` rule in `eslint:recommended` ignores identifiers starting with `_`).

### Pitfall 4: `postcss.config.js` Already JS (No Change Needed)
**What goes wrong:** Accidentally trying to "convert" `postcss.config.js` or `server.js` when they are already JavaScript.
**How to avoid:** Only 22 files need conversion. `postcss.config.js`, `server.js`, and `postcss.config.js` are already `.js`. Cross-reference against the file inventory in this document.

### Pitfall 5: Vite Config `__dirname` Not Available in ESM
**What goes wrong:** In Vite config files loaded as ESM (because `package.json` has `"type": "module"`), `__dirname` is not defined.
**How to avoid:** Use `import.meta.url` + `fileURLToPath` pattern:
```javascript
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### Pitfall 6: `tsconfig.json` as Input for Remix/Vite Build
**What goes wrong:** Removing `tsconfig.json` may cause issues if Vite or the Remix build plugin expects it for path resolution or JSX config.
**Verification:** This should not be an issue because:
- Path resolution moves to `resolve.alias` in `vite.config.js`
- JSX is configured by Vite's `esbuild` options, not by `tsconfig.json`
- The `allowJs: true` setting was needed when TS and JS coexisted -- no longer relevant

After removing `tsconfig.json`, run `npm run build` to verify the build works without it.

### Pitfall 7: ESLint `import/resolver` Failing Without Package
**What goes wrong:** The `eslint-import-resolver-typescript` package is removed from devDependencies but its `typescript: {}` reference in settings would fail. The `node` resolver requires specific extensions config for `.jsx` files.
**Verification:** Ensure `.eslintrc.cjs` settings has:
```javascript
"import/resolver": {
  node: {
    extensions: [".js", ".jsx"],
  },
}
```
Without the extensions config, the import plugin may fail to resolve `.jsx` files.

### Pitfall 8: eslint-plugin-import Must Be Preserved
**What goes wrong:** The import plugin is currently used only in the TypeScript override block. When that block is removed, the plugin must be re-added to the React override to satisfy success criteria 3 ("existing plugins ... import preserved").
**How to avoid:** Add `"plugin:import/recommended"` to the React override's `extends` array. The `eslint-plugin-import` dependency stays in devDependencies.

### Pitfall 9: Remix `declare module` Augmentation for Future Flags
**What goes wrong:** The `declare module "@remix-run/node" { interface Future { v3_singleFetch: true; } }` block is TS-only. Removing it does not affect the future flag's behavior -- the flag is already runtime-configured in `remix({ future: { v3_singleFetch: true } })`. The `declare module` was only for TS compile-time type checking on the Future interface.

## Code Examples

### Complete File Conversion: `app/lib/utils.ts`
```typescript
// BEFORE (TS)
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
```javascript
// AFTER (JS)
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

### Complete File Conversion: `app/entry.server.tsx`
```javascript
// AFTER (JS)
import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  // eslint-disable-next-line no-unused-vars
  _loadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}
// ... remaining functions are identical with types stripped
```

### Complete File Conversion: `app/some-route.jsx`
```javascript
// AFTER (JS) -- a typical route file
import { useEffect, useState } from "react";
import { useSessionTimer } from "~/hooks/useSessionTimer";
import { useAudioManager } from "~/hooks/useAudioManager";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { detectVibeName, detectMood, writeSessionEntry } from "~/lib/session";
import { CelebrationOverlay } from "~/components/CelebrationOverlay";
import { SessionTimer } from "~/components/SessionTimer";
import { RoomMixControls } from "~/components/RoomMixControls";
import { BackdropOverlay } from "~/components/BackdropOverlay";
import { VibeSelector } from "~/components/VibeSelector";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SCENE,
  DEFAULT_TRACKS,
  STORAGE_KEY,
} from "~/constants/audioConfig";
```
Changes from TS version: removed 3 `import type` lines, all type annotations on state variables, generic parameters on `useState`, `as` casts on `JSON.parse`, `satisfies` keyword from `JSON.stringify` argument, and `: MixerTrack[]` annotation on callback parameter.

## Assumptions Log

No `[ASSUMED]` claims -- all findings in this research were verified against the actual codebase, official documentation, or Context7 sources.

## Open Questions

1. **Shadcn `components.json` update scope**
   - What we know: `"tsx": true` and `"tailwind.config": "tailwind.config.ts"` are stale after migration
   - What's unclear: Whether this affects any automated workflow (linting, CLI)
   - Recommendation: Include update in plan for tidiness; low risk if skipped

2. **ESLint `no-unused-vars` conflict with entry.server.tsx**
   - What we know: `loadContext` parameter is unused; currently suppressed by `@typescript-eslint/no-unused-vars` disable comment
   - What's unclear: Whether `eslint:recommended`'s `no-unused-vars` will trigger on this parameter
   - Recommendation: Rename to `_loadContext` to match JS convention that `no-unused-vars` ignores underscore-prefixed params. Or change the disable comment to `no-unused-vars`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build & dev server | Yes | v25.9.0 | -- |
| npm | Package management | Yes | 11.12.1 | -- |

**Missing dependencies with no fallback:** None.

## Sources

### Primary (HIGH confidence)
- [VERIFIED: codebase read] -- All 22 TypeScript files read and catalogued for type patterns
- [VERIFIED: package.json read] -- All TS-related packages identified
- [VERIFIED: .eslintrc.cjs read] -- All parser/plugin configs catalogued
- [VERIFIED: Context7 /vitejs/vite] -- `resolve.alias` configuration pattern for path mapping
- [VERIFIED: Context7 /eslint/eslint] -- Parser configuration, override patterns, JS-only config

### Secondary (MEDIUM confidence)
- [ASSUMED: ESLint 8 behavior] -- `eslint:recommended` includes `no-unused-vars` (warn level). Verified against ESLint 8.x source pattern documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified against package.json and npm registry
- Architecture patterns: HIGH - All patterns extracted from actual codebase files
- Pitfalls: HIGH - All gotchas derived from specific code patterns in the codebase

**Research date:** 2026-05-05
**Valid until:** 2026-06-05 (30 days -- build tools are stable)
