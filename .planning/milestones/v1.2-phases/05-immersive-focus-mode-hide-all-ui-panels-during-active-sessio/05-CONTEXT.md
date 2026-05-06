# Phase 5: Immersive Focus Mode - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

When a focus session starts on `_index.jsx`, all control panels (RoomMixControls, VibeSelector, SessionTimer card, duration picker, hero text) animate out with a fade-slide transition, leaving only the cafe backdrop scene and a minimal centered floating timer pill. Hovering near the bottom edge or pressing Escape reveals the panels temporarily. Auto-hide after 3 seconds of inactivity. When the session ends and the celebration overlay appears, panels restore to default visible state — immersive mode is session-scoped, not persistent.

Does NOT apply to the `/relax` page — the relax page is already a simplified ambient-only view with no timer.

**Requirements:** IMMER-01, IMMER-02, IMMER-03
</domain>

<decisions>
## Implementation Decisions

### Animation behavior
- **D-01:** Panels animate out with fade + slide-to-edges — left column (timer card + vibe selector) slides left, right column (mixer) slides right, hero text ("Stay in the room.") slides up. All fade out simultaneously. 400ms ease-out.
- **D-02:** Timer transitions via crossfade reposition — the card-based SessionTimer fades out while a new floating timer pill fades in at center screen (~300ms crossfade overlap). Two separate elements, not a single animated element.
- **D-03:** Hero text ("Stay in the room." and subtitle) fades out completely — not dimmed, fully removed during immersive mode.

### Timer restyling
- **D-04:** Immersive timer is a minimal floating pill — dark translucent background (`rgba(0,0,0,0.35)`), rounded, positioned dead center of the viewport (both horizontally and vertically).
- **D-05:** Timer digit typography is larger than the card timer — ~text-6xl (3.75rem), light font weight. Light-colored text against the dark pill for legibility on any backdrop scene.

### Reveal behavior
- **D-06:** Panels reveal via reverse animation when: (a) user presses Escape, or (b) cursor enters the bottom 10% of the viewport. Panels auto-hide after 3 seconds of cursor inactivity outside the panel area. Escape toggles — pressing it again re-hides panels.
- **D-07:** Immersive mode is session-scoped — when the timer hits 0 and the celebration overlay appears, panels restore to their default visible state. Starting a new session re-enters immersive mode.

### Claude's Discretion
- Exact CSS transform distances for slide-to-edges animation (left column slides left ~40px, right ~40px, hero ~20px up — adjust for visual balance)
- Floating pill exact dimensions, border-radius, padding
- Edge-hover detection implementation (CSS `:hover` zone vs JS `mousemove` listener vs a transparent hover strip element)
- Auto-hide inactivity timer implementation (debounced mousemove listener vs CSS-only approach)
- Whether to pause/disable keyboard shortcuts (Space, Arrow keys) during immersive mode or keep them active
- How the `useImmersiveMode` hook coordinates with `useKeyboardShortcuts` for the Escape key (extend existing hook vs new hook)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — IMMER-01, IMMER-02, IMMER-03 (note: these IDs appear in ROADMAP.md but REQUIREMENTS.md may need updating)
- `.planning/ROADMAP.md` — Phase 5 success criteria (3 items), phase boundary, plan list

### Prior phases
- `.planning/phases/01-complete-session-loop/01-CONTEXT.md` — Frosted glass card pattern, celebration overlay pattern, session lifecycle decisions (D-03 save-on-show, D-08/D-09 error surfacing)
- `.planning/phases/02-js-migration/02-CONTEXT.md` — JS-only codebase constraint, `~/` path alias, ES modules

### Codebase maps
- `.planning/codebase/CONVENTIONS.md` — Component patterns, Tailwind styling, hook patterns
- `.planning/codebase/STRUCTURE.md` — File layout, component locations, integration points
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`useSessionTimer`** (`app/hooks/useSessionTimer.js`) — Exposes `isRunning`, `timeLeft`, `start`, `pause`, `stop`, `formatTime`. Timer completion sets `isRunning=false` when `timeLeft` hits 0. Immersive mode triggers on `isRunning` becoming true.
- **`useKeyboardShortcuts`** (`app/hooks/useKeyboardShortcuts.js`) — Already listens on `window` for `keydown` events. Currently handles Space, ArrowUp, ArrowDown. Needs Escape key added (either extend this hook or add a separate listener in `useImmersiveMode`).
- **`CelebrationOverlay`** (`app/components/CelebrationOverlay.jsx`) — Existing overlay pattern: absolute positioned, z-50, fade-in transition. Immersive mode panels restore when this overlay appears (timer completion → celebration).
- **Session timer card** — Currently a frosted glass card wrapping `<SessionTimer>`. The immersive floating pill replaces this wrapper entirely when active.

### Integration Points
- **`_index.jsx`** — Main integration surface. `handleToggleTimer` starts/pauses the session; `timer.isRunning` is the trigger for immersive mode. The file already manages `showCelebration` state and coordinates timer + audio + keyboard.
- **Timer completion detection** (line 66-88 in `_index.jsx`) — `useEffect` watching `timer.timeLeft`, `timer.isRunning`, `showCelebration`. Celebration overlay appears here. Immersive mode must restore panels before or alongside this overlay.
- **`app/routes/relax.jsx`** — NOT affected. Immersive mode is `_index.jsx` only per phase boundary.

### Established Patterns
- Frosted glass cards: `background: rgba(255,255,255,0.88)`, `backdropFilter: blur(12px)`, `rounded-2xl`, `shadow-[0_24px_40px_rgba(29,28,13,0.08)]`
- Tailwind utility classes with inline style overrides for brand colors
- `~/` path alias for all imports — never relative paths
- Custom hooks for stateful logic extraction (useEffect-based, SSR-safe)
- All `localStorage` inside `useEffect` — never in render/loaders
</code_context>

<specifics>
## Specific Ideas

- Immersive mode should feel like the room "clears space" for you — panels don't vanish abruptly, they leave gracefully
- The floating timer pill should feel like a natural part of the backdrop, not a UI element pasted on top
- Dark translucent pill works with the cafe's warm/dark aesthetic from Phase 1
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 05-immersive-focus-mode*
*Context gathered: 2026-05-06*
