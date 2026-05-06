# Phase 2: JS Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-05-05
**Phase:** 02-js-migration
**Mode:** discuss (standard, interactive)
**Areas discussed:** Conversion method, Path alias resolution, JSDoc type preservation

## Conversion method

| Question | Options | Selected | Notes |
|----------|---------|----------|-------|
| How should TS → JS conversion be executed? | Manual per-file / tsc emit + review diffs / Hybrid | Manual per-file | Line-by-line review, safest for zero-logic-change |
| What conversion order? | Dependency order / Simplest files first | Dependency order | Types → Constants → Lib → Hooks → Components → Routes → Entry → Config |
| Verify per file or batch? | Batch by plan / Per file / Per layer | Batch by plan | Convert all in 02-01, verify in 02-02 |

## Path alias resolution

| Question | Options | Selected | Notes |
|----------|---------|----------|-------|
| How to resolve ~/ after tsconfig removal? | Vite resolve.alias / Keep jsconfig.json | Vite resolve.alias | Direct alias in vite.config.js, remove vite-tsconfig-paths |

## JSDoc type preservation

| Question | Options | Selected | Notes |
|----------|---------|----------|-------|
| Preserve types as JSDoc? | Strip completely / Preserve as JSDoc / JSDoc for public API only | Strip completely | Clean JS, no TS-adjacent syntax |

## Deferred ideas

None.
