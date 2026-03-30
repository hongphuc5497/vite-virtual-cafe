# Technical Debt & Concerns

## Critical Issues

### No Error Handling for Audio
**Severity**: HIGH
**Location**: Audio system (`SoundBoard.tsx`, `RoomMixControls.tsx`, audio hooks)
**Issue**:
- No error boundaries for failed audio loads
- No user feedback if audio file is missing
- Howler.js errors not caught or logged
- Silent failures could confuse users

**Impact**: Users don't know why audio isn't playing
**Recommendation**:
- Add error state to audio hooks
- Catch Howler errors in try/catch
- Display user-friendly error messages
- Add console logging for debugging

### No Test Coverage
**Severity**: HIGH
**Location**: All code
**Issue**:
- Zero test files detected
- No unit tests for hooks
- No component tests
- No E2E tests
- No CI/CD validation

**Impact**: Regressions not caught before production
**Recommendation**:
- Add Vitest + Testing Library
- Start with critical paths (session timer, persistence)
- Aim for 70%+ coverage

### Unhandled Browser API Dependencies
**Severity**: MEDIUM
**Location**: `usePersistentState.ts`
**Issue**:
- Assumes localStorage is always available
- No fallback for private/incognito mode
- No feature detection (localStorage might be disabled)
- SSR could try to access localStorage on server

**Impact**: App could crash in private browsing or with localStorage disabled
**Recommendation**:
- Add try/catch around localStorage access
- Implement fallback (in-memory state)
- Guard localStorage calls with typeof check
- Test in incognito/private mode

### No Session Validation
**Severity**: MEDIUM
**Location**: Session timer, journal routes
**Issue**:
- No way to validate if a session is "real"
- Could manually edit localStorage to fake sessions
- No integrity checks
- No audit trail

**Impact**: Unreliable session history
**Recommendation**:
- Add timestamps and hashing
- Validate data structure on load
- Could integrate with backend API later

## Performance Concerns

### Large Audio Files Not Optimized
**Severity**: MEDIUM
**Location**: Audio config, public assets
**Issue**:
- No indication of audio file sizes
- No streaming/lazy loading
- Large files could cause initial page load delay
- No format fallbacks (mp3, ogg, wav)

**Impact**: Slow initial load, especially on poor connections
**Recommendation**:
- Measure audio file sizes
- Consider lazy loading (load on demand, not all at once)
- Use next-gen audio formats (webm for smaller files)
- Add loading indicators while audio loads

### No Caching Strategy
**Severity**: MEDIUM
**Location**: Build config, server.js
**Issue**:
- No cache headers configured for assets
- No service worker for offline support
- No browser caching directives
- Audio files re-downloaded on every visit

**Impact**: Slower repeat visits, wasted bandwidth
**Recommendation**:
- Add cache-control headers in Express
- Consider service worker for offline audio
- Use versioned asset names (Vite already does this)
- Set long expiry for hashed assets

### Bundle Size Not Monitored
**Severity**: LOW
**Location**: Build process
**Issue**:
- No bundle analysis tools configured
- Tailwind CSS might not be fully purged
- No tree-shaking validation
- Howler.js size not analyzed

**Impact**: Larger than necessary bundle could slow load times
**Recommendation**:
- Add bundle-analyzer-plugin to Vite
- Monitor bundle size in CI/CD
- Audit Tailwind CSS usage

## Security Concerns

### No Input Validation
**Severity**: MEDIUM
**Location**: All user inputs (journal entries, session notes)
**Issue**:
- No validation on what gets stored in localStorage
- Potential for XSS if data is rendered without sanitization
- No length limits on strings
- No type checking on loaded data

**Impact**: Could allow malicious data injection
**Recommendation**:
- Add runtime type validation (zod, io-ts)
- Sanitize data on load
- Add max length constraints
- Validate before rendering in JSX

### No Content Security Policy
**Severity**: LOW
**Location**: HTTP headers
**Issue**:
- No CSP headers configured
- External resources could be injected
- Inline scripts not restricted

**Impact**: Minor, but increases XSS attack surface
**Recommendation**:
- Add CSP headers in Express
- Restrict to trusted sources
- Consider nonce for inline scripts

### No HTTPS Enforcement (if deployed)
**Severity**: MEDIUM
**Location**: server.js, deployment
**Issue**:
- No HSTS headers
- No automatic HTTPS redirect
- Sensitive data (session history) sent unencrypted in HTTP

**Impact**: Man-in-the-middle attacks possible
**Recommendation**:
- Add HSTS header (if deployed on HTTPS)
- Use secure cookies if adding auth
- Enforce HTTPS in production

## Code Quality Concerns

