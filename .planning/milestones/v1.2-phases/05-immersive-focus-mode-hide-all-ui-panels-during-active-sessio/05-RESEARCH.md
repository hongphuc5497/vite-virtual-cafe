# Phase 5: Immersive Focus Mode - Research

**Researched:** 2026-05-06
**Domain:** CSS transitions, React hooks, UI animation patterns, accessibility
**Confidence:** HIGH

## Summary

Immersive Focus Mode is a purely frontend feature on the `_index.jsx` route. When a focus session starts, all control panels animate out (fade+slide) using only CSS transitions -- no animation library needed. A new `useImmersiveMode` hook manages three responsibilities: (1) session-scoped enter/exit lifecycle, (2) Escape key and edge-hover detection for temporary panel reveal, and (3) an auto-hide inactivity timer. A lightweight `ImmersiveTimerPill` component replaces the card-based timer during immersion.

The implementation is ~150-200 lines of new/modified code across 2 new files and 1 modified file. Zero new npm dependencies. The existing `tw-animate-css` package (installed but designed for Tailwind v4) provides usable CSS `@keyframes enter/exit` but the `@utility` blocks are incompatible with Tailwind v3 -- the recommended approach is direct CSS `transition` classes via Tailwind or inline styles, consistent with existing codebase patterns.

**Primary recommendation:** Pure CSS transitions for all animations, transparent hover strip for edge detection, debounced mousemove for auto-hide, and a dedicated Escape handler inside `useImmersiveMode`.

## User Constraints (from CONTEXT.md)

<user_constraints>
### Locked Decisions

- **D-01:** Panels animate out with fade + slide-to-edges -- left column (timer card + vibe selector) slides left, right column (mixer) slides right, hero text slides up. All fade out simultaneously. 400ms ease-out.
- **D-02:** Timer transitions via crossfade reposition -- the card-based SessionTimer fades out while a new floating timer pill fades in at center screen (~300ms crossfade overlap). Two separate elements, not a single animated element.
- **D-03:** Hero text fades out completely -- not dimmed, fully removed during immersive mode.
- **D-04:** Immersive timer is a minimal floating pill -- dark translucent background (rgba(0,0,0,0.35)), rounded, positioned dead center of the viewport.
- **D-05:** Timer digit typography is larger than the card timer -- ~text-6xl (3.75rem), light font weight. Light-colored text against the dark pill.
- **D-06:** Panels reveal via reverse animation when: (a) user presses Escape, or (b) cursor enters the bottom 10% of the viewport. Panels auto-hide after 3 seconds of cursor inactivity outside the panel area. Escape toggles -- pressing it again re-hides panels.
- **D-07:** Immersive mode is session-scoped -- when the timer hits 0 and the celebration overlay appears, panels restore to default visible state. Starting a new session re-enters immersive mode.

### Claude's Discretion

- Exact CSS transform distances for slide-to-edges animation
- Floating pill exact dimensions, border-radius, padding
- Edge-hover detection implementation (CSS `:hover` zone vs JS `mousemove` listener vs transparent hover strip element)
- Auto-hide inactivity timer implementation (debounced mousemove vs CSS-only)
- Whether to pause/disable keyboard shortcuts (Space, Arrow keys) during immersive mode
- How `useImmersiveMode` coordinates with `useKeyboardShortcuts` for Escape key

### Deferred Ideas (OUT OF SCOPE)

