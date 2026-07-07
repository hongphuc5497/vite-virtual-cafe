export function CelebrationOverlay({
  session,
  show,
  onDismiss,
}) {
  const rows = [
    { label: "Duration", value: `${session.durationMinutes} min` },
    { label: "Vibe", value: session.vibe },
    { label: "Mood", value: session.mood },
  ];

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
        style={{
          background: "rgba(20,12,6,0.5)",
          WebkitBackdropFilter: "blur(3px)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onDismiss}
      />
      <div
        className="surface-card surface-hero relative mx-4 max-w-sm cursor-default overflow-hidden px-7 py-9"
        style={{
          transform: show ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
          transition: "transform 500ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
      >
          <span
            className="relative flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "var(--color-accent)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px -8px rgba(194,104,63,0.45)",
            }}
            aria-hidden="true"
          >
          <span
            className="material-symbols-outlined text-[26px]"
            style={{ color: "var(--color-background-muted)" }}
          >
            celebration
          </span>
        </span>

        <h2
          id="celebration-title"
          data-testid="celebration-heading"
          className="relative mt-5 font-headline text-3xl font-semibold italic"
          style={{ color: "var(--color-accent)" }}
        >
          Great work!
        </h2>
        <p className="relative mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          You stayed in the room. Here&rsquo;s your session.
        </p>

        <div
          className="relative mt-6 overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-4 py-3"
              style={{
                background: "var(--color-background-muted)",
                borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {row.label}
              </span>
              <span className="text-base font-medium text-on-surface">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p className="relative mt-7 text-center text-xs text-on-surface-variant">
          Tap anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
