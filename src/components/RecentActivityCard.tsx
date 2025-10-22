'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function RecentActivityCard() {
    const [last] = useLocalStorage<any>('lastCheckIn', null);

    const items: { id: string; title: string; when: string }[] = [];
    if (last) {
        items.push({
            id: 'checkin',
            title: `Daily check-in: feeling ${last.feeling}`,
            when: new Date(last.date).toLocaleString(),
        });
        if (last.photos?.front || last.photos?.side || last.photos?.back) {
            items.push({
                id: 'photos',
                title: 'Uploaded progress photos',
                when: new Date(last.date).toLocaleString(),
            });
        }
    }

    const show = items.slice(0, 2);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-400">Recent Activity</div>
            {show.length === 0 ? (
                <div className="mt-2 text-sm text-zinc-500">No activity yet.</div>
            ) : (
                <ul className="mt-3 space-y-2">
                    {show.map((i) => (
                        <li key={i.id} className="rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/10">
                            <div className="text-sm font-medium">{i.title}</div>
                            <div className="text-xs text-zinc-500">{i.when}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
