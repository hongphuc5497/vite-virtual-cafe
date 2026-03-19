import { useEffect, useRef, useState } from "react";

type MixerTrack = {
  label: string;
  value: number;
};

type RoomTone = "cafe" | "rain";

type SavedPreferences = {
  durationMinutes?: number;
  selectedSound?: RoomTone;
  tracks?: MixerTrack[];
  showBackdropDetails?: boolean;
  savePreferences?: boolean;
};

const DEFAULT_DURATION_MINUTES = 25;
const DEFAULT_SOUND: RoomTone = "cafe";
const STORAGE_KEY = "virtual-cafe-home-prefs";
const DEFAULT_TRACKS: MixerTrack[] = [
  { label: "Barista", value: 64 },
  { label: "Preparing Drinks", value: 42 },
  { label: "Coffee Cups", value: 56 },
  { label: "Other Customers", value: 38 },
  { label: "Machinery", value: 31 },
  { label: "Rainy Day", value: 18 },
  { label: "Sunny Day", value: 67 },
  { label: "Fireplace", value: 22 },
];

export default function Index() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [showBackdropDetails, setShowBackdropDetails] = useState(true);
  const [savePreferences, setSavePreferences] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES);
  const [selectedSound, setSelectedSound] = useState<RoomTone>(DEFAULT_SOUND);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return;
    }

    try {
      const parsed = JSON.parse(savedValue) as SavedPreferences;

      if (Array.isArray(parsed.tracks)) {
        setTracks(
          DEFAULT_TRACKS.map((track) => {
            const savedTrack = parsed.tracks?.find(
              (candidate) => candidate.label === track.label
            );
            return savedTrack ? { ...track, value: savedTrack.value } : track;
          })
        );
      }

      setDurationMinutes(parsed.durationMinutes ?? DEFAULT_DURATION_MINUTES);
      setSelectedSound(parsed.selectedSound ?? DEFAULT_SOUND);
      setShowBackdropDetails(parsed.showBackdropDetails ?? true);
      setSavePreferences(parsed.savePreferences ?? false);
      setTimeLeft(
        (parsed.durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60
      );
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!savePreferences) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        durationMinutes,
        selectedSound,
        tracks,
        showBackdropDetails,
        savePreferences,
      } satisfies SavedPreferences)
    );
  }, [
    durationMinutes,
    selectedSound,
    tracks,
    showBackdropDetails,
    savePreferences,
  ]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleApplySetup = () => {
    setTimeLeft(durationMinutes * 60);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(durationMinutes * 60);
      setIsRunning(true);
      return;
    }

    setIsRunning((previousValue) => !previousValue);
  };

  const handleReset = () => {
    setTimeLeft(durationMinutes * 60);
    setIsRunning(false);
  };

  const strongestTrack = [...tracks].sort(
    (left, right) => right.value - left.value
  )[0];
  const sunlightLevel =
    tracks.find((track) => track.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-6 text-stone-950 md:px-8 lg:px-10"
      style={{
        backgroundImage: `url('/cafe-background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 14%, rgba(255, 236, 202, ${backdropGlow}), transparent 28%), linear-gradient(180deg, rgba(25, 19, 14, 0.2), rgba(25, 19, 14, 0.58))`,
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[90rem] flex-col gap-8 lg:grid lg:grid-cols-[0.92fr_1.35fr_0.96fr] lg:items-stretch">
        <section className="flex flex-col justify-between gap-6 lg:py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
              Virtual Cafe
            </p>
            <h1 className="mt-6 font-serif text-6xl font-semibold leading-[0.92] tracking-[-0.05em] md:text-8xl">
              One room.
              <br />
              One page.
              <br />
              Stay here.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-stone-700">
              The backdrop, mixer, timer, and setup now live together on the
              main screen instead of jumping through subpages.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_20px_45px_rgba(55,41,29,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                    Focus Setup
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-stone-900">
                    {durationMinutes} min with {selectedSound}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApplySetup}
                  className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:bg-stone-800"
                >
                  Apply
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Duration
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={durationMinutes}
                    onChange={(event) =>
                      setDurationMinutes(
                        Math.max(1, Number.parseInt(event.target.value || "1", 10))
                      )
                    }
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white/70 px-4 py-3 text-lg text-stone-900 outline-none transition focus:border-stone-900"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Room Tone
                  </span>
                  <select
                    value={selectedSound}
                    onChange={(event) =>
                      setSelectedSound(event.target.value as RoomTone)
                    }
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white/70 px-4 py-3 text-lg text-stone-900 outline-none transition focus:border-stone-900"
                  >
                    <option value="cafe">Cafe</option>
                    <option value="rain">Rain</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-[1.9rem] bg-stone-950 px-6 py-6 text-stone-100 shadow-[0_22px_45px_rgba(32,24,19,0.14)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Session Timer
                  </p>
                  <div className="mt-3 font-mono text-5xl font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300">
                  {isRunning ? "running" : "paused"}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className={`rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] transition ${
                    isRunning
                      ? "bg-[#cc8a53] text-stone-950 hover:bg-[#d49a68]"
                      : "bg-[#8fa77b] text-stone-950 hover:bg-[#9db68a]"
                  }`}
                >
                  {isRunning ? "Pause" : timeLeft === 0 ? "Restart" : "Start"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/5"
                >
                  Reset
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Blend", value: strongestTrack.label },
                  { label: "Backdrop", value: "Coffee shop" },
                  { label: "Room tone", value: selectedSound },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold capitalize text-stone-100">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[32rem] overflow-hidden rounded-[2.75rem] border border-white/25 bg-[rgba(248,240,233,0.12)] shadow-[0_28px_60px_rgba(18,14,10,0.18)] backdrop-blur-[10px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.22)] via-[rgba(255,255,255,0.04)] to-[rgba(18,14,10,0.18)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(255,250,246,0.18)] to-transparent" />
          <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
            <div className="rounded-full bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-stone-100 backdrop-blur">
              Full-page backdrop
            </div>
            <div className="rounded-full bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-stone-100 backdrop-blur">
              {strongestTrack.label}
            </div>
          </div>

          {showBackdropDetails ? (
            <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.8rem] bg-[rgba(20,16,12,0.58)] p-5 text-stone-100 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-300">
                  Room Note
                </p>
                <p className="mt-3 max-w-md text-lg leading-8 text-stone-100/90">
                  The image now lives behind the whole interface, so the room
                  feels continuous while the controls float over it.
                </p>
              </div>
              <div className="rounded-[1.8rem] bg-[rgba(247,239,229,0.84)] p-5 text-stone-900 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Active Setup
                </p>
                <p className="mt-3 text-2xl font-semibold">
                  {durationMinutes} min / {selectedSound}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Apply new values from the left card whenever you want to reset
                  the session with a different duration or room tone.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_20px_45px_rgba(55,41,29,0.08)] lg:py-8">
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3 text-sm text-stone-700">
              <span>show backdrop details</span>
              <input
                type="checkbox"
                checked={showBackdropDetails}
                onChange={(event) =>
                  setShowBackdropDetails(event.target.checked)
                }
                className="h-5 w-5 rounded border-stone-400 text-stone-900 focus:ring-stone-500"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm text-stone-700">
              <span>save preferences</span>
              <input
                type="checkbox"
                checked={savePreferences}
                onChange={(event) => setSavePreferences(event.target.checked)}
                className="h-5 w-5 rounded border-stone-400 text-stone-900 focus:ring-stone-500"
              />
            </label>
          </div>

          <div className="mt-8 space-y-7">
            {tracks.map((track) => (
              <div key={track.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-medium text-stone-900">
                    {track.label}
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    {track.value}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500">◔</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={track.value}
                    onChange={(event) =>
                      setTracks((currentTracks) =>
                        currentTracks.map((currentTrack) =>
                          currentTrack.label === track.label
                            ? {
                                ...currentTrack,
                                value: Number.parseInt(event.target.value, 10),
                              }
                            : currentTrack
                        )
                      )
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-300 accent-stone-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
