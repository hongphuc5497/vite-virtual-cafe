import { useEffect, useRef, useState } from "react";

type MixerTrack = {
  label: string;
  value: number;
};

type RoomTone = "cafe" | "rain";

type SavedPreferences = {
  durationMinutes?: number;
  selectedSound?: RoomTone;
  draftDurationMinutes?: number;
  appliedDurationMinutes?: number;
  draftSelectedSound?: RoomTone;
  appliedSelectedSound?: RoomTone;
  tracks?: MixerTrack[];
  showBackdropDetails?: boolean;
  savePreferences?: boolean;
  soundEnabled?: boolean;
};

const DEFAULT_DURATION_MINUTES = 25;
const DEFAULT_SOUND: RoomTone = "cafe";
const STORAGE_KEY = "virtual-cafe-home-prefs";
const APPLY_FEEDBACK_DURATION_MS = 1600;
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

const SOUND_URLS: Record<string, string> = {
  "Barista": "https://imissmycafe.com/assets/sounds/barista-reagan.mp3",
  "Preparing Drinks": "https://imissmycafe.com/assets/sounds/makingdrinks.mp3",
  "Coffee Cups": "https://imissmycafe.com/assets/sounds/coffeecups.mp3",
  "Other Customers": "https://imissmycafe.com/assets/sounds/interior.mp3",
  "Machinery": "https://imissmycafe.com/assets/sounds/machinery.mp3",
  "Rainy Day": "https://imissmycafe.com/assets/sounds/rain.mp3",
  "Sunny Day": "https://imissmycafe.com/assets/sounds/exterior.mp3",
  "Fireplace": "https://imissmycafe.com/assets/sounds/fireplace.mp3",
};

const TRACK_BASE_VOLUME: Record<string, number> = {
  Barista: 0.18,
  "Preparing Drinks": 0.16,
  "Coffee Cups": 0.12,
  "Other Customers": 0.16,
  Machinery: 0.14,
  "Rainy Day": 0.28,
  "Sunny Day": 0.14,
  Fireplace: 0.18,
};

const TONE_PROFILES: Record<RoomTone, Record<string, number>> = {
  cafe: {
    Barista: 1,
    "Preparing Drinks": 1,
    "Coffee Cups": 1,
    "Other Customers": 1,
    Machinery: 0.9,
    "Rainy Day": 0.15,
    "Sunny Day": 0.8,
    Fireplace: 0.45,
  },
  rain: {
    Barista: 0.45,
    "Preparing Drinks": 0.35,
    "Coffee Cups": 0.25,
    "Other Customers": 0.3,
    Machinery: 0.35,
    "Rainy Day": 1,
    "Sunny Day": 0.1,
    Fireplace: 0.6,
  },
};

