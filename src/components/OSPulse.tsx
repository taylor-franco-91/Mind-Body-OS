'use client';
import { useEffect } from 'react';

export default function OSPulse({
    show,
    message,
    onDone,
    duration = 3500,
}: {
    show: boolean;
    message: string;
    onDone?: () => void;
    duration?: number;
}) {
    useEffect(() => {
        if (!show) return;
        const id = setTimeout(() => onDone?.(), duration);
        return () => clearTimeout(id);
    }, [show, duration, onDone]);

    if (!show) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center">
            <div
                className="pointer-events-auto max-w-[90vw] rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm text-white shadow-[0_0_40px_rgba(0,255,200,0.25)]
                   backdrop-blur-md animate-[osPulse_450ms_ease-out] ring-1 ring-cyan-300/20"
            >
                {message}
            </div>
            <style jsx global>{`
        @keyframes osPulse {
          0% { transform: translateY(8px) scale(0.98); opacity: 0; }
          60% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-[osPulse_450ms_ease-out] { animation: osPulse 450ms ease-out; }
      `}</style>
        </div>
    );
}
