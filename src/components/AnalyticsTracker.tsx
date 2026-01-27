'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Basic debounce to avoid double counting in dev or rapid nav
        const timer = setTimeout(() => {
            fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: pathname,
                    referrer: document.referrer,
                }),
            }).catch((err) => console.error('Failed to send analytics:', err));
        }, 1000);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
