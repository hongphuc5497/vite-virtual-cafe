// Per-scene tint layered over the cafe photo.
// Warm Daylight values: a soft warm veil washes the photo to a paper haze.
const SCENE_TINTS = {
  "misty-cabin":      "rgba(150, 180, 165, 0.12)",
  "sunday-morning":   "rgba(255, 222, 165, 0.18)",
  "midnight-archive": "rgba(80,  90, 125,  0.16)",
  "rainy-metro":      "rgba(95, 125, 150,  0.16)",
};

export function BackdropOverlay({ backdropGlow, scene = "misty-cabin" }) {
  const tint = SCENE_TINTS[scene];
  return (
    <div
      className="absolute inset-0"
      style={{
        background: [
          `radial-gradient(circle at 16% 14%, rgba(255, 226, 180, ${backdropGlow}), transparent 30%)`,
          `linear-gradient(180deg, rgba(247, 238, 222, 0.5), rgba(243, 232, 214, 0.66))`,
          `linear-gradient(135deg, ${tint}, ${tint})`,
        ].join(", "),
      }}
    />
  );
}
