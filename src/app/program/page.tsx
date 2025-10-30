'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import WeekBar from '@/components/program/WeekBar';
import DayPills from '@/components/program/DayPills';
import TodaysSession from '@/components/program/TodaysSession';
import WeekSummaryStrip from '@/components/program/WeekSummaryStrip';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { EXERCISES } from '@/lib/exercises';

import {
    loadClock, saveClock, localISODate, todayKey,
    dayDelta, advanceOneDay, isNewWeekBoundary, DOW_KEYS, fromLocalISO
} from '@/lib/programClock';

import {
    loadWeekState, saveWeekState,
    addCompleted, addMissed, isCompleted, isMissed, resetWeek
} from '@/lib/programStorage';

type ProgramDay = {
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    label: string;
    completed: boolean;
    missed?: boolean;
    locked: boolean;
    isToday: boolean;
    type: string;
    activity: string;
};

const DAY_LABEL: Record<ProgramDay['day'], string> = {
    MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday',
    FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday'
};

/** Canonical exercise IDs for each day — must align with EXERCISES keys */
const DAY_PLAN_IDS: Record<ProgramDay['day'], string[]> = {
    MON: ['press_overhead_dumbbell', 'row_dumbbell', 'pushup_standard', 'farmer_carry'],
    TUE: ['plank_knees', 'plank_rkc', 'suitcase_carry_single'],
    WED: ['squat_bodyweight', 'squat_goblet', 'hinge_rdl_dumbbell'],
    THU: ['row_dumbbell', 'pullup_band_assisted', 'pushup_standard'],
    FRI: ['walking_lunge_dumbbell', 'pushup_standard', 'hinge_rdl_dumbbell'],
    SAT: ['press_half_kneeling_dumbbell', 'row_supported_chest', 'plank_rkc'],
    SUN: ['glute_bridge_floor', 'squat_bodyweight', 'suitcase_carry_single'],
};

type SessionStatus = 'idle' | 'in_progress' | 'complete';

