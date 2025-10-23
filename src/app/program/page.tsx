'use client';

import { useState, useMemo } from 'react';
import WeekBar from '@/components/program/WeekBar';
import DayPills from '@/components/program/DayPills';
import TodaysSession from '@/components/program/TodaysSession';
import { useLocalStorage } from '@/lib/useLocalStorage';
import WeekSummaryStrip from '@/components/program/WeekSummaryStrip';

type ProgramDay = {
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    label: string;
    completed: boolean;
    locked: boolean;
    isToday: boolean;
    type: string;
    activity: string;
};

export default function ProgramPage() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const aiActive = Boolean(last);

    // Mock program (UI only)
    const currentWeek = 3;
    const totalWeeks = 12;
    const days: ProgramDay[] = [
        { day: 'MON', label: 'Monday', completed: true, locked: false, isToday: false, type: 'Upper', activity: 'Push Power' },
        { day: 'TUE', label: 'Tuesday', completed: true, locked: false, isToday: false, type: 'Mindset', activity: 'Meditation' },
        { day: 'WED', label: 'Wednesday', completed: true, locked: false, isToday: false, type: 'Lower', activity: 'Squat Focus' },
        { day: 'THU', label: 'Thursday', completed: false, locked: false, isToday: true, type: 'Upper', activity: 'Pull Power' },
        { day: 'FRI', label: 'Friday', completed: false, locked: true, isToday: false, type: 'Full Body', activity: 'HIIT Circuit' },
        { day: 'SAT', label: 'Saturday', completed: false, locked: true, isToday: false, type: 'Mindset', activity: 'Journaling' },
        { day: 'SUN', label: 'Sunday', completed: false, locked: true, isToday: false, type: 'Recovery', activity: 'Active Rest' },
    ];

    const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);
    const [selectedDay, setSelectedDay] = useState<ProgramDay>(days.find(d => d.isToday) || days[0]);

    const weekTitle = useMemo(() => {
        const titles = ['Foundation', 'Load', 'Power', 'Density', 'Deload', 'Strength', 'Capacity', 'Power', 'Deload', 'Peak', 'Taper', 'Finish'];
        return titles[(selectedWeek - 1) % titles.length];
    }, [selectedWeek]);

    const daysCompleted = days.filter(d => d.completed).length;

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold">12-Week Program</h1>
            <p className="mt-2 text-zinc-400">Week {selectedWeek}: {weekTitle}</p>

            {/* Week timeline (future weeks locked) */}
            <div className="mt-6">
                <WeekBar
                    currentWeek={selectedWeek}
                    totalWeeks={totalWeeks}
                    unlockedThroughWeek={currentWeek}
                    onSelect={setSelectedWeek}
                />
            </div>

            {/* Day chips + completion summary */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-400">Select a day</div>
                    <div className="text-xs font-semibold text-zinc-300">
                        {daysCompleted}/7 completed
                    </div>
                </div>
                <DayPills
                    days={days}
                    onSelect={(d) => setSelectedDay(d)}
                />
                {/* NEW: Week Performance Strip */}
                <WeekSummaryStrip percent={(daysCompleted / 7) * 100} />
            </div>

            {/* Today / Selected session */}
            <div className="mt-6">
                <TodaysSession
                    aiActive={aiActive}
                    title={`${selectedDay.label}: ${selectedDay.type} · ${selectedDay.activity}`}
                    blocks={[
                        { kind: 'Warm-up', detail: '8–10 min mobility + activation' },
                        { kind: 'Main', detail: 'Pull-ups 4×8–10 · Rows 4×10 · Face Pulls 3×15 · Curls 3×12' },
                        { kind: 'Finisher', detail: 'Short EMOM · 6–8 min' },
                        { kind: 'Cooldown', detail: 'Breath reset 2 min · light stretch' },
                    ]}
                    progressPct={selectedDay.isToday ? 30 : 0}
                    ctaHref="/program"
                    locked={selectedDay.locked}
                    completed={selectedDay.completed}
                    isToday={selectedDay.isToday}
                />
            </div>
        </div>
    );
}