export default function Index() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [showBackdropDetails, setShowBackdropDetails] = useState(true);
  const [savePreferences, setSavePreferences] = useState(false);
  const [draftDurationMinutes, setDraftDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [appliedDurationMinutes, setAppliedDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [draftSelectedSound, setDraftSelectedSound] =
    useState<RoomTone>(DEFAULT_SOUND);
  const [appliedSelectedSound, setAppliedSelectedSound] =
    useState<RoomTone>(DEFAULT_SOUND);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState<"idle" | "applied">("idle");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Sound is off");
  const intervalRef = useRef<number | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const initializedAudioRef = useRef(false);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return;
    }

    try {
      const parsed = JSON.parse(savedValue) as SavedPreferences;
      const savedDraftDuration =
        parsed.draftDurationMinutes ??
        parsed.durationMinutes ??
        DEFAULT_DURATION_MINUTES;
      const savedAppliedDuration =
        parsed.appliedDurationMinutes ?? savedDraftDuration;
      const savedDraftSound =
        parsed.draftSelectedSound ??
        parsed.selectedSound ??
        DEFAULT_SOUND;
      const savedAppliedSound =
        parsed.appliedSelectedSound ?? savedDraftSound;

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

      setDraftDurationMinutes(savedDraftDuration);
      setAppliedDurationMinutes(savedAppliedDuration);
      setDraftSelectedSound(savedDraftSound);
      setAppliedSelectedSound(savedAppliedSound);
      setShowBackdropDetails(parsed.showBackdropDetails ?? true);
      setSavePreferences(parsed.savePreferences ?? false);
      setSoundEnabled(parsed.soundEnabled ?? false);
      setTimeLeft(savedAppliedDuration * 60);
      setAudioStatus(parsed.soundEnabled ? "Sound ready" : "Sound is off");
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
        draftDurationMinutes,
        appliedDurationMinutes,
        draftSelectedSound,
        appliedSelectedSound,
        tracks,
        showBackdropDetails,
        savePreferences,
        soundEnabled,
      } satisfies SavedPreferences)
    );
  }, [
    appliedDurationMinutes,
    appliedSelectedSound,
    draftDurationMinutes,
    draftSelectedSound,
    savePreferences,
    showBackdropDetails,
    soundEnabled,
    tracks,
  ]);

  useEffect(() => {
    if (applyFeedback !== "applied") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setApplyFeedback("idle");
    }, APPLY_FEEDBACK_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [applyFeedback]);

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

  useEffect(() => {
    if (!soundEnabled) {
      return;
    }

    const toneProfile = TONE_PROFILES[appliedSelectedSound];

    tracks.forEach((track) => {
      const audioElement = audioElementsRef.current.get(track.label);

      if (!audioElement) {
        return;
      }

      const normalizedValue = Math.pow(track.value / 100, 1.35);
      const targetVolume = Math.min(
        1,
        TRACK_BASE_VOLUME[track.label] *
        toneProfile[track.label] *
        normalizedValue
      );

      audioElement.volume = targetVolume;
    });

    setAudioStatus(`Ambient mix on: ${appliedSelectedSound}`);
  }, [appliedSelectedSound, soundEnabled, tracks]);

  useEffect(() => {
    const audioElements = audioElementsRef.current;

    return () => {
      audioElements.forEach((audioElement) => {
        audioElement.pause();
        audioElement.src = "";
      });
      audioElements.clear();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const initializeAudio = async () => {
    if (audioElementsRef.current.size === 0) {
      DEFAULT_TRACKS.forEach((track) => {
        const audioElement = new Audio(SOUND_URLS[track.label]);
        audioElement.crossOrigin = "anonymous";
        audioElement.loop = true;
        audioElement.preload = "auto";
        audioElement.volume = 0;
        audioElementsRef.current.set(track.label, audioElement);
      });
    }

    try {
      await Promise.all(
        [...audioElementsRef.current.values()].map(async (audioElement) => {
          const playPromise = audioElement.play();

          if (playPromise) {
            await playPromise;
          }
        })
      );
    } catch {
      setAudioStatus("Browser blocked audio. Click enable sound again.");
      return false;
    }

    initializedAudioRef.current = true;
    setSoundEnabled(true);
    setAudioStatus(`Streaming ambient mix: ${appliedSelectedSound}`);

    return true;
  };

  const handleToggleSound = async () => {
    if (!initializedAudioRef.current) {
      await initializeAudio();
      return;
    }

    if (soundEnabled) {
      audioElementsRef.current.forEach((audioElement) => {
        audioElement.pause();
      });
      setSoundEnabled(false);
      setAudioStatus("Sound is off");
      return;
    }

    await Promise.all(
      [...audioElementsRef.current.values()].map(async (audioElement) => {
        const playPromise = audioElement.play();

        if (playPromise) {
          await playPromise;
        }
      })
    );
    setSoundEnabled(true);
    setAudioStatus(`Streaming ambient mix: ${appliedSelectedSound}`);
  };

  const handleApplySetup = () => {
    setAppliedDurationMinutes(draftDurationMinutes);
    setAppliedSelectedSound(draftSelectedSound);
    setTimeLeft(draftDurationMinutes * 60);
    setIsRunning(false);
    setApplyFeedback("applied");
  };

  const handleToggleTimer = async () => {
    if (!soundEnabled) {
      await initializeAudio();
    }

    if (timeLeft === 0) {
      setTimeLeft(appliedDurationMinutes * 60);
      setIsRunning(true);
      return;
    }

    setIsRunning((previousValue) => !previousValue);
  };

  const handleReset = () => {
    setTimeLeft(appliedDurationMinutes * 60);
    setIsRunning(false);
  };

  const strongestTrack = [...tracks].sort(
    (left, right) => right.value - left.value
  )[0];
  const sunlightLevel =
    tracks.find((track) => track.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;
  const roomMood = sunlightLevel >= 50 ? "soft daylight" : "after dark";
  const activeDurationSeconds = appliedDurationMinutes * 60;

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-4 text-stone-950 md:px-7 md:py-6 lg:px-10"
      style={{
        backgroundImage: `url('/cafe-background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 17% 16%, rgba(255, 236, 202, ${backdropGlow}), transparent 24%), linear-gradient(90deg, rgba(20, 15, 10, 0.56), rgba(20, 15, 10, 0.22) 36%, rgba(20, 15, 10, 0.35) 100%)`,
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-[92rem] flex-col gap-5 lg:grid lg:grid-cols-[0.84fr_1.4fr_0.9fr] lg:items-start lg:gap-6">
        <section className="order-1 flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,248,241,0.9),rgba(245,233,223,0.78))] p-5 shadow-[0_18px_40px_rgba(22,16,12,0.16)] backdrop-blur md:p-6">
            <p className="text-[11px] uppercase tracking-[0.45em] text-stone-500">
              Virtual Cafe
            </p>
            <h1 className="mt-4 max-w-[4.5ch] font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-6xl">
              Stay in the room.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-stone-700">
              The cafe image is the environment now. Setup, timer, and mix stay
              visible without turning the page into three heavy columns.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-600">
              <span className="rounded-full bg-white/55 px-3 py-2">
                {roomMood}
              </span>
              <span className="rounded-full bg-white/55 px-3 py-2">
                {strongestTrack.label}
              </span>
              <span className="rounded-full bg-white/55 px-3 py-2">
                one-page flow
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-[rgba(20,15,12,0.78)] p-5 text-stone-100 shadow-[0_22px_48px_rgba(18,14,10,0.22)] backdrop-blur md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-stone-400">
                  Focus Setup
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {draftDurationMinutes} min with {draftSelectedSound}
                </p>
              </div>
              <div className="rounded-full border border-white/12 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-300">
                {applyFeedback === "applied" ? "applied" : "draft setup"}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                  Duration
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={draftDurationMinutes}
                  onChange={(event) =>
                    setDraftDurationMinutes(
                      Math.max(1, Number.parseInt(event.target.value || "1", 10))
                    )
                  }
                  className="w-full rounded-[1.1rem] border border-white/10 bg-white/90 px-4 py-3 text-lg text-stone-950 outline-none transition focus:border-[#8fa77b]"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                  Room Tone
                </span>
                <select
                  value={draftSelectedSound}
                  onChange={(event) =>
                    setDraftSelectedSound(event.target.value as RoomTone)
                  }
                  className="w-full rounded-[1.1rem] border border-white/10 bg-white/90 px-4 py-3 text-lg text-stone-950 outline-none transition focus:border-[#8fa77b]"
                >
                  <option value="cafe">Cafe</option>
                  <option value="rain">Rain</option>
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={handleApplySetup}
                  className="rounded-full bg-[#8fa77b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950 transition hover:bg-[#9db68a]"
                >
                  {applyFeedback === "applied" ? "Applied" : "Apply to timer"}
                </button>
                <p className="self-center text-sm leading-6 text-stone-400">
                  Updates the active session and resets the timer to the applied
                  setup.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="order-3 rounded-[2rem] border border-white/12 bg-[rgba(246,239,231,0.88)] p-5 shadow-[0_22px_45px_rgba(18,14,10,0.18)] backdrop-blur md:p-6 lg:order-2 lg:mt-14 lg:min-h-[36rem] lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
          <div className="grid gap-4 lg:hidden">
            <div className="rounded-[1.6rem] bg-[rgba(20,15,12,0.76)] p-5 text-stone-100">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.34em] text-stone-400">
                  Session Timer
                </p>
                <span className="rounded-full border border-white/12 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-300">
                  {isRunning ? "running" : "paused"}
                </span>
              </div>
              <div className="mt-4 font-mono text-5xl font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
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
            </div>

            <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/70 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                Current Session
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Blend", value: strongestTrack.label },
                  { label: "Mood", value: roomMood },
                  { label: "Tone", value: appliedSelectedSound },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.1rem] bg-white/80 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold capitalize text-stone-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block lg:min-h-[36rem]">
            <div className="absolute left-0 top-2 rounded-full bg-[rgba(14,11,9,0.42)] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-stone-100 backdrop-blur">
              Full-page backdrop
            </div>
            <div className="absolute right-0 top-2 rounded-full bg-[rgba(14,11,9,0.42)] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-stone-100 backdrop-blur">
              {strongestTrack.label}
            </div>

            <div className="absolute left-0 top-20 max-w-[18rem] rounded-[1.5rem] bg-[rgba(22,17,13,0.72)] p-5 text-stone-100 shadow-[0_18px_45px_rgba(18,14,10,0.2)] backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                Room Note
              </p>
              <p className="mt-3 text-base leading-7 text-stone-100/90">
                The backdrop carries the atmosphere. The UI should feel like a
                few tools sitting inside the room, not a full dashboard laid on
                top of it.
              </p>
            </div>

            <div className="absolute left-[12%] top-[42%] rounded-[1.7rem] bg-[rgba(249,242,235,0.9)] p-6 shadow-[0_20px_45px_rgba(18,14,10,0.16)] backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
                Active Setup
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {appliedDurationMinutes} min
              </p>
              <p className="mt-1 text-base capitalize text-stone-700">
                {appliedSelectedSound} tone, {roomMood}
              </p>
              <p className="mt-4 max-w-[15rem] text-sm leading-6 text-stone-600">
                This card only changes when you click Apply, so it reflects the
                real active session instead of draft form input.
              </p>
            </div>

            <div className="absolute bottom-10 right-0 w-[18rem] rounded-[1.7rem] bg-[rgba(18,14,10,0.78)] p-6 text-stone-100 shadow-[0_22px_48px_rgba(18,14,10,0.22)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                  Session Timer
                </p>
                <span className="rounded-full border border-white/12 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-300">
                  {isRunning ? "running" : "paused"}
                </span>
              </div>
              <div className="mt-4 font-mono text-5xl font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
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
              <p className="mt-5 text-sm leading-6 text-stone-400">
                Active duration: {Math.round(activeDurationSeconds / 60)} min
              </p>
            </div>
          </div>
        </section>

        <aside className="order-2 rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,249,243,0.9),rgba(244,236,228,0.78))] p-5 shadow-[0_22px_45px_rgba(18,14,10,0.16)] backdrop-blur md:p-6 lg:order-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Room Mix
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                Shape the atmosphere
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleSound}
              className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                soundEnabled
                  ? "bg-stone-950 text-stone-100 hover:bg-stone-800"
                  : "bg-white/70 text-stone-700 hover:bg-white"
              }`}
            >
              {soundEnabled ? "Sound on" : "Enable sound"}
            </button>
          </div>

          <div className="mt-3 rounded-[1rem] bg-white/55 px-4 py-3 text-sm leading-6 text-stone-600">
            {audioStatus}
          </div>

          <div className="mt-5 grid gap-2 rounded-[1.3rem] bg-white/55 p-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="flex items-center justify-between gap-3 rounded-[1rem] px-2 py-2 text-sm text-stone-700">
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
            <label className="flex items-center justify-between gap-3 rounded-[1rem] px-2 py-2 text-sm text-stone-700">
              <span>save preferences</span>
              <input
                type="checkbox"
                checked={savePreferences}
                onChange={(event) => setSavePreferences(event.target.checked)}
                className="h-5 w-5 rounded border-stone-400 text-stone-900 focus:ring-stone-500"
              />
            </label>
          </div>

          <div className="mt-5 space-y-5">
            {tracks.map((track) => (
              <div key={track.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-base font-medium text-stone-900">
                    {track.label}
                  </p>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    {track.value}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-stone-500">◔</span>
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
