import { useEffect, useState } from "react";

interface JournalEntry {
  id: string;
  date: string;
  duration: number;
  vibe: string;
  mood: "focused" | "calm" | "energized" | "reflective";
  note: string;
}

const MOOD_ICONS: Record<JournalEntry["mood"], string> = {
  focused: "center_focus_strong",
  calm: "spa",
  energized: "bolt",
  reflective: "self_improvement",
};

const MOOD_COLORS: Record<JournalEntry["mood"], string> = {
  focused: "#8f4a00",
  calm: "#55612e",
  energized: "#835418",
  reflective: "#544438",
};

const DEMO_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    date: "2026-03-24",
    duration: 165,
    vibe: "Lo-fi Beats",
    mood: "focused",
    note: "Deep work on typography system. The Barista track kept me grounded.",
  },
  {
    id: "2",
    date: "2026-03-23",
    duration: 50,
    vibe: "Rainy Day",
    mood: "reflective",
    note: "Slow morning. Rain on the windows, coffee going cold.",
  },
  {
    id: "3",
    date: "2026-03-22",
    duration: 75,
    vibe: "Jazz Night",
    mood: "energized",
    note: "Late session. Fireplace at 70% — felt like a different city.",
  },
  {
    id: "4",
    date: "2026-03-21",
    duration: 25,
    vibe: "Nature",
    mood: "calm",
    note: "Short afternoon break. Sunshine and birdsong.",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(DEMO_ENTRIES);

  useEffect(() => {
    const saved = window.localStorage.getItem("analog-sanctuary-journal");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as JournalEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div
      className="min-h-[calc(100vh-57px)]"
      style={{ background: "#fefae0" }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Your Reflections
          </p>
          <h1
            className="mt-2 font-headline text-5xl font-light italic"
            style={{ color: "#1d1c0d", letterSpacing: "-0.02em" }}
          >
            The Journal
          </h1>
          <p className="mt-2 font-body text-base text-on-surface-variant">
            A record of your time in the sanctuary.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Focus Hours", value: totalHours, icon: "schedule" },
            { label: "Sessions", value: entries.length, icon: "coffee" },
            {
              label: "Avg Session",
              value: `${Math.round(totalMinutes / entries.length)}m`,
              icon: "timer",
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-xl p-5 shadow-[0_8px_24px_rgba(29,28,13,0.06)]"
              style={{ background: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-[20px] text-primary">
                {icon}
              </span>
              <p
                className="mt-2 font-headline text-3xl font-light"
                style={{ color: "#1d1c0d" }}
              >
                {value}
              </p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Entries — Polaroid-style cards */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl shadow-[0_8px_24px_rgba(29,28,13,0.06)]"
              style={{ background: "#ffffff" }}
            >
              {/* Top strip */}
              <div
                className="flex items-center justify-between gap-4 rounded-t-xl px-6 py-4"
                style={{ background: "#f8f4db" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ color: MOOD_COLORS[entry.mood] }}
                  >
                    {MOOD_ICONS[entry.mood]}
                  </span>
                  <p className="text-sm font-semibold capitalize text-on-surface">
                    {entry.mood}
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {formatDate(entry.date)}
                </p>
              </div>

              {/* Content — asymmetric padding (Polaroid) */}
              <div className="px-6 pb-8 pt-5">
                <p
                  className="font-headline text-lg font-light italic leading-relaxed"
                  style={{ color: "#1d1c0d" }}
                >
                  "{entry.note}"
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: "#ffdcc4", color: "#8f4a00" }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      schedule
                    </span>
                    {formatDuration(entry.duration)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: "#f2efd5", color: "#544438" }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      music_note
                    </span>
                    {entry.vibe}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-on-surface-variant">
          Sessions are logged automatically when your timer completes.
        </p>
      </div>
    </div>
  );
}
