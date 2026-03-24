import type { MixerTrack } from "~/types/audio";

const VIBES = [
  {
    label: "Lo-fi Beats",
    icon: "music_note",
    description: "Warm café ambiance",
    preset: {
      Barista: 65,
      "Preparing Drinks": 45,
      "Coffee Cups": 50,
      "Other Customers": 30,
      Machinery: 20,
      "Rainy Day": 5,
      "Sunny Day": 40,
      Fireplace: 0,
    },
  },
  {
    label: "Rainy Day",
    icon: "rainy",
    description: "Cozy & introspective",
    preset: {
      Barista: 25,
      "Preparing Drinks": 15,
      "Coffee Cups": 20,
      "Other Customers": 15,
      Machinery: 10,
      "Rainy Day": 75,
      "Sunny Day": 0,
      Fireplace: 30,
    },
  },
  {
    label: "Jazz Night",
    icon: "piano",
    description: "Evening sophistication",
    preset: {
      Barista: 40,
      "Preparing Drinks": 30,
      "Coffee Cups": 55,
      "Other Customers": 45,
      Machinery: 15,
      "Rainy Day": 0,
      "Sunny Day": 0,
      Fireplace: 70,
    },
  },
  {
    label: "Nature",
    icon: "eco",
    description: "Open & expansive",
    preset: {
      Barista: 20,
      "Preparing Drinks": 10,
      "Coffee Cups": 15,
      "Other Customers": 10,
      Machinery: 0,
      "Rainy Day": 45,
      "Sunny Day": 80,
      Fireplace: 0,
    },
  },
] as const;

export interface VibeSelectorProps {
  tracks: MixerTrack[];
  onApplyVibe: (preset: Record<string, number>) => void;
}

export function VibeSelector({ tracks, onApplyVibe }: VibeSelectorProps) {
  const activeVibe = VIBES.find((vibe) =>
    Object.entries(vibe.preset).every(
      ([label, val]) =>
        tracks.find((t) => t.label === label)?.value === val
    )
  );

  return (
    <div>
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
              className="rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: isActive ? "#ffdcc4" : "#f2efd5",
                color: isActive ? "#8f4a00" : "#544438",
                outline: isActive ? "2px solid #ffb781" : "none",
                outlineOffset: "1px",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: isActive ? "#8f4a00" : "#877366" }}
              >
                {vibe.icon}
              </span>
              <p className="mt-1.5 text-sm font-semibold">{vibe.label}</p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: isActive ? "#6f3800" : "#877366" }}
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
