import type React from "react";


const TRACK_ICONS: Record<string, string> = {
  Barista: "coffee",
  "Preparing Drinks": "local_cafe",
  "Coffee Cups": "coffee_maker",
  "Other Customers": "people",
  Machinery: "settings",
  "Rainy Day": "rainy",
  "Sunny Day": "wb_sunny",
  Fireplace: "local_fire_department",
};

export interface TrackControlProps {
  label: string;
  value: number;
  isPaused: boolean;
  hasError: boolean;
  onVolumeChange: (value: number) => void;
  onTogglePause: () => void;
  onRetry: () => void;
}

export function TrackControl({
  label,
  value,
  isPaused,
  hasError,
  onVolumeChange,
  onTogglePause,
  onRetry,
}: TrackControlProps) {
  const icon = TRACK_ICONS[label] ?? "music_note";

  return (
    <div
      className={`rounded-lg px-3 py-3 transition-colors ${
        isPaused ? "opacity-50" : "hover:bg-surface-container"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <span
            className="material-symbols-outlined flex-shrink-0 text-[20px]"
            style={{ color: "#8f4a00" }}
          >
            {icon}
          </span>
          {hasError && (
            <span className="absolute -right-1 -top-1 material-symbols-outlined text-[14px]" style={{ color: "#ba1a1a" }} title="Track failed to load. Tap to retry.">error</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-on-surface">{label}</p>
            <span className="flex-shrink-0 text-xs font-semibold tabular-nums text-on-surface-variant">
              {value}%
            </span>
          </div>
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
            className="mt-2 w-full cursor-pointer"
            style={{ "--track-fill": `${value}%` } as React.CSSProperties}
          />
        </div>

        <div className="flex items-center gap-1">
          {hasError && (
            <button type="button" onClick={onRetry} aria-label={`Retry ${label}`} className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-surface-container-high" title="Track failed to load. Tap to retry.">
              <span className="material-symbols-outlined text-[18px] text-outline transition-colors hover:text-primary">refresh</span>
            </button>
          )}
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={`${isPaused ? "Play" : "Pause"} ${label}`}
            aria-pressed={!isPaused}
            className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-surface-container-high"
            title={isPaused ? "Play" : "Pause"}
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              {isPaused ? "play_arrow" : "pause"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
