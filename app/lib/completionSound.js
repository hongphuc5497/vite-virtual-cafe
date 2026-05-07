/**
 * Play a short ascending chime using the Web Audio API.
 * Silently no-ops if AudioContext is unavailable.
 * Browser-only — call only from useEffect or event handlers.
 */
export function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Major chord arpeggio: C5 → E5 → G5 → C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const noteDuration = 0.15;
    const noteGap = 0.08;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + i * (noteDuration + noteGap);
      const endTime = startTime + noteDuration + 0.3;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(endTime);
    });

    const totalDuration = notes.length * (noteDuration + noteGap) + 0.3;
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, totalDuration * 1000 + 100);
  } catch {
    // AudioContext unavailable or user gesture required — silently skip
  }
}