None.
</user_constraints>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| IMMER-01 | Starting a focus session triggers panels to fade/slide out smoothly (~400ms) -- only backdrop and centered timer remain | CSS `transition-all duration-[400ms] ease-out` on opacity + translate. Sessions active when `timer.isRunning` is true. |
| IMMER-02 | Escape key or bottom 10% hover reveals panels with reverse animation; auto-hide after 3s inactivity | Transparent hover strip for edge detection. Debounced mousemove listener with 3s timeout. CSS reverse animation via class toggle. |
| IMMER-03 | Timer end + celebration overlay restores panels to default visible state -- session-scoped | `useImmersiveMode` exits when `timer.isRunning` transitions to false AND `timeLeft === 0`. Panels restore before or simultaneous with celebration overlay. |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Panel animation (fade+slide) | Browser / Client | -- | Pure CSS transitions, no server involvement |
| Floating timer pill | Browser / Client | -- | Client-only timer display, reads `timer.timeLeft` |
| Edge-hover detection | Browser / Client | -- | DOM event handling, no server data needed |
| Auto-hide inactivity timer | Browser / Client | -- | Browser timer API, no server data |
| Escape key handling | Browser / Client | -- | KeyboardEvent listener, no server needed |
| Session lifecycle coordination | Browser / Client | API / Backend | `timer.isRunning` + `showCelebration` state in `_index.jsx` |
| Celebrating overlay appearance | Browser / Client | -- | Existing z-50 overlay, independent of immersive mode |
| Relax page / other routes | -- | -- | Not affected per phase boundary |

All capabilities are client-side only. The immersive mode has zero backend dependencies and operates entirely within `_index.jsx`.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useEffect, useRef, useCallback) | 18.3.1 | State management, DOM event listeners, timer intervals | Already in project, no alternatives needed |
| Tailwind CSS transitions | 3.4.19 | CSS `transition-all`, `duration-[400ms]`, `ease-out`, opacity and transform classes | Already in project, consistent with existing patterns |
| tw-animate-css | 1.4.0 | Provides `@keyframes enter` and `@keyframes exit` CSS animations | Already installed. NOTE: `@utility` blocks are Tailwind v4 syntax -- incompatible with Tailwind v3. Only the `@property` and `@keyframes` declarations are usable. The enter/exit keyframes can still be referenced directly in CSS. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| cn() utility (clsx + tailwind-merge) | from app/lib/utils.js | Conditional class merging for panel visibility | To toggle between visible and hidden states with smooth transitions |
| useSessionTimer | from app/hooks/useSessionTimer.js | Provides `isRunning`, `timeLeft`, `formatTime` | Trigger source for entering/exiting immersive mode, time display for floating pill |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transitions | Framer Motion | Framer Motion adds ~32KB gzipped. CSS transitions are sufficient for simple fade+slide. Framer Motion needed if user wanted spring physics, staggered children, or complex gesture-driven animations. NOT recommended for this use case. |
| CSS transitions | tw-animate-css utility classes | `tw-animate-css` is designed for Tailwind v4 (`@utility` directive). This project uses Tailwind v3 where `@utility` is unrecognized. Only the `@keyframes` and `@property` declarations are usable. The recommended approach is direct `transition-all duration-N` Tailwind classes. |
| Transparent hover strip | JS mousemove listener | Mousemove fires on every pixel movement, requiring throttling. Transparent strip is zero-overhead CSS. |
| Transparent hover strip | CSS `:hover` on a bottom div | CSS `:hover` alone can't trigger React state changes. Need `onMouseEnter`/`onMouseLeave` which requires a React element. |
| Separate Escape handler | Extending useKeyboardShortcuts | `useKeyboardShortcuts` is callback-based and has no "enabled/disabled" state. Escape key is specific to immersive mode -- co-locating it in `useImmersiveMode` is cleaner and follows single-concern pattern. |

**Installation:** Zero new packages to install. All animations use existing CSS infrastructure.

**Version verification:** `tw-animate-css@1.4.0` verified via `npm view`. React 18.3.1 from `package.json`. Tailwind CSS 3.4.19 from `package.json`.

## Architecture Patterns

### System Architecture Diagram