export default function ProgramPage() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const aiActive = Boolean(last);

    const [clockWeek, setClockWeek] = useState<number>(() => loadClock().currentWeek);
    const [tick, setTick] = useState(0);

    function catchUpToToday() {
        let clock = loadClock();
        const todayISO = localISODate();
        const delta = dayDelta(clock.lastDateISO, todayISO);

        if (delta > 0) {
            for (let i = 0; i < delta; i++) {
                const prevISO = clock.lastDateISO;
                const prevDayKey = todayKey(fromLocalISO(prevISO));
                const wk = clock.currentWeek;

                if (!isCompleted(wk, prevDayKey)) addMissed(wk, prevDayKey);

                const nextClock = advanceOneDay(clock);
                if (isNewWeekBoundary(clock.lastDateISO, nextClock.lastDateISO)) {
                    resetWeek(nextClock.currentWeek);
                }
                clock = nextClock;
            }
            clock.lastDateISO = todayISO;
            saveClock(clock);
            setClockWeek(clock.currentWeek);
            setTick(x => x + 1);
        } else {
            if (clock.lastDateISO !== todayISO) {
                clock.lastDateISO = todayISO;
                saveClock(clock);
            }
            setClockWeek(clock.currentWeek);
        }
    }

    useEffect(() => {
        catchUpToToday();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // live midnight heartbeat
    const lastDateRef = useRef(localISODate());
    useEffect(() => {
        const id = setInterval(() => {
            const nowISO = localISODate();
            if (nowISO !== lastDateRef.current) {
                lastDateRef.current = nowISO;
                catchUpToToday();
            }
        }, 30_000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedWeek = clockWeek;
    const todayDayKey = todayKey();
    const todayIdx = DOW_KEYS.indexOf(todayDayKey);

    const template: Array<Pick<ProgramDay, 'type' | 'activity'>> = [
        { type: 'Upper', activity: 'Push Power' },
        { type: 'Mindset', activity: 'Meditation' },
        { type: 'Lower', activity: 'Squat Focus' },
        { type: 'Upper', activity: 'Pull Power' },
        { type: 'Full Body', activity: 'HIIT Circuit' },
        { type: 'Mindset', activity: 'Journaling' },
        { type: 'Recovery', activity: 'Active Rest' },
    ];

    const computedDays: ProgramDay[] = useMemo(() => {
        return DOW_KEYS.map((dk, idx) => {
            const completed = isCompleted(selectedWeek, dk);
            const missed = isMissed(selectedWeek, dk);
            const isTodayFlag = idx === todayIdx;
            const locked = idx > todayIdx;
            const base = template[idx];

            return {
                day: dk,
                label: DAY_LABEL[dk],
                completed,
                missed,
                locked,
                isToday: isTodayFlag,
                type: base.type,
                activity: base.activity,
            };
        });
    }, [selectedWeek, todayIdx, tick]);

    const daysCompleted = computedDays.filter(d => d.completed).length;
    const todayDay = computedDays[todayIdx];

    // Past-day review while keeping today anchored
    const [viewDayKey, setViewDayKey] = useState<ProgramDay['day']>(todayDay.day);
    useEffect(() => {
        setViewDayKey(todayDay.day);
    }, [todayDay.day]);

    const viewingDay = computedDays.find(d => d.day === viewDayKey) ?? todayDay;
    const reviewOnly = viewingDay?.missed === true;

    const weekTitle = useMemo(() => {
        const titles = ['Foundation', 'Load', 'Power', 'Density', 'Deload', 'Strength', 'Capacity', 'Power', 'Deload', 'Peak', 'Taper', 'Finish'];
        return titles[(selectedWeek - 1) % titles.length];
    }, [selectedWeek]);

    // Build today’s exercise list from canonical IDs so Program matches Library
    const todaysIds = DAY_PLAN_IDS[todayDay.day] ?? [];
    const todaysExerciseTitles = todaysIds
        .map(id => EXERCISES[id]?.title)
        .filter(Boolean) as string[];

    // Track session status for TODAY only (so UI doesn’t show phantom “in progress”)
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
    useEffect(() => {
        try {
            const raw = localStorage.getItem('activeSession');
            if (!raw) return setSessionStatus('idle');
            const s = JSON.parse(raw) as {
                week: number; dayKey: ProgramDay['day']; status: SessionStatus;
            };
            if (s.week === selectedWeek && s.dayKey === todayDay.day) {
                setSessionStatus(s.status);
            } else {
                setSessionStatus('idle');
            }
        } catch {
            setSessionStatus('idle');
        }
    }, [selectedWeek, todayDay.day, tick]);

    function handleCompleteToday() {
        if (!todayDay || todayDay.locked || todayDay.completed || todayDay.missed) return;
        addCompleted(selectedWeek, todayDay.day);
        const s = loadWeekState(selectedWeek);
        s.missed = s.missed.filter(d => d !== todayDay.day);
        saveWeekState(selectedWeek, s);
        // mark activeSession complete if it’s for today
        try {
            const raw = localStorage.getItem('activeSession');
            if (raw) {
                const a = JSON.parse(raw);
                if (a.week === selectedWeek && a.dayKey === todayDay.day) {
                    a.status = 'complete';
                    localStorage.setItem('activeSession', JSON.stringify(a));
                }
            }
        } catch { }
        setSessionStatus('complete');
        setTick(x => x + 1);
    }

    function handleStartToday() {
        if (!todayDay || todayDay.locked) return;

        const payload = {
            week: selectedWeek,
            dayKey: todayDay.day,
            status: 'in_progress' as const,
            exerciseIds: todaysIds,
        };

        try {
            localStorage.setItem('activeSession', JSON.stringify(payload));
        } catch { }

        setSessionStatus('in_progress');
        window.location.href = '/library';
    }

    /** DEV: quick reset so you can re-test flow for TODAY */
    function devResetToday() {
        try {
            // clear active session
            localStorage.removeItem('activeSession');
            // clear completion/miss for TODAY only
            const s = loadWeekState(selectedWeek);
            s.completed = s.completed.filter(d => d !== todayDay.day);
            s.missed = s.missed.filter(d => d !== todayDay.day);
            saveWeekState(selectedWeek, s);
            setSessionStatus('idle');
            setTick(x => x + 1);
        } catch { }
    }

    return (
        <div className="p-8 text-white">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">12-Week Program</h1>
                    <p className="mt-2 text-zinc-400">Week {selectedWeek}: {weekTitle}</p>
                </div>

                {/* DEV reset button for quick testing */}
                <button
                    onClick={devResetToday}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
                    title="Dev: reset only today's state"
                >
                    DEV · Reset Today
                </button>
            </div>

            <div key={`wk-${selectedWeek}`} className="mt-6 animate-fade-slide-left">
                <WeekBar
                    currentWeek={selectedWeek}
                    totalWeeks={12}
                    unlockedThroughWeek={selectedWeek}
                    onSelect={() => { }}
                />
            </div>

            <div key={`days-${selectedWeek}`} className="mt-6 animate-fade-slide-up">
                <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-400">This week</div>
                    <div className="text-xs font-semibold text-zinc-300">{daysCompleted}/7 completed</div>
                </div>
                <DayPills
                    days={computedDays}
                    selectedDayKey={viewDayKey}
                    todayKey={todayDay.day}
                    onSelect={(d) => {
                        if (!d.locked) setViewDayKey(d.day);
                    }}
                />
                <WeekSummaryStrip percent={(daysCompleted / 7) * 100} />
            </div>

            <div key={`sess-${viewingDay.day}`} className="mt-6 animate-soft-pop">
                <TodaysSession
                    aiActive={aiActive}
                    title={`${viewingDay.label}: ${viewingDay.type} · ${viewingDay.activity}`}
                    // Show the actual exercises that Library will use (today only)
                    blocks={
                        viewingDay.isToday
                            ? todaysExerciseTitles.map(t => ({ kind: 'Exercise', detail: t }))
                            : [
                                { kind: 'Warm-up', detail: '8–10 min mobility + activation' },
                                { kind: 'Main', detail: 'Compound lifts & pulls' },
                                { kind: 'Finisher', detail: 'Short EMOM · 6–8 min' },
                                { kind: 'Cooldown', detail: 'Breath reset 2 min · light stretch' },
                            ]
                    }
                    progressPct={viewingDay.isToday && !viewingDay.completed ? 30 : 100}
                    locked={viewingDay.locked}
                    completed={viewingDay.completed}
                    isToday={viewingDay.isToday}
                    reviewOnly={reviewOnly}
                    sessionStatus={sessionStatus}
                    onStart={viewingDay.isToday ? handleStartToday : undefined}
                    onComplete={
                        viewingDay.isToday && !viewingDay.completed && !reviewOnly ? handleCompleteToday : undefined
                    }
                />
            </div>
        </div>
    );
}
