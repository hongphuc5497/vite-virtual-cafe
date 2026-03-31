import type { SceneId } from "~/types/audio";

// Per-scene tint layered on top of the base dark overlay.
// Values chosen to evoke each scene's mood while keeping the café photo readable.
const SCENE_TINTS: Record<SceneId, string> = {
  "misty-cabin":      "rgba(180, 210, 200, 0.08)",
  "sunday-morning":   "rgba(245, 220, 180, 0.10)",
  "midnight-archive": "rgba(30,  35,  65,  0.22)",
  "rainy-metro":      "rgba(60,  90, 120,  0.18)",
};

export interface BackdropOverlayProps {
  backdropGlow: number;
  scene?: SceneId;
}

export function BackdropOverlay({ backdropGlow, scene = "misty-cabin" }: BackdropOverlayProps) {
  const tint = SCENE_TINTS[scene];
  return (
    <div
      className="absolute inset-0"
      style={{
        background: [
          `radial-gradient(circle at 17% 16%, rgba(255, 236, 202, ${backdropGlow}), transparent 24%)`,
          `linear-gradient(90deg, rgba(20, 15, 10, 0.56), rgba(20, 15, 10, 0.22) 36%, rgba(20, 15, 10, 0.35) 100%)`,
          `linear-gradient(135deg, ${tint}, ${tint})`,
        ].join(", "),
      }}
    />
  );
}
