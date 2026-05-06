import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionTimer(initialDurationMinutes) {
  const [timeLeft, setTimeLeft] = useState(initialDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const sessionDurationRef = useRef(initialDurationMinutes * 60);
  const pausedRemainingRef = useRef(null);

  // Sync session duration when prop changes (only when not running)
  useEffect(() => {
    if (!isRunning) {
      sessionDurationRef.current = initialDurationMinutes * 60;
    }
  }, [initialDurationMinutes, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, sessionDurationRef.current - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setIsRunning(false);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    intervalRef.current = setInterval(tick, 250);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }, []);

  const start = useCallback(() => {
    if (pausedRemainingRef.current !== null) {
      sessionDurationRef.current = pausedRemainingRef.current;
      pausedRemainingRef.current = null;
      setTimeLeft(sessionDurationRef.current);
    }
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    const elapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;
    pausedRemainingRef.current = Math.max(0, sessionDurationRef.current - elapsed);
    setTimeLeft(pausedRemainingRef.current);
    setIsRunning(false);
    startTimeRef.current = null;
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    pausedRemainingRef.current = null;
    startTimeRef.current = null;
    sessionDurationRef.current = initialDurationMinutes * 60;
    setTimeLeft(initialDurationMinutes * 60);
  }, [initialDurationMinutes]);

  const reset = useCallback((durationMinutes) => {
    setIsRunning(false);
    pausedRemainingRef.current = null;
    startTimeRef.current = null;
    const seconds = durationMinutes * 60;
    sessionDurationRef.current = seconds;
    setTimeLeft(seconds);
  }, []);

  const setTimeLeftDirect = useCallback((seconds) => {
    setTimeLeft(seconds);
    sessionDurationRef.current = seconds;
    pausedRemainingRef.current = null;
    startTimeRef.current = null;
  }, []);

  return {
    timeLeft,
    isRunning,
    formatTime,
    start,
    pause,
    stop,
    reset,
    setTimeLeft: setTimeLeftDirect,
  };
}
