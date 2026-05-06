# vite-remix-virtual-cafe — Agent Config

No custom subagents defined yet.
GitNexus block below auto-injected by GitNexus tool.
Add agent defs here when isolated, tool-restricted tasks needed.

Token efficiency rules in CLAUDE.md (single source of truth).

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

Project indexed by GitNexus as **vite-virtual-cafe** (229 symbols, 294 relationships, 2 execution flows). Use GitNexus MCP tools to understand code, assess impact, navigate safely.

> If any GitNexus tool warns index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report blast radius (direct callers, affected processes, risk level) to user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify changes only affect expected symbols and execution flows.
- **MUST warn user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. Returns process-grouped results ranked by relevance.
- Need full context on a symbol — callers, callees, execution flows — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename`.
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