---
phase: 02-js-migration
fixed_at: 2026-05-06T10:00:00Z
review_path: /Users/hongphuc/playground/vite-virtual-cafe/.planning/phases/02-js-migration/02-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 2: Code Review Fix Report

**Fixed at:** 2026-05-06T10:00:00Z
**Source review:** 02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 5 (2 critical, 3 warning)
- Fixed: 5
- Skipped: 0

## Fixed Issues

### CR-01: Duplicate session entry written on overlay dismiss (infinite re-trigger)

**Files modified:** `app/routes/_index.jsx`
**Commit:** d5fafb5
**Status:** fixed: requires human verification
**Issue:** Timer-completion `useEffect` does not guard against re-firing after the celebration overlay has been dismissed. When `showCelebration` transitions from `true` to `false`, the effect fires again because the existing guard (`timer.timeLeft !== 0 || timer.isRunning || showCelebration`) does not prevent re-entry. This writes a duplicate session entry and re-shows the overlay.
**Applied fix:** Added ` || lastSession` to the guard clause. Once a session entry has been written (and `lastSession` state is set), the effect short-circuits on subsequent renders. The effect dependency array already includes all relevant state variables, so no additional dependencies were needed.

### CR-02: Keyboard shortcuts fire inside input fields

**Files modified:** `app/hooks/useKeyboardShortcuts.js`
**Commit:** f2dfa80
**Status:** fixed: requires human verification
**Issue:** The `handleKeyDown` event listener registered on `window` does not check the event target. Space (toggle play/pause), ArrowUp (volume up), and ArrowDown (volume down) fire even when focus is inside an `<input>`, `<textarea>`, or `<select>` element, making the session-length input partially unusable.
**Applied fix:** Added a target-element guard at the top of `handleKeyDown` that returns early if `event.target` is an `INPUT`, `TEXTAREA`, or `SELECT` element. The guard uses `event.target.tagName` comparison (reliable in standard DOM environments) rather than `document.activeElement` to correctly capture the event source during the capture/bubble phase.

### WR-01: Import layering violation -- lib/ imports from components/

**Files modified:** `app/constants/audioConfig.js`, `app/components/VibeSelector.jsx`, `app/lib/session.js`
**Commit:** 0763193
**Status:** fixed
**Issue:** `session.js` (lib layer) imported `VIBES` from `components/VibeSelector.jsx`, creating a reverse dependency from lib up to components. If `VibeSelector.jsx` ever imported anything from `session.js`, this would become a circular dependency causing import resolution failures.
**Applied fix:** Moved the `VIBES` constant array from `VibeSelector.jsx` into `app/constants/audioConfig.js` alongside other audio/track constants. Updated both `VibeSelector.jsx` and `session.js` to import `VIBES` from `~/constants/audioConfig`. The data constant is now at the correct architectural layer (constants, not UI components).

### WR-02: Keyboard shortcut effect re-binds listener on every render

**Files modified:** `app/hooks/useKeyboardShortcuts.js`
**Commit:** 0bd39fd
**Status:** fixed
**Issue:** The `useEffect` dependency array was `[callbacks]`. The parent component (`_index.jsx`) passes an inline object literal to `useKeyboardShortcuts()`, which creates a new object on every render. This causes the effect to tear down and re-register the event listener on every single render of the Index component.
**Applied fix:** Destructured the `callbacks` parameter into individual named properties (`onTogglePlay`, `onVolumeIncrease`, `onVolumeDecrease`) and listed each as an explicit dependency in the effect array. The parent call site at `_index.jsx:98-115` passes an object with these exact keys and is compatible with the destructured signature. The parent still creates new function references on each render (those are inline arrow functions), but the effect will now only re-run when those specific callback references change rather than every render.

### WR-03: ESLint import resolver cannot resolve `~/` path alias

**Files modified:** `.eslintrc.cjs`, `package.json`, `package-lock.json`
**Commit:** c324eed
**Status:** fixed
**Issue:** The `import/resolver` was configured with only `node` and extensions `[".js", ".jsx"]`, with no alias configuration for `~/`. Since every source file imports via `~/` (e.g., `import { cn } from "~/lib/utils"`), this caused false-positive `import/no-unresolved` and `import/named` errors on every import.
**Applied fix:** Installed `eslint-import-resolver-alias` as a dev dependency and configured the `import/resolver` settings to map `["~", "./app"]` with extensions `[".js", ".jsx"]`. Verified that running `npx eslint app/routes/_index.jsx` no longer produces `import/no-unresolved` errors for `~/` imports.

---

_Fixed: 2026-05-06T10:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
