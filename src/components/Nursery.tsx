import React from 'react';
import { motion } from 'motion/react';
import { Egg } from '../types';
import { EggDisplay } from './EggDisplay';
import { RARITY_INFO } from '../data/petsData';
import { Sparkles, Calendar, Award, Info, PlusCircle, RefreshCw } from 'lucide-react';

interface NurseryProps {
  activeEgg: Egg | null;
  storedEggs: Egg[];
  onHatchActiveEgg: () => void;
  onActivateStoredEgg: (eggId: string) => void;
  onClaimFreshEgg: () => void;
  streakCount: number;
}

export const Nursery: React.FC<NurseryProps> = ({
  activeEgg,
  storedEggs,
  onHatchActiveEgg,
  onActivateStoredEgg,
  onClaimFreshEgg,
  streakCount,
}) => {
  return (
    <div id="egg-nursery-sanctuary" className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#c8a97e] bg-[#c8a97e]/10 px-3 py-1 rounded-full border border-[#c8a97e]/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Incubation Chamber
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] font-light">
          Daily Egg Hatchery
        </h1>
        <p className="text-xs sm:text-sm text-[#8a8f98] mt-1.5">
          Your daily egg absorbs every second of your focus. Deepen your dedication to raise its tier before hatching, or let it auto-hatch at midnight.
        </p>
      </div>

      {/* Main Center Stage: Active Egg */}
      <div className="bg-[#12151d] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-10">
        {/* Subtle radial background backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c8a97e]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <EggDisplay
            egg={activeEgg}
            onHatchClick={onHatchActiveEgg}
            isFocusing={false}
          />

          {/* If egg is missing or destroyed, provide button to start a new egg */}
          {(!activeEgg || activeEgg.isDestroyed) && (
            <div className="mt-6">
              <button
                onClick={onClaimFreshEgg}
                className="px-6 py-2.5 rounded-xl text-xs font-medium bg-[#c8a97e] hover:bg-[#d6b78d] text-[#0c0e12] flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Prepare New Egg for Nest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Egg Reserve & Tier Codex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stored Eggs / Reserve Nest */}
        <div className="bg-[#12151d] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-[#ede8df] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c8a97e]" />
              Egg Reserve ({storedEggs.length})
            </h3>
            <span className="text-[11px] font-mono text-[#8a8f98]">
              Streak & Task Rewards
            </span>
          </div>

          <p className="text-xs text-[#8a8f98] mb-4">
            Earn bonus eggs by maintaining your 7-day streak or completing sanctuary milestones.
          </p>

          {storedEggs.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
              <p className="text-xs text-[#717682]">
                Your egg reserve is currently empty.
              </p>
              <p className="text-[11px] text-[#555a64] mt-1">
                Reach day 7 of your login streak or claim tasks to earn extra eggs!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {storedEggs.map((egg, idx) => (
                <div
                  key={egg.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-11 rounded-full bg-gradient-to-b from-[#f5ede4] to-[#a89b8c] shadow-sm flex items-center justify-center text-[10px] font-bold text-[#0c0e12]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#ede8df]">
                        {egg.source === 'streak_bonus' ? '7-Day Streak Bonus Egg' : 'Sanctuary Milestone Egg'}
                      </div>
                      <div className="text-[10px] text-[#787e8d] font-mono">
                        {egg.focusHours > 0 ? `${egg.focusHours.toFixed(1)}h pre-incubated` : 'Fresh & unincubated'}
                      </div>
                    </div>
                  </div>

                  {!activeEgg && (
                    <button
                      onClick={() => onActivateStoredEgg(egg.id)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/15 text-[#ede8df] transition-colors"
                    >
                      Place in Nest
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Streak Progress Note */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#8a8f98] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c8a97e]" />
              Current Streak: <strong className="text-[#ede8df]">{streakCount} Days</strong>
            </span>
            <span className="text-[11px] font-mono text-[#c8a97e]">
              {7 - (streakCount % 7 || 7)} days until next bonus egg
            </span>
          </div>
        </div>

        {/* Tier Codex & Rules */}
        <div className="bg-[#12151d] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-[#ede8df] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#c8a97e]" />
              Incubation Tier Rules
            </h3>
            <span className="text-[11px] font-mono text-[#8a8f98]">Focus Logic</span>
          </div>

          <p className="text-xs text-[#8a8f98] mb-4">
            The creature awaiting inside evolves as your focus hours grow:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d6cbbe]" />
                <span className="font-medium text-[#ede8df]">Common Pet</span>
              </div>
              <span className="font-mono text-[#8a8f98]">0h – 3.9h</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                <span className="font-medium text-[#ede8df]">Rare Pet</span>
              </div>
              <span className="font-mono text-[#60a5fa]">4h – 7.9h</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
                <span className="font-medium text-[#ede8df]">Epic Pet</span>
              </div>
              <span className="font-mono text-[#c084fc]">8h – 11.9h</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                <span className="font-medium text-[#ede8df]">Legendary Pet</span>
              </div>
              <span className="font-mono text-[#fbbf24]">12h+</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-rose-500/20 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                <span className="font-medium text-rose-300">Mythical Pet (Hidden)</span>
              </div>
              <span className="font-mono text-rose-400">14h+ / Secret Transcendent</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
            <strong>Duplicate Blessing:</strong> If you hatch a creature you already possess, it automatically infuses <strong>+12 hours</strong> directly into that companion&apos;s age and bond!
          </div>
        </div>
      </div>
    </div>
  );
};
