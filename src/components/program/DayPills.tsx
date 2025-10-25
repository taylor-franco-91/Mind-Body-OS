'use client';

type Day = {
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    label: string;
    completed: boolean;
    missed?: boolean;
    locked: boolean;
    isToday: boolean;
    type: string;
    activity: string;
};

export default function DayPills({
    days,
    onSelect,
    selectedDayKey,
    todayKey,
}: {
    days: Day[];
    onSelect: (d: Day) => void;
    selectedDayKey?: Day['day'];
    todayKey?: Day['day'];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {days.map((d) => {
                const isSelected = selectedDayKey === d.day;
                const isToday = todayKey === d.day;

                // Base style
                let cls =
                    'relative rounded-full px-3 py-1.5 text-sm font-medium transition ring-1 ring-white/10 ';

                if (d.locked) {
                    cls += 'bg-white/5 text-zinc-500 cursor-not-allowed';
                } else if (isToday) {
                    // TODAY = same style as active WeekBar button
                    cls += 'bg-gradient-to-r from-lime-400 to-cyan-400 text-black';
                } else if (d.completed) {
                    cls += 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/25';
                } else if (d.missed) {
                    cls += 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/20';
                } else {
                    cls += 'bg-white/5 text-zinc-200 hover:bg-white/10';
                }

                // Viewing past day => subtle halo (not for today)
                const viewHalo =
                    isSelected && !isToday
                        ? 'after:absolute after:inset-[-4px] after:rounded-full after:ring-1 after:ring-cyan-300/40'
                        : '';

                return (
                    <button
                        key={d.day}
                        onClick={() => onSelect(d)}
                        disabled={d.locked}
                        className={`${cls} ${viewHalo}`}
                        title={d.label}
                    >
                        <span className="mr-2 text-[10px] opacity-70">{d.day}</span>
                        {d.completed ? '✔' : d.missed ? '✕' : '•'}
                    </button>
                );
            })}
        </div>
    );
}
