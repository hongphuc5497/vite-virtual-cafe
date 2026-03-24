export interface SessionTimerProps {
  timeLeft: number;
  isRunning: boolean;
  draftDurationMinutes: number;
  onStart: () => void;
  onReset: () => void;
  onDurationChange: (minutes: number) => void;
  formatTime: (seconds: number) => string;
}

export function SessionTimer({
  timeLeft,
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

      <div
        className="mt-3 font-headline text-6xl font-light tracking-tight"
        style={{ color: "#1d1c0d", letterSpacing: "-0.02em" }}
      >
        {formatTime(timeLeft)}
      </div>

      <p className="mt-1 font-headline text-sm italic text-on-surface-variant">
        {isRunning ? "Stay in the room." : `${draftDurationMinutes} min session`}
      </p>

      <div className="mt-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Session Length (min)
          </span>
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
            className="w-full rounded-lg px-4 py-2.5 text-base text-on-surface outline-none"
            style={{
              background: "#f2efd5",
              color: "#1d1c0d",
            }}
          />
        </label>
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
