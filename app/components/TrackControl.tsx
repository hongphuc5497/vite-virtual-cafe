export interface TrackControlProps {
  label: string;
  value: number;
  isPaused: boolean;
  onVolumeChange: (value: number) => void;
  onTogglePause: () => void;
}

export function TrackControl({
  label,
  value,
  isPaused,
  onVolumeChange,
  onTogglePause,
}: TrackControlProps) {
  return (
    <div
      className={`space-y-2 rounded-[1.1rem] px-2 py-2 transition ${
        isPaused ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-medium text-stone-900">
            {label}
          </p>
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
            {isPaused ? "paused" : "live"} · {value}%
          </span>
        </div>
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={`${isPaused ? "Play" : "Pause"} ${label}`}
          aria-pressed={!isPaused}
          className={`btn-primary text-xs ${
            isPaused
              ? "bg-stone-950 text-stone-100"
              : "bg-white/75 text-stone-700"
          }`}
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-stone-500">◔</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) =>
            onVolumeChange(Number.parseInt(event.target.value, 10))
          }
          aria-label={`${label} volume: ${value}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-300 accent-stone-900"
        />
      </div>
    </div>
  );
}
