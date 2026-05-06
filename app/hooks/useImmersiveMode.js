import { useState, useEffect, useCallback, useRef } from "react";

export function useImmersiveMode(isRunning) {
  const [showPanels, setShowPanels] = useState(true);
  const hideTimerRef = useRef(null);
  const isImmersive = isRunning && !showPanels;

  // When session starts, hide panels after a brief delay
  // When session stops, show panels immediately
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => setShowPanels(false), 600);
      return () => clearTimeout(timer);
    } else {
      setShowPanels(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }
  }, [isRunning]);

  // Escape key toggles panel visibility (only during session)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isRunning) {
        setShowPanels((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  // Auto-hide after 3s of inactivity (only when panels are shown during session)
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isRunning && showPanels) {
      hideTimerRef.current = setTimeout(() => setShowPanels(false), 3000);
    }
  }, [isRunning, showPanels]);

  // Reset the timer whenever showPanels changes
  useEffect(() => {
    resetHideTimer();
  }, [showPanels, resetHideTimer]);

  // Edge hover detection — bottom 10% of viewport reveals panels
  const handleMouseMove = useCallback(
    (e) => {
      if (!isRunning) return;
      const inBottomZone = e.clientY > window.innerHeight * 0.9;
      if (inBottomZone) {
        setShowPanels(true);
      }
      resetHideTimer();
    },
    [isRunning, resetHideTimer]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return { isImmersive, showPanels, setShowPanels };
}
