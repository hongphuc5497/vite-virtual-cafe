# Technology Stack

**Analysis Date:** 2026-04-29

## Languages

**Primary:**
- TypeScript 5.9.3 (strict mode) - All application code in `app/` and `server.js`
- CSS (Tailwind CSS v3.4 + custom layer components) - Styling in `app/tailwind.css`

**Secondary:**
- JavaScript (ESM) - `server.js` server entry point, `postcss.config.js`

## Runtime

**Environment:**
- Node.js >=20.0.0 (enforced via `package.json` `engines` field)
- Runs on Express server, not the default Remix CLI server

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- React 18.3.1 - UI library
- Remix v2 (via `@remix-run/react`, `@remix-run/express`, `@remix-run/node` 2.17.4) - Full-stack web framework
- Vite 6.4.1 - Build tool and dev server HMR

**UI & Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- shadcn/ui v4 (partially configured via `components.json`, style: `base-nova`)
- `tw-animate-css` 1.4.0 - Animation CSS utilities
- `@base-ui/react` 1.4.1 - Headless UI primitives (shadcn dependency)
- `@fontsource-variable/geist` - Geist variable font (imported in `tailwind.css`)
- Google Fonts (Newsreader, Plus Jakarta Sans) - Loaded via `<link>` in `app/root.tsx`
- Material Symbols Outlined - Icon system (loaded via Google Fonts `<link>`)
- Lucide React 1.12.0 - Icon library available for shadcn/ui (not yet used in components)
- `class-variance-authority` 0.7.1 + `clsx` 2.1.1 + `tailwind-merge` 3.5.0 - Utility chain for class merging (`app/lib/utils.ts` `cn()` helper)

**Testing:**
- **None detected** - No test runner, no test framework, no test files in the project. `package.json` has no test script.

**Build/Dev:**
- `@remix-run/dev` 2.17.4 - Remix Vite plugin
- `vite-tsconfig-paths` 4.2.1 - Path alias resolution (`~/*` -> `./app/*`)
- ESLint 8.38.0 - Linting with TypeScript, import, JSX a11y, React, React Hooks plugins
- PostCSS 8.5.8 + Autoprefixer 10.4.27 - CSS processing pipeline
- `cross-env` 10.1.0 - Environment variable cross-platform support

## Key Dependencies

**Critical:**
- `@remix-run/express` 2.17.4 - Bridges Remix request handling to Express
- `express` 4.22.1 - HTTP server framework
- `compression` 1.8.1 - Gzip compression middleware for production responses
- `morgan` 1.10.1 - HTTP request logging middleware
- `isbot` 5.1.36 - Bot detection for SSR streaming strategy split

**Audio:**
- Native `HTMLAudioElement` (no Howler.js or external audio library)
- Audio tracks are remote MP3s from `https://imissmycafe.com/`

**Infrastructure:**
- `shadcn` 4.6.0 - CLI tool for component scaffolding

## Configuration

**Environment:**
- `NODE_ENV` (production/development) - Controls Vite dev server vs static build serving (`server.js`)
- `PORT` (default 3000) - Server listen port
- No `.env` file present in working tree; `.env` is gitignored

**Build:**
- `vite.config.ts` - Vite + Remix plugin with 5 future flags: `v3_singleFetch`, `v3_lazyRouteDiscovery`, `v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`
- `tsconfig.json` - TypeScript strict mode, `ES2022` target, `Bundler` module resolution, `~/*` path alias
- `tailwind.config.ts` - Custom M3-like color palette (warm browns), custom font families, border radii
- `postcss.config.js` - Tailwind CSS + Autoprefixer pipeline

## Platform Requirements

**Development:**
- Node.js >=20
- npm (no specific version pinned)
- Run via `npm run dev` (starts Express with Vite HMR middleware at localhost:3000)

**Production:**
- Node.js >=20
- Build via `npm run build`, serve via `npm start`
- Static assets served from `build/client/` with fingerprint-based caching
- Compressed responses via `compression` middleware

---

*Stack analysis: 2026-04-29*
