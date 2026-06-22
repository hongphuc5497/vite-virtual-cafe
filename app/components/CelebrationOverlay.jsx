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
        {/* warm bloom from the top */}
        <div
          className="ember-glow pointer-events-none absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(255,196,128,0.45), transparent 70%)",
          }}
          aria-hidden="true"
        />

        <span
          className="relative flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(150deg, #f3c781, #e0a64f)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px -8px rgba(234,180,100,0.5)",
          }}
          aria-hidden="true"
        >
          <span
            className="material-symbols-outlined text-[26px]"
            style={{ color: "#16271d" }}
          >
            celebration
          </span>
        </span>

        <h2
          id="celebration-title"
          data-testid="celebration-heading"
          className="relative mt-5 font-headline text-3xl font-light italic"
          style={{ color: "#eab464" }}
        >
          Great work!
        </h2>
        <p className="relative mt-1 text-sm" style={{ color: "#7c8d80" }}>
          You stayed in the room. Here&rsquo;s your session.
        </p>

        <div
          className="relative mt-6 overflow-hidden rounded-xl"
          style={{ border: "1px solid rgba(190,210,195,0.14)" }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderTop: i === 0 ? "none" : "1px solid rgba(190,210,195,0.1)",
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
