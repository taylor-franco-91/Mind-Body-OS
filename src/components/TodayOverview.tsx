'use client';

export default function TodayOverview() {
    return (
        <div className="grid max-w-5xl gap-4 md:grid-cols-3">
            <Card
                title="Workout"
                subtitle="Today’s Focus"
                body="Balanced Push/Pull"
                hint="45–60 min · strength + accessories"
                icon="💪"
            />
            <Card
                title="Fuel"
                subtitle="Nutrition Cue"
                body="Protein Priority"
                hint="~30–40g per meal · hydrate + electrolytes"
                icon="🥗"
            />
            <Card
                title="Mindset"
                subtitle="Reset"
                body="2-min Breath Reset"
                hint="Box breathing · 4–4–4–4"
                icon="🧠"
            />
        </div>
    );
}

function Card({
    title, subtitle, body, hint, icon,
}: {
    title: string; subtitle: string; body: string; hint: string; icon: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-400">{subtitle}</div>
                <div className="text-lg">{icon}</div>
            </div>
            <div className="mt-1 text-xl font-semibold">{title}</div>
            <div className="mt-2 text-zinc-200">{body}</div>
            <div className="mt-1 text-xs text-zinc-500">{hint}</div>
        </div>
    );
}
