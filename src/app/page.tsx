'use client';

import Link from 'next/link';
import { useLocalStorage } from '@/lib/useLocalStorage';
import LastCheckInCard from '@/components/LastCheckInCard';
import TodaysPlanCard from '@/components/TodaysPlanCard';
import TodayOverview from '@/components/TodayOverview';
import MomentumStrip from '@/components/MomentumStrip';
import StreaksCard from '@/components/StreaksCard';
import RecentActivityCard from '@/components/RecentActivityCard';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function Page() {
  const [last] = useLocalStorage<any>('lastCheckIn', null);
  const today = new Date();
  const hasTodayCheckIn = last ? isSameDay(new Date(last.date), today) : false;

  return (
    <div className="p-8">
      {/* Hero / Command header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(98,255,203,0.15),transparent),radial-gradient(800px_400px_at_90%_110%,rgba(0,242,255,0.12),transparent),#0a0a0a] px-8 py-16 text-white">
        <div className="absolute inset-0 opacity-40 blur-3xl" />
        <div className="relative mx-auto flex max-w-screen-md flex-col items-start text-left">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Let’s get after it.
          </h1>
          <p className="mt-3 text-zinc-300">
            Today is yours to control.
          </p>

          {/* Intelligent CTA */}
          {hasTodayCheckIn ? (
            <Link
              href="/program"
              className="mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-lg font-semibold
                         bg-gradient-to-r from-lime-400 to-cyan-400 text-black hover:opacity-90 active:opacity-80 transition"
            >
              View Today’s Plan
            </Link>
          ) : (
            <Link
              href="/check-in"
              className="mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-lg font-semibold
                         bg-gradient-to-r from-lime-400 to-cyan-400 text-black hover:opacity-90 active:opacity-80 transition"
            >
              Start Today’s Check-in
            </Link>
          )}
        </div>
      </section>

      {/* Today Overview row */}
      <div className="mt-8">
        <TodayOverview />
        <MomentumStrip />
      </div>

      {/* Status cards row */}
      <div className="mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
        <LastCheckInCard />
        <TodaysPlanCard />
      </div>

      {/* Streaks + Activity */}
      <div className="mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
        <StreaksCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}
