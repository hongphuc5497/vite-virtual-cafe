import { TrackControl } from "./TrackControl";
import type { MixerTrack } from "~/types/audio";

export interface RoomMixControlsProps {
  soundEnabled: boolean;
  tracks: MixerTrack[];
  pausedTracks: Record<string, boolean>;
  onToggleSound: () => void;
  onTrackVolumeChange: (label: string, value: number) => void;
  onTrackPauseToggle: (label: string) => void;
}

export function RoomMixControls({
  soundEnabled,
  tracks,
  pausedTracks,
  onToggleSound,
  onTrackVolumeChange,
  onTrackPauseToggle,
}: RoomMixControlsProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Atmosphere
          </p>
          <h2
            className="mt-1 font-headline text-2xl font-light"
            style={{ color: "#1d1c0d" }}
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
          <span className="material-symbols-outlined text-[16px]">
            {soundEnabled ? "volume_up" : "volume_off"}
          </span>
          {soundEnabled ? "Live" : "Enable"}
        </button>
      </div>

      <div className="mt-4 -mx-3">
        {tracks.map((track) => (
          <TrackControl
            key={track.label}
            label={track.label}
            value={track.value}
            isPaused={pausedTracks[track.label] || false}
            onVolumeChange={(value) => onTrackVolumeChange(track.label, value)}
            onTogglePause={() => onTrackPauseToggle(track.label)}
          />
        ))}
      </div>
    </div>
  );
}
