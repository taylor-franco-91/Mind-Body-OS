'use client';

export default function TodaysSession({
    aiActive,
    title,
    blocks,
    progressPct,
    ctaHref,
    locked,
    completed,
    isToday,
}: {
    aiActive?: boolean;
    title: string;
    blocks: { kind: 'Warm-up' | 'Main' | 'Finisher' | 'Cooldown'; detail: string }[];
    progressPct: number;
    ctaHref: string;
    locked?: boolean;
    completed?: boolean;
    isToday?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {/* progress bar */}
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-lime-400 to-cyan-400"
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">{isToday ? 'Today’s Session' : 'Selected Session'}</div>
                {aiActive && (
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                        Adaptive AI · calibrated
                    </span>
                )}
            </div>

            <div className="mt-1 text-xl font-semibold">{title}</div>

            {/* state badges */}
            <div className="mt-2 flex gap-2 text-xs">
                {completed && <Badge text="Completed" tone="ok" />}
                {locked && <Badge text="Locked" tone="warn" />}
                {isToday && <Badge text="Today" tone="now" />}
            </div>

            {/* Blocks */}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {blocks.map((b, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-zinc-400">{b.kind}</div>
                        <div className="mt-1 text-sm text-zinc-100">{b.detail}</div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <a
                href={locked ? '#' : ctaHref}
                className={`mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
          ${locked
                        ? 'bg-white/10 text-zinc-500 cursor-not-allowed'
                        : 'bg-emerald-400 text-black hover:opacity-90'}`}
            >
                {locked ? 'Locked' : completed ? 'View Summary' : 'Start Workout'}
            </a>
        </div>
    );
}

function Badge({ text, tone }: { text: string; tone: 'ok' | 'warn' | 'now' }) {
    const cls =
        tone === 'ok' ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30' :
            tone === 'warn' ? 'bg-amber-400/10  text-amber-300  ring-amber-400/30' :
                'bg-cyan-400/10   text-cyan-200   ring-cyan-400/30';
    return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${cls}`}>{text}</span>;
}
