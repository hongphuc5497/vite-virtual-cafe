import { useState } from "react";

const BACKDROP_SCENES = [
  {
    id: "misty-cabin",
    title: "Misty Cabin Retreat",
    artist: "Elena Rossi",
    active: true,
  },
  {
    id: "sunday-morning",
    title: "Sunday Morning Dust",
    artist: "Marc Aubert",
    active: false,
  },
  {
    id: "midnight-archive",
    title: "The Midnight Archive",
    artist: "Sarah Jenkins",
    active: false,
  },
  {
    id: "rainy-metro",
    title: "Rainy Metro Glow",
    artist: "Hiroshi Sato",
    active: false,
  },
];

const SCENE_GRADIENTS: Record<string, string> = {
  "misty-cabin": "linear-gradient(135deg, #b8cfc4 0%, #8aaba2 100%)",
  "sunday-morning": "linear-gradient(135deg, #f5e6d3 0%, #d4b896 100%)",
  "midnight-archive": "linear-gradient(135deg, #2d3142 0%, #1a1c2e 100%)",
  "rainy-metro": "linear-gradient(135deg, #4a6b7c 0%, #2c4a5a 100%)",
};

export default function Settings() {
  const [activeScene, setActiveScene] = useState("misty-cabin");
  const [focusTimerSounds, setFocusTimerSounds] = useState(true);
  const [fadeTransitions, setFadeTransitions] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <div
      className="min-h-[calc(100vh-57px)]"
      style={{ background: "#fefae0" }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Fine-tune Your Vibe
          </p>
          <h1
            className="mt-2 font-headline text-5xl font-light italic"
            style={{ color: "#1d1c0d", letterSpacing: "-0.02em" }}
          >
            Settings
          </h1>
        </div>

        {/* Profile card */}
        <section
          className="mb-6 rounded-xl p-6 shadow-[0_8px_24px_rgba(29,28,13,0.06)]"
          style={{ background: "#ffffff" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "#ffdcc4" }}
            >
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ color: "#8f4a00" }}
              >
                account_circle
              </span>
            </div>
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface">
                Your Sanctuary
              </h2>
              <p className="mt-0.5 text-sm text-on-surface-variant">
                Curating since March 2026
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" className="btn-primary">
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              Edit Profile
            </button>
            <button type="button" className="btn-ghost">
              Manage Subscription
            </button>
          </div>
        </section>

        {/* Backdrop Library */}
        <section
          className="mb-6 rounded-xl shadow-[0_8px_24px_rgba(29,28,13,0.06)]"
          style={{ background: "#ffffff" }}
        >
          <div className="flex items-center justify-between gap-4 px-6 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Backdrop Library
              </p>
              <h2 className="mt-1 font-headline text-xl font-light text-on-surface">
                Visual Scenes
              </h2>
            </div>
            <button type="button" className="btn-ghost text-xs">
              View All
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 px-6 pb-6">
            {BACKDROP_SCENES.map((scene) => {
              const isSelected = activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveScene(scene.id)}
                  className="group rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-95 overflow-hidden"
                  style={{
                    outline: isSelected ? "2px solid #8f4a00" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {/* Scene preview */}
                  <div
                    className="h-24 w-full"
                    style={{ background: SCENE_GRADIENTS[scene.id] }}
                  />
                  {/* Polaroid bottom */}
                  <div
                    className="px-3 pb-4 pt-2"
                    style={{ background: "#ffffff" }}
                  >
                    <p className="text-sm font-medium text-on-surface">
                      {scene.title}
                    </p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      by {scene.artist}
                    </p>
                    <p
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: isSelected ? "#8f4a00" : "#877366" }}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isSelected ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      {isSelected ? "Active Scene" : "Select Scene"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Toggles */}
        <section
          className="rounded-xl shadow-[0_8px_24px_rgba(29,28,13,0.06)]"
          style={{ background: "#ffffff" }}
        >
          <div className="px-6 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Preferences
            </p>
            <h2 className="mt-1 font-headline text-xl font-light text-on-surface">
              Quick Toggles
            </h2>
          </div>

          <div className="mt-4 pb-2">
            {[
              {
                label: "Focus Timer Sounds",
                description: "Play a chime when your session ends",
                value: focusTimerSounds,
                onChange: setFocusTimerSounds,
              },
              {
                label: "Fade Transitions",
                description: "Smooth crossfades when switching vibes",
                value: fadeTransitions,
                onChange: setFadeTransitions,
              },
              {
                label: "Session Notifications",
                description: "Browser notification when timer completes",
                value: notifications,
                onChange: setNotifications,
              },
            ].map(({ label, description, value, onChange }) => (
              <label
                key={label}
                className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface-container-low"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">{label}</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-on-surface-variant">
          The Analog Sanctuary · v2.0
        </p>
      </div>
    </div>
  );
}
