'use client';

import { useEffect, useState } from 'react';

type Props = {
    show: boolean;
    message: string;
    onDone: () => void;
    /** how long the banner stays visible (ms) */
    durationMs?: number;
};

/**
 * Subtle bottom-center pulse banner.
 * - Client-only
 * - No SVG filters or special characters
 * - Uses simple Tailwind transitions
 */
export default function OSPulse({ show, message, onDone, durationMs = 3200 }: Props) {
    const [visible, setVisible] = useState(false);

    // When show flips true, reveal, then auto-dismiss after durationMs
    useEffect(() => {
        if (!show) return;
        setVisible(true);

        const t = setTimeout(() => {
            // animate out
            setVisible(false);
            // call parent after the exit transition finishes
            const exitDelay = 220; // should match transition duration below
            const t2 = setTimeout(() => onDone(), exitDelay);
            return () => clearTimeout(t2);
        }, durationMs);

        return () => clearTimeout(t);
    }, [show, durationMs, onDone]);

    // Render nothing if not showing and not visible
    if (!show && !visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
        fixed bottom-4 left-1/2 z-50 -translate-x-1/2 
        rounded-full border border-white/15 bg-white/10 backdrop-blur 
        px-4 py-2 text-xs text-white/90 shadow-xl
        transition-all duration-200
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
        >
            {message}
        </div>
    );
}
