'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function LastCheckInCard() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);

    if (!last) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-zinc-400">Last Check-in</div>
                <div className="mt-1 text-xl font-semibold">No check-in yet</div>
                <div className="mt-2 text-sm text-zinc-500">Head to Daily Check-in to log your day.</div>
            </div>
        );
    }

    const date = new Date(last.date);
    const formatted = date.toLocaleDateString(undefined, {
        weekday: 'long', month: 'short', day: 'numeric'
    });

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">Last Check-in</div>
                <div className="text-xs text-zinc-500">{formatted}</div>
            </div>

            <div className="mt-2 text-lg font-semibold capitalize">
                Feeling: {last.feeling}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Sleep" value={last.metrics.sleep} />
                <Metric label="Energy" value={last.metrics.energy} />
                <Metric label="Stress" value={last.metrics.stress} />
                <Metric label="Soreness" value={last.metrics.soreness} />
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/10">
            <div className="text-zinc-400">{label}</div>
            <div className="font-semibold">{value}/10</div>
        </div>
    );
}
