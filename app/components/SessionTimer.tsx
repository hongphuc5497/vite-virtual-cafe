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
  return (
    <div className="mt-5 rounded-[1.6rem] bg-[rgba(20,15,12,0.76)] p-5 text-stone-100">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.34em] text-stone-400">
          Session Timer
        </p>
        <span className="rounded-full border border-white/12 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-300">
          {isRunning ? "running" : "paused"}
        </span>
      </div>
      <div className="mt-4 font-mono text-5xl font-bold">
        {formatTime(timeLeft)}
      </div>
      <div className="mt-5 grid gap-4">
        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
            Session Length
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
            className="w-full rounded-[1.1rem] border border-white/10 bg-white/90 px-4 py-3 text-lg text-stone-950 outline-none transition focus:border-[#8fa77b]"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStart}
          aria-label={isRunning ? "Pause session" : "Start session"}
          aria-pressed={isRunning}
          className={`btn-primary ${
            isRunning
              ? "bg-[#cc8a53] text-stone-950"
              : "bg-[#8fa77b] text-stone-950"
          }`}
        >
          {isRunning ? "Pause" : timeLeft === 0 ? "Restart" : "Start"}
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset timer"
          className="btn-secondary border border-white/15 px-5 py-3 text-stone-100 hover:bg-white/5"
        >
          Reset
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-400">
        Start applies the current number and begins the session.
      </p>
    </div>
  );
}
