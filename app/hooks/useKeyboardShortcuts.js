import { useEffect } from "react";

export function useKeyboardShortcuts({ onTogglePlay, onVolumeIncrease, onVolumeDecrease }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox"
      ) {
        return;
      }

      // Space to toggle play/pause
      if (event.code === "Space") {
        event.preventDefault();
        onTogglePlay?.();
      }
      // Up arrow to increase volume
      if (event.code === "ArrowUp") {
        event.preventDefault();
        onVolumeIncrease?.();
      }
      // Down arrow to decrease volume
      if (event.code === "ArrowDown") {
        event.preventDefault();
        onVolumeDecrease?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlay, onVolumeIncrease, onVolumeDecrease]);
}
