export default function MessagesPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Coach Messages</h1>
            <p className="mt-2 text-zinc-400">1:1 chat with you or your AI coach — coming soon.</p>

            <div className="mt-8 grid gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm text-zinc-400">Inbox</div>
                    <div className="mt-1 text-xl font-semibold">No messages yet</div>
                </div>
            </div>
        </div>
    );
}
