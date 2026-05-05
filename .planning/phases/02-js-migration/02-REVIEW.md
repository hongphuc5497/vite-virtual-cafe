---
phase: 02-js-migration
reviewed: 2026-05-06T10:00:00Z
depth: standard
files_reviewed: 22
files_reviewed_list:
  - .eslintrc.cjs
  - app/components/BackdropOverlay.jsx
  - app/components/CelebrationOverlay.jsx
  - app/components/RoomMixControls.jsx
  - app/components/SessionTimer.jsx
  - app/components/TrackControl.jsx
  - app/components/VibeSelector.jsx
  - app/components/ui/button.jsx
  - app/constants/audioConfig.js
  - app/entry.client.jsx
  - app/entry.server.jsx
  - app/hooks/useAudioManager.js
  - app/hooks/useKeyboardShortcuts.js
  - app/hooks/usePersistentState.js
  - app/hooks/useSessionTimer.js
  - app/lib/session.js
  - app/lib/utils.js
  - app/root.jsx
  - app/routes/_index.jsx
  - app/routes/relax.jsx
  - components.json
  - package.json
  - tailwind.config.js
  - vite.config.js
findings:
  critical: 2
  warning: 3
  info: 1
  total: 6
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-05-06T10:00:00Z
**Depth:** standard
**Files Reviewed:** 24
**Status:** issues_found

## Summary

Reviewed 24 source files from the JS migration (Phase 2). The migration itself -- converting .ts/.tsx to .js/.jsx, removing TypeScript infrastructure -- appears mechanically correct: all imports and exports were properly converted, JSX syntax is preserved, and bundler configuration references the new JS paths. However, several pre-existing logic bugs and configuration gaps were surfaced by the review. Two critical issues were found: a duplicate session-entry bug that causes an infinite overlay loop on dismiss, and global keyboard shortcuts that fire inside input fields. The ESLint import resolver is also misconfigured for the `~/` path alias, so `npm run lint` will produce false-positive errors on every file.

## Critical Issues

### CR-01: Duplicate session entry written on overlay dismiss (infinite re-trigger)

**File:** `app/routes/_index.jsx:63-84`
**Issue:** The timer-completion `useEffect` does not guard against re-firing after the celebration overlay has already been shown. When the user dismisses the celebration overlay, `showCelebration` transitions from `true` to `false`, triggering the effect again. Since `timer.timeLeft` is still `0` and `timer.isRunning` is still `false`, the guard clause (`timer.timeLeft !== 0 || timer.isRunning || showCelebration`) passes, causing a duplicate session entry to be written via `writeSessionEntry()` and `showCelebration` to be set back to `true`. This creates an infinite loop: every dismiss immediately re-shows the overlay and writes another entry.

**Fix:** Add `lastSession` to the guard clause so the effect can only fire once per timer completion.
```js
useEffect(() => {
  if (timer.timeLeft !== 0 || timer.isRunning || showCelebration || lastSession) {
    return;
  }
  // ...rest of the effect body
}, [timer.timeLeft, timer.isRunning, showCelebration, appliedDurationMinutes, tracks]);
```

### CR-02: Keyboard shortcuts fire inside input fields

**File:** `app/hooks/useKeyboardShortcuts.js:5-21`
**Issue:** The `handleKeyDown` event listener is registered on `window` without filtering for active input elements. When the user is typing in the session-length `<input>` (or any other form field), pressing Space toggles the session timer, and ArrowUp/ArrowDown adjust all track volumes globally. This makes the custom session-length input partially unusable (cannot navigate with arrow keys, pressing space triggers timer toggle) and causes unexpected behavior anywhere on the page.

**Fix:** Add a target-element guard to skip keyboard shortcuts when the focus is inside an input, textarea, or select element.
```js
const handleKeyDown = (event) => {
  const target = event.target;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  ) {
    return;
  }
  // Space to toggle play/pause
  if (event.code === "Space") {
    event.preventDefault();
    callbacks.onTogglePlay?.();
  }
  // ...rest of handler
};
```

## Warnings

### WR-01: Import layering violation -- lib/ imports from components/

**File:** `app/lib/session.js:1`
**Issue:** The `session.js` library module imports the `VIBES` constant array from `app/components/VibeSelector.jsx`. This creates a reverse dependency from the `lib/` layer up into the `components/` layer, which is architecturally backward. If `VibeSelector.jsx` ever imports anything from `lib/session.js` (directly or indirectly), this becomes a circular dependency that can cause runtime errors (imports resolving to `undefined`). It also makes the data harder to locate for future developers -- vibe presets are data, not UI.

**Fix:** Move `VIBES` into `app/constants/audioConfig.js` (alongside other constants) and import it from there in both `VibeSelector.jsx` and `session.js`. Alternatively, create a dedicated `app/constants/vibes.js` file.

### WR-02: Keyboard shortcut effect re-binds listener on every render

**File:** `app/hooks/useKeyboardShortcuts.js:23-24`
**Issue:** The `useEffect` dependency array is `[callbacks]`, and the parent component (`_index.jsx`) passes an inline object literal:
```js
useKeyboardShortcuts({
  onTogglePlay: () => ...,
  onVolumeIncrease: () => ...,
  onVolumeDecrease: () => ...,
});
```
This creates a new object on every render, causing the effect to run (remove + re-add event listener) on every single render of the Index component. While not a correctness bug, it adds unnecessary overhead and is an anti-pattern that could mask stale-closure bugs if the listener captured old callback references.

**Fix:** Either memoize the callbacks with `useCallback` in the parent, or destructure the callbacks in the hook and list them as individual dependencies:
```js
export function useKeyboardShortcuts({ onTogglePlay, onVolumeIncrease, onVolumeDecrease }) {
  useEffect(() => {
    const handleKeyDown = (event) => { ... };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlay, onVolumeIncrease, onVolumeDecrease]);
}
```

### WR-03: ESLint import resolver cannot resolve `~/` path alias

**File:** `.eslintrc.cjs:42-46`
**Issue:** The `import/resolver` is configured with only `node` and extensions `[".js", ".jsx"]`. There is no alias configuration for `~/`. Since every source file imports via `~/` (e.g., `import { cn } from "~/lib/utils"`), the `eslint-plugin-import` rules `import/no-unresolved` and `import/named` will produce false-positive errors for every single import in the project. This makes `npm run lint` effectively unusable.

**Fix:** Install `eslint-import-resolver-alias` (or migrate to `eslint-plugin-import-x` which has built-in alias support) and configure it:
```js
settings: {
  "import/resolver": {
    alias: {
      map: [["~", "./app"]],
      extensions: [".js", ".jsx"],
    },
  },
},
```

## Info

### IN-01: stale CLAUDE.md references TypeScript tooling

**File:** `CLAUDE.md:6-7` (project root)
**Issue:** The project CLAUDE.md documents `npm run typecheck` as running `tsc --noEmit` and `npm run lint` as using "TS+import plugins". Both are stale after the migration: there is no `typecheck` script in `package.json`, no `tsconfig.json`, and the ESLint config no longer includes `@typescript-eslint` plugins. While this does not affect code behavior, it will confuse developers who follow this documentation.

**Fix:** Update the Commands section:
- Remove or comment out the `typecheck` entry entirely.
- Change `npm run lint` description from "ESLint w/ TS+import plugins" to "ESLint with React + import plugins".
- Remove the reference to `app/types/audio.ts` in the Code Style section (the `types/` directory was deleted).

---

_Reviewed: 2026-05-06T10:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
