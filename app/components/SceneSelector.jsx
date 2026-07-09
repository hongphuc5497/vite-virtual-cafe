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
                background: isActive ? "var(--color-accent)" : "var(--color-background-muted)",
                color: isActive ? "var(--color-on-accent)" : "var(--color-text-secondary)",
                boxShadow: isActive ? "var(--shadow-inset-selected)" : "none",
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
