'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function MomentumStrip() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const m = last?.metrics;

    return (
        <div className="mt-4 flex flex-wrap gap-3">
            <Chip label="Sleep" value={m?.sleep ?? '—'} />
            <Chip label="Energy" value={m?.energy ?? '—'} />
            <Chip label="Stress" value={m?.stress ?? '—'} />
            <Chip label="Soreness" value={m?.soreness ?? '—'} />
            <Cue feeling={last?.feeling} />
        </div>
    );
}

function Chip({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-full bg-black/30 px-3 py-1.5 text-sm ring-1 ring-white/10">
            <span className="text-zinc-400">{label}:</span>{' '}
            <span className="font-medium text-zinc-100">{value}</span>
            {typeof value === 'number' ? <span className="text-zinc-500">/10</span> : null}
        </div>
    );
}

function Cue({ feeling }: { feeling?: string }) {
    const map: Record<string, string> = {
        exhausted: 'Dial intensity · recovery bias',
        low: 'Technique day · shorter blocks',
        average: 'Balanced session · steady',
        good: 'Strength blocks · push pace',
        excellent: 'Power focus · green light',
    };
    const text = feeling ? map[feeling] : 'Check in to calibrate today';
    return (
        <div className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            {text}
        </div>
    );
}
