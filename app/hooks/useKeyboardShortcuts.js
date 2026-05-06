import { useEffect } from "react";

export function useKeyboardShortcuts(callbacks) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      // Space to toggle play/pause
      if (event.code === "Space") {
        event.preventDefault();
        callbacks.onTogglePlay?.();
      }
      // Up arrow to increase volume
      if (event.code === "ArrowUp") {
        event.preventDefault();
        callbacks.onVolumeIncrease?.();
      }
      // Down arrow to decrease volume
      if (event.code === "ArrowDown") {
        event.preventDefault();
        callbacks.onVolumeDecrease?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callbacks]);
}
