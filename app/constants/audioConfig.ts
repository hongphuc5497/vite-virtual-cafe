import type { MixerTrack } from "~/types/audio";

export const DEFAULT_DURATION_MINUTES = 25;
export const STORAGE_KEY = "virtual-cafe-home-prefs";

export const DEFAULT_TRACKS: MixerTrack[] = [
  { label: "Barista", value: 64 },
  { label: "Preparing Drinks", value: 42 },
  { label: "Coffee Cups", value: 56 },
  { label: "Other Customers", value: 38 },
  { label: "Machinery", value: 31 },
  { label: "Rainy Day", value: 18 },
  { label: "Sunny Day", value: 67 },
  { label: "Fireplace", value: 22 },
];

export const DEFAULT_PAUSED_TRACKS = Object.fromEntries(
  DEFAULT_TRACKS.map((track) => [track.label, false])
) as Record<string, boolean>;

export const SOUND_URLS: Record<string, string> = {
  Barista: "https://imissmycafe.com/assets/sounds/barista-reagan.mp3",
  "Preparing Drinks": "https://imissmycafe.com/assets/sounds/makingdrinks.mp3",
  "Coffee Cups": "https://imissmycafe.com/assets/sounds/coffeecups.mp3",
  "Other Customers": "https://imissmycafe.com/assets/sounds/interior.mp3",
  Machinery: "https://imissmycafe.com/assets/sounds/machinery.mp3",
  "Rainy Day": "https://imissmycafe.com/assets/sounds/rain.mp3",
  "Sunny Day": "https://imissmycafe.com/assets/sounds/exterior.mp3",
  Fireplace: "https://imissmycafe.com/assets/sounds/fireplace.mp3",
};

export const TRACK_BASE_VOLUME: Record<string, number> = {
  Barista: 0.18,
  "Preparing Drinks": 0.16,
  "Coffee Cups": 0.12,
  "Other Customers": 0.16,
  Machinery: 0.14,
  "Rainy Day": 0.28,
  "Sunny Day": 0.14,
  Fireplace: 0.18,
};
