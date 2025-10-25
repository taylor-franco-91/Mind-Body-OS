'use client'
// src/lib/programClock.ts
export type ProgramClock = {
    currentWeek: number;      // 1..12
    lastDateISO: string;      // yyyy-mm-dd (local)
};

const CLOCK_KEY = 'program_clock_v1';

export function localISODate(d = new Date()): string {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
}

// NEW: parse a local ISO (yyyy-mm-dd) into a local Date (no UTC offset issues)
export function fromLocalISO(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m - 1), d);
}

// 0=Sun..6=Sat => map to 'MON'..'SUN'
export const DOW_KEYS: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'> =
    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function todayKey(date: Date = new Date()): typeof DOW_KEYS[number] {
    const js = date.getDay();       // 0=Sun..6=Sat
    const idx = (js + 6) % 7;       // 0=Mon..6=Sun
    return DOW_KEYS[idx];
}

export function loadClock(): ProgramClock {
    try {
        const raw = localStorage.getItem(CLOCK_KEY);
        if (!raw) {
            const iso = localISODate();
            return { currentWeek: 1, lastDateISO: iso };
        }
        const parsed = JSON.parse(raw);
        return {
            currentWeek: Math.max(1, Math.min(12, parsed.currentWeek ?? 1)),
            lastDateISO: parsed.lastDateISO ?? localISODate(),
        };
    } catch {
        return { currentWeek: 1, lastDateISO: localISODate() };
    }
}

export function saveClock(clock: ProgramClock) {
    localStorage.setItem(CLOCK_KEY, JSON.stringify(clock));
}

function addDaysISO(iso: string, n: number): string {
    const dt = fromLocalISO(iso);
    dt.setDate(dt.getDate() + n);
    return localISODate(dt);
}

// Day-of-week index 0..6 for a local yyyy-mm-dd (Mon=0..Sun=6)
function isoDowIndex(iso: string): number {
    const dt = fromLocalISO(iso);
    return (dt.getDay() + 6) % 7;
}

export function isNewWeekBoundary(prevISO: string, nextISO: string): boolean {
    return isoDowIndex(prevISO) === 6 && isoDowIndex(nextISO) === 0;
}

export function advanceOneDay(clock: ProgramClock): ProgramClock {
    const nextISO = addDaysISO(clock.lastDateISO, 1);
    let newWeek = clock.currentWeek;
    if (isNewWeekBoundary(clock.lastDateISO, nextISO)) {
        newWeek = Math.min(12, clock.currentWeek + 1);
    }
    return { currentWeek: newWeek, lastDateISO: nextISO };
}

export function dayDelta(fromISO: string, toISO: string): number {
    if (fromISO === toISO) return 0;
    const a = fromLocalISO(fromISO);
    const b = fromLocalISO(toISO);
    const ms = b.getTime() - a.getTime();
    return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}
