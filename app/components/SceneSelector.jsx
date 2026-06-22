import { SCENES } from "~/constants/audioConfig";

export function SceneSelector({ selectedScene, onSelect }) {
  return (
    <div data-testid="scene-selector">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
        Scene
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {SCENES.map((scene) => {
          const isActive = selectedScene === scene.id;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSelect(scene.id)}
              data-testid={`scene-${scene.id}`}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive ? "rgba(234,180,100,0.16)" : "#1b2c22",
                color: isActive ? "#eab464" : "#a7b6a9",
                outline: isActive ? "2px solid rgba(234,180,100,0.75)" : "none",
                outlineOffset: "1px",
              }}
            >
              {scene.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
