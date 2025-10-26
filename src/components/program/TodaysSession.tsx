'use client';

import { useEffect, useState } from 'react';

type Phase = 'idle' | 'in_progress' | 'completed';

export default function TodaysSession({
    aiActive,
    title,
    blocks,
    progressPct,
    locked,
    completed,
    isToday,
    reviewOnly,
    onStart,
    onComplete,
}: {
    aiActive: boolean;
    title: string;
    blocks: { kind: string; detail: string }[];
    progressPct: number;
    locked: boolean;
    completed: boolean;
    isToday: boolean;
    reviewOnly?: boolean;
    onStart?: () => void;
    onComplete?: () => void;
}) {
    const [phase, setPhase] = useState<Phase>('idle');

    useEffect(() => {
        if (completed) setPhase('completed');
        else setPhase('idle');
    }, [title, completed, isToday]);

    const canActToday = isToday && !completed && !reviewOnly && !locked;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-zinc-400">
                        {aiActive ? 'AI-Optimized Session' : 'Standard Session'}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                </div>

                {locked ? (
                    <span className="rounded-full bg-black/40 px-3 py-1 text-sm text-zinc-500 ring-1 ring-white/10">
                        Locked
                    </span>
                ) : completed || phase === 'completed' ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-400/30">
                        Workout complete
                    </span>
                ) : reviewOnly ? (
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-300/30">
                        Review Only (Missed)
                    </span>
                ) : canActToday ? (
                    <div className="flex items-center gap-2">
                        {phase === 'idle' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhase('in_progress');
                                        onStart?.();
                                    }}
                                    className="rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                                >
                                    Start Workout
                                </button>
                                <button
                                    disabled
                                    className="rounded-xl bg-white/10 px-3 py-1.5 text-sm text-zinc-300 ring-1 ring-white/15 cursor-not-allowed"
                                >
                                    Mark Complete
                                </button>
                            </>
                        )}

                        {phase === 'in_progress' && (
                            <>
                                <span className="rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/15">
                                    Workout in progress
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhase('completed');
                                        onComplete?.();
                                    }}
                                    className="rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                                >
                                    Mark Complete
                                </button>
                            </>
                        )}
                    </div>
                ) : null}
            </div>

            {!completed && phase !== 'completed' && isToday && !reviewOnly && (
                <div className="mt-3 text-xs text-zinc-400">{progressPct}% planned for today</div>
            )}

            <div className="mt-4 grid gap-2">
                {blocks.map((b, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{b.kind}</div>
                        <div className="text-sm text-zinc-200">{b.detail}</div>
                    </div>
                ))}
            </div>

            {/* Echo when finished locally (in case parent completion is async) */}
            {phase === 'completed' && !completed && (
                <div className="mt-3 text-xs text-emerald-300">Workout finished</div>
            )}
        </div>
    );
}
