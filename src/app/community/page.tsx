export default function CommunityPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="mt-2 text-zinc-400">Progress posts, comments, and reactions — coming soon.</p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Today’s Highlights</div>
                    <div className="mt-1 text-xl font-semibold">No posts yet</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Your Recent Updates</div>
                    <div className="mt-1 text-xl font-semibold">Nothing to show (yet)</div>
                </div>
            </div>
        </div>
    );
}
