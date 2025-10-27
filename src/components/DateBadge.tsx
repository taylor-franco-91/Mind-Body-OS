'use client';
import { useEffect, useState } from 'react';

export default function DateBadge() {
    const [mounted, setMounted] = useState(false);
    const [label, setLabel] = useState('');

    useEffect(() => {
        setMounted(true);
        const fmt = new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        setLabel(fmt.format(new Date()));
    }, []);

    if (!mounted) return null; // avoid SSR/client text mismatch

    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
            {label}
        </div>
    );
}
