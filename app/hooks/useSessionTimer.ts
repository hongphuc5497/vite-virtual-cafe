import { useEffect, useRef, useState } from "react";

export function useSessionTimer(initialDurationMinutes: number) {
  const [timeLeft, setTimeLeft] = useState(initialDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

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

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const stop = () => {
    setIsRunning(false);
    setTimeLeft(initialDurationMinutes * 60);
  };
  const reset = (durationMinutes: number) => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  return {
    timeLeft,
    isRunning,
    formatTime,
    start,
    pause,
    stop,
    reset,
    setTimeLeft,
  };
}
