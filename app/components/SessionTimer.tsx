const DURATION_PRESETS = [25, 45, 60, 90] as const;

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface SessionTimerProps {
  timeLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  draftDurationMinutes: number;
  onStart: () => void;
  onReset: () => void;
  onDurationChange: (minutes: number) => void;
  formatTime: (seconds: number) => string;
}

export function SessionTimer({
  timeLeft,
  totalSeconds,
  isRunning,
  draftDurationMinutes,
  onStart,
  onReset,
  onDurationChange,
  formatTime,
}: SessionTimerProps) {
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
            background: isRunning ? "#ffdcc4" : "#f2efd5",
            color: isRunning ? "#8f4a00" : "#544438",
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Circular progress ring */}
      <div className="mt-4 flex items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
          <svg
            width="140"
            height="140"
            viewBox="0 0 120 120"
            className="absolute inset-0"
            style={{ transform: "rotate(-90deg)" }}
            aria-hidden="true"
          >
            {/* Track ring */}
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#e7e3ca"
              strokeWidth="5"
            />
            {/* Progress ring */}
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#8f4a00"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
            />
          </svg>
          <div
            className="relative z-10 text-center font-headline text-4xl font-light tracking-tight"
            style={{ color: "#1d1c0d", letterSpacing: "-0.02em" }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <p className="mt-1 text-center font-headline text-sm italic text-on-surface-variant">
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
                className="flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "#ffdcc4" : "#f2efd5",
                  color: isActive ? "#8f4a00" : "#544438",
                  outline: isActive ? "2px solid #ffb781" : "none",
                  outlineOffset: "1px",
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
          style={{ background: "#f2efd5", color: "#1d1c0d" }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onStart}
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
