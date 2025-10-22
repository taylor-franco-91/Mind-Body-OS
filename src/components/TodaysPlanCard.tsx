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

export default function TodaysPlanCard() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);
    const plan = planFromFeeling(last?.feeling);

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-400">Today’s Plan</div>
            <div className="mt-1 text-xl font-semibold">{plan.focus}</div>
            <div className="mt-2 text-sm text-zinc-500">Intensity: {plan.intensity}</div>
            <div className="mt-1 text-sm text-zinc-500">Finisher: {plan.finisher}</div>
            <a
                href="/program"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
                Open Full Plan
            </a>
        </div>
    );
}
