# Deferred Items

Issues discovered during execution that are out of scope for the current plan.

## Build Failure: `text-foreground` class not found

- **Discovered during:** Task 1 (post-deletion verification)
- **File:** `app/tailwind.css`
- **Symptom:** `@apply text-foreground` fails because the `text-foreground` class does not exist in the Tailwind CSS configuration.
- **Root cause:** The `app/tailwind.css` file was modified (pre-existing dirty state) to add shadcn/ui style layers. The `text-foreground` class depends on a shadcn CSS configuration that is not properly loaded.
- **Impact:** `npm run build` fails. `npm run typecheck` also fails with pre-existing errors in `app/lib/session.ts` (untracked) and `app/components/VibeSelector.tsx` (modified).
- **Resolution:** Needs investigation of shadcn/ui Tailwind plugin or CSS layer setup.
- **Planned in:** Not yet scheduled.
