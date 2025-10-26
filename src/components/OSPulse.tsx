'use client';

export default function OSPulse({
    show,
    message,
    onDone,
}: {
    show: boolean;
    message: string;
    onDone: () => void;
}) {
    // TEMP SAFETY: Just render nothing so we isolate the crash source.
    if (!show) return null;
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs text-white/80">
            {message}
        </div>
    );
}
