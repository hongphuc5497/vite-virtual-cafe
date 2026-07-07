import { useEffect, useState } from "react";
import { useSessionTimer } from "~/hooks/useSessionTimer";
import { useAudioManager } from "~/hooks/useAudioManager";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { detectVibeName, detectMood, writeSessionEntry } from "~/lib/session";
import { playCompletionChime } from "~/lib/completionSound";
import { CelebrationOverlay } from "~/components/CelebrationOverlay";
import { SessionTimer } from "~/components/SessionTimer";
import { RoomMixControls } from "~/components/RoomMixControls";

import { VibeSelector } from "~/components/VibeSelector";
import { SceneSelector } from "~/components/SceneSelector";
import { ImmersiveTransition } from "~/components/ImmersiveTransition";
import { useImmersiveMode } from "~/hooks/useImmersiveMode";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SCENE,
  DEFAULT_TRACKS,
  STORAGE_KEY,
} from "~/constants/audioConfig";

export default function Index() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [draftDurationMinutes, setDraftDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [appliedDurationMinutes, setAppliedDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES
  );
  const [selectedScene, setSelectedScene] = useState(DEFAULT_SCENE);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
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
      if (parsed.selectedScene) setSelectedScene(parsed.selectedScene);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const timer = useSessionTimer(appliedDurationMinutes);
  const audio = useAudioManager(tracks);

  // Timer completion detection: when timer hits 0, build session entry,
  // write to localStorage (save-on-show per D-03), and show celebration overlay.
  // lastSession guards against duplicate entries when showCelebration is dismissed
  // (effect re-fires because showCelebration goes false→true transition).
  // Intentionally omitted from deps: adding lastSession would re-trigger endlessly.
  useEffect(() => {
    if (timer.timeLeft !== 0 || timer.isRunning || showCelebration || lastSession) {
      return;
    }

    const vibeName = detectVibeName(tracks);
    const moodLabel = detectMood(tracks, vibeName);

    const entry = {
      date: new Date().toISOString(),
      durationMinutes: appliedDurationMinutes,
      vibe: vibeName,
      mood: moodLabel,
      tracksSnapshot: Object.fromEntries(
        tracks.map((t) => [t.label, t.value])
      ),
    };

    writeSessionEntry(entry);
    setLastSession(entry);
    setShowCelebration(true);
    playCompletionChime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.timeLeft, timer.isRunning, showCelebration, appliedDurationMinutes, tracks]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        draftDurationMinutes,
        appliedDurationMinutes,
        tracks,
        pausedTracks: audio.pausedTracks,
        selectedScene,
      })
    );
  }, [draftDurationMinutes, appliedDurationMinutes, tracks, audio.pausedTracks, selectedScene]);

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

  const immersive = useImmersiveMode(timer.isRunning);

  // Panels are visible when: not in immersive mode, OR user revealed them, OR celebration is showing
  const panelsVisible = immersive.showPanels || showCelebration;

  const handleToggleTimer = async () => {
    // Reset celebration state when starting a new session from a completed timer
    if (!timer.isRunning && timer.timeLeft === 0) {
      setShowCelebration(false);
    }
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

  const handleDismissCelebration = () => {
    setShowCelebration(false);
  };

  const handleApplyVibe = (preset) => {
    setTracks((current) =>
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
      style={{ background: "var(--color-background-body)" }}
    >

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        {/* Hero text - assembles on load, slides up + fades during immersive mode */}
        <div className="reveal reveal-1 mb-9">
          <h1
            className="font-headline text-5xl font-semibold italic leading-[1.1] pb-1 md:text-6xl"
            style={{
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Stay in the room.
          </h1>
          <p
            className="mt-3 max-w-md font-body text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Set a session length, press start, and let the room breathe around
            you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Timer + Vibe — slides in from the left */}
          <div className="reveal reveal-2 flex flex-col gap-5">
            {/* Session Timer card — the lit hero */}
            <div className="surface-card surface-hero p-6">
              <SessionTimer
                timeLeft={timer.timeLeft}
                totalSeconds={appliedDurationMinutes * 60}
                isRunning={timer.isRunning}
                draftDurationMinutes={draftDurationMinutes}
                onStart={handleToggleTimer}
                onReset={() => {
                  setShowCelebration(false);
                  timer.setTimeLeft(appliedDurationMinutes * 60);
                  timer.stop();
                }}
                onDurationChange={setDraftDurationMinutes}
                formatTime={timer.formatTime}
              />
            </div>

            {/* Vibe Selector card */}
            <div className="surface-card p-6">
              <VibeSelector tracks={tracks} onApplyVibe={handleApplyVibe} />
            </div>

            {/* Scene Selector card */}
            <div className="surface-card p-6">
              <SceneSelector
                selectedScene={selectedScene}
                onSelect={setSelectedScene}
              />
            </div>
          </div>

          {/* Right column: Mixer — slides in from the right */}
          <div className="surface-card reveal reveal-3 p-6">
            <RoomMixControls
              soundEnabled={audio.soundEnabled}
              tracks={tracks}
              pausedTracks={audio.pausedTracks}
              trackErrors={audio.trackErrors}
              allTracksFailed={audio.allTracksFailed}
              onToggleSound={audio.toggleSound}
              onTrackVolumeChange={(label, value) =>
                setTracks((current) =>
                  current.map((track) =>
                    track.label === label ? { ...track, value } : track
                  )
                )
              }
              onTrackPauseToggle={(label) => audio.toggleTrackPause(label)}
              onTrackRetry={(label) => audio.retryTrack(label)}
            />
          </div>
        </div>
      </div>

      <ImmersiveTransition
        isImmersive={immersive.isImmersive}
        showPanels={panelsVisible}
        formatTime={timer.formatTime}
        timeLeft={timer.timeLeft}
        totalSeconds={appliedDurationMinutes * 60}
      />

      {lastSession && (
        <CelebrationOverlay
          session={lastSession}
          show={showCelebration}
          onDismiss={handleDismissCelebration}
        />
      )}
    </main>
  );
}
