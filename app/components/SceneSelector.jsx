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
                background: isActive ? "rgba(194,104,63,0.14)" : "#ece2d2",
                color: isActive ? "#c2683f" : "#7b6f5f",
                outline: isActive ? "2px solid rgba(194,104,63,0.6)" : "none",
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
