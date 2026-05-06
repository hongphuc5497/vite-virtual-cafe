# Phase 5: Immersive Focus Mode - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-06
**Phase:** 05-immersive-focus-mode
**Areas discussed:** Animation style, Timer restyling

---

## Animation style

| Option | Description | Selected |
|--------|-------------|----------|
| Fade out + slide down | Panels fade while sliding down ~20px | |
| Fade out only | Panels dissolve to transparent in place | |
| Fade out + slide to edges | Left slides left, right slides right, hero slides up | ✓ |

**User's choice:** Fade out + slide to edges — left column slides left, right column slides right, hero text slides up.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Crossfade reposition | Card timer fades out, floating timer fades in centered (~300ms crossfade) | ✓ |
| Lift and center | Single element animates from card position to center | |
| Instant swap | Panels out, timer instantly appears centered | |

**User's choice:** Crossfade reposition — two elements, overlapping crossfade transition.

---

| Option | Description | Selected |
|--------|-------------|----------|
| 400ms ease-out | Matches ROADMAP criteria, smooth without sluggishness | ✓ |
| 300ms ease-out | Snappier, still intentional | |
| 600ms ease-in-out | Slower, cinematic | |

**User's choice:** 400ms ease-out.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Fade out completely | Hero text fully removed during immersive mode | ✓ |
| Fade to subtle | Hero text stays at ~20% opacity | |

**User's choice:** Fade out completely.

---

## Timer restyling

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal floating pill | Small rounded pill, dark translucent, time digits only | ✓ |
| Large centered digits | No background, just bold text over backdrop | |
| Ghost card | Keep frosted card but solo on screen | |

**User's choice:** Minimal floating pill.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Center screen | Dead center, both horizontal and vertical | ✓ |
| Top center | Centered horizontally, ~15% from top | |
| Bottom center | Centered horizontally, ~15% from bottom | |

**User's choice:** Center screen.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dark translucent | rgba(0,0,0,0.35) with light text | ✓ |
| Light frosted | Same frosted glass as existing cards | |
| No background | Pure text with text-shadow | |

**User's choice:** Dark translucent (`rgba(0,0,0,0.35)`).

---

| Option | Description | Selected |
|--------|-------------|----------|
| Larger than card timer | ~text-6xl (3.75rem), light weight | ✓ |
| Same size as card timer | Keep existing typography | |
| Much larger, bold | ~text-8xl, bold, cinematic | |

**User's choice:** Larger than card timer (~text-6xl, light weight).

---

## Claude's Discretion

- Exact CSS transform distances for slide-to-edges
- Floating pill exact dimensions, border-radius, padding
- Edge-hover detection implementation (CSS zone vs JS listener vs hover strip)
- Auto-hide inactivity timer implementation
- Keyboard shortcut behavior during immersive mode
- Coordination between useImmersiveMode and useKeyboardShortcuts for Escape key

## Deferred Ideas

None.
