'use client';
import { useEffect, useState } from 'react';

export default function DateBadge() {
    const [now, setNow] = useState(new Date());

    // keep it fresh if the page stays open (checks once a minute)
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);

    const formatted = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="text-sm text-zinc-400">
            {formatted}
        </div>
    );
}
