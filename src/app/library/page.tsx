'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { addCompleted, loadWeekState, saveWeekState, isCompleted, isMissed } from '@/lib/programStorage';
import { DOW_KEYS } from '@/lib/programClock';

type DayKey = typeof DOW_KEYS[number];

const DAY_LABEL: Record<DayKey, string> = {
    MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday',
    FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday'
};

export default function LibraryPage() {
    const router = useRouter();
    const sp = useSearchParams();
    const week = Number(sp.get('week') || '1');
    const day = (sp.get('day') || 'MON') as DayKey;

    const completed = isCompleted(week, day);
    const missed = isMissed(week, day);
    const [phase, setPhase] = useState<'in_progress' | 'completed'>(completed ? 'completed' : 'in_progress');

    const title = useMemo(() => `${DAY_LABEL[day]} · Workout Library`, [day]);

    const blocks = [
        { kind: 'Warm-up', detail: '8–10 min mobility + activation' },
        { kind: 'Main', detail: 'Pull-ups 4×8–10 · Rows 4×10 · Face Pulls 3×15 · Curls 3×12' },
        { kind: 'Finisher', detail: 'Short EMOM · 6–8 min' },
        { kind: 'Cooldown', detail: 'Breath reset 2 min · light stretch' },
    ];

    function handleComplete() {
        if (missed || completed) return;
        addCompleted(week, day);
        const state = loadWeekState(week);
        state.missed = state.missed.filter(d => d !== day);
        saveWeekState(week, state);
        setPhase('completed');
        window.dispatchEvent(new CustomEvent('os:workout-completed', { detail: { week, day } }));
    }

    return (
        <div className="p-8 text-white">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>

                {missed ? (
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-300/30">
                        Review Only (Missed)
                    </span>
                ) : phase === 'completed' ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-400/30">
                        Workout complete
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/15">
                            Workout in progress
                        </span>
                        <button
                            type="button"
                            onClick={handleComplete}
                            className="rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90 active:opacity-80"
                        >
                            Mark Complete
                        </button>
                    </div>
                )}
            </div>

            {/* Example library content */}
            <div className="grid gap-3">
                {blocks.map((b, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{b.kind}</div>
                        <div className="text-sm text-zinc-200">{b.detail}</div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => router.push('/program')}
                    className="rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/15 hover:bg-white/15"
                >
                    Back to Program
                </button>
            </div>
        </div>
    );
}