```
Session Start (timer.isRunning = true)
         |
         v
  useImmersiveMode hook
  - Sets `isActive = true`
  - Sets `showPanels = false`
         |
         v
  CSS transitions (400ms ease-out):
  ┌─────────────────────────────────────────────┐
  │ Left column  → opacity:0 + translateX(-40px) │
  │ Right column → opacity:0 + translateX(40px)  │
  │ Hero text    → opacity:0 + translateY(-20px) │
  └─────────────────────────────────────────────┘
         |
         v
  ~100ms delay → ImmersiveTimerPill fades in (300ms)
  ┌──────────────────────┐
  │ Centered dark pill   │
  │ Time in text-6xl     │
  │ formatTime(timeLeft) │
  └──────────────────────┘
         |
         ├── User presses Escape ──┐
         │                         v
         │              showPanels = true
         │              ┌─────────────────────┐
         │              │ Panels animate IN   │
         │              │ (reverse animation) │
         │              │ Pill stays visible  │
         │              └─────────────────────┘
         │                         |
         │              3s inactivity timer starts
         │                         |
         │              ┌──────────┘
         │              v
         │    Tiemout fires? ──yes──→ showPanels = false
         │              |                    |
         │              no                   v
         │              |           Panels animate OUT
         │              |           (stay in showPanels=true)
         │              v
         │    User presses Escape again?
         │    Or timer hits 0?
         │
         ├── User hovers bottom 10% ──→ same as Escape flow
         │
         └── Timer hits 0 ──┐
                             v
  timer.isRunning = false, timeLeft = 0
         |
         v
  showCelebration = true (existing effect fires)
  exitImmersiveMode()
  showPanels = true
  isActive = false
         |
         v
  Panels restore to default visible state
  ImmersiveTimerPill fades out
  CelebrationOverlay appears (z-50, above panels)
```

### Recommended Project Structure

No new directories needed. New files follow the existing structure:

```
app/
├── hooks/
│   ├── useKeyboardShortcuts.js   (unchanged)
│   ├── useSessionTimer.js        (unchanged)
│   └── useImmersiveMode.js       (NEW - ~80-100 lines)
├── components/
│   ├── CelebrationOverlay.jsx    (unchanged)
│   ├── SessionTimer.jsx          (unchanged)
│   └── ImmersiveTimerPill.jsx    (NEW - ~30-40 lines)
└── routes/
    └── _index.jsx                (MODIFIED - add ~30-50 lines)
```

### Pattern 1: CSS Transition State Toggling

**What:** Use Tailwind's `transition-all` class combined with conditional classes for opacity and transform to animate panel visibility. Elements stay in the DOM but become invisible/non-interactive via `pointer-events-none` and `opacity-0`.

**When to use:** All panel animations in this phase. This is the existing pattern used by `CelebrationOverlay` (`transition-opacity duration-500 ease-out` + `opacity-0` + `pointer-events-none`).

**Example:**
```jsx
// Source: Existing pattern from CelebrationOverlay.jsx + standard CSS transition architecture
// Left column wrapper
<div
  className={cn(
    "flex flex-col gap-5 transition-all duration-[400ms] ease-out",
    hidePanels && "pointer-events-none opacity-0 -translate-x-10"
  )}
>
  <SessionTimer ... />
  <VibeSelector ... />
</div>

// Right column wrapper
<div
  className={cn(
    "transition-all duration-[400ms] ease-out",
    hidePanels && "pointer-events-none opacity-0 translate-x-10"
  )}
>
  <RoomMixControls ... />
</div>

// Hero text wrapper
<div
  className={cn(
    "mb-8 transition-all duration-[400ms] ease-out",
    hidePanels && "pointer-events-none opacity-0 -translate-y-5"
  )}
>
  <h1>Stay in the room.</h1>
  <p>Set a session length...</p>
</div>

// Float timer pill - inverse opacity
<div
  className={cn(
    "fixed left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-[300ms] ease-out",
    isActive ? "opacity-100" : "pointer-events-none opacity-0"
  )}
>
  <ImmersiveTimerPill timeLeft={timer.timeLeft} formatTime={timer.formatTime} />
</div>
```

### Anti-Patterns to Avoid

