export const VIBES = [
  {
    label: "Lo-fi Beats",
    icon: "music_note",
    description: "Warm café ambiance",
    preset: {
      Barista: 65,
      "Preparing Drinks": 45,
      "Coffee Cups": 50,
      "Other Customers": 30,
      Machinery: 20,
      "Rainy Day": 5,
      "Sunny Day": 40,
      Fireplace: 0,
    },
  },
  {
    label: "Rainy Day",
    icon: "rainy",
    description: "Cozy & introspective",
    preset: {
      Barista: 25,
      "Preparing Drinks": 15,
      "Coffee Cups": 20,
      "Other Customers": 15,
      Machinery: 10,
      "Rainy Day": 75,
      "Sunny Day": 0,
      Fireplace: 30,
    },
  },
  {
    label: "Jazz Night",
    icon: "piano",
    description: "Evening sophistication",
    preset: {
      Barista: 40,
      "Preparing Drinks": 30,
      "Coffee Cups": 55,
      "Other Customers": 45,
      Machinery: 15,
      "Rainy Day": 0,
      "Sunny Day": 0,
      Fireplace: 70,
    },
  },
  {
    label: "Nature",
    icon: "eco",
    description: "Open & expansive",
    preset: {
      Barista: 20,
      "Preparing Drinks": 10,
      "Coffee Cups": 15,
      "Other Customers": 10,
      Machinery: 0,
      "Rainy Day": 45,
      "Sunny Day": 80,
      Fireplace: 0,
    },
  },
];

export const DEFAULT_DURATION_MINUTES = 25;
export const STORAGE_KEY = "virtual-cafe-home-prefs";
export const DEFAULT_SCENE = "misty-cabin";

// Backdrop scenes — single source of truth, shared by Focus + Relax.
export const SCENES = [
  { id: "misty-cabin", label: "Misty Cabin" },
  { id: "sunday-morning", label: "Sunday Morning" },
  { id: "midnight-archive", label: "Midnight Archive" },
  { id: "rainy-metro", label: "Rainy Metro" },
];

export const DEFAULT_TRACKS = [
  { label: "Barista", value: 64 },
  { label: "Preparing Drinks", value: 42 },
  { label: "Coffee Cups", value: 56 },
  { label: "Other Customers", value: 38 },
  { label: "Machinery", value: 31 },
  { label: "Rainy Day", value: 18 },
  { label: "Sunny Day", value: 67 },
  { label: "Fireplace", value: 22 },
];

export const SOUND_URLS = {
  Barista: "https://imissmycafe.com/assets/sounds/barista-reagan.mp3",
  "Preparing Drinks": "https://imissmycafe.com/assets/sounds/makingdrinks.mp3",
  "Coffee Cups": "https://imissmycafe.com/assets/sounds/coffeecups.mp3",
  "Other Customers": "https://imissmycafe.com/assets/sounds/interior.mp3",
  Machinery: "https://imissmycafe.com/assets/sounds/machinery.mp3",
  "Rainy Day": "https://imissmycafe.com/assets/sounds/rain.mp3",
  "Sunny Day": "https://imissmycafe.com/assets/sounds/exterior.mp3",
  Fireplace: "https://imissmycafe.com/assets/sounds/fireplace.mp3",
};

export const TRACK_BASE_VOLUME = {
  Barista: 0.18,
  "Preparing Drinks": 0.16,
  "Coffee Cups": 0.12,
  "Other Customers": 0.16,
  Machinery: 0.14,
  "Rainy Day": 0.28,
  "Sunny Day": 0.14,
  Fireplace: 0.18,
};
