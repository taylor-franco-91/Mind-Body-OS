'use client';

export default function TodaysSession({
    aiActive,
    title,
    blocks,
    progressPct,
    ctaHref,         // <-- now optional
    locked,
    completed,
    isToday,
    reviewOnly,
    onComplete,      // <-- optional callback
}: {
    aiActive: boolean;
    title: string;
    blocks: { kind: string; detail: string }[];
    progressPct: number;
    ctaHref?: string;           // <-- make optional
    locked: boolean;
    completed: boolean;
    isToday: boolean;
    reviewOnly?: boolean;
    onComplete?: () => void;    // <-- optional
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-zinc-400">
                        {aiActive ? 'AI-Optimized Session' : 'Standard Session'}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                </div>

                {/* Right side controls */}
                {locked ? (
                    <span className="rounded-full bg-black/40 px-3 py-1 text-sm text-zinc-500 ring-1 ring-white/10">
                        Locked
                    </span>
                ) : completed ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-400/30">
                        Completed
                    </span>
                ) : reviewOnly ? (
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-300/30">
                        Review Only (Missed)
                    </span>
                ) : isToday ? (
                    ctaHref ? (
                        <a
                            href={ctaHref}
                            className="rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                        >
                            Start Workout
                        </a>
                    ) : onComplete ? (
                        <button
                            onClick={onComplete}
                            className="rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                        >
                            Start Workout
                        </button>
                    ) : null
                ) : null}
            </div>

            {/* Progress hint */}
            {isToday && !completed && !reviewOnly && (
                <div className="mt-3 text-xs text-zinc-400">{progressPct}% planned for today</div>
            )}

            {/* Blocks */}
            <div className="mt-4 grid gap-2">
                {blocks.map((b, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{b.kind}</div>
                        <div className="text-sm text-zinc-200">{b.detail}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