### No Type Safety for Config
**Severity**: LOW
**Location**: `audioConfig.ts`
**Issue**:
- Configuration might not be type-safe
- No validation that config matches schema
- Could load invalid config at runtime

**Impact**: Type errors at runtime
**Recommendation**:
- Use zod/io-ts to validate config shape
- Export strict TypeScript types
- Test config loading

### Inconsistent Error Handling
**Severity**: LOW
**Location**: Throughout
**Issue**:
- Some components might throw errors silently
- No consistent error logging pattern
- No error boundaries

**Impact**: Hard to debug issues in production
**Recommendation**:
- Add React Error Boundary component
- Create consistent error logging (e.g., Sentry)
- Add try/catch in strategic places

### Missing Comments on Complex Logic
**Severity**: LOW
**Location**: Session timer, audio mixing
**Issue**:
- No JSDoc comments
- No inline comments for non-obvious code
- Hard to understand intent of some functions

**Impact**: Harder to maintain and extend
**Recommendation**:
- Add JSDoc to exported functions/components
- Comment complex algorithms
- Document assumptions (e.g., audio format expectations)

## Dependency Concerns

### Outdated Dependency Versions (Possible)
**Severity**: LOW
**Location**: package.json
**Issue**:
- TypeScript 5.9.3 (check if latest)
- ESLint 8.38.0 (check if latest)
- React 18.3.1 (check if using latest Remix-compatible)

**Impact**: Missing security patches, new features
**Recommendation**:
- Run `npm outdated` regularly
- Review changelog before updating
- Add dependabot for automated PRs

### No Lockfile Mentioned
**Severity**: MEDIUM
**Location**: Git repo
**Issue**:
- Unclear if package-lock.json is committed
- Could lead to dependency drift

**Impact**: Different installs on different machines
**Recommendation**:
- Commit package-lock.json
- Use CI/CD that respects lockfile

## Architectural Concerns

### No Global State Management
**Severity**: LOW (currently OK, might be needed later)
**Location**: State management
**Issue**:
- Using only React hooks
- Will become unwieldy if state grows
- Prop drilling could occur with complex features

**Impact**: Could lead to messy state logic as app grows
**Recommendation**:
- Monitor state complexity
- Consider Context API or Zustand if it gets complex
- Plan for state management before it becomes critical

### No Data Validation Pattern
**Severity**: MEDIUM
**Location**: Data loading and storage
**Issue**:
- No schema validation (zod, io-ts, etc.)
- Assumes data is always correct shape
- Could crash if data is malformed

**Impact**: Runtime errors if localStorage is corrupted
**Recommendation**:
- Add zod for runtime type checking
- Validate on load and save
- Provide migration path for old data

### No API Client Abstraction
**Severity**: LOW (not needed yet)
**Location**: Would be needed for backend integration
**Issue**:
- No HTTP client configured
- No API layer separation
- Direct fetch calls (if any) scattered in code

**Impact**: Harder to add backend later
**Recommendation**:
- Create `app/services/api.ts` when backend is added
- Use fetch wrapper or axios
- Centralize API calls

## DevOps / Deployment Concerns

### No Environment Configuration
**Severity**: MEDIUM
**Location**: server.js, build config
**Issue**:
- No .env support (likely)
- No environment-specific config (dev, staging, prod)
- Hard-coded values might be needed

**Impact**: Can't easily deploy to multiple environments
**Recommendation**:
- Add dotenv support
- Configure app URL for audio based on env
- Support different backends per environment

### No Monitoring / Logging
**Severity**: MEDIUM
**Location**: server.js, components
**Issue**:
- No error reporting (e.g., Sentry)
- No analytics
- No performance monitoring
- No user behavior tracking

**Impact**: Can't debug issues in production
**Recommendation**:
- Add error tracking (Sentry, Rollbar)
- Add analytics (Mixpanel, Plausible)
- Monitor performance (Vercel Analytics, etc.)

### No Deployment Documentation
**Severity**: LOW
**Location**: README, DEPLOYMENT.md
**Issue**:
- README doesn't mention deployment
- No Docker support
- No deployment scripts

**Impact**: Hard for others (or future-you) to deploy
**Recommendation**:
- Add DEPLOYMENT.md with steps
- Consider Docker if deploying to complex infra
- Document required environment variables

## Summary of Priorities

### Must Fix (Before Production)
1. Error handling for audio system
2. Test coverage (at least critical paths)
3. Browser API safety (localStorage guards)
4. Input validation

### Should Fix (Before Public Use)
1. Performance optimization (bundle size, caching)
2. Error reporting / monitoring
3. Environment configuration
4. Data validation pattern

### Nice to Have (Ongoing)
1. Accessibility auditing
2. Security hardening
3. Code documentation
4. Dependency management
