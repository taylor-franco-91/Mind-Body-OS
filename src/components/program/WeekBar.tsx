'use client';

export default function WeekBar({
    currentWeek,
    totalWeeks,
    unlockedThroughWeek,
    onSelect,
}: {
    currentWeek: number;
    totalWeeks: number;
    unlockedThroughWeek: number; // weeks > this are locked
    onSelect: (w: number) => void;
}) {
    const items = Array.from({ length: totalWeeks }, (_, i) => i + 1);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-zinc-400">Timeline</div>
                <div className="text-xs text-zinc-400">1–{totalWeeks}</div>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
                {items.map((w) => {
                    const isNow = w === currentWeek;
                    const past = w < currentWeek;
                    const locked = w > unlockedThroughWeek;

                    const base = `relative h-8 rounded-lg text-xs font-semibold ring-1 transition`;
                    const cls = locked
                        ? 'bg-black/20 text-zinc-600 ring-white/10 cursor-not-allowed'
                        : isNow
                            ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-black ring-lime-300'
                            : past
                                ? 'bg-white/10 text-zinc-200 ring-white/15'
                                : 'bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10';

                    return (
                        <button
                            key={w}
                            onClick={() => !locked && onSelect(w)}
                            className={`${base} ${cls}`}
                            title={locked ? `Week ${w} (locked)` : `Week ${w}`}
                            aria-disabled={locked}
                        >
                            W{w}
                            {isNow && !locked && (
                                <span className="absolute -top-2 right-1 rounded-full bg-emerald-400/90 px-1.5 py-0.5 text-[10px] font-bold text-black">
                                    Today
                                </span>
                            )}
                            {locked && (
                                <span className="absolute -top-2 right-1 rounded-full bg-zinc-700/80 px-1.5 py-0.5 text-[10px] font-bold text-white/80">
                                    Locked
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
