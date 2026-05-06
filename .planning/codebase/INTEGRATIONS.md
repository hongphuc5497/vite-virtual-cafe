# External Integrations

**Analysis Date:** 2026-04-29

## APIs & External Services

**Audio Streaming:**
- **imissmycafe.com** - Remote MP3 audio sources for 8 ambient cafe sound tracks
  - SDK/Client: Native `HTMLAudioElement` (DOM API, no external library)
  - Auth: None (public URLs, CORS set via `crossOrigin="anonymous"`)
  - Sources: `https://imissmycafe.com/assets/sounds/{barista,makingdrinks,coffeecups,interior,machinery,rain,exterior,fireplace}.mp3`
  - Defined in `app/constants/audioConfig.ts` (`SOUND_URLS` map)
  - Each audio element has `loop = true` for continuous playback

**Google Fonts:**
- **fonts.googleapis.com** - Newsreader + Plus Jakarta Sans font families
  - Loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` in `app/root.tsx:13-23`
  - Also loads Material Symbols Outlined icon font (`root.tsx:24-27`)
- **fonts.gstatic.com** - Font file CDN
  - Preconnected with `crossOrigin: "anonymous"` in `root.tsx:15-19`

## Data Storage

**Persistence (client-side only):**
- **localStorage** - All state persistence, two keys:
  - `virtual-cafe-home-prefs` - User preferences (draft/applied duration, track volumes, paused tracks, scene, sound enabled state)
    - Written by `_index.tsx:88-99` (effect on pref changes), `relax.tsx:49-57` (effect on track changes)
    - Read on mount by both routes
  - `virtual-cafe-sessions` - Session log array (`SessionEntry[]`) with no cap
    - Written by `app/lib/session.ts:79-88` (`writeSessionEntry`)
    - Each entry: date ISO, duration, vibe name, mood label, track snapshot

**Caching:**
- Express static file caching in `server.js`:
  - `/assets` (fingerprinted builds): `immutable: true, maxAge: "1y"`
  - Other static files: `maxAge: "1h"`

## Authentication & Identity

**Auth Provider:**
- None. No authentication, no user accounts, no server-side sessions. All state is per-browser localStorage.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, Datadog, or similar service configured.

**Logs:**
- `morgan("tiny")` middleware in `server.js:43` - HTTP request logging to stdout
- `console.error` in `app/entry.server.tsx:82` - SSR streaming rendering error logging
- Client-side errors tracked UI-only via `trackErrors` state in `useAudioManager`

## CI/CD & Deployment

**Hosting:**
- Not configured. No Dockerfile, deployment manifest, or platform bindings found.

**CI Pipeline:**
- Not configured. No GitHub Actions, CircleCI, or similar config found.

## Environment Configuration

**Required env vars:**
- `NODE_ENV` - Controls dev (Vite HMR) vs production (static build) asset serving (`server.js:7-13`)
- `PORT` - Server listen port, defaults to 3000 (`server.js:48`)

**Secrets location:**
- None required. Application does not connect to any authenticated external service.
- `.env` is gitignored and absent from the working tree.

## Webhooks & Callbacks

**Incoming:**
- None. No webhook endpoints defined.

**Outgoing:**
- None. No outgoing webhook calls.

---

*Integration audit: 2026-04-29*
