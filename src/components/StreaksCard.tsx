'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}
function isYesterday(a: Date, b: Date) {
    const y = new Date(b);
    y.setDate(b.getDate() - 1);
    return isSameDay(a, y);
}

export default function StreaksCard() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const today = new Date();

    // Placeholder streak (we’ll replace with real history later)
    let streak = 0;
    if (last) {
        const d = new Date(last.date);
        streak = isSameDay(d, today) ? 1 : isYesterday(d, today) ? 1 : 0;
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-400">Streak</div>
            <div className="mt-1 text-3xl font-extrabold">{streak} day{streak === 1 ? '' : 's'}</div>
            <div className="mt-2 text-sm text-zinc-500">Check in daily to build momentum.</div>
        </div>
    );
}
