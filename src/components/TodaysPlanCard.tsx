'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

function planFromFeeling(feeling?: string) {
    switch (feeling) {
        case 'exhausted': return { focus: 'Recovery + Mobility', intensity: 'Low', finisher: '2-min breath reset' };
        case 'low': return { focus: 'Technique Work', intensity: 'Low-Medium', finisher: 'Core stability' };
        case 'average': return { focus: 'Balanced Push/Pull', intensity: 'Medium', finisher: 'Short EMOM' };
        case 'good': return { focus: 'Strength Blocks', intensity: 'Medium-High', finisher: 'Intervals' };
        case 'excellent': return { focus: 'Power + Sprints', intensity: 'High', finisher: 'All-out finisher' };
        default: return { focus: 'Balanced Session', intensity: 'Medium', finisher: 'Core + breath' };
    }
}

export default function TodaysPlanCard({ aiActive }: { aiActive?: boolean }) {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const plan = planFromFeeling(last?.feeling);
    const progressPct = 30; // UI-only for now

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {/* slim progress bar */}
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-cyan-400" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">Today’s Plan</div>
                {aiActive ? (
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                        Adaptive AI · recalibrated
                    </span>
                ) : null}
            </div>

            <div className="mt-1 text-xl font-semibold">{plan.focus}</div>
            <div className="mt-2 text-sm text-zinc-500">Intensity: {plan.intensity}</div>
            <div className="mt-1 text-sm text-zinc-500">Finisher: {plan.finisher}</div>

            <a href="/program" className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                Open Full Plan
            </a>
        </div>
    );
}
