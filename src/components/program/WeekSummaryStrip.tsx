'use client';

export default function WeekSummaryStrip({ percent }: { percent: number }) {
    // Bound & round
    const pct = Math.max(0, Math.min(100, Math.round(percent)));

    // Fast-energy copy (F1 strategist tone)
    let line = `${pct}% complete — stay locked in. Momentum is compounding.`;
    if (pct < 25) line = `${pct}% complete — set the base. Keep moving.`;
    else if (pct >= 60 && pct < 90) line = `${pct}% complete — clean execution. Keep pressure.`;
    else if (pct >= 90) line = `Final stretch — close strong. Precision over hype.`;

    return (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
            {/* Label row */}
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-zinc-400">Week Performance</div>
                <div className="text-xs font-semibold text-zinc-300">{pct}%</div>
            </div>

            {/* Progress track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                {/* Fill */}
                <div
                    className="h-full rounded-full bg-gradient-to-r from-lime-400 to-cyan-400"
                    style={{ width: `${pct}%` }}
                />
                {/* Fast-energy shimmer (subtle, not loud) */}
                <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-pulse"
                    style={{ animationDuration: '0.8s' }}
                >
                    <div className="h-full translate-x-2 rounded-full bg-white/20 blur-[2px]" />
                </div>
            </div>

            {/* Intel line */}
            <div className="mt-3 text-sm text-zinc-200">{line}</div>
        </div>
    );
}
