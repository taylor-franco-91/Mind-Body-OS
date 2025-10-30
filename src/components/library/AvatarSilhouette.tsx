'use client';

type Mode = 'idle' | 'prep' | 'victory';

/**
 * Self-contained SVG with local (scoped) animations via styled-jsx.
 * No globals, no Date.now/Math.random in render = no hydration drama.
 */
export default function AvatarSilhouette({ mode = 'idle' }: { mode?: Mode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-400">Form Avatar</div>

            <div className="mt-3 grid place-items-center rounded-xl bg-black/30 p-6">
                <svg
                    viewBox="0 0 200 260"
                    className="h-64 w-40"
                    aria-hidden
                    role="img"
                >
                    {/* Head */}
                    <circle cx="100" cy="50" r="28" className="fill" />

                    {/* Torso */}
                    <rect x="80" y="78" width="40" height="70" rx="8" className={`fill ${mode === 'victory' ? 'victory-chest' : ''}`} />

                    {/* Arms */}
                    <g className={`${mode === 'victory' ? 'victory-arms' : ''}`}>
                        <rect x="50" y="85" width="25" height="12" rx="6" className="fill" />
                        <rect x="125" y="85" width="25" height="12" rx="6" className="fill" />
                    </g>

                    {/* Legs */}
                    <g className={`${mode === 'prep' ? 'prep-bounce' : ''}`}>
                        <rect x="82" y="150" width="14" height="60" rx="7" className="fill" />
                        <rect x="104" y="150" width="14" height="60" rx="7" className="fill" />
                    </g>

                    {/* Micro “breath” halo on prep */}
                    {mode === 'prep' && (
                        <circle cx="100" cy="50" r="34" className="halo" />
                    )}
                </svg>

                <div className="mt-3 text-xs text-zinc-500">
                    {mode === 'idle' && 'Idle — ready.'}
                    {mode === 'prep' && 'Locked in — light bounce & breath.'}
                    {mode === 'victory' && 'Session complete — composed victory.'}
                </div>
            </div>

            <style jsx>{`
        .fill { fill: rgba(255,255,255,0.08); }

        /* Subtle inhale/exhale glow around head */
        .halo {
          fill: none;
          stroke: rgba(163, 230, 53, 0.25);
          stroke-width: 2;
          transform-origin: 100px 50px;
          animation: breath 2.4s ease-in-out infinite;
        }
        @keyframes breath {
          0%   { transform: scale(1);   opacity: .35; }
          50%  { transform: scale(1.06); opacity: .18; }
          100% { transform: scale(1);   opacity: .35; }
        }

        /* Boxer micro bounce on legs (whole lower group nudges) */
        .prep-bounce {
          transform-origin: 100px 180px;
          animation: bounce 0.9s ease-in-out infinite;
        }
        @keyframes bounce {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-2.2px); }
          100% { transform: translateY(0); }
        }

        /* Victory posture: tiny chest open + arms set slightly */
        .victory-chest {
          transform-origin: 100px 110px;
          animation: chest 400ms ease both;
        }
        @keyframes chest {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-1.5px) scale(1.02); }
        }
        .victory-arms {
          transform-origin: 100px 90px;
          animation: arms 400ms ease both;
        }
        @keyframes arms {
          from { transform: translateY(0) }
          to   { transform: translateY(-1px) }
        }
      `}</style>
        </div>
    );
}
