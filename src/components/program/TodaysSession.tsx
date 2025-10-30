'use client';

type SessionStatus = 'idle' | 'in_progress' | 'complete';

export default function TodaysSession({
    aiActive,
    title,
    blocks,
    progressPct,
    locked,
    completed,
    isToday,
    reviewOnly,
    sessionStatus,       // ← NEW (required)
    onStart,             // ← optional: start handler
    onComplete,          // ← optional: complete handler
}: {
    aiActive: boolean;
    title: string;
    blocks: { kind: string; detail: string }[];
    progressPct: number;
    locked: boolean;
    completed: boolean;
    isToday: boolean;
    reviewOnly?: boolean;
    sessionStatus: SessionStatus;
    onStart?: () => void;
    onComplete?: () => void;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-zinc-400">
                        {aiActive ? 'AI-Optimized Session' : 'Standard Session'}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                </div>

                {/* Right-side status chip */}
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
                ) : null}
            </div>

            {/* Progress hint (only show for active today and not completed/missed) */}
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

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
                {/* Today only, not locked, not completed, not review-only */}
                {isToday && !locked && !completed && !reviewOnly && (
                    <>
                        {/* Primary left button: Start / In progress / Finished (read-only) */}
                        {sessionStatus === 'idle' && (
                            <button
                                onClick={onStart}
                                className="rounded-2xl px-4 py-2 text-sm font-semibold transition bg-gradient-to-r from-lime-400 to-cyan-400 text-black hover:opacity-90 active:opacity-80"
                            >
                                Start Workout
                            </button>
                        )}

                        {sessionStatus === 'in_progress' && (
                            <span className="rounded-2xl border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-200">
                                Workout in progress
                            </span>
                        )}

                        {sessionStatus === 'complete' && (
                            <span className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                                Workout finished
                            </span>
                        )}

                        {/* Secondary right button: Mark Complete (only when in progress) */}
                        {sessionStatus === 'in_progress' && (
                            <button
                                onClick={onComplete}
                                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                            >
                                Mark Complete
                            </button>
                        )}
                    </>
                )}

                {/* If the day is already completed (today or past), show finished badge */}
                {!isToday && completed && (
                    <span className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                        Workout finished
                    </span>
                )}
            </div>
        </div>
    );
}
