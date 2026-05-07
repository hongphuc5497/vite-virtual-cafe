export function ImmersiveTransition({
  isImmersive,
  showPanels,
  formatTime,
  timeLeft,
  totalSeconds,
  children,
}) {
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 1;
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <>
      {/* Floating timer — centered, visible only during immersive mode */}
      {isImmersive && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          data-testid="immersive-timer-pill"
        >
          <div
            className="relative flex items-center justify-center"
            style={{ width: 200, height: 200 }}
          >
            {/* Circular progress ring — mirrors SessionTimer style */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 160 160"
              className="absolute inset-0"
              style={{ transform: "rotate(-90deg)" }}
              aria-hidden="true"
            >
              {/* Track ring */}
              <circle
                cx="80" cy="80" r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="6"
              />
              {/* Progress ring */}
              <circle
                cx="80" cy="80" r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span
              className="relative z-10 font-headline text-6xl font-light tracking-tight"
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
