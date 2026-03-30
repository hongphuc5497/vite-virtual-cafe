# External Integrations & APIs

## Current Integrations
**None detected** — This is a client-heavy application without explicit external service integrations in the current codebase.

## Audio Sources
The application uses **Howler.js** to manage Web Audio API:
- Local audio files (inferred from `SoundBoard.tsx` and `RoomMixControls.tsx`)
- No external streaming service integration detected
- Audio configuration centralized in `app/constants/audioConfig.ts`

## Potential Integration Points
Based on codebase structure, the following integrations could be added:

### Session/Diary Features
- `app/routes/journal.tsx` and `app/routes/relax.tsx` suggest potential for:
  - Cloud storage (user journal entries)
  - Sync service (cross-device session persistence)

### User State
- `usePersistentState` hook (`app/hooks/usePersistentState.ts`) currently uses browser storage
- Could be extended to:
  - User authentication API
  - Cloud sync backend
  - Analytics service

## Data Flow
- **No backend API calls detected** in current router/component structure
- **Local browser storage** used for session persistence (via custom hook)
- **No database integration** — all data appears to be client-side

## Deployment Considerations
- Single Express server (`server.js`) for serving SSR and static assets
- No explicit database, message queue, or microservice dependencies
- Ready for deployment to Node.js hosting (Vercel, Fly.io, Heroku, custom VPS)

## Security & Auth
- **No authentication detected** — application is public/anonymous
- Could integrate OAuth (GitHub, Google) or email-based auth if scope expands
