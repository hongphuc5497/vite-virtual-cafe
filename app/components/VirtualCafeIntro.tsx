export interface VirtualCafeIntroProps {
  roomMood: string;
  dominantTrack: string;
}

export function VirtualCafeIntro({ roomMood, dominantTrack }: VirtualCafeIntroProps) {
  return (
    <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,248,241,0.9),rgba(245,233,223,0.78))] p-5 shadow-[0_18px_40px_rgba(22,16,12,0.16)] backdrop-blur md:p-6">
      <p className="text-[11px] uppercase tracking-[0.45em] text-stone-500">
        Virtual Cafe
      </p>
      <h1 className="mt-4 max-w-[4.5ch] font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-6xl">
        Stay in the room.
      </h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-stone-700">
        Set a session length, press start, and let the room run. The
        backdrop stays visible while the timer and sound controls float on
        top of it.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-600">
        <span className="rounded-full bg-white/55 px-3 py-2">
          {roomMood}
        </span>
        <span className="rounded-full bg-white/55 px-3 py-2">
          {dominantTrack}
        </span>
        <span className="rounded-full bg-white/55 px-3 py-2">
          one-page flow
        </span>
      </div>
    </div>
  );
}
