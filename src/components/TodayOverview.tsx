'use client';

export default function TodayOverview() {
    return (
        <div className="grid max-w-5xl gap-4 md:grid-cols-3">
            <Card
                title="Workout"
                subtitle="Today’s Focus"
                body="Balanced Push/Pull"
                hint="45–60 min · strength + accessories"
                icon={<DumbbellIcon />}
            />
            <Card
                title="Fuel"
                subtitle="Nutrition Cue"
                body="Protein Priority"
                hint="~30–40g per meal · hydrate + electrolytes"
                icon={<BoltIcon />}
            />
            <Card
                title="Mindset"
                subtitle="Reset"
                body="2-min Breath Reset"
                hint="Box breathing · 4-4-4-4"
                icon={<MindIcon />}
            />
        </div>
    );
}

function Card({
    title, subtitle, body, hint, icon,
}: {
    title: string; subtitle: string; body: string; hint: string; icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">{subtitle}</div>
                <div className="text-lg opacity-90">{icon}</div>
            </div>
            <div className="mt-1 text-xl font-semibold">{title}</div>
            <div className="mt-2 text-zinc-200">{body}</div>
            <div className="mt-1 text-xs text-zinc-500">{hint}</div>
        </div>
    );
}

/* Minimal inline SVGs (no libs) */
function DumbbellIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="9" width="3" height="6" rx="1" fill="currentColor" opacity=".85" />
            <rect x="18" y="9" width="3" height="6" rx="1" fill="currentColor" opacity=".85" />
            <rect x="7" y="10" width="10" height="4" rx="1" fill="currentColor" />
        </svg>
    );
}
function BoltIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
        </svg>
    );
}
function MindIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity=".6" />
            <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}
