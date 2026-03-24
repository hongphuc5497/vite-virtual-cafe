import { useEffect, useState } from "react";
import { useSessionTimer } from "~/hooks/useSessionTimer";
import { useAudioManager } from "~/hooks/useAudioManager";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { SessionTimer } from "~/components/SessionTimer";
import { RoomMixControls } from "~/components/RoomMixControls";
import { BackdropOverlay } from "~/components/BackdropOverlay";
import { VibeSelector } from "~/components/VibeSelector";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_TRACKS,
  STORAGE_KEY,
} from "~/constants/audioConfig";
import type { MixerTrack, SavedPreferences } from "~/types/audio";

export default function Index() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [draftDurationMinutes, setDraftDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [appliedDurationMinutes, setAppliedDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedPreferences;
      const savedDraft =
        parsed.draftDurationMinutes ??
        parsed.durationMinutes ??
        DEFAULT_DURATION_MINUTES;
      const savedApplied = parsed.appliedDurationMinutes ?? savedDraft;

      if (Array.isArray(parsed.tracks)) {
        setTracks(
          DEFAULT_TRACKS.map((track) => {
            const s = parsed.tracks?.find((t) => t.label === track.label);
            return s ? { ...track, value: s.value } : track;
          })
        );
      }

      setDraftDurationMinutes(savedDraft);
      setAppliedDurationMinutes(savedApplied);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const timer = useSessionTimer(appliedDurationMinutes);
  const audio = useAudioManager(tracks);

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

  const sunlightLevel = tracks.find((t) => t.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;

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

  const handleApplyVibe = (preset: Record<string, number>) => {
    setTracks((current: MixerTrack[]) =>
      current.map((track) =>
        preset[track.label] !== undefined
          ? { ...track, value: preset[track.label] }
          : track
      )
    );
  };

  return (
    <main
      className="relative min-h-[calc(100vh-57px)] overflow-hidden"
      style={{
        backgroundImage: `url('/cafe-background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <BackdropOverlay backdropGlow={backdropGlow} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Hero text */}
        <div className="mb-8">
          <h1
            className="font-headline text-5xl font-light italic"
            style={{ color: "rgba(255,250,224,0.95)", letterSpacing: "-0.02em" }}
          >
            Stay in the room.
          </h1>
          <p
            className="mt-2 font-body text-base"
            style={{ color: "rgba(255,250,224,0.6)" }}
          >
            Set a session length, press start, and let the room breathe around
            you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Timer + Vibe */}
          <div className="flex flex-col gap-5">
            {/* Session Timer card */}
            <div
              className="rounded-2xl p-6 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
              style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}
            >
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

            {/* Vibe Selector card */}
            <div
              className="rounded-2xl p-6 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
              style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}
            >
              <VibeSelector tracks={tracks} onApplyVibe={handleApplyVibe} />
            </div>
          </div>

          {/* Right column: Mixer */}
          <div
            className="rounded-2xl p-6 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}
          >
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
              onTrackPauseToggle={(label) => audio.toggleTrackPause(label)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
