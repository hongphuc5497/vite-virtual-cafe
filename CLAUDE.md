# vite-remix-virtual-cafe

## Commands
- `npm run dev` — start dev server (Express + Vite HMR) at **http://localhost:3000**
- `npm run build` — production build via `remix vite:build`
- `npm run typecheck` — type-check only (`tsc --noEmit`); Vite handles emit, not tsc
- `npm run lint` — ESLint with TypeScript + import plugins
- `npm start` — production Express server (requires `npm run build` first)

## Architecture
- Remix v2 on a **custom Express server** (`server.js`) — not the default Remix CLI server
- Vite future flags active: `v3_singleFetch`, `v3_lazyRouteDiscovery`, `v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`
- Path alias: `~/*` → `./app/*` — always use `~/components/Foo`, never relative paths
- Tailwind CSS **v3** — config in `tailwind.config.ts` + `postcss.config.js`
- Audio via native **HTMLAudioElement** — browser-only; never import audio code in loaders, actions, or server-side code
- shadcn/ui **v4** partially configured (`components.json`, `app/components/ui/`, `app/lib/utils.ts`) — Tailwind v3 so some v4 directives unavailable

## Code Style
- TypeScript strict mode — no `any`, no non-null assertions without an explanatory comment
- ES modules throughout (`import`/`export`), no `require()`
- Directory layout: `app/components/`, `app/routes/`, `app/hooks/`, `app/types/`, `app/constants/`
- `MixerTrack` and `SavedPreferences` are the core audio state types (`app/types/audio.ts`)

## Gotchas
- **No test runner configured** — do not assume Jest, Vitest, or any other test framework exists
- `useAudioManager` and `useSessionTimer` are client-only hooks; they must not run during SSR
- All `localStorage` access must be inside `useEffect` — never in render or loaders
- `DEFAULT_TRACKS` in `app/constants/audioConfig.ts` is the single source of truth for track configuration; update there first, then check downstream consumers
- Node.js ≥ 20 required (`engines` field in `package.json`)

## Token Efficiency
- Never re-read files you just wrote or edited. You know the contents.
- Never re-run commands to "verify" unless the outcome was uncertain.
- Don't echo back large blocks of code or file contents unless asked.
- Batch related edits into single operations. Don't make 5 edits when 1 handles it.
- Skip confirmations like "I'll continue..." Just do it.
- If a task needs 1 tool call, don't use 3. Plan before acting.
- Do not summarize what you just did unless the result is ambiguous or you need additional input.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **vite-virtual-cafe** (242 symbols, 307 relationships, 2 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/vite-virtual-cafe/context` | Codebase overview, check index freshness |
| `gitnexus://repo/vite-virtual-cafe/clusters` | All functional areas |
| `gitnexus://repo/vite-virtual-cafe/processes` | All execution flows |
| `gitnexus://repo/vite-virtual-cafe/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
