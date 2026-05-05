import { useEffect, useRef, useState } from "react";
import { DEFAULT_TRACKS, SOUND_URLS, TRACK_BASE_VOLUME } from "~/constants/audioConfig";

export function useAudioManager(tracks, initialPausedTracks) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pausedTracks, setPausedTracks] = useState(
    initialPausedTracks ?? Object.fromEntries(tracks.map((t) => [t.label, false]))
  );
  const [trackErrors, setTrackErrors] = useState({});
  const audioElementsRef = useRef(new Map());
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
          setTrackErrors((prev) => ({ ...prev, [track.label]: true }));
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
        audioElement.onerror = () => {
          setTrackErrors((prev) => ({ ...prev, [track.label]: true }));
        };
        audioElementsRef.current.set(track.label, audioElement);
      });
    }

    await Promise.all(
      DEFAULT_TRACKS.filter((track) => !pausedTracks[track.label]).map(
        async (track) => {
          const el = audioElementsRef.current.get(track.label);

          if (!el) {
            return;
          }

          try {
            const p = el.play();
            if (p) await p;
            setTrackErrors((prev) => ({ ...prev, [track.label]: false }));
          } catch {
            setTrackErrors((prev) => ({ ...prev, [track.label]: true }));
          }
        }
      )
    );

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

  const toggleTrackPause = async (label) => {
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

    setTrackErrors((prev) => ({ ...prev, [label]: false }));

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

  const retryTrack = async (label) => {
    const el = audioElementsRef.current.get(label);
    if (!el) return;
    try {
      el.load();
      const p = el.play();
      if (p) await p;
      setTrackErrors((prev) => ({ ...prev, [label]: false }));
    } catch {
      /* error remains */
    }
  };

  const setAllPausedTracks = (paused) => {
    setPausedTracks(paused);
  };

  return {
    soundEnabled,
    pausedTracks,
    trackErrors,
    initializeAudio,
    toggleSound,
    toggleTrackPause,
    retryTrack,
    setAllPausedTracks,
  };
}
