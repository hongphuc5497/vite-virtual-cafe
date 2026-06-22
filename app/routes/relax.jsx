import { useEffect, useRef, useState } from "react";
import { useAudioManager } from "~/hooks/useAudioManager";
import { RoomMixControls } from "~/components/RoomMixControls";
import { BackdropOverlay } from "~/components/BackdropOverlay";
import { VibeSelector } from "~/components/VibeSelector";
import { SceneSelector } from "~/components/SceneSelector";
import { DEFAULT_SCENE, DEFAULT_TRACKS, STORAGE_KEY } from "~/constants/audioConfig";

export default function Relax() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [selectedScene, setSelectedScene] = useState(DEFAULT_SCENE);
  const loadedRef = useRef(false);

  const audio = useAudioManager(tracks);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.tracks)) {
        setTracks(
          DEFAULT_TRACKS.map((track) => {
            const s = parsed.tracks?.find((t) => t.label === track.label);
            return s ? { ...track, value: s.value } : track;
          })
        );
      }
      if (parsed.selectedScene) setSelectedScene(parsed.selectedScene);
      if (parsed.pausedTracks) {
        audio.setAllPausedTracks(parsed.pausedTracks);
      }
    } catch {
      /* ignore */
    }
    loadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : {};
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, tracks, pausedTracks: audio.pausedTracks, selectedScene })
    );
  }, [tracks, audio.pausedTracks, selectedScene]);

  const sunlightLevel = tracks.find((t) => t.label === "Sunny Day")?.value ?? 0;
  const backdropGlow = 0.14 + sunlightLevel / 260;

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
      style={{
        backgroundImage: `url('/virtual-cafe/cafe-background.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <BackdropOverlay backdropGlow={backdropGlow} scene={selectedScene} />
      <div className="cafe-atmosphere" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="reveal reveal-1 mb-9">
          <h1
            className="font-headline text-5xl font-light italic leading-[1.1] pb-1 md:text-6xl"
            style={{
              color: "rgba(237,240,228,0.96)",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 18px rgba(20,12,6,0.45)",
            }}
          >
            Ambient Sanctuary.
          </h1>
          <p
            className="mt-3 max-w-md font-body text-base"
            style={{ color: "rgba(167,182,169,0.82)" }}
          >
            No timer. No pressure. Just the room.
          </p>
        </div>

        <div
          className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start"
          data-testid="relax-ambient-player"
        >
          {/* Left column: Vibe + Scene */}
          <div className="reveal reveal-2 flex flex-col gap-5">
            <div className="surface-card p-6">
              <VibeSelector tracks={tracks} onApplyVibe={handleApplyVibe} />
            </div>
            <div className="surface-card p-6">
              <SceneSelector
                selectedScene={selectedScene}
                onSelect={setSelectedScene}
              />
            </div>
          </div>

          {/* Mixer */}
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
    </main>
  );
}
