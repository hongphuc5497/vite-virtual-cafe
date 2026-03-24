export type MixerTrack = {
  label: string;
  value: number;
};

export type SavedPreferences = {
  durationMinutes?: number;
  draftDurationMinutes?: number;
  appliedDurationMinutes?: number;
  tracks?: MixerTrack[];
  pausedTracks?: Record<string, boolean>;
  soundEnabled?: boolean;
};
