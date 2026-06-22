import { TrackControl } from "./TrackControl";

export function RoomMixControls({
  soundEnabled,
  tracks,
  pausedTracks,
  trackErrors,
  allTracksFailed,
  onToggleSound,
  onTrackVolumeChange,
  onTrackPauseToggle,
  onTrackRetry,
}) {
  return (
    <div data-testid="mixer-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Atmosphere
          </p>
          <h2
            className="mt-1 font-headline text-2xl font-light"
            style={{ color: "#edf0e4" }}
          >
            Mixer
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          aria-pressed={soundEnabled}
          className={soundEnabled ? "btn-primary" : "btn-secondary"}
        >
          {!soundEnabled && (
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse flex-shrink-0"
              style={{ background: "#eab464" }}
              aria-hidden="true"
            />
          )}
          <span className="material-symbols-outlined text-[16px]">
            {soundEnabled ? "volume_up" : "volume_off"}
          </span>
          {soundEnabled ? "Live" : "Enable"}
        </button>
      </div>

      {!soundEnabled && (
        <p className="mt-2 text-xs text-on-surface-variant">
          Tap <strong>Enable</strong> to fill the room with sound.
        </p>
      )}

      {soundEnabled && allTracksFailed && (
        <p className="mt-2 rounded-lg px-3 py-2 text-xs font-medium" style={{ background: "rgba(120,40,34,0.5)", color: "#ffb4ab" }}>
          All audio sources are currently unreachable. Please check your connection and try again.
        </p>
      )}

      <div className="mt-4 -mx-3">
        {tracks.map((track) => (
          <TrackControl
            key={track.label}
            label={track.label}
            value={track.value}
            isPaused={pausedTracks[track.label] || false}
            hasError={trackErrors[track.label] || false}
            onVolumeChange={(value) => onTrackVolumeChange(track.label, value)}
            onTogglePause={() => onTrackPauseToggle(track.label)}
            onRetry={() => onTrackRetry(track.label)}
          />
        ))}
      </div>
    </div>
  );
}
