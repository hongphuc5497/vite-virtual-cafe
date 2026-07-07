const DURATION_PRESETS = [25, 45, 60, 90];

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SessionTimer({
  timeLeft,
  totalSeconds,
  isRunning,
  draftDurationMinutes,
  onStart,
  onReset,
  onDurationChange,
  formatTime,
}) {
  const statusLabel = isRunning
    ? "Deep Focus"
    : timeLeft === 0
      ? "Session Complete"
      : "Ready";

  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Session Timer
        </p>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: isRunning ? "var(--color-accent)" : "var(--color-background-muted)",
            color: isRunning ? "var(--color-accent)" : "var(--color-text-secondary)",
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Circular progress ring */}
      <div className="mt-5 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 168, height: 168 }}
        >
          <svg
            width="168"
            height="168"
            viewBox="0 0 140 140"
            className="absolute inset-0"
            style={{ transform: "rotate(-90deg)" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="var(--color-accent)" />
              </linearGradient>
            </defs>
            {/* Track ring */}
            <circle
              cx="70" cy="70" r={RADIUS}
              fill="none"
              stroke="var(--color-border-emphasized)"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <circle
              cx="70" cy="70" r={RADIUS}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
            />
          </svg>
          <div
            className="relative z-10 text-center font-headline text-5xl font-semibold tracking-tight tabular-nums"
            style={{
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
            data-testid="timer-display"
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center font-headline text-sm italic text-on-surface-variant">
        {isRunning ? "Stay in the room." : `${draftDurationMinutes} min session`}
      </p>

      <div className="mt-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Session Length
        </span>
        {/* Quick-select presets */}
        <div className="mt-2 flex gap-2">
          {DURATION_PRESETS.map((preset) => {
            const isActive = draftDurationMinutes === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onDurationChange(preset)}
                data-testid={`preset-${preset}`}
                className="flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "var(--color-accent)" : "var(--color-background-muted)",
                  color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                  boxShadow: isActive ? "var(--shadow-inset-selected)" : "none",
                }}
              >
                {preset}m
              </button>
            );
          })}
        </div>
        {/* Custom input */}
        <input
          type="number"
          min="1"
          step="1"
          value={draftDurationMinutes}
          onChange={(event) =>
            onDurationChange(
              Math.max(1, Number.parseInt(event.target.value || "1", 10))
            )
          }
          aria-label="Custom session length in minutes"
          className="mt-2 w-full rounded-lg px-4 py-2.5 text-base text-on-surface outline-none"
          style={{ background: "var(--color-background-muted)", color: "var(--color-text-primary)" }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onStart}
          data-testid="timer-start"
          aria-label={isRunning ? "Pause session" : "Start session"}
          aria-pressed={isRunning}
          className="btn-primary"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRunning ? "pause" : timeLeft === 0 ? "replay" : "play_arrow"}
          </span>
          {isRunning ? "Pause" : timeLeft === 0 ? "Restart" : "Start"}
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset timer"
          className="btn-ghost"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
