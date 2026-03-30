# Technology Stack

## Runtime & Build Tools
- **Node.js**: ≥20.0.0 (from package.json engines)
- **Package Manager**: npm
- **Build Tool**: Vite 6.4.1
- **Framework**: Remix 2.17.4 (React meta-framework with file-based routing)
- **Server**: Express 4.22.1 (Node.js web server)

## Frontend Technologies
- **UI Library**: React 18.3.1
- **DOM Library**: react-dom 18.3.1
- **Styling**: Tailwind CSS 3.4.19 (utility-first CSS framework)
- **CSS Processing**: PostCSS 8.5.8 with autoprefixer 10.4.27
- **Icon Library**: react-icons 5.6.0

## Audio & Media
- **Audio Library**: howler.js 2.2.4 (Web Audio API wrapper)
- **TypeScript Audio Types**: @types/howler 2.2.12

## Backend & Server
- **Framework**: @remix-run/express 2.17.4
- **Server Runtime**: @remix-run/node 2.17.4
- **Compression**: compression 1.8.1
- **Logging**: morgan 1.10.1 (HTTP request logger)
- **Bot Detection**: isbot 5.1.36

## Development Tools
- **Language**: TypeScript 5.9.3 (strict mode enabled)
- **Type Checking**: tsc (via `npm run typecheck`)
- **Linting**: ESLint 8.38.0 with:
  - @typescript-eslint/eslint-plugin 6.7.4
  - @typescript-eslint/parser 6.7.4
  - eslint-plugin-import 2.32.0
  - eslint-plugin-jsx-a11y 6.7.1
  - eslint-plugin-react 7.37.5
  - eslint-plugin-react-hooks 4.6.0
  - eslint-import-resolver-typescript 3.6.1

## Configuration Files
- **TypeScript Config**: `tsconfig.json` (strict, no emit, path aliases at `~/*`)
- **Vite Config**: Managed by Remix (Vite wrapper)
- **Tailwind Config**: Standard tailwind.config.js (inferred from dependencies)
- **PostCSS Config**: postcss.config.js (autoprefixer enabled)

## Environment & Module System
- **Module Type**: ES modules (`"type": "module"` in package.json)
- **Side Effects**: Explicitly marked as false (`"sideEffects": false`)
- **Target Environments**:
  - Browser: ES2022
  - Node.js: ES2022
  - DOM APIs: DOM and DOM.Iterable

## File Structure & Conventions
- **Main Entry (Server)**: `app/entry.server.tsx`
- **Main Entry (Client)**: `app/entry.client.tsx`
- **Root Component**: `app/root.tsx`
- **Routes**: File-based routing (Remix convention, files in `app/routes/`)
- **Components**: `app/components/` directory
- **Hooks**: `app/hooks/` directory
- **Types**: `app/types/` directory
- **Constants**: `app/constants/` directory
