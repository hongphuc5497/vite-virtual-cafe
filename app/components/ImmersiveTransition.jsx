export function ImmersiveTransition({
  isImmersive,
  showPanels,
  formatTime,
  timeLeft,
  children,
}) {
  return (
    <>
      {/* Floating timer pill — centered, visible only during immersive mode */}
      {isImmersive && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          data-testid="immersive-timer-pill"
        >
          <div
            className="rounded-full px-10 py-5"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span
              className="font-headline text-6xl font-light tracking-tight"
              style={{
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "-0.02em",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* Control panels wrapper — fades out when immersive */}
      <div
        style={{
          opacity: showPanels ? 1 : 0,
          pointerEvents: showPanels ? "auto" : "none",
          transition: "opacity 400ms ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
