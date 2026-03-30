# Code Style & Conventions

## Language & Type System
- **Language**: TypeScript with strict mode enabled
- **Target**: ES2022 (modern JavaScript)
- **Strict Settings**:
  - `strict: true` in tsconfig.json
  - Requires explicit types, no implicit any
  - Null/undefined checks enforced

## Component Style

### Functional Components
- **Pattern**: Functional components with React hooks
- **Example from codebase**: `SessionTimer.tsx`, `VibeSelector.tsx`
```typescript
// Pattern
const ComponentName: React.FC<Props> = (props) => {
  return <div>content</div>;
};
```

### Naming
- **Components**: PascalCase (e.g., `SoundBoard`, `SessionTimer`)
- **Files**: Match component name exactly
- **Props**: Explicit interfaces or types

### Hooks Usage
- **Custom hooks**: `useSessionTimer`, `usePersistentState`
- **Built-in hooks**: `useState`, `useEffect`, `useCallback` (inferred from custom hooks)
- **Pattern**: Extract logic into custom hooks for reusability

## Styling Conventions

### Tailwind CSS
- **Framework**: Tailwind CSS 3.4.19 (utility-first)
- **Pattern**: Inline utility classes on elements
- **No CSS-in-JS**: Not detected in codebase
- **Example** (inferred):
  ```jsx
  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
    {children}
  </div>
  ```
- **Responsive**: Tailwind's responsive prefixes (sm:, md:, lg:, etc.)
- **Colors**: Likely using Tailwind's default palette plus custom theme

### PostCSS & Autoprefixer
- PostCSS 8.5.8 for CSS transformation
- Autoprefixer 10.4.27 for cross-browser compatibility
- Standard Tailwind setup with default plugins

## File Organization

### Constants
- **Location**: `app/constants/`
- **Example**: `audioConfig.ts` contains:
  - Track definitions
  - Mood configurations
  - Visual settings
- **Pattern**: Centralize configuration to avoid duplication

### Types & Interfaces
- **Location**: `app/types/`
- **Example**: `audio.ts` for audio-related types
- **Naming**: Match domain (e.g., audio types in audio.ts)
- **Pattern**:
  ```typescript
  interface Track {
    id: string;
    name: string;
    // ... properties
  }
  ```

### Hooks
- **Location**: `app/hooks/`
- **Naming**: `use[Feature]` prefix (e.g., `useSessionTimer`)
- **Pattern**: Extract stateful logic, make it reusable
- **Example**:
  ```typescript
  function useSessionTimer() {
    const [duration, setDuration] = useState(0);
    // ... logic
    return { duration, start, stop };
  }
  ```

## Imports & Module Resolution

### Path Aliases
- **Base alias**: `~/` → `app/`
- **Usage**: `import { Component } from "~/components/Component"`
- **Benefit**: Cleaner, more readable imports vs relative paths

### Module Format
- **Type**: ES modules (`"type": "module"` in package.json)
- **Imports**: `import` / `export` syntax
- **Re-exports**: Allowed but minimize (circular dependency risk)

## React-Specific Conventions

### Component Structure (inferred)
```typescript
// 1. Imports
import { useState, useEffect } from "react";
import { usePersistentState } from "~/hooks";

// 2. Type definitions
interface ComponentProps {
  title: string;
  onSubmit?: (data: string) => void;
}

// 3. Component declaration
const MyComponent: React.FC<ComponentProps> = ({ title, onSubmit }) => {
  // 4. Hooks
  const [state, setState] = useState("");

  // 5. Event handlers
  const handleChange = (e) => setState(e.target.value);

  // 6. Return JSX
  return <div>{/* ... */}</div>;
};

export default MyComponent;
```

### Props Typing
- **Required**: Explicit prop interfaces
- **Pattern**: `React.FC<PropsInterface>` for function component typing
- **Optional props**: Use `?` in interface

### State Management
- **Local state**: `useState` for component-level state
- **Custom hooks**: Extract shared state logic
- **Persistence**: `usePersistentState` for browser storage
- **No global state library**: Using React hooks pattern only

## Error Handling (Recommended Patterns)

### Current State
- **No explicit error boundaries** detected
- **No error state handling** in hooks
- **Console errors likely silent** in production

### Recommended Approach
```typescript
const useAudioTrack = (trackId: string) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Load track
    } catch (err) {
      setError(err as Error);
    }
  }, [trackId]);

  return { error };
};
```

## Testing Patterns (None Detected)

### Current State
- **No test files found** in codebase
- **No testing framework** configured (no Jest, Vitest, etc.)

### Recommended Setup
- Test files: `__tests__/` folder or `.test.ts` suffix
- Framework: Vitest (Vite-native) or Jest
- Pattern: One test file per component/hook

## Linting & Code Quality

### ESLint Configuration
- **Parser**: @typescript-eslint/parser
- **Plugins**:
  - @typescript-eslint (TypeScript linting)
  - eslint-plugin-import (import/export validation)
  - eslint-plugin-react (React best practices)
  - eslint-plugin-react-hooks (Hook rules enforcement)
  - eslint-plugin-jsx-a11y (Accessibility)

### Commands
- **Lint**: `npm run lint` — Check all files
- **Type check**: `npm run typecheck` — Run tsc without emit
- **Format**: Not explicitly configured (no Prettier detected)

## Commit Convention (Inferred from Recent Commits)
- **Format**: `type: subject` or `type(scope): subject`
- **Types seen**:
  - `feat:` — New feature
  - `chore:` — Maintenance, config updates
  - `refactor:` — Code reorganization
  - `ui:` — UI-specific changes
  - `ai:` — AI/analysis work
- **Example**: `feat: add journal/relax routes, VibeSelector, and UI refinements`

## Performance Considerations

### Code Splitting
- **Remix default**: Automatic route-based code splitting
- **Async imports**: Use Remix loaders if needed (not yet detected)

### Re-render Optimization
- **Hooks**: Should use dependency arrays correctly in useEffect
- **Callback memoization**: Use useCallback where needed (not currently enforced)

## Accessibility (a11y)

### Current State
- **ESLint plugin**: jsx-a11y enabled (enforcement via linting)
- **Semantic HTML**: Should be using proper elements (not verified in code)
- **ARIA labels**: Not yet audited

### Recommendations
- Ensure all interactive elements have labels
- Use semantic HTML (button, nav, main, etc.)
- Include alt text for images
- Test with keyboard navigation
