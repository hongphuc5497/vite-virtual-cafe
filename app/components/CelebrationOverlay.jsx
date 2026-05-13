export function CelebrationOverlay({
  session,
  show,
  onDismiss,
}) {
  return (
    <div
        data-testid="celebration-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ease-out ${
          show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      <button
        type="button"
        aria-label="Dismiss celebration overlay"
        className="absolute inset-0"
        style={{ background: "rgba(29,28,13,0.2)" }}
        onClick={onDismiss}
      />
        <div
        className="relative mx-4 max-w-sm cursor-default rounded-2xl px-6 py-8 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
        <h2
          id="celebration-title"
          data-testid="celebration-heading"
          className="font-headline text-3xl font-light italic"
          style={{ color: "#8f4a00" }}
        >
          Great work!
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Duration
            </span>
            <p className="mt-1 text-base font-medium text-on-surface">
              {session.durationMinutes} min
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Vibe
            </span>
            <p className="mt-1 text-base font-medium text-on-surface">
              {session.vibe}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Mood
            </span>
            <p className="mt-1 text-base font-medium text-on-surface">
              {session.mood}
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Tap anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
