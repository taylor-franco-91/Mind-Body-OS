'use client';

import Link from 'next/link';
import { useLocalStorage } from '@/lib/useLocalStorage';
import LastCheckInCard from '@/components/LastCheckInCard';
import TodaysPlanCard from '@/components/TodaysPlanCard';
import TodayOverview from '@/components/TodayOverview';
import MomentumStrip from '@/components/MomentumStrip';
import StreaksCard from '@/components/StreaksCard';
import RecentActivityCard from '@/components/RecentActivityCard';
import SectionHeader from '@/components/SectionHeader';


function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function accentForFeeling(feeling?: string) {
  switch (feeling) {
    case 'excellent': return { from: 'from-emerald-400', to: 'to-teal-300', text: 'text-emerald-300' };
    case 'good': return { from: 'from-cyan-400', to: 'to-sky-300', text: 'text-cyan-300' };
    case 'average': return { from: 'from-amber-300', to: 'to-yellow-200', text: 'text-amber-300' };
    case 'low': return { from: 'from-violet-400', to: 'to-indigo-300', text: 'text-indigo-300' };
    case 'exhausted': return { from: 'from-fuchsia-400', to: 'to-violet-300', text: 'text-fuchsia-300' };
    default: return { from: 'from-lime-400', to: 'to-cyan-400', text: 'text-emerald-300' };
  }
}

function coachCue(feeling?: string, hasData?: boolean) {
  if (!hasData) return 'Signal pending. Check in to calibrate your operating state.';
  switch (feeling) {
    case 'excellent': return 'Signal received. Readiness elevated—power blocks unlocked.';
    case 'good': return 'Recognition complete. Strength pacing recommended.';
    case 'average': return 'System steady. Balanced session deployed.';
    case 'low': return 'Load reduced. Precision technique blocks queued.';
    case 'exhausted': return 'Recovery bias engaged. Breathe, mobilize, reset.';
    default: return 'Calibration complete. Operate with intent.';
  }
}

export default function Page() {
  const [last] = useLocalStorage<any>('lastCheckIn', null);
  const today = new Date();
  const hasTodayCheckIn = last ? isSameDay(new Date(last.date), today) : false;
  const accent = accentForFeeling(last?.feeling);
  const aiActive = Boolean(last); // unlock moment: AI visible only after first check-in

  return (
    <div className="p-8">
      {/* Hero / Command header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] px-8 py-16 text-white">
        {/* subtle, living background */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -inset-[40%] animate-hero-shimmer bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(98,255,203,0.10),transparent),radial-gradient(800px_400px_at_90%_110%,rgba(0,242,255,0.08),transparent)]" />

        </div>

        <div className="relative mx-auto flex max-w-screen-md flex-col items-start text-left animate-fade-up">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Let’s get after it.
          </h1>
          <p className="mt-3 text-zinc-300">
            Today is yours to control.
          </p>

          {/* Calm, classified “recognized” cue */}
          <p className={`mt-3 text-sm ${accent.text}`}>
            {coachCue(last?.feeling, aiActive)}
          </p>

          {/* Intelligent CTA */}
          {hasTodayCheckIn ? (
            <Link
              href="/program"
              className={`mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-lg font-semibold
                         bg-gradient-to-r ${accent.from} ${accent.to} text-black hover:opacity-90 active:opacity-80 transition`}
            >
              View Today’s Plan
            </Link>
          ) : (
            <Link
              href="/check-in"
              className={`mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-lg font-semibold
                         bg-gradient-to-r ${accent.from} ${accent.to} text-black hover:opacity-90 active:opacity-80 transition`}
            >
              Start Today’s Check-in
            </Link>
          )}
        </div>
      </section>

      {/* Today Overview row */}
      <div className="mt-8 max-w-5xl mx-auto animate-fade-up [animation-delay:60ms]">
        <SectionHeader title="Today Overview" subtitle="Workout · Fuel · Mindset" />
        <TodayOverview />
        <MomentumStrip aiActive={aiActive} />
      </div>

      {/* Status cards row */}
      <div className="mt-8 max-w-5xl mx-auto animate-fade-up [animation-delay:120ms]">
        <SectionHeader title="Status" subtitle="Your latest check-in and today’s auto plan" />
        <div className="grid gap-6 md:grid-cols-2">
          <LastCheckInCard />
          <TodaysPlanCard aiActive={aiActive} />
        </div>
      </div>

      {/* Streaks + Activity */}
      <div className="mt-8 max-w-5xl mx-auto animate-fade-up [animation-delay:180ms]">
        <SectionHeader title="Momentum" subtitle="Consistency and recent actions" />
        <div className="grid gap-6 md:grid-cols-2">
          <StreaksCard />
          <RecentActivityCard />
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 z-20 md:hidden">
        <Link
          href={hasTodayCheckIn ? '/program' : '/check-in'}
          className={`shadow-xl rounded-full px-5 py-3 text-sm font-semibold text-black transition
                      bg-gradient-to-r ${accent.from} ${accent.to} hover:opacity-90 active:opacity-80`}
        >
          {hasTodayCheckIn ? 'Open Plan' : 'Check in'}
        </Link>
      </div>

      <style jsx global>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 420ms ease-out both; }
        @keyframes hero-shimmer { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
        .animate-hero-shimmer { animation: hero-shimmer 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