- **Removing elements from DOM during transition:** React removes elements synchronously, causing instant disappearance. Instead, keep elements in DOM and control visibility via opacity + pointer-events-none.
- **Using Framer Motion for simple fade+slide:** Adds unnecessary ~32KB bundle. CSS transitions cover all requirements.
- **Global mousemove listener without remove:** Must clean up in useEffect return. Use addEventListener/removeEventListener pattern matching useKeyboardShortcuts.
- **Inline event handlers on the hover strip:** Use onMouseEnter/onMouseLeave on a React element, not raw DOM addEventListener.
- **Nesting the timer pill inside `overflow-hidden` parent:** The pill needs `fixed` positioning for viewport centering, which escapes overflow-hidden. Keep pill at the top level of the main element.

### Pattern 2: Transparent Hover Strip for Edge Detection

**What:** A fixed-position, full-width transparent `<div>` at the bottom 10% of the viewport. `onMouseEnter` triggers panel reveal. Less expensive than a mousemove listener.

**When to use:** When you only need to detect the cursor entering a specific edge zone, not track continuous cursor position.

**Example:**
```jsx
// Inside the main element, positioned above the backdrop
{isActive && (
  <div
    className="fixed bottom-0 left-0 right-0 z-40"
    style={{ height: "10vh" }}
    onMouseEnter={() => handleReveal()}
    aria-hidden="true"
  />
)}
```

### Anti-Pattern: JS mousemove for edge zone detection

**What goes wrong:** `mousemove` fires on every pixel of mouse movement. Even throttled, it continuously checks `event.clientY < window.innerHeight * 0.9`. This is wasteful when all you need is an "enter zone" trigger.

**Do this instead:** Transparent hover strip element. It fires one event on enter, zero overhead otherwise. Works whether the cursor is moving or still.

### Pattern 3: Debounced Auto-Hide Inactivity Timer

**What:** When panels are revealed, a debounced mousemove listener resets a 3-second timeout. If the user stops moving the mouse for 3 seconds and the cursor is not inside the panels, panels auto-hide.

**When to use:** Any "reveal on interaction, hide on idle" pattern.

**Example:**
```jsx
// Inside useImmersiveMode hook
const inactivityRef = useRef(null);

const startInactivityTimer = useCallback(() => {
  clearTimeout(inactivityRef.current);
  inactivityRef.current = setTimeout(() => {
    setShowPanels(false);
  }, 3000);
}, []);

const cancelInactivityTimer = useCallback(() => {
  clearTimeout(inactivityRef.current);
}, []);

// Only add mousemove when panels are visible
useEffect(() => {
  if (!showPanels || !isActive) return;
  
  const handleMouseMove = (e) => {
    // Don't auto-hide if mouse is in the bottom 10% (edge zone)
    if (e.clientY > window.innerHeight * 0.9) return;
    startInactivityTimer();
  };

  window.addEventListener("mousemove", handleMouseMove);
  startInactivityTimer(); // Start timer when panels first appear
  
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    cancelInactivityTimer();
  };
}, [showPanels, isActive, startInactivityTimer, cancelInactivityTimer]);
```

### Anti-Pattern: CSS-only auto-hide

CSS cannot detect mouse motion or trigger timeouts. You need JS to reset a timer on `mousemove`. CSS-only auto-hide would require the panels to auto-hide at a fixed interval regardless of user activity, which is not the desired behavior (should only hide when user is inactive).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation library | A custom animation framework | CSS `transition` classes | The required animations are simple opacity + translate transforms. CSS transitions are GPU-accelerated, zero bundle cost, and the existing codebase already uses this pattern in 6+ components. No custom animation logic needed. |
| Edge-zone detection | A continuous JS mousemove listener with throttled Y-position checks | Transparent hover strip div | One DOM element, one `onMouseEnter` handler. Simpler to read, debug, and maintain. Zero performance overhead when cursor is not near the bottom edge. |
| Keyboard shortcut coordination | A global key dispatcher or event bus | Separate Escape keydown in useImmersiveMode | Escape is exclusively for immersive mode. Adding it to useKeyboardShortcuts would require adding an escape callback parameter and would couple two independent concerns. A separate listener is simpler and follows single-responsibility. |
| prefers-reduced-motion detection | A custom observable | `window.matchMedia("(prefers-reduced-motion: reduce)").matches` | Standard browser API, used via useEffect. Returns whether user prefers reduced motion. When true, remove transition classes so panels appear/disappear instantly. |

