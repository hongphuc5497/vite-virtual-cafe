import { VIBES } from "~/constants/audioConfig";

export function VibeSelector({ tracks, onApplyVibe }) {
  const activeVibe = VIBES.find((vibe) =>
    Object.entries(vibe.preset).every(
      ([label, val]) =>
        tracks.find((t) => t.label === label)?.value === val
    )
  );

  return (
    <div data-testid="vibe-selector">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
        Vibe
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VIBES.map((vibe) => {
          const isActive = activeVibe?.label === vibe.label;
          return (
            <button
              key={vibe.label}
              type="button"
              onClick={() => onApplyVibe({ ...vibe.preset })}
              data-testid={`vibe-${vibe.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: isActive ? "rgba(194,104,63,0.14)" : "#ece2d2",
                color: isActive ? "#c2683f" : "#7b6f5f",
                outline: isActive ? "2px solid rgba(194,104,63,0.6)" : "none",
                outlineOffset: "1px",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: isActive ? "#c2683f" : "#9a8b78" }}
              >
                {vibe.icon}
              </span>
              <p className="mt-1.5 text-sm font-semibold">{vibe.label}</p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: isActive ? "#9a4f2c" : "#9a8b78" }}
              >
                {vibe.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
