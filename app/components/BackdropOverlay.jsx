// Per-scene tint layered on top of the base dark overlay.
// Values chosen to evoke each scene's mood while keeping the café photo readable.
// Per-scene tint layered over the dimmed cafe photo.
// Forest-nocturne values: the room is lit by lamplight after dark.
const SCENE_TINTS = {
  "misty-cabin":      "rgba(110, 150, 130, 0.12)",
  "sunday-morning":   "rgba(230, 195, 140, 0.12)",
  "midnight-archive": "rgba(18,  28,  52,  0.34)",
  "rainy-metro":      "rgba(38,  68,  88,  0.26)",
};

export function BackdropOverlay({ backdropGlow, scene = "misty-cabin" }) {
  const tint = SCENE_TINTS[scene];
  return (
    <div
      className="absolute inset-0"
      style={{
        background: [
          `radial-gradient(circle at 16% 14%, rgba(255, 205, 130, ${backdropGlow}), transparent 26%)`,
          `linear-gradient(180deg, rgba(8, 16, 12, 0.64), rgba(7, 14, 11, 0.8))`,
          `linear-gradient(135deg, ${tint}, ${tint})`,
        ].join(", "),
      }}
    />
  );
}