## Runtime State Inventory

**Skip:** Phase 5 is a greenfield feature addition (new behavior on existing route), not a rename, refactor, or migration. No existing runtime data keys, service config names, OS registrations, env var names, or build artifacts need to change.

## Common Pitfalls

### Pitfall 1: Flash of visible panels on initial page load

**What goes wrong:** The `useImmersiveMode` hook initially returns `isActive=false, showPanels=true`, so panels are rendered. Then React hydrates and the `useEffect` fires, potentially changing state. But for immersive mode, the initial state is "not running" so panels should be visible. This is only a problem if the initial render incorrectly hides panels.

**How to avoid:** Ensure `useState` initial values are `isActive=false, showPanels=true`. Never default to immersive mode.

### Pitfall 2: Animation stutter on session start

**What goes wrong:** When the user clicks "Start", multiple state updates happen simultaneously (timer starts, immersive mode enters, celebration overlay hides). If these are in the same synchronous render batch, the CSS classes change before the browser paints, causing the initial state (visible) to jump directly to the final state (hidden) without animation.

**How to avoid:** Use a two-phase update: first set `isRunning` (which starts the timer), then in a subsequent `useEffect` triggered by `isRunning`, set `isActive=true` to trigger the animation. The `useEffect` fires after the browser paints the "running" state, ensuring the transition runs from the visible state.

**Warning signs:** Panels disappear instantly instead of animating over 400ms.

### Pitfall 3: Mousemove listener leak

**What goes wrong:** If the mousemove listener added for auto-hide is not removed on unmount or when panels are hidden, it continues firing and resetting timeouts on every mouse movement across the entire app.

**How to avoid:** Always pair `addEventListener("mousemove", handler)` with a `removeEventListener` in the useEffect cleanup. The listener should only be active when `showPanels=true && isActive=true`. Use a dependency array that triggers re-registration.

**Warning signs:** Panels auto-hiding when the user is not in focus mode (mousemove listener leaking).

### Pitfall 4: Escape key toggling celebration overlay

**What goes wrong:** When the celebration overlay is visible and the user presses Escape, it might trigger the `useImmersiveMode` Escape handler instead of (or in addition to) the overlay's dismiss behavior.

**How to avoid:** `useImmersiveMode` should check `if (showCelebration) return` before processing Escape, or the celebration overlay should prevent Escape propagation. The safest approach: check `event.defaultPrevented` and bail early.

**Warning signs:** Pressing Escape during the celebration overlay hides panels (already invisible) or triggers unexpected behavior.

### Pitfall 5: Timer desync between card and pill

**What goes wrong:** The floating pill reads `timer.timeLeft` and calls `timer.formatTime`. Since both the card and pill read from the same source, they stay in sync automatically. But if there's a props-drilling issue (pill gets stale `timeLeft`), it could show a different time.

**How to avoid:** The pill receives `timeLeft` and `formatTime` as props directly from the parent route where `timer` is initialized. No intermediate component re-renders these values. The pill should be a pure display component, not managing its own timer state.

### Pitfall 6: SSR hydration mismatch

**What goes wrong:** `useImmersiveMode` uses `matchMedia` and browser event listeners inside `useEffect`, which are SSR-safe. But if any visual state is computed from browser-only APIs (e.g., `window.innerHeight` for the hover strip height), the server render won't see it.

