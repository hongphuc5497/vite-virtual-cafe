import { ProgressRing } from "./ProgressRing";

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
      {isImmersive && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          data-testid="immersive-timer-pill"
        >
          <ProgressRing
            radius={RADIUS}
            circumference={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            size={200}
            trackColor="rgba(255,255,255,0.15)"
            progressColor="rgba(255,255,255,0.9)"
            transitionStyle="stroke-dashoffset 1s linear"
          >
            <span
              className="relative z-10 font-headline text-6xl font-semibold tracking-tight"
              style={{
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "-0.02em",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </ProgressRing>
        </div>
      )}

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
