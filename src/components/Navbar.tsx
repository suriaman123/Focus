import React from 'react';
import { Sparkles, Compass, Gift, Clock, Volume2, VolumeX, Moon } from 'lucide-react';
import { Egg } from '../types';
import { getRarityTierForHours, RARITY_INFO } from '../data/petsData';

interface NavbarProps {
  activeTab: 'focus' | 'nursery' | 'playground' | 'tasks';
  onTabChange: (tab: 'focus' | 'nursery' | 'playground' | 'tasks') => void;
  activeEgg: Egg | null;
  petCount: number;
  streak: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeEgg,
  petCount,
  streak,
  isMuted,
  onToggleMute,
}) => {
  const eggHours = activeEgg?.focusHours || 0;
  const eggRarity = getRarityTierForHours(eggHours);
  const eggMeta = RARITY_INFO[eggRarity];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0c0e12]/85 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onTabChange('focus')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c8a97e] to-[#edd9bd] flex items-center justify-center text-[#0c0e12] shadow-sm group-hover:scale-105 transition-transform">
            <Moon className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-serif text-lg tracking-wide text-[#ede8df] font-semibold">
              Kanso
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#a89b8c] ml-1.5 hidden sm:inline">
              Focus Sanctuary
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-focus"
            onClick={() => onTabChange('focus')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'focus'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[#8a8f98] hover:text-[#ede8df] hover:bg-white/[0.03]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>

          <button
            id="nav-tab-nursery"
            onClick={() => onTabChange('nursery')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 relative ${
              activeTab === 'nursery'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[#8a8f98] hover:text-[#ede8df] hover:bg-white/[0.03]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c8a97e]" />
            <span>Hatchery</span>
            {activeEgg && !activeEgg.isDestroyed && (
              <span
                className="w-2 h-2 rounded-full ml-0.5 animate-pulse"
                style={{ backgroundColor: eggMeta.color }}
                title={`Active egg tier: ${eggMeta.label}`}
              />
            )}
          </button>

          <button
            id="nav-tab-playground"
            onClick={() => onTabChange('playground')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[#8a8f98] hover:text-[#ede8df] hover:bg-white/[0.03]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Playground</span>
            {petCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-[#c8a97e]">
                {petCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-tasks"
            onClick={() => onTabChange('tasks')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[#8a8f98] hover:text-[#ede8df] hover:bg-white/[0.03]'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Tasks</span>
            {streak > 0 && (
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded-full border border-amber-500/20">
                {streak}d
              </span>
            )}
          </button>
        </nav>

        {/* Audio Mute Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[#8a8f98] hover:text-[#ede8df] transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
