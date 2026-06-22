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
                background: isActive ? "rgba(234,180,100,0.16)" : "#1b2c22",
                color: isActive ? "#eab464" : "#a7b6a9",
                outline: isActive ? "2px solid rgba(234,180,100,0.75)" : "none",
                outlineOffset: "1px",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: isActive ? "#eab464" : "#7c8d80" }}
              >
                {vibe.icon}
              </span>
              <p className="mt-1.5 text-sm font-semibold">{vibe.label}</p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: isActive ? "#e9c089" : "#7c8d80" }}
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
