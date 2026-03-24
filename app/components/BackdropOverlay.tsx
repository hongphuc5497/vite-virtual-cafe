export interface BackdropOverlayProps {
  backdropGlow: number;
}

export function BackdropOverlay({ backdropGlow }: BackdropOverlayProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 17% 16%, rgba(255, 236, 202, ${backdropGlow}), transparent 24%), linear-gradient(90deg, rgba(20, 15, 10, 0.56), rgba(20, 15, 10, 0.22) 36%, rgba(20, 15, 10, 0.35) 100%)`,
      }}
    />
  );
}
