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

    // Placeholder streak logic (replace with real history later)
    let streak = 0;
    if (last) {
        const d = new Date(last.date);
        streak = isSameDay(d, today) ? 1 : isYesterday(d, today) ? 1 : 0;
    }

    const goal = 7; // visualize 7-day target ring
    const pct = Math.max(0, Math.min(1, streak / goal));
    const r = 28;
    const C = 2 * Math.PI * r;
    const dash = C * pct;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">Streak</div>
                <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-sm">
                    <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
                    <circle
                        cx="32" cy="32" r={r}
                        stroke="url(#grad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${C - dash}`}
                        transform="rotate(-90 32 32)"
                        fill="none"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#A7F3D0" />
                            <stop offset="100%" stopColor="#67E8F9" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="mt-2 text-3xl font-extrabold">{streak} day{streak === 1 ? '' : 's'}</div>
            <div className="mt-2 text-sm text-zinc-500">Build your 7-day momentum.</div>
        </div>
    );
}
