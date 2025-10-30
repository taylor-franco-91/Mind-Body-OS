// src/lib/sessionBus.ts
'use client';

type SessionPayload = {
    week: number;
    dayKey: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    title: string;
    blocks: { kind: string; detail: string }[];
};

const KEY = 'os_active_session_v1';
const STATUS_KEY = 'os_active_session_status_v1'; // 'idle' | 'in-progress' | 'completed'

export function setActiveSession(payload: SessionPayload) {
    localStorage.setItem(KEY, JSON.stringify(payload));
    localStorage.setItem(STATUS_KEY, 'in-progress'); // when starting from Program, we consider it started
    window.dispatchEvent(new Event('os:session-updated'));
}

export function getActiveSession(): { data: SessionPayload | null; status: 'idle' | 'in-progress' | 'completed' } {
    try {
        const raw = localStorage.getItem(KEY);
        const status = (localStorage.getItem(STATUS_KEY) as 'idle' | 'in-progress' | 'completed') || 'idle';
        if (!raw) return { data: null, status };
        return { data: JSON.parse(raw) as SessionPayload, status };
    } catch {
        return { data: null, status: 'idle' };
    }
}

export function setSessionStatus(status: 'idle' | 'in-progress' | 'completed') {
    localStorage.setItem(STATUS_KEY, status);
    window.dispatchEvent(new Event('os:session-updated'));
}

export function clearActiveSession() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(STATUS_KEY);
    window.dispatchEvent(new Event('os:session-cleared'));
}
