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
    <aside className="order-2 rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,249,243,0.9),rgba(244,236,228,0.78))] p-5 shadow-[0_22px_45px_rgba(18,14,10,0.16)] backdrop-blur md:p-6 lg:order-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Room Mix
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            Shape the atmosphere
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          aria-pressed={soundEnabled}
          className={`btn-primary flex items-center gap-2 ${
            soundEnabled
              ? "bg-stone-950 text-stone-100"
              : "bg-white/70 text-stone-700"
          }`}
        >
          <span className={`sound-indicator ${soundEnabled ? "" : "disabled"}`} />
          {soundEnabled ? "Sound on" : "Enable sound"}
        </button>
      </div>

      <div className="mt-5 space-y-5">
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
    </aside>
  );
}
