import { VIBES } from "~/components/VibeSelector";

// --- Constants ---

export const SESSIONS_KEY = "virtual-cafe-sessions";
export const MATCH_THRESHOLD = 5;

export const VIBE_MOODS = {
  "Lo-fi Beats": "Bright & Buzzy",
  "Rainy Day": "Cozy & Rainy",
  "Jazz Night": "Warm Glow",
  Nature: "Open & Airy",
};

// --- Detection Functions ---

/**
 * Detect vibe preset name via threshold-based matching.
 * Each track must be within +/-MATCH_THRESHOLD of the preset value.
 * Falls back to "Custom" when no preset is a close match.
 * This prevents the fragile exact-match issue (Pitfall 5 in RESEARCH.md).
 */
export function detectVibeName(tracks) {
  for (const vibe of VIBES) {
    const matches = Object.entries(vibe.preset).every(([label, val]) => {
      const track = tracks.find((t) => t.label === label);
      return track && Math.abs(track.value - val) <= MATCH_THRESHOLD;
    });
    if (matches) return vibe.label;
  }
  return "Custom";
}

/**
 * Detect mood label from track composition.
 * If vibe preset was matched, use its preset-to-mood mapping.
 * Otherwise, use a track-volume heuristic (D-07).
 * Fallback to "Custom Blend" when no heuristic matches.
 * Threshold values from UI-SPEC mood trigger table.
 */
export function detectMood(tracks, vibeName) {
  // If vibe preset was matched, return its mapped mood
  if (vibeName !== "Custom" && VIBE_MOODS[vibeName]) {
    return VIBE_MOODS[vibeName];
  }

  // Fallback: heuristic based on dominant tracks
  const barista = tracks.find((t) => t.label === "Barista")?.value ?? 0;
  const rainy = tracks.find((t) => t.label === "Rainy Day")?.value ?? 0;
  const sunny = tracks.find((t) => t.label === "Sunny Day")?.value ?? 0;
  const fire = tracks.find((t) => t.label === "Fireplace")?.value ?? 0;

  if (barista > 60 && sunny > 50) return "Bright & Buzzy";
  if (rainy > 50 && fire > 30) return "Cozy & Rainy";
  if (fire > 50) return "Warm Glow";
  if (sunny > 60 && barista < 30) return "Open & Airy";
  return "Custom Blend";
}

// --- Persistence ---

/**
 * Write a session entry to the "virtual-cafe-sessions" localStorage key (D-04).
 * Reads existing array, appends new entry, writes back (D-06: no cap).
 * Written immediately when overlay appears (save-on-show, D-03).
 * Silently ignores errors (localStorage unavailable or full -- unlikely).
 */
export function writeSessionEntry(entry) {
  try {
    const existing = window.localStorage.getItem(SESSIONS_KEY);
    const sessions = existing ? JSON.parse(existing) : [];
    sessions.push(entry);
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage unavailable or full -- silently ignore
  }
}
