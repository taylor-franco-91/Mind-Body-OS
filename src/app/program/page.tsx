'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import WeekBar from '@/components/program/WeekBar';
import DayPills from '@/components/program/DayPills';
import TodaysSession from '@/components/program/TodaysSession';
import WeekSummaryStrip from '@/components/program/WeekSummaryStrip';
import { useLocalStorage } from '@/lib/useLocalStorage';

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
                const prevDayKey = todayKey(fromLocalISO(prevISO)); // LOCAL safe
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

    // NEW: react to timezone changes (from TimezoneWatcher)
    useEffect(() => {
        function onTZChange() {
            catchUpToToday();
        }
        window.addEventListener('os:timezone-changed', onTZChange);
        return () => window.removeEventListener('os:timezone-changed', onTZChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // REAL today (no parsing issues)
    const selectedWeek = clockWeek;
    const todayDayKey = todayKey(); // uses new Date() in local time
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

    const weekState = useMemo(() => loadWeekState(selectedWeek), [selectedWeek, tick]);

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

    function handleCompleteToday() {
        if (!todayDay || todayDay.locked || todayDay.completed || todayDay.missed) return;
        addCompleted(selectedWeek, todayDay.day);
        const s = loadWeekState(selectedWeek);
        s.missed = s.missed.filter(d => d !== todayDay.day);
        saveWeekState(selectedWeek, s);
        setTick(x => x + 1);
    }

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold">12-Week Program</h1>
            <p className="mt-2 text-zinc-400">Week {selectedWeek}: {weekTitle}</p>

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
                    blocks={[
                        { kind: 'Warm-up', detail: '8–10 min mobility + activation' },
                        { kind: 'Main', detail: 'Pull-ups 4×8–10 · Rows 4×10 · Face Pulls 3×15 · Curls 3×12' },
                        { kind: 'Finisher', detail: 'Short EMOM · 6–8 min' },
                        { kind: 'Cooldown', detail: 'Breath reset 2 min · light stretch' },
                    ]}
                    progressPct={viewingDay.isToday && !viewingDay.completed ? 30 : 100}
                    ctaHref="/program"
                    locked={viewingDay.locked}
                    completed={viewingDay.completed}
                    isToday={viewingDay.isToday}
                    reviewOnly={reviewOnly}
                    onComplete={
                        viewingDay.isToday && !viewingDay.completed && !reviewOnly ? handleCompleteToday : undefined
                    }
                />
            </div>
        </div>
    );
}
