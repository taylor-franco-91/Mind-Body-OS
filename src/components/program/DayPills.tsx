'use client';

type Day = {
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    label: string;
    completed: boolean;
    missed?: boolean;        // NEW
    locked: boolean;
    isToday: boolean;
    type: string;
    activity: string;
};

export default function DayPills({
    days,
    onSelect,
    selectedDayKey,
}: {
    days: Day[];
    onSelect: (d: Day) => void;
    selectedDayKey?: Day['day'];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {days.map((d) => {
                const state =
                    d.isToday ? 'today' :
                        d.completed ? 'done' :
                            d.missed ? 'missed' :
                                d.locked ? 'locked' : 'idle';

                const cls =
                    state === 'today' ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-black ring-lime-300' :
                        state === 'done' ? 'bg-white/10 text-zinc-200 ring-white/15' :
                            state === 'missed' ? 'bg-white/5 text-rose-300 ring-rose-300/30' :
                                state === 'locked' ? 'bg-black/30 text-zinc-500 ring-white/10 cursor-not-allowed' :
                                    'bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10';

                const isSelected = selectedDayKey === d.day;

                return (
                    <button
                        key={d.day}
                        onClick={() => !d.locked && onSelect(d)}
                        className={`relative rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition ${cls}`}
                        title={`${d.label}: ${d.type} · ${d.activity}`}
                        aria-disabled={d.locked}
                    >
                        {/* Halo pulse when selected */}
                        {isSelected && <span className="halo-ring animate-halo" aria-hidden />}

                        {d.day}

                        {d.completed && (
                            <span
                                aria-hidden
                                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 text-[10px] font-black text-black ring-1 ring-emerald-300"
                            >
                                ✓
                            </span>
                        )}

                        {d.missed && !d.completed && (
                            <span
                                aria-hidden
                                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-black text-black ring-1 ring-rose-300"
                            >
                                ×
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

