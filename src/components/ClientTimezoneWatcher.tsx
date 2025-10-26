'use client';
import { useEffect, useState } from 'react';

export default function ClientTimezoneWatcher() {
    const [Comp, setComp] = useState<null | React.ComponentType>(null);

    useEffect(() => {
        // Lazy-load only in the browser
        import('./TimezoneWatcher').then((m) => setComp(() => m.default));
    }, []);

    if (!Comp) return null;
    return <Comp />;
}
