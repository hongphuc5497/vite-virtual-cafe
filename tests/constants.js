// URLs
export const ROUTES = {
  HOME: '/',
  RELAX: '/relax',
};

// data-testid selectors
export const SELECTORS = {
  // Timer
  TIMER_DISPLAY: '[data-testid=timer-display]',
  TIMER_START: '[data-testid=timer-start]',
  TIMER_PRESET_25: '[data-testid=preset-25]',
  TIMER_PRESET_45: '[data-testid=preset-45]',
  TIMER_PRESET_60: '[data-testid=preset-60]',
  TIMER_PRESET_90: '[data-testid=preset-90]',

  // Celebration
  CELEBRATION_OVERLAY: '[data-testid=celebration-overlay]',
  CELEBRATION_HEADING: '[data-testid=celebration-heading]',

  // Audio mixer
  MIXER_PANEL: '[data-testid=mixer-panel]',
  TRACK_PLAY: (trackId) => `[data-testid=track-play-${trackId}]`,
  TRACK_PAUSE: (trackId) => `[data-testid=track-pause-${trackId}]`,
  TRACK_VOLUME: (trackId) => `[data-testid=track-volume-${trackId}]`,
  TRACK_ERROR: (trackId) => `[data-testid=track-error-${trackId}]`,
  TRACK_RETRY: (trackId) => `[data-testid=track-retry-${trackId}]`,

  // Vibe selector
  VIBE_SELECTOR: '[data-testid=vibe-selector]',
  VIBE_OPTION: (vibe) => `[data-testid=vibe-${vibe}]`,

  // Scene selector
  SCENE_SELECTOR: '[data-testid=scene-selector]',

  // Navigation
  NAV_RELAX: '[data-testid=nav-relax]',
  NAV_HOME: '[data-testid=nav-home]',

  // Relax page
  RELAX_AMBIENT_PLAYER: '[data-testid=relax-ambient-player]',
};

// Timeouts (ms)
export const TIMEOUTS = {
  TIMER_TICK: 2000,
  CELEBRATION: 5000,
  AUDIO_PLAY: 3000,
  PAGE_LOAD: 10000,
  ANIMATION: 500,
};

// Vibe preset names (match audioConfig.js VIBES labels)
export const VIBES = {
  LO_FI: 'Lo-fi Beats',
  RAINY_DAY: 'Rainy Day',
  JAZZ: 'Jazz Night',
  NATURE: 'Nature',
};

// Timer presets (match SessionTimer.jsx DURATION_PRESETS)
export const PRESETS = {
  QUICK: 25,
  STANDARD: 45,
  DEEP: 60,
  LONG: 90,
};

// localStorage keys (match app constants)
export const STORAGE_KEYS = {
  SESSIONS: 'virtual-cafe-sessions',
  PREFS: 'virtual-cafe-home-prefs',
  PAUSED_TRACKS: 'pausedTracks',
};

// Track labels (match audioConfig.js DEFAULT_TRACKS)
export const TRACKS = {
  BARISTA: 'Barista',
  PREPARING_DRINKS: 'Preparing Drinks',
  COFFEE_CUPS: 'Coffee Cups',
  OTHER_CUSTOMERS: 'Other Customers',
  MACHINERY: 'Machinery',
  RAINY_DAY: 'Rainy Day',
  SUNNY_DAY: 'Sunny Day',
  FIREPLACE: 'Fireplace',
};
