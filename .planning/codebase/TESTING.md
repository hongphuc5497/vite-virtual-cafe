# Testing & Quality Assurance

## Current Testing State
**No test framework detected** — This is a gap that should be addressed as the project grows.

### Missing Test Infrastructure
- ❌ No test runner configured (Jest, Vitest, Playwright, etc.)
- ❌ No test files in codebase (`*.test.ts`, `*.spec.ts`)
- ❌ No E2E testing framework
- ❌ No test utilities or mocking libraries

## Recommended Testing Strategy

### Unit Tests (For Hooks & Components)

**Framework**: Vitest (recommended for Vite/TypeScript projects)
- Fast, Vite-native, Jest-compatible API
- Minimal config needed
- Works well with TypeScript

**Setup**:
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/dom
```

**Hook Testing Example**:
```typescript
// app/hooks/__tests__/usePersistentState.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistentState } from '../usePersistentState';

describe('usePersistentState', () => {
  it('persists state to localStorage', () => {
    const { result } = renderHook(() => usePersistentState('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(localStorage.getItem('test-key')).toBe('updated');
  });
});
```

**Component Testing Example**:
```typescript
// app/components/__tests__/Timer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timer from '../Timer';

describe('Timer', () => {
  it('renders duration correctly', () => {
    render(<Timer duration={60} />);
    expect(screen.getByText('60')).toBeInTheDocument();
  });
});
```

### Integration Tests (For Routes & Workflows)

**Framework**: Vitest with MSW (Mock Service Worker) for API mocking
- Test user workflows across multiple components
- Mock browser APIs (localStorage, Howler audio)
- Avoid touching real audio files

**Example**:
```typescript
// app/routes/__tests__/relax.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RelaxRoute from '../relax';

describe('Relax Route', () => {
  it('loads and displays vibe selector', () => {
    render(<RelaxRoute />);
    expect(screen.getByText(/choose.*vibe/i)).toBeInTheDocument();
  });
});
```

### E2E Tests (For User Workflows)

**Framework**: Playwright (recommended for Remix apps)
- Test real browser behavior
- Verify audio playback (mocked)
- Test session persistence

**Example**:
```typescript
// tests/e2e/session.spec.ts
import { test, expect } from '@playwright/test';

test('user can start and track a session', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Start Session")');
  await expect(page.locator('.timer')).toBeVisible();

  // Session should persist after reload
  await page.reload();
  await expect(page.locator('.timer')).toBeVisible();
});
```

## Code Quality Tools

### Type Checking
- **Current**: `npm run typecheck` runs tsc without emit ✓
- **Status**: Enabled and working
- **Recommendation**: Run in CI/CD pipeline before tests

### Linting
- **Current**: ESLint configured with TypeScript support ✓
- **Command**: `npm run lint`
- **Recommendation**: Enforce in pre-commit hooks

### Pre-commit Hooks (Recommended)

Install husky + lint-staged:
```bash
npm install -D husky lint-staged
npx husky install
```

**Configuration** (`.husky/pre-commit`):
```bash
#!/bin/sh
npx lint-staged
```

**Configuration** (`package.json`):
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "npm run typecheck"]
  }
}
```

## Test Coverage Goals

### Recommended Coverage Targets
- **Statements**: 70%+ (critical paths: 90%+)
- **Branches**: 65%+ (handle if/else)
- **Functions**: 75%+ (all exported functions)
- **Lines**: 70%+

### Priority Test Areas
1. **Audio system** (`audioConfig.ts`, `SoundBoard.tsx`)
   - Track loading and playback
   - Volume/mixing controls

2. **Session timing** (`useSessionTimer`, `SessionTimer.tsx`)
   - Timer accuracy
   - Persistence across reloads

3. **Persistent state** (`usePersistentState`)
   - localStorage integration
   - Sync with React state

4. **Routes** (`journal.tsx`, `relax.tsx`)
   - Navigation works
   - Data persists

5. **Vibe selection** (`VibeSelector.tsx`)
   - Selection changes state
   - UI updates correctly

## Test Utilities & Helpers

### Recommended Library Setup

**Testing Library**:
- @testing-library/react — Component testing
- @testing-library/dom — DOM queries
- @testing-library/user-event — User interactions

**Mocking**:
- MSW (Mock Service Worker) — Future API calls
- vitest mocking utilities — Module mocks
- Howler mock — Audio library mocking

**Assertion Library**:
- Vitest built-in assertions
- jest-dom matchers (via @testing-library/jest-dom)

### Example Test Setup File

**`vitest.config.ts`**:
```typescript
import { getViteConfig } from '@remix-run/dev';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  getViteConfig({
    future: { v3_singleFetchStrategy: true },
  }),
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  }),
);
```

**`test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => cleanup());

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock Howler
vi.mock('howler', () => ({
  Howl: vi.fn(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    seek: vi.fn(),
  })),
}));
```

## Continuous Integration Recommendations

### GitHub Actions Workflow Example

**`.github/workflows/test.yml`**:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e
```

## Performance Testing

### Currently Not Implemented
- No Lighthouse CI
- No bundle size analysis
- No performance benchmarks

### Recommendations
- Add `bundle-analyzer` to track bundle size
- Run Lighthouse in CI for accessibility/performance scores
- Monitor Core Web Vitals (Remix provides helpers)

## Accessibility Testing

### Manual Testing
- Use ESLint jsx-a11y plugin (already configured) ✓
- Run axe DevTools or similar in browser

### Automated Testing
- axe-core integration (test-only)
- inchjs for accessibility checks

### Example:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect(toHaveNoViolations(await axe(container)));
```

## Future Enhancements

### Near Term
1. Set up Vitest + Testing Library
2. Write tests for custom hooks (useSessionTimer, usePersistentState)
3. Add pre-commit hooks (husky + lint-staged)

### Medium Term
1. Add E2E tests with Playwright
2. Aim for 70%+ code coverage
3. Set up CI/CD pipeline with GitHub Actions

### Long Term
1. Monitor performance metrics
2. Maintain accessibility standards
3. Expand test coverage as features grow
