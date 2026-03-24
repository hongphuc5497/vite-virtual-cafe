import { useEffect, useRef, useState } from "react";
import { DEFAULT_TRACKS, SOUND_URLS, TRACK_BASE_VOLUME } from "~/constants/audioConfig";
import type { MixerTrack } from "~/types/audio";

export function useAudioManager(tracks: MixerTrack[]) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pausedTracks, setPausedTracks] = useState<Record<string, boolean>>(
    Object.fromEntries(tracks.map((t) => [t.label, false]))
  );
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const initializedAudioRef = useRef(false);

  // Sync audio volumes when tracks change
  useEffect(() => {
    tracks.forEach((track) => {
      const audioElement = audioElementsRef.current.get(track.label);

      if (!audioElement) {
        return;
      }

      if (!soundEnabled || pausedTracks[track.label]) {
        audioElement.pause();
        return;
      }

      const normalizedValue = Math.pow(track.value / 100, 1.35);
      const targetVolume = Math.min(
        1,
        TRACK_BASE_VOLUME[track.label] * normalizedValue
      );

      audioElement.volume = targetVolume;
      if (audioElement.paused) {
        void audioElement.play().catch(() => {
          // Audio playback blocked by browser
        });
      }
    });
  }, [pausedTracks, soundEnabled, tracks]);

  // Cleanup audio elements on unmount
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
        DEFAULT_TRACKS.filter((track) => !pausedTracks[track.label]).map(
          async (track) => {
            const audioElement = audioElementsRef.current.get(track.label);

            if (!audioElement) {
              return;
            }

            const playPromise = audioElement.play();

            if (playPromise) {
              await playPromise;
            }
          }
        )
      );
    } catch {
      return false;
    }

    initializedAudioRef.current = true;
    setSoundEnabled(true);

    return true;
  };

  const toggleSound = async () => {
    if (!initializedAudioRef.current) {
      await initializeAudio();
      return;
    }

    if (soundEnabled) {
      audioElementsRef.current.forEach((audioElement) => {
        audioElement.pause();
      });
      setSoundEnabled(false);
      return;
    }

    await Promise.all(
      DEFAULT_TRACKS.filter((track) => !pausedTracks[track.label]).map(
        async (track) => {
          const audioElement = audioElementsRef.current.get(track.label);

          if (!audioElement) {
            return;
          }

          const playPromise = audioElement.play();

          if (playPromise) {
            await playPromise;
          }
        }
      )
    );
    setSoundEnabled(true);
  };

  const toggleTrackPause = async (label: string) => {
    const nextPaused = !pausedTracks[label];
    setPausedTracks((currentTracks) => ({
      ...currentTracks,
      [label]: nextPaused,
    }));

    const audioElement = audioElementsRef.current.get(label);
    if (!audioElement) {
      return;
    }

    if (nextPaused) {
      audioElement.pause();
      return;
    }

    if (!soundEnabled) {
      return;
    }

    try {
      const playPromise = audioElement.play();
      if (playPromise) {
        await playPromise;
      }
    } catch {
      // Audio playback failed silently
    }
  };

  const updateTrackVolume = (label: string, value: number) => {
    // This is handled by parent component updating tracks
  };

  return {
    soundEnabled,
    pausedTracks,
    initializeAudio,
    toggleSound,
    toggleTrackPause,
    updateTrackVolume,
  };
}
