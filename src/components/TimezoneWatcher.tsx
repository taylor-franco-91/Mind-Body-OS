'use client';
import { useEffect, useRef, useState } from 'react';
import OSPulse from './OSPulse';

const TZ_KEY = 'os_last_tz_v1';

function getTZ() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
}

export default function TimezoneWatcher() {
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const tzRef = useRef<string | null>(null);

    // init + store tz
    useEffect(() => {
        const current = getTZ();
        const stored = localStorage.getItem(TZ_KEY);
        tzRef.current = stored ?? current;
        if (!stored) localStorage.setItem(TZ_KEY, current);
    }, []);

    // helper to handle tz updates
    function handleTZChange(newTZ: string) {
        const prev = tzRef.current;
        if (!prev || prev === newTZ) return;
        tzRef.current = newTZ;
        localStorage.setItem(TZ_KEY, newTZ);

        // Dispatch global event so pages can realign logic without reload
        window.dispatchEvent(new CustomEvent('os:timezone-changed', { detail: { from: prev, to: newTZ } }));

        // Show composed, calm system message
        setMsg('Time zone updated — system realigned to local time.');
        setShow(true);
    }

    // react to tab focus (common travel scenario)
    useEffect(() => {
        function onFocus() {
            const current = getTZ();
            handleTZChange(current);
        }
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    // periodic light check (covers long sessions)
    useEffect(() => {
        const id = setInterval(() => {
            const current = getTZ();
            handleTZChange(current);
        }, 60_000); // 1 min
        return () => clearInterval(id);
    }, []);

    return (
        <OSPulse
            show={show}
            message={msg}
            onDone={() => setShow(false)}
        />
    );
}
