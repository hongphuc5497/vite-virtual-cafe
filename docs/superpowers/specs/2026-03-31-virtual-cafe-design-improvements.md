# Virtual Café — Design Improvements Spec

**Date:** 2026-03-31  
**Scope:** 8 UI/UX improvements across all routes and shared components  
**Priority order:** High Impact (A–C) → Medium Impact (D–F) → Polish (G–H)

---

## A — Timer Circular Progress Ring (High Impact)

**Problem:** The session countdown is plain `text-6xl` digits. The timer is the hero element and communicates nothing visually about progress.

**Approach:** Wrap the existing time display in an SVG circle progress ring.
- SVG `<circle>` with `stroke-dasharray = 2π × r` and animated `stroke-dashoffset = circumference × (1 - progress)`
- `progress = timeLeft / totalSeconds` (totalSeconds = `appliedDurationMinutes × 60`)
- Ring animates from full (session start) to empty (complete)
- Color: primary orange (`#8f4a00`) stroke on a cream track ring
- Transition: `stroke-dashoffset 1s linear` (matches the 1-second timer tick)
- Component: inline SVG added inside `SessionTimer.tsx`; new `totalSeconds` prop required
- SSR-safe: pure SVG, no browser APIs

**Files changed:** `app/components/SessionTimer.tsx`, `app/routes/_index.tsx` (pass `totalSeconds`)

---

## B — Duration Quick-Select Presets (High Impact)

**Problem:** Users must type a number into an `<input type="number">` to change session length. This is slow for the most common durations.

**Approach:** Add a row of preset buttons (25 / 45 / 60 / 90 min) above the number input.
- Clicking a preset fires `onDurationChange(minutes)` — same handler already exists
- Active preset highlighted when `draftDurationMinutes` matches exactly
- Number input remains for custom values
- Style: small pill buttons using existing `#f2efd5` / `#ffdcc4` token palette

**Files changed:** `app/components/SessionTimer.tsx` only

---

## C — Slider Filled Track (High Impact)

**Problem:** The range slider track is uniformly gray — you cannot read mix levels visually.

**Approach:** Use a CSS `linear-gradient` background on the track that splits at the current value.
- Track background: `linear-gradient(to right, #8f4a00 {value}%, #e7e3ca {value}%)`
- Applied via inline `style` on `<input type="range">` using the `value` prop already available
- No JS event listener needed — updates naturally as state changes
- Works in WebKit and Firefox (separate CSS rules for `-moz-range-track` already exist; add gradient there too)

**Files changed:** `app/components/TrackControl.tsx` (inline style on the input)

---

## D — Nav Visual Separation (Medium Impact)

**Problem:** On Journal/Settings (cream background), the sticky nav (`#f8f4db`) blends into the page — no visual anchor.

**Approach:** Add a `border-bottom: 1px solid #d9c2b3` (the existing `--outline-variant` token) to the `<header>` in `AppNav`.
- Subtle, consistent with the existing color system
- Visible on cream pages; barely perceptible against the photo backdrop on Focus/Relax (intentionally invisible there)

**Files changed:** `app/root.tsx` (AppNav header style)

---

## E — Button Hover Border-Radius (Medium Impact)

**Problem:** `.btn-primary:hover` applies `@apply rounded-xl`, changing the corner radius from `rounded-lg` on hover — creating a jarring animated shape change.

**Approach:** Remove `@apply rounded-xl` from the hover rule. Keep `rounded-lg` in both default and hover states. The darker background color already provides sufficient hover feedback.

**Files changed:** `app/tailwind.css`

---

## F — Relax Page Non-Functional Toggles (Medium Impact)

**Problem:** "Auto-start on open" and "Fade transitions" checkboxes on `/relax` have `onChange={() => {}}` — they appear interactive but save nothing, misleading users.

**Approach:** Remove both toggles from `relax.tsx`. Add a subtle "Manage preferences in Settings →" link pointing to `/settings`, which already has properly wired versions of both toggles.
- This avoids duplicating logic; Settings is the authoritative place for preferences

**Files changed:** `app/routes/relax.tsx`

---

## G — Sound Enable Onboarding (Polish)

**Problem:** First-time visitors don't discover they need to click "Enable" in the Mixer to hear anything. The button is easy to miss.

**Approach:** When `soundEnabled === false`, show a pulsing amber dot next to the "Enable" button label and add a one-line hint below the Mixer header: *"Tap Enable to fill the room with sound."* The hint disappears once sound is enabled.
- Uses the existing `.sound-indicator` CSS class (already defined in tailwind.css)
- No localStorage needed — the hint simply reflects `soundEnabled` state

**Files changed:** `app/components/RoomMixControls.tsx`

---

## H — Settings Scene Picker Wiring (Polish)

**Problem:** Selecting a visual scene in Settings looks interactive but never affects the Focus/Relax backdrop.

**Approach:** Persist `selectedScene` in localStorage under the existing `STORAGE_KEY`. Read it in `_index.tsx` and `relax.tsx` to apply a scene-specific CSS overlay via `BackdropOverlay`.
- Since only one background image exists, differentiate scenes via overlay color/opacity variations in `BackdropOverlay`
- Add `selectedScene` to the `SavedPreferences` type
- `BackdropOverlay` receives a `scene` prop and applies preset overlay styles per scene ID
- Settings `setActiveScene` writes to localStorage on change

**Files changed:** `app/types/audio.ts`, `app/constants/audioConfig.ts`, `app/components/BackdropOverlay.tsx`, `app/routes/_index.tsx`, `app/routes/relax.tsx`, `app/routes/settings.tsx`

---

## Out of Scope

- Actual new background images per scene (content, not code)
- `VisualScene.tsx` stub (unused; leave for later)
- Journal write-back from timer completion (separate feature)
- Profile/subscription functionality in Settings
