# vite-remix-virtual-cafe

## Commands
- `npm run dev` — start dev (Express+Vite HMR) **http://localhost:3000**
- `npm run build` — prod build via `remix vite:build`
- `npm run typecheck` — `tsc --noEmit`; Vite handles emit
- `npm run lint` — ESLint w/ TS+import plugins
- `npm start` — prod Express (needs `npm run build` first)

## Architecture
- Remix v2 on **custom Express** (`server.js`) — not Remix CLI server
- Vite future flags: `v3_singleFetch`, `v3_lazyRouteDiscovery`, `v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`
- Path alias: `~/*` → `./app/*` — always `~/components/Foo`, never relative
- Tailwind CSS **v3** — `tailwind.config.ts` + `postcss.config.js`
- Audio: native **HTMLAudioElement** — browser-only; never import audio code in loaders/actions/server
- shadcn/ui **v4** partial (`components.json`, `app/components/ui/`, `app/lib/utils.ts`) — Tailwind v3 so some v4 directives unavailable

## Code Style
- TS strict — no `any`, no non-null assertions w/o comment
- ES modules (`import`/`export`), no `require()`
- Dir layout: `app/components/`, `app/routes/`, `app/hooks/`, `app/types/`, `app/constants/`
- `MixerTrack` + `SavedPreferences` = core audio state types (`app/types/audio.ts`)

## Gotchas
- **No test runner** — don't assume Jest/Vitest/etc
- `useAudioManager` + `useSessionTimer` client-only; never run during SSR
- All `localStorage` inside `useEffect` — never in render/loaders
- `DEFAULT_TRACKS` in `app/constants/audioConfig.ts` = single truth source for tracks; update there, check downstream
- Node.js ≥ 20 (`engines` in `package.json`)

## Token Efficiency
- Never re-read files just wrote/edited
- Never re-run commands to "verify" unless outcome uncertain
- Don't echo large code/file blocks unless asked
- Batch edits: 1 op over 5
- Skip "I'll continue..." confirmations
- 1 tool call > 3. Plan first.
- Don't summarize what just did unless ambiguous/need input

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project indexed as **vite-virtual-cafe** (229 symbols, 294 relationships, 2 execution flows). Use GitNexus MCP tools to understand code, assess impact, navigate safely.

> If GitNexus tool warns stale index, run `npx gitnexus analyze` first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying function/class/method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` + report blast radius (direct callers, affected processes, risk level).
- **MUST run `gitnexus_detect_changes()` before committing** to verify changes only affect expected symbols/flows.
- **MUST warn** if impact analysis returns HIGH/CRITICAL risk before edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. Returns process-grouped results ranked by relevance.
- When need full context on symbol — callers, callees, execution flows — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit function/class/method without first running `gitnexus_impact`.
- NEVER ignore HIGH/CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` (understands call graph).
- NEVER commit without running `gitnexus_detect_changes()` to check affected scope.

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