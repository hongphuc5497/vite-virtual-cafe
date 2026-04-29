# Deferred Items

Issues discovered during execution that are out of scope for the current plan.

## ~~Build Failure: `text-foreground` class not found~~ RESOLVED

- **Discovered during:** Task 1 (post-deletion verification)
- **File:** `app/tailwind.css`
- **Symptom:** `@apply text-foreground` failed because shadcn semantic colors (foreground, border, ring, muted, accent, etc.) were missing from the Tailwind config.
- **Root cause:** shadcn v4 `tailwind.css` import uses Tailwind v4 syntax (`@theme inline`, `@custom-variant`), but the project is on Tailwind v3. The shadcn semantic color utilities don't get generated without color definitions in `tailwind.config.ts`.
- **Resolution:** Added missing shadcn semantic colors (foreground, border, ring, input, muted, muted-foreground, accent, accent-foreground, card, card-foreground, popover, popover-foreground, destructive, primary-foreground, secondary-foreground) to `tailwind.config.ts`, mapping them to CSS variables already defined in `:root`. Replaced `@apply text-foreground` and `@apply border-border outline-ring/50` in `tailwind.css` with direct CSS variable references (opacity modifiers don't work with oklch CSS variables in Tailwind v3). Added `build/` to ESLint ignorePatterns.
