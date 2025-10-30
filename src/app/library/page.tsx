'use client';

import { useEffect, useMemo, useState } from 'react';
import { EXERCISES } from '@/lib/exercises';
import dynamic from 'next/dynamic';

// Load the 3D avatar only on the client to avoid hydration issues
const Avatar3D = dynamic(() => import('@/components/library/Avatar3D'), { ssr: false });

type SessionStatus = 'idle' | 'in_progress' | 'complete';
type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

type ActiveSession = {
    week: number;
    dayKey: DayKey;
    status: SessionStatus;
    exerciseIds: string[];
};

export default function LibraryPage() {
    const [session, setSession] = useState<ActiveSession | null>(null);

    // Load once on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem('activeSession');
            if (!raw) return;
            setSession(JSON.parse(raw));
        } catch {
            /* noop */
        }
    }, []);

    const exercises = useMemo(() => {
        if (!session) return [];
        return (session.exerciseIds || []).map((id) => ({
            id,
            title: EXERCISES[id]?.title ?? id,
            video: EXERCISES[id]?.video ?? null,
            cues: EXERCISES[id]?.cues ?? [],
        }));
    }, [session]);

    function updateStatus(next: SessionStatus) {
        if (!session) return;
        const updated = { ...session, status: next };
        setSession(updated);
        try {
            localStorage.setItem('activeSession', JSON.stringify(updated));
        } catch {
            /* noop */
        }
    }

    if (!session) {
        return (
            <div className="p-8 text-white">
                <h1 className="text-2xl font-bold">Workout Library</h1>
                <p className="mt-2 text-zinc-400">No active session. Start today’s workout from the Program page.</p>
            </div>
        );
    }

    const inProgress = session.status === 'in_progress';
    const isComplete = session.status === 'complete';
    const avatarStatus: SessionStatus = isComplete ? 'complete' : inProgress ? 'in_progress' : 'idle';

    return (
        <div className="p-8 text-white">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Workout Library</h1>
                    <p className="mt-1 text-zinc-400">
                        Week {session.week} · {session.dayKey}
                    </p>
                </div>

                {/* Status controls mirror Program page */}
                <div className="flex items-center gap-3">
                    {!inProgress && !isComplete && (
                        <button
                            onClick={() => updateStatus('in_progress')}
                            className="rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                        >
                            Start Workout
                        </button>
                    )}
                    {inProgress && (
                        <button
                            onClick={() => updateStatus('complete')}
                            className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
                        >
                            Mark Complete
                        </button>
                    )}
                    {isComplete && (
                        <span className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                            Workout Complete
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 3D Avatar reacts to status */}
                <Avatar3D status={avatarStatus} />

                {/* Exercise list + videos */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Today’s Movements</div>
                    <ul className="mt-3 space-y-3">
                        {exercises.map((ex) => (
                            <li key={ex.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                                <div className="font-medium">{ex.title}</div>
                                {ex.cues?.length ? (
                                    <ul className="mt-1 list-disc pl-5 text-xs text-zinc-400">
                                        {ex.cues.map((c: string, i: number) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                ) : null}
                                {ex.video ? (
                                    <video
                                        className="mt-3 w-full rounded-lg ring-1 ring-white/10"
                                        src={ex.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <div className="mt-3 text-xs text-zinc-500">Demo video not available.</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
