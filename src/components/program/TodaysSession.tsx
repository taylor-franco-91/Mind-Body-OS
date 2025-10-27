'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Block = { kind: string; detail: string };

export default function TodaysSession({
    aiActive,
    title,
    blocks,
    progressPct,
    ctaHref,             // keep prop to satisfy callers (unused here)
    locked,
    completed,
    isToday,
    reviewOnly,
    onComplete,          // Program passes this for TODAY completion
    dayKey,              // <-- ADD: e.g. 'FRI' so Library knows which day
}: {
    aiActive: boolean;
    title: string;
    blocks: Block[];
    progressPct: number;
    ctaHref?: string;
    locked: boolean;
    completed: boolean;
    isToday: boolean;
    reviewOnly?: boolean;
    onComplete?: () => void;
    dayKey: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
}) {
    const router = useRouter();
    const LS_KEY = 'workoutState_v1';
    type WorkoutState = { day: string; status: 'idle' | 'inProgress' | 'completed' };

    const [status, setStatus] = useState<WorkoutState['status']>('idle');

    // hydrate status from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as WorkoutState;
                if (parsed.day === dayKey) setStatus(parsed.status);
                else setStatus('idle');
            } else {
                setStatus('idle');
            }
        } catch {
            setStatus('idle');
        }
    }, [dayKey]);

    function setLS(next: WorkoutState) {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        setStatus(next.status);
    }

    function handleStart() {
        // mark in-progress + go to library for this day
        setLS({ day: dayKey, status: 'inProgress' });
        router.push(`/library?day=${dayKey}`);
    }

    function handleComplete() {
        // mark completed locally + call parent to record completion
        setLS({ day: dayKey, status: 'completed' });
        onComplete?.();
    }

    const canAct = isToday && !locked && !reviewOnly;
    const showButtons = canAct && !completed;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-zinc-400">
                        {aiActive ? 'AI-Optimized Session' : 'Standard Session'}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                    {isToday && !completed && !reviewOnly && (
                        <div className="mt-1 text-xs text-zinc-400">{progressPct}% planned for today</div>
                    )}
                </div>

                {/* Right status chips (locked/missed/completed) */}
                {locked ? (
                    <span className="rounded-full bg-black/40 px-3 py-1 text-sm text-zinc-500 ring-1 ring-white/10">
                        Locked
                    </span>
                ) : reviewOnly ? (
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-300/30">
                        Review Only (Missed)
                    </span>
                ) : completed ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-400/30">
                        Workout complete
                    </span>
                ) : null}
            </div>

            {/* Blocks */}
            <div className="mt-4 grid gap-2">
                {blocks.map((b, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{b.kind}</div>
                        <div className="text-sm text-zinc-200">{b.detail}</div>
                    </div>
                ))}
            </div>

            {/* Two-button control row */}
            {showButtons && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {/* Left button reflects current status */}
                    {status === 'inProgress' ? (
                        <button
                            className="rounded-2xl bg-zinc-700/60 px-4 py-2 text-sm font-semibold text-zinc-200 ring-1 ring-white/10"
                            onClick={() => router.push(`/library?day=${dayKey}`)}
                            title="Continue in Library"
                        >
                            Workout in progress
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            className="rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                        >
                            Start Workout
                        </button>
                    )}

                    {/* Right button highlights once inProgress */}
                    <button
                        onClick={handleComplete}
                        disabled={status !== 'inProgress'}
                        className={
                            status === 'inProgress'
                                ? 'rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90'
                                : 'rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 cursor-not-allowed'
                        }
                        title={status === 'inProgress' ? 'Mark today complete' : 'Start workout to enable'}
                    >
                        Mark Complete
                    </button>
                </div>
            )}
        </div>
    );
}
