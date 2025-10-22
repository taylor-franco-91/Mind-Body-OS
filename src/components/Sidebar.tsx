'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/program', label: '12-Week Program' },
    { href: '/check-in', label: 'Daily Check-in' },
    { href: '/library', label: 'Workout Library' },
    { href: '/messages', label: 'Coach Messages' },
    { href: '/community', label: 'Community' },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0c1424] text-white border-r border-white/10">
            <div className="px-5 py-6">
                <div className="text-xl font-extrabold tracking-wide">
                    <span className="text-emerald-400">MIND</span>BODY <span className="text-zinc-400">OS</span>
                </div>
                <nav className="mt-8 space-y-1">
                    {links.map((l) => {
                        const active = pathname === l.href;
                        return (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`block rounded-lg px-3 py-2 text-sm font-medium transition
                  ${active ? 'bg-emerald-400 text-black' : 'text-zinc-300 hover:bg-white/5'}`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
