'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function MomentumStrip({ aiActive }: { aiActive?: boolean }) {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const m = last?.metrics;

    // Tiny inference line (calm, classified)
    let intel = 'Check in to calibrate today';
    if (aiActive && m) {
        const stress = Number(m.stress ?? 5);
        const energy = Number(m.energy ?? 5);
        if (energy >= 7 && stress <= 4) intel = 'Readiness trending up—green light for progression.';
        else if (stress >= 7) intel = 'System load detected—precision blocks recommended.';
        else if (energy <= 3) intel = 'Low output window—recovery bias advised.';
        else intel = 'Stable signal—balanced pacing optimal.';
    }

    return (
        <>
            <div className="mt-4 flex flex-wrap gap-3">
                <Chip icon="🌙" label="Sleep" value={m?.sleep ?? '—'} delta="→" />
                <Chip icon="⚡" label="Energy" value={m?.energy ?? '—'} delta="→" />
                <Chip icon="🧠" label="Stress" value={m?.stress ?? '—'} delta="→" />
                <Chip icon="💥" label="Soreness" value={m?.soreness ?? '—'} delta="→" />
                <Cue text={intel} aiActive={aiActive} />
            </div>
        </>
    );
}

function Chip({ icon, label, value, delta }:
    { icon: string; label: string; value: number | string; delta: '↑' | '→' | '↓' }
) {
    const deltaColor = delta === '↑' ? 'text-emerald-300' : delta === '↓' ? 'text-amber-300' : 'text-zinc-400';
    return (
        <div className="rounded-full bg-black/30 px-3 py-1.5 text-sm ring-1 ring-white/10">
            <span className="mr-1">{icon}</span>
            <span className="text-zinc-400">{label}:</span>{' '}
            <span className="font-medium text-zinc-100">{value}</span>
            {typeof value === 'number' ? <span className="text-zinc-500">/10</span> : null}
            <span className={`ml-2 ${deltaColor}`}>{delta}</span>
        </div>
    );
}

function Cue({ text, aiActive }: { text: string; aiActive?: boolean }) {
    const base = 'rounded-full px-3 py-1.5 text-sm font-medium ring-1';
    return aiActive ? (
        <div className={`${base} bg-emerald-400/10 text-emerald-300 ring-emerald-400/30`}>{text}</div>
    ) : (
        <div className={`${base} bg-white/5 text-zinc-300 ring-white/10`}>{text}</div>
    );
}

