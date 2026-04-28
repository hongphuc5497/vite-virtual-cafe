# Phase 1: Complete the Session Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-29
**Phase:** 01-complete-session-loop
**Areas discussed:** Celebration UX, Session log structure, Audio error surfacing

---

## Celebration UX

| Option | Description | Selected |
|--------|-------------|----------|
| Animated overlay | Full-card overlay with congratulations, stats, and subtle animation | ✓ |
| Toast notification | Non-blocking toast with "Session complete!" | |
| Inline card transformation | Timer card transforms in-place with stats below | |

| Option | Description | Selected |
|--------|-------------|----------|
| Stats-focused | Duration, vibe, mood, congratulatory message | ✓ |
| Minimal celebration | Just a big message with subtle animation | |
| Stats + streak tease | Stats plus placeholder for future tracking | |

| Option | Description | Selected |
|--------|-------------|----------|
| Fade-in + tap dismiss | Smooth fade-in, tap anywhere to dismiss | ✓ |
| Ring burst + auto-dismiss | Ring expands into overlay, auto-dismisses after 5s | |
| Confetti + tap dismiss | CSS confetti on entry, tap to dismiss | |

| Option | Description | Selected |
|--------|-------------|----------|
| Save on show, tap-anywhere dismiss | Log written immediately, no visible button | ✓ |
| Save on show, visible dismiss button | Log written immediately, "Done" button visible | |

**User's choice:** Fade-in animated overlay with stats, save session log immediately on show, tap-anywhere dismiss.
**Notes:** User prefers celebration that feels rewarding but respects post-focus flow.

---

## Session Log Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Separate key | New key like "virtual-cafe-sessions" | ✓ |
| Extend STORAGE_KEY | Add sessions array to existing prefs object | |

| Option | Description | Selected |
|--------|-------------|----------|
| Track-composition heuristic | Derive mood from which tracks are loudest | ✓ |
| Direct vibe→mood mapping | Each vibe preset maps to a fixed mood label | |

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal entries, keep all | Full entry with tracksSnapshot, no cap | ✓ |
| Compact entries, cap at 50 | Date/duration/vibe/mood only, 50 most recent | |

| Option | Description | Selected |
|--------|-------------|----------|
| Define rules during planning | Capture approach, leave exact rules for plan-phase | ✓ |
| Define now | Spec moods and trigger rules immediately | |

**User's choice:** Separate localStorage key, track-composition heuristic for mood, full entries with tracksSnapshot, keep all sessions, define exact mood rules during planning.

---

## Audio Error Surfacing

| Option | Description | Selected |
|--------|-------------|----------|
| Inline error per track | Error icon/badge on each TrackControl row | ✓ |
| Toast notification | Single toast listing failed tracks | |
| Banner in mixer header | Warning banner at top of mixer | |

| Option | Description | Selected |
|--------|-------------|----------|
| Load failure only + retry button | Flag load + mid-playback failures, show retry | ✓ |
| Load failure only, no retry | Only initial load failures, no retry button | |
| Any failure, auto-retry once | Auto-retry after 3s, then persistent error | |

| Option | Description | Selected |
|--------|-------------|----------|
| Red badge + icon swap | Track icon turns red error icon, clears on success | ✓ |
| Subtle amber indicator | Amber left-border, dimmed slider | |

**User's choice:** Inline per-track error with red icon badge, retry button, covers load and mid-playback failures, clears on successful retry or track toggle.

---

## Claude's Discretion

- Overlay animation curve, exact typography, and layout
- localStorage key name for session log
- Mood detection rules (specific moods, thresholds, track combinations)
- Error icon choice and exact TrackControl retry layout
- How to thread initial pausedTracks into useAudioManager

## Deferred Ideas

None — all discussion stayed within Phase 1 scope.
