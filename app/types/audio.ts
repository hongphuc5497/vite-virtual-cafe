export type MixerTrack = {
  label: string;
  value: number;
};

export type SceneId = "misty-cabin" | "sunday-morning" | "midnight-archive" | "rainy-metro";

export type SavedPreferences = {
  durationMinutes?: number;
  draftDurationMinutes?: number;
  appliedDurationMinutes?: number;
  tracks?: MixerTrack[];
  pausedTracks?: Record<string, boolean>;
  soundEnabled?: boolean;
  selectedScene?: SceneId;
};
