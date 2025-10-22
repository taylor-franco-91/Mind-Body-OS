export default function ProgramPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">12-Week Program</h1>
            <p className="mt-2 text-zinc-400">Week timeline + today’s session (coming next).</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Current Week</div>
                    <div className="mt-1 text-xl font-semibold">Week 3: Power Building</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Today</div>
                    <div className="mt-1 text-xl font-semibold">Upper Body · Pull Power</div>
                </div>
            </div>
        </div>
    );
}
