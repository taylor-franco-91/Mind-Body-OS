export default function LibraryPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Workout Library</h1>
            <p className="mt-2 text-zinc-400">Searchable exercises, tags, and media — coming soon.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Category</div>
                    <div className="mt-1 text-xl font-semibold">Push · Chest/Shoulders/Triceps</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Category</div>
                    <div className="mt-1 text-xl font-semibold">Pull · Back/Biceps</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Category</div>
                    <div className="mt-1 text-xl font-semibold">Legs · Quads/Hamstrings/Glutes</div>
                </div>
            </div>
        </div>
    );
}
