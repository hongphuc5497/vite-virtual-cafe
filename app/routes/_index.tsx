import { useEffect, useState } from "react";
import { useSessionTimer } from "~/hooks/useSessionTimer";
import { useAudioManager } from "~/hooks/useAudioManager";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { VirtualCafeIntro } from "~/components/VirtualCafeIntro";
import { SessionTimer } from "~/components/SessionTimer";
import { RoomMixControls } from "~/components/RoomMixControls";
import { BackdropOverlay } from "~/components/BackdropOverlay";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_TRACKS,
  STORAGE_KEY,
} from "~/constants/audioConfig";
import type { SavedPreferences } from "~/types/audio";

export default function Index() {
  // Initialize state from localStorage
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [draftDurationMinutes, setDraftDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [appliedDurationMinutes, setAppliedDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );

  // Load from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as SavedPreferences;
      const savedDraft = parsed.draftDurationMinutes ?? parsed.durationMinutes ?? DEFAULT_DURATION_MINUTES;
      const savedApplied = parsed.appliedDurationMinutes ?? savedDraft;

      if (Array.isArray(parsed.tracks)) {
        setTracks(
          DEFAULT_TRACKS.map((track) => {
            const saved = parsed.tracks?.find((t) => t.label === track.label);
            return saved ? { ...track, value: saved.value } : track;
          })
        );
      }

      setDraftDurationMinutes(savedDraft);
      setAppliedDurationMinutes(savedApplied);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Custom hooks for business logic
  const timer = useSessionTimer(appliedDurationMinutes);
  const audio = useAudioManager(tracks);

  // Persist state to localStorage
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        draftDurationMinutes,
        appliedDurationMinutes,
        tracks,
        pausedTracks: audio.pausedTracks,
      } satisfies SavedPreferences)
    );
  }, [draftDurationMinutes, appliedDurationMinutes, tracks, audio.pausedTracks]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: () => (timer.isRunning ? timer.pause() : timer.start()),
    onVolumeIncrease: () =>
      setTracks((current) =>
        current.map((track) => ({
          ...track,
          value: Math.min(100, track.value + 5),
        }))
      ),
    onVolumeDecrease: () =>
      setTracks((current) =>
        current.map((track) => ({
          ...track,
          value: Math.max(0, track.value - 5),
        }))
      ),
  });

  // Derived values
  const strongestTrack = [...tracks].sort(
    (a, b) => b.value - a.value
  )[0];
  const sunlightLevel = tracks.find((t) => t.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;
  const roomMood = sunlightLevel >= 50 ? "soft daylight" : "after dark";

  // Handlers
  const handleToggleTimer = async () => {
    if (timer.isRunning) {
      timer.pause();
      return;
    }

    if (
      draftDurationMinutes !== appliedDurationMinutes ||
      timer.timeLeft === 0
    ) {
      setAppliedDurationMinutes(draftDurationMinutes);
      timer.setTimeLeft(draftDurationMinutes * 60);
    }

    if (!audio.soundEnabled) {
      await audio.initializeAudio();
    }

    timer.start();
  };

  const handleToggleTrackPause = async (label: string) => {
    await audio.toggleTrackPause(label);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-4 text-stone-950 md:px-7 md:py-6 lg:px-10"
      style={{
        backgroundImage: `url('/cafe-background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <BackdropOverlay backdropGlow={backdropGlow} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-[92rem] flex-col gap-5 lg:grid lg:grid-cols-[0.84fr_1.4fr_0.9fr] lg:items-start lg:gap-6">
        <section className="order-1 flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,248,241,0.9),rgba(245,233,223,0.78))] p-5 shadow-[0_18px_40px_rgba(22,16,12,0.16)] backdrop-blur md:p-6">
            <VirtualCafeIntro
              roomMood={roomMood}
              dominantTrack={strongestTrack.label}
            />

            <div className="mt-5 rounded-[1.6rem] bg-[rgba(20,15,12,0.76)] p-5 text-stone-100">
              <SessionTimer
                timeLeft={timer.timeLeft}
                isRunning={timer.isRunning}
                draftDurationMinutes={draftDurationMinutes}
                onStart={handleToggleTimer}
                onReset={() => {
                  timer.setTimeLeft(appliedDurationMinutes * 60);
                  timer.stop();
                }}
                onDurationChange={setDraftDurationMinutes}
                formatTime={timer.formatTime}
              />
            </div>
          </div>
        </section>

        <aside className="order-2 rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,249,243,0.9),rgba(244,236,228,0.78))] p-5 shadow-[0_22px_45px_rgba(18,14,10,0.16)] backdrop-blur md:p-6 lg:order-3">
          <RoomMixControls
            soundEnabled={audio.soundEnabled}
            tracks={tracks}
            pausedTracks={audio.pausedTracks}
            onToggleSound={audio.toggleSound}
            onTrackVolumeChange={(label, value) =>
              setTracks((current) =>
                current.map((track) =>
                  track.label === label ? { ...track, value } : track
                )
              )
            }
            onTrackPauseToggle={handleToggleTrackPause}
          />
        </aside>
      </div>
    </main>
  );
}
