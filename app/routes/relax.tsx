import { useEffect, useRef, useState } from "react";
import { useAudioManager } from "~/hooks/useAudioManager";
import { RoomMixControls } from "~/components/RoomMixControls";
import { BackdropOverlay } from "~/components/BackdropOverlay";
import { VibeSelector } from "~/components/VibeSelector";
import { DEFAULT_SCENE, DEFAULT_TRACKS, STORAGE_KEY } from "~/constants/audioConfig";
import type { MixerTrack, SavedPreferences, SceneId } from "~/types/audio";

export default function Relax() {
  let initialPausedTracks: Record<string, boolean> | undefined;
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedPreferences;
        if (parsed.pausedTracks) {
          initialPausedTracks = parsed.pausedTracks;
        }
      }
    } catch { /* ignore */ }
  }

  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [selectedScene, setSelectedScene] = useState<SceneId>(DEFAULT_SCENE);
  const loadedRef = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedPreferences;
      if (Array.isArray(parsed.tracks)) {
        setTracks(
          DEFAULT_TRACKS.map((track) => {
            const s = parsed.tracks?.find((t) => t.label === track.label);
            return s ? { ...track, value: s.value } : track;
          })
        );
      }
      if (parsed.selectedScene) setSelectedScene(parsed.selectedScene);
    } catch {
      /* ignore */
    }
    loadedRef.current = true;
  }, []);

  const audio = useAudioManager(tracks, initialPausedTracks);

  useEffect(() => {
    if (!loadedRef.current) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : {};
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, tracks, pausedTracks: audio.pausedTracks })
    );
  }, [tracks, audio.pausedTracks]);

  const sunlightLevel = tracks.find((t) => t.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;

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
      <BackdropOverlay backdropGlow={backdropGlow} scene={selectedScene} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1
            className="font-headline text-5xl font-light italic"
            style={{ color: "rgba(255,250,224,0.95)", letterSpacing: "-0.02em" }}
          >
            Ambient Sanctuary.
          </h1>
          <p
            className="mt-2 font-body text-base"
            style={{ color: "rgba(255,250,224,0.6)" }}
          >
            No timer. No pressure. Just the room.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          {/* Vibe Selector */}
          <div
            className="rounded-2xl p-6 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
            }}
          >
            <VibeSelector tracks={tracks} onApplyVibe={handleApplyVibe} />
          </div>

          {/* Mixer */}
          <div
            className="rounded-2xl p-6 shadow-[0_24px_40px_rgba(29,28,13,0.08)]"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
            }}
          >
            <RoomMixControls
              soundEnabled={audio.soundEnabled}
              tracks={tracks}
              pausedTracks={audio.pausedTracks}
              trackErrors={audio.trackErrors}
              onToggleSound={audio.toggleSound}
              onTrackVolumeChange={(label, value) =>
                setTracks((current) =>
                  current.map((track) =>
                    track.label === label ? { ...track, value } : track
                  )
                )
              }
              onTrackPauseToggle={(label) => audio.toggleTrackPause(label)}
              onTrackRetry={(label: string) => audio.retryTrack(label)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