**How to avoid:** The hover strip uses `10vh` (CSS viewport-relative unit), not a JS-computed height. All browser API usage is inside `useEffect` or `useRef`. No `window` access during render.

## Code Examples

Verified patterns from the existing codebase:

### Pattern: CSS Transition for Show/Hide (from CelebrationOverlay.jsx)

```jsx
// Source: app/components/CelebrationOverlay.jsx (existing pattern)
<button
  type="button"
  className={`fixed inset-0 z-50 flex transition-opacity duration-500 ease-out ${
    show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
>
```

This is the exact pattern to replicate for all panels. Key elements:
1. Element always rendered (never conditionally removed)
2. `transition-{property} duration-{ms} ease-{type}` on the element
3. Conditional class toggles between visible (`opacity-100 pointer-events-auto`) and invisible (`opacity-0 pointer-events-none`)
4. `pointer-events-none` prevents interaction with invisible elements

### Pattern: Keyboard Shortcut Listener (from useKeyboardShortcuts.js)

```jsx
// Source: app/hooks/useKeyboardShortcuts.js
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      onTogglePlay?.();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onTogglePlay]);
```

For Escape key in `useImmersiveMode`, replicate this pattern with `event.code === "Escape"`.

### Pattern: Timer Formatting (from useSessionTimer.js)

```jsx
// Source: app/hooks/useSessionTimer.js
const formatTime = useCallback((seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}, []);
```

The pill component receives `formatTime` as a prop (or calls `timer.formatTime`) -- no need to duplicate this.

### ImmersiveTimerPill Component

```jsx
// NEW: app/components/ImmersiveTimerPill.jsx
export function ImmersiveTimerPill({ timeLeft, formatTime }) {
  return (
    <div
      className="rounded-2xl px-8 py-4 text-center"
      style={{
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        className="font-headline text-6xl font-light tracking-tight"
        style={{ color: "rgba(255,255,255,0.95)", letterSpacing: "-0.02em" }}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS animations in separate stylesheets | Tailwind utility classes for transitions | Tailwind 2.x+ | Animations are now co-located with markup. For this project, the `transition-all duration-[400ms] ease-out` inline Tailwind pattern is standard. |
| Framer Motion / React Spring for enter/exit | CSS `transition` with class toggles | Always possible | CSS class toggling handles this pattern for simple opacity+transform. Framer Motion only needed for complex shared element transitions or spring-physics animations. |

**Deprecated/outdated:**
- `Animating` elements via component unmount (conditional rendering): Causes instant disappearance in React. Use opacity + pointer-events-none instead.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | CSS transitions on `transform` and `opacity` are universally supported in target browsers | Code Examples | LOW risk -- these properties have been supported since IE10. No polyfill needed. |
| A2 | `window.matchMedia("(prefers-reduced-motion: reduce)")` is available | Standard Stack | LOW risk -- supported since IE11. Falls back gracefully (no motion reduction on old browsers, which is acceptable). |
| A3 | Transparent hover strip approach works without interfering with scroll or click events | Pattern 2 | LOW risk -- `pointer-events: auto` on the strip, `aria-hidden="true"` for screen readers. No interaction with click targets below since bottom 10% of viewport is empty during immersive mode. |
| A4 | Escape key does not conflict with browser default behavior (back navigation) | Pattern 1 | MEDIUM risk -- Some browsers (Safari) use Cmd+[ for back, but Escape alone is not a back shortcut. In Remix, Escape has no default handler. Confirm during testing. |
| A5 | No zero-duration CSS transition flash on initial SSR hydration | Pitfall 6 | LOW risk -- all transitions are gated on `isActive` state, which defaults to false. No initial animation. |

## Open Questions

1. **How should `useImmersiveMode` receive session state?**
   - What we know: The hook needs to know when `timer.isRunning` transitions and when `showCelebration` is set.
   - What's unclear: Should these be passed as props to the hook, or should `_index.jsx` call separate `enter(immersiveMode()` / `exitImmersiveMode()` functions?
   - **Recommendation:** Pass `timer.isRunning` and `showCelebration` as parameters. The hook watches for state transitions internally via `useEffect`. This keeps the integration surface clean: `const immersion = useImmersiveMode({ isSessionActive: timer.isRunning, showCelebration })`.

2. **What exact transform distances for slide-to-edges?**
   - What we know: Left column slides left, right column slides right, hero slides up.
   - What's unclear: Exact pixel values. D-01 doesn't specify.
   - **Recommendation:** Start with `-translate-x-10` (40px) for left, `translate-x-10` (40px) for right, `-translate-y-5` (20px) for hero. These are perceptible without being jarring. Leave fine-tuning to visual review.

3. **Should keyboard shortcuts (Space, Arrow keys) be active during immersive mode?**
   - What we know: Users can press Escape to reveal panels.
   - What's unclear: Should Space still toggle play/pause when panels are hidden?
   - **Recommendation:** Keep Space/Arrow keys active. Users familiar with the keyboard shortcuts should be able to pause the session without needing to reveal panels first. This is consistent with audio player behavior (Space pauses even in fullscreen/cinema mode).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| CSS `transition` | All animations | Yes | -- | -- |
| `keydown` event | Keyboard handling | Yes | -- | -- |
| `mousemove` event | Auto-hide timer | Yes | -- | -- |
| `matchMedia` | Reduced motion detection | Yes | -- | Skip `prefers-reduced-motion` check |
| `setTimeout` / `clearTimeout` | Auto-hide timer | Yes | -- | -- |
| DOM APIs (addEventListener/removeEventListener) | All event handling | Yes | -- | -- |

**Missing dependencies with no fallback:** None -- no new packages or external services needed.

**Missing dependencies with fallback:** None.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Single-user local app, no auth |
| V3 Session Management | No | No server sessions |
| V4 Access Control | No | Single-user |
| V5 Input Validation | No | No new inputs |
| V6 Cryptography | No | No new crypto |
| V8 Data Protection | No | No new data storage |
| V11 Business Logic | Yes | Timer lifecycle -- `useImmersiveMode` must not allow entering immersive mode when session is not active |

### Known Threat Patterns for this Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| n/a | -- | No new attack surface. All changes are client-side UI visibility toggles with no data flow. |

## Sources

### Primary (HIGH confidence)
- [Codebase: app/routes/_index.jsx] -- Main integration surface, existing panel layout, timer lifecycle
- [Codebase: app/hooks/useSessionTimer.js] -- Timer API (isRunning, timeLeft, formatTime)
- [Codebase: app/hooks/useKeyboardShortcuts.js] -- Existing keyboard handler pattern
- [Codebase: app/components/CelebrationOverlay.jsx] -- CSS transition show/hide pattern
- [Codebase: tailwind.css] -- Imports tw-animate-css, existing CSS transition patterns
- [Codebase: tailwind.config.js] -- Tailwind v3 config (no animation plugin configured)

### Secondary (MEDIUM confidence)
- [npm registry: tw-animate-css@1.4.0] -- Installed package. Provides CSS @keyframes enter/exit but @utility blocks are Tailwind v4 syntax, incompatible with Tailwind v3.
- [Codebase: package.json] -- No animation libraries installed. Project uses pure CSS transitions.

### Tertiary (LOW confidence)
- None -- all major claims are verified against the codebase.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- verified against existing package.json, tailwind.css, and component patterns
- Architecture: HIGH -- verified against codebase conventions (hooks pattern, state management, event handling)
- Pitfalls: MEDIUM -- based on training knowledge of React animation patterns; some (pitfall 2, 6) are common React issues
- Accessibility: MEDIUM -- `prefers-reduced-motion` handling is standard but focus management assumptions need testing

**Research date:** 2026-05-06
**Valid until:** Stable (30 days) -- no fast-moving dependencies involved. CSS transitions and React hooks have stable APIs.
