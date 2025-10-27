'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { todayKey as clockTodayKey } from '@/lib/programClock';

type Status = 'idle' | 'inProgress' | 'completed';
const LS_KEY = 'workoutState_v1';

const DAY_LABEL: Record<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN', string> = {
    MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday',
    FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday',
};

const DAY_TEMPLATE: Record<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN', { type: string; activity: string }> = {
    MON: { type: 'Upper', activity: 'Push Power' },
    TUE: { type: 'Mindset', activity: 'Meditation' },
    WED: { type: 'Lower', activity: 'Squat Focus' },
    THU: { type: 'Upper', activity: 'Pull Power' },
    FRI: { type: 'Full Body', activity: 'HIIT Circuit' },
    SAT: { type: 'Mindset', activity: 'Journaling' },
    SUN: { type: 'Recovery', activity: 'Active Rest' },
};

function defaultBlocks() {
    return [
        { kind: 'Warm-up', detail: '8-10 min mobility + activation' },
        { kind: 'Main', detail: 'Pull-ups 4x8-10 - Rows 4x10 - Face Pulls 3x15 - Curls 3x12' },
        { kind: 'Finisher', detail: 'Short EMOM - 6-8 min' },
        { kind: 'Cooldown', detail: 'Breath reset 2 min - light stretch' },
    ];
}

function fallbackTodayKey(): 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' {
    const d = new Date();
    return (['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const)[d.getDay()];
}

function resolveDayKey(raw: string | null): 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' {
    if (!raw || raw === 'TODAY') {
        try { return clockTodayKey(); } catch { return fallbackTodayKey(); }
    }
    const up = raw.toUpperCase();
    if (['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].includes(up)) return up as any;
    const byLabel: Record<string, any> = {
        MONDAY: 'MON', TUESDAY: 'TUE', WEDNESDAY: 'WED', THURSDAY: 'THU', FRIDAY: 'FRI', SATURDAY: 'SAT', SUNDAY: 'SUN'
    };
    return (byLabel[up] ?? fallbackTodayKey()) as any;
}

export default function LibraryPage() {
    const params = useSearchParams();
    const router = useRouter();

    const dayParam = params.get('day');
    const dayKey = useMemo(() => resolveDayKey(dayParam), [dayParam]);

    const [status, setStatus] = useState<Status>('idle');

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as { day: string; status: Status };
                if (parsed.day === dayKey) setStatus(parsed.status);
            }
        } catch { }
    }, [dayKey]);

    function setLS(next: Status) {
        localStorage.setItem(LS_KEY, JSON.stringify({ day: dayKey, status: next }));
        setStatus(next);
    }

    function finishAndReturn() {
        setLS('completed');
        router.push('/program?complete=1');
    }

    const session = useMemo(() => {
        const meta = DAY_TEMPLATE[dayKey];
        const title = `${DAY_LABEL[dayKey]}: ${meta.type} - ${meta.activity}`;
        return { title, blocks: defaultBlocks() };
    }, [dayKey]);

    return (
        <div className="p-8 text-white">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Workout Library · {DAY_LABEL[dayKey]}</h1>
                    <p className="mt-2 text-zinc-400">Form demos, cues, and timing live here.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
                    Status: <span className="font-semibold text-zinc-100">
                        {status === 'inProgress' ? 'in progress' : status}
                    </span>
                </div>
            </div>

            {/* Session Details */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-zinc-100">{session.title}</div>
                <div className="mt-3 space-y-3">
                    {session.blocks.map((b, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <div className="text-xs uppercase tracking-wide text-zinc-400">{b.kind}</div>
                            <div className="text-sm text-zinc-200 mt-1">{b.detail}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {/* Disabled indicator: Workout in progress */}
                    <button
                        disabled
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-emerald-300 cursor-not-allowed"
                        title="Workout in progress"
                    >
                        Workout in progress
                    </button>

                    {/* Action: Mark Complete (always clickable) */}
                    <button
                        onClick={finishAndReturn}
                        className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                    >
                        Mark Complete
                    </button>
                </div>
            </div>
        </div>
    );
}
