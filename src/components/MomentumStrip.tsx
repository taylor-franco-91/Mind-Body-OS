'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function MomentumStrip({ aiActive }: { aiActive?: boolean }) {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const m = last?.metrics;

    // ---- INTEL (data) ----
    let intel = 'Check in to calibrate today';
    if (aiActive && m) {
        const energy = Number(m.energy ?? 5);
        const stress = Number(m.stress ?? 5);

        if (energy >= 7 && stress <= 4) {
            intel = 'Energy signal high — progression window open.';
        } else if (stress >= 7 && energy >= 5) {
            intel = 'System load elevated — precision over volume.';
        } else if (energy <= 3) {
            intel = 'Output window low — recovery bias advisable.';
        } else {
            intel = 'Stable state — balanced pacing optimal.';
        }
    }

    // ---- PUSH (composed Nike vibe) ----
    let push = aiActive
        ? 'You’re steady — keep your rhythm.'
        : 'Make your check-in — set the tone.';

    if (aiActive && m) {
        const energy = Number(m.energy ?? 5);
        const stress = Number(m.stress ?? 5);

        if (energy >= 7 && stress <= 4) {
            push = 'Your energy is climbing — stay in control.';
        } else if (stress >= 7 && energy >= 5) {
            push = 'You’re charged — focus the effort, don’t spill it.';
        } else if (energy <= 3) {
            push = 'Low window today — keep moving, lightly.';
        } else {
            push = 'You’re steady — precision is progress.';
        }
    }

    return (
        <div className="mt-4 flex flex-wrap gap-3">
            <Chip icon="🌙" label="Sleep" value={m?.sleep ?? '—'} delta="→" />
            <Chip icon="⚡" label="Energy" value={m?.energy ?? '—'} delta="→" />
            <Chip icon="🧠" label="Stress" value={m?.stress ?? '—'} delta="→" />
            <Chip icon="💥" label="Soreness" value={m?.soreness ?? '—'} delta="→" />

            {/* Intel (data) */}
            <Cue
                text={intel}
                variant={aiActive ? 'ai' : 'neutral'}
            />

            {/* Composed motivational push */}
            <Cue
                text={push}
                variant={aiActive ? 'aiSoft' : 'neutral'}
            />
        </div>
    );
}

function Chip({
    icon, label, value, delta,
}: {
    icon: string; label: string; value: number | string; delta: '↑' | '→' | '↓'
}) {
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

function Cue({ text, variant }: { text: string; variant: 'ai' | 'aiSoft' | 'neutral' }) {
    const style =
        variant === 'ai'
            ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30'
            : variant === 'aiSoft'
                ? 'bg-cyan-400/10 text-cyan-200 ring-cyan-400/30'
                : 'bg-white/5 text-zinc-300 ring-white/10';

    return (
        <div className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${style}`}>
            {text}
        </div>
    );
}

