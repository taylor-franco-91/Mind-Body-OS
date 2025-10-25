'use client'
// src/lib/programStorage.ts
export type WeekState = {
    completed: string[];   // day keys: ['MON', 'TUE', ...]
    missed: string[];      // day keys missed
};

const KEY = (week: number) => `program_week_${week}_v1`;

export function loadWeekState(week: number): WeekState {
    try {
        const raw = localStorage.getItem(KEY(week));
        if (!raw) return { completed: [], missed: [] };
        const parsed = JSON.parse(raw);
        return {
            completed: Array.isArray(parsed.completed) ? parsed.completed : [],
            missed: Array.isArray(parsed.missed) ? parsed.missed : [],
        };
    } catch {
        return { completed: [], missed: [] };
    }
}

export function saveWeekState(week: number, state: WeekState) {
    localStorage.setItem(KEY(week), JSON.stringify(state));
}

export function addCompleted(week: number, dayKey: string) {
    const s = loadWeekState(week);
    if (!s.completed.includes(dayKey)) s.completed.push(dayKey);
    s.missed = s.missed.filter(d => d !== dayKey);
    saveWeekState(week, s);
}

export function addMissed(week: number, dayKey: string) {
    const s = loadWeekState(week);
    if (!s.missed.includes(dayKey) && !s.completed.includes(dayKey)) {
        s.missed.push(dayKey);
    }
    saveWeekState(week, s);
}

export function isCompleted(week: number, dayKey: string) {
    return loadWeekState(week).completed.includes(dayKey);
}

export function isMissed(week: number, dayKey: string) {
    return loadWeekState(week).missed.includes(dayKey);
}

export function resetWeek(week: number) {
    saveWeekState(week, { completed: [], missed: [] });
}
