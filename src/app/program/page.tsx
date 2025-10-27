'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

const DAY_LABEL = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
    SUN: 'Sunday'
};

export default function ProgramPage() {
    const [last] = useLocalStorage('lastCheckIn', null);
    const aiActive = Boolean(last);

    const [clockWeek, setClockWeek] = useState(() => loadClock().currentWeek);
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
            setTick(function (x) { return x + 1; });
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
    }, []);

    const lastDateRef = useRef(localISODate());
    useEffect(() => {
        const id = setInterval(() => {
            const nowISO = localISODate();
            if (nowISO !== lastDateRef.current) {
                lastDateRef.current = nowISO;
                catchUpToToday();
            }
        }, 30000);
        return () => clearInterval(id);
    }, []);

    const selectedWeek = clockWeek;
    const todayDayKey = todayKey();
    const todayIdx = DOW_KEYS.indexOf(todayDayKey);

    const template = [
        { type: 'Upper', activity: 'Push Power' },
        { type: 'Mindset', activity: 'Meditation' },
        { type: 'Lower', activity: 'Squat Focus' },
        { type: 'Upper', activity: 'Pull Power' },
        { type: 'Full Body', activity: 'HIIT Circuit' },
        { type: 'Mindset', activity: 'Journaling' },
        { type: 'Recovery', activity: 'Active Rest' }
    ];

    useMemo(() => loadWeekState(selectedWeek), [selectedWeek, tick]);

    const computedDays = useMemo(() => {
        return DOW_KEYS.map(function (dk, idx) {
            const completed = isCompleted(selectedWeek, dk);
            const missed = isMissed(selectedWeek, dk);
            const isTodayFlag = idx === todayIdx;
            const locked = idx > todayIdx;
            const base = template[idx];

            return {
                day: dk,
                label: DAY_LABEL[dk],
                completed: completed,
                missed: missed,
                locked: locked,
                isToday: isTodayFlag,
                type: base.type,
                activity: base.activity
            };
        });
    }, [selectedWeek, todayIdx, tick]);

    const daysCompleted = computedDays.filter(function (d) { return d.completed; }).length;
    const todayDay = computedDays[todayIdx];

    const [viewDayKey, setViewDayKey] = useState(todayDay.day);
    useEffect(() => {
        setViewDayKey(todayDay.day);
    }, [todayDay.day]);

    const viewingDay = computedDays.find(function (d) { return d.day === viewDayKey; }) || todayDay;
    const reviewOnly = Boolean(viewingDay && viewingDay.missed === true);

    const weekTitle = useMemo(() => {
        const titles = ['Foundation', 'Load', 'Power', 'Density', 'Deload', 'Strength', 'Capacity', 'Power', 'Deload', 'Peak', 'Taper', 'Finish'];
        return titles[(selectedWeek - 1) % titles.length];
    }, [selectedWeek]);

    function handleCompleteToday() {
        if (!todayDay || todayDay.locked || todayDay.completed || todayDay.missed) return;
        addCompleted(selectedWeek, todayDay.day);
        const s = loadWeekState(selectedWeek);
        s.missed = (s.missed || []).filter(function (d) { return d !== todayDay.day; });
        saveWeekState(selectedWeek, s);
        setTick(function (x) { return x + 1; });
    }

    const router = useRouter();
    const search = useSearchParams();

    function handleResetToday() {
        const t = todayDay && todayDay.day;
        if (!t) return;
        const ok = window.confirm(
            "Reset ONLY today's state (" + t + ")?\n\nThis clears completed/missed so you can re-test Start -> Complete flow. Streaks/history remain intact."
        );
        if (!ok) return;

        const s = loadWeekState(selectedWeek);
        if (Array.isArray(s.completed)) {
            s.completed = s.completed.filter(function (d) { return d !== t; });
        }
        if (Array.isArray(s.missed)) {
            s.missed = s.missed.filter(function (d) { return d !== t; });
        }
        saveWeekState(selectedWeek, s);

        router.replace('/program');

        setTick(function (x) { return x + 1; });

        try {
            const el = document.createElement('div');
            el.textContent = 'Today reset. Ready to test.';
            el.setAttribute(
                'style',
                'position:fixed;top:16px;right:16px;padding:10px 12px;background:rgba(20,20,20,0.9);color:#fff;border-radius:10px;font-size:12px;z-index:99999;box-shadow:0 6px 20px rgba(0,0,0,0.3);'
            );
            document.body.appendChild(el);
            setTimeout(function () { el.remove(); }, 1400);
        } catch (e) { }
    }

    useEffect(() => {
        if (search.get('complete') === '1') {
            handleCompleteToday();
            router.replace('/program');
        }
    }, [search]);

    return (
        <div className="p-8 text-white relative">
            <button
                onClick={handleResetToday}
                className="absolute top-4 right-4 text-xs font-medium rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur hover:bg-white/15 active:scale-[0.98]"
                title="Reset ONLY today's state for quick QA"
            >
                Reset Today
            </button>

            <h1 className="text-3xl font-bold">12-Week Program</h1>
            <p className="mt-2 text-zinc-400">Week {selectedWeek}: {weekTitle}</p>

            <div key={'wk-' + selectedWeek} className="mt-6">
                <WeekBar
                    currentWeek={selectedWeek}
                    totalWeeks={12}
                    unlockedThroughWeek={selectedWeek}
                    onSelect={function () { }}
                />
            </div>

            <div key={'days-' + selectedWeek} className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-400">This week</div>
                    <div className="text-xs font-semibold text-zinc-300">{daysCompleted}/7 completed</div>
                </div>
                <DayPills
                    days={computedDays}
                    selectedDayKey={viewDayKey}
                    todayKey={todayDay.day}
                    onSelect={function (d) {
                        if (!d.locked) setViewDayKey(d.day);
                    }}
                />
                <WeekSummaryStrip percent={(daysCompleted / 7) * 100} />
            </div>

            <div key={'sess-' + viewingDay.day} className="mt-6">
                <TodaysSession
                    aiActive={aiActive}
                    title={viewingDay.label + ': ' + viewingDay.type + ' - ' + viewingDay.activity}
                    blocks={[
                        { kind: 'Warm-up', detail: '8-10 min mobility + activation' },
                        { kind: 'Main', detail: 'Pull-ups 4x8-10 - Rows 4x10 - Face Pulls 3x15 - Curls 3x12' },
                        { kind: 'Finisher', detail: 'Short EMOM - 6-8 min' },
                        { kind: 'Cooldown', detail: 'Breath reset 2 min - light stretch' }
                    ]}
                    progressPct={viewingDay.isToday && !viewingDay.completed ? 30 : 100}
                    locked={viewingDay.locked}
                    completed={viewingDay.completed}
                    isToday={viewingDay.isToday}
                    reviewOnly={reviewOnly}
                    onComplete={viewingDay.isToday && !viewingDay.completed && !reviewOnly ? handleCompleteToday : undefined}
                    dayKey={viewingDay.day}
                />
            </div>
        </div>
    );
}
