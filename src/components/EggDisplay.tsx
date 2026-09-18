import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Egg } from '../types';
import { getRarityTierForHours, RARITY_INFO } from '../data/petsData';
import { sound } from '../utils/audio';
import { Sparkles, AlertCircle, Clock, Flame } from 'lucide-react';

interface EggDisplayProps {
  egg: Egg | null;
  onHatchClick: () => void;
  isFocusing?: boolean;
}

export const EggDisplay: React.FC<EggDisplayProps> = ({
  egg,
  onHatchClick,
  isFocusing = false,
}) => {
  const [wobbleCount, setWobbleCount] = useState(0);

  if (!egg) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-[#14171f]/50 border border-white/5 rounded-3xl max-w-sm mx-auto">
        <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4 text-[#8a8f98]">
          <Clock className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="font-serif text-2xl text-[#ede8df] mb-2">The Sanctuary Awaits</h3>
        <p className="text-sm text-[#8a8f98] mb-4">
          You currently have no active egg incubating. Your nest will welcome a fresh free egg tomorrow at dawn, or select one from your reserve.
        </p>
      </div>
    );
  }

  const hours = egg.focusHours || 0;
  const currentTier = getRarityTierForHours(hours);
  const tierMeta = RARITY_INFO[currentTier];

  // Calculate next tier target
  let nextTierHours = 4;
  let nextTierName = 'Rare';
  if (hours >= 12) {
    nextTierHours = 14;
    nextTierName = 'Mythical (Hidden)';
  } else if (hours >= 8) {
    nextTierHours = 12;
    nextTierName = 'Legendary';
  } else if (hours >= 4) {
    nextTierHours = 8;
    nextTierName = 'Epic';
  }

  const progressToNext = hours >= 14 ? 100 : Math.min(100, Math.round((hours / nextTierHours) * 100));

  // Determine crack levels based on hours
  const crackLevel = hours >= 12 ? 3 : hours >= 8 ? 2 : hours >= 4 ? 1 : 0;

  const handleEggClick = () => {
    sound.playCrack();
    setWobbleCount((prev) => prev + 1);
  };

  // Autohatch countdown
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();
  const hoursUntilMidnight = Math.floor(msUntilMidnight / (1000 * 60 * 60));
  const minsUntilMidnight = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));

  if (egg.isDestroyed) {
    return (
      <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-red-950/20 border border-red-900/30 max-w-md mx-auto">
        <div className="w-24 h-24 mb-3 text-red-400 opacity-60 flex items-center justify-center">
          <AlertCircle className="w-16 h-16" />
        </div>
        <h3 className="font-serif text-2xl text-red-200 mb-1">Egg Fractured</h3>
        <p className="text-xs text-red-300/80 mb-4 max-w-xs">
          This egg was fractured when a Deep Focus session was prematurely interrupted.
        </p>
      </div>
    );
  }

  // Shell colors depending on current tier
  const shellGradients = {
    common: 'radial-gradient(circle at 35% 30%, #f4ede4 0%, #dcd3c5 50%, #9e9382 100%)',
    rare: 'radial-gradient(circle at 35% 30%, #e0f2fe 0%, #7dd3fc 45%, #0369a1 100%)',
    epic: 'radial-gradient(circle at 35% 30%, #f3e8ff 0%, #c084fc 45%, #581c87 100%)',
    legendary: 'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fbbf24 40%, #78350f 100%)',
    mythical: 'radial-gradient(circle at 35% 30%, #ffe4e6 0%, #f43f5e 40%, #4c0519 100%)',
  };

  return (
    <div id="egg-display-container" className="flex flex-col items-center text-center select-none relative">
      {/* Tier Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wider uppercase font-medium border"
          style={{
            backgroundColor: tierMeta.badgeBg,
            borderColor: tierMeta.borderColor,
            color: tierMeta.color,
          }}
        >
          <Sparkles className="w-3 h-3" />
          {tierMeta.label} Potential
        </span>

        {isFocusing && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
            <Flame className="w-3 h-3" /> Incubating
          </span>
        )}
      </div>

      {/* Egg Canvas with Aura and Wobble */}
      <div className="relative w-56 h-64 flex items-center justify-center cursor-pointer group" onClick={handleEggClick}>
        {/* Ambient Halo */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: tierMeta.glow }}
          animate={{
            scale: isFocusing ? [0.9, 1.25, 0.9] : [0.95, 1.08, 0.95],
            opacity: isFocusing ? [0.4, 0.8, 0.4] : [0.25, 0.5, 0.25],
          }}
          transition={{ duration: isFocusing ? 2 : 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* The Egg SVG with realistic shape & crack details */}
        <motion.div
          className="relative w-44 h-56 flex items-center justify-center"
          key={wobbleCount}
          animate={{
            y: [-4, 4, -4],
            rotate: wobbleCount > 0 ? [-5, 5, -3, 3, 0] : 0,
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 0.4 },
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="eggGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
              </linearGradient>

              {/* Glowing crack filter */}
              <filter id="crackGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Egg Outer Shell Geometry */}
            <path
              d="M100,10 C155,10 185,85 185,160 C185,225 145,250 100,250 C55,250 15,225 15,160 C15,85 45,10 100,10 Z"
              style={{ fill: `url(#eggGradient-${currentTier})` }}
            />

            {/* Inline dynamic gradient */}
            <radialGradient id={`eggGradient-${currentTier}`} cx="35%" cy="30%" r="70%">
              {currentTier === 'common' && (
                <>
                  <stop offset="0%" stopColor="#fdfbf7" />
                  <stop offset="50%" stopColor="#d9cec1" />
                  <stop offset="100%" stopColor="#8c8072" />
                </>
              )}
              {currentTier === 'rare' && (
                <>
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="45%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#075985" />
                </>
              )}
              {currentTier === 'epic' && (
                <>
                  <stop offset="0%" stopColor="#f5f3ff" />
                  <stop offset="45%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </>
              )}
              {currentTier === 'legendary' && (
                <>
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#78350f" />
                </>
              )}
              {currentTier === 'mythical' && (
                <>
                  <stop offset="0%" stopColor="#ffe4e6" />
                  <stop offset="45%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#310515" />
                </>
              )}
            </radialGradient>

            {/* Egg Shading Overlay */}
            <path
              d="M100,10 C155,10 185,85 185,160 C185,225 145,250 100,250 C55,250 15,225 15,160 C15,85 45,10 100,10 Z"
              fill="url(#eggGradLight)"
              opacity="0.3"
            />

            {/* Subtle egg surface sheen */}
            <ellipse cx="75" cy="65" rx="30" ry="45" transform="rotate(-25 75 65)" fill="#ffffff" opacity="0.25" />

            {/* Cracks based on crackLevel */}
            {crackLevel >= 1 && (
              <path
                d="M100,70 L108,82 L98,92 L112,105"
                stroke={tierMeta.color}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                filter="url(#crackGlow)"
              />
            )}

            {crackLevel >= 2 && (
              <g filter="url(#crackGlow)">
                <path d="M112,105 L125,118 L115,130 L135,142" stroke={tierMeta.color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M98,92 L80,105 L88,118" stroke={tierMeta.color} strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )}

            {crackLevel >= 3 && (
              <g filter="url(#crackGlow)">
                <path d="M135,142 L120,165 L140,185" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M88,118 L70,140 L78,160" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="112" cy="105" r="3" fill="#fff" />
                <circle cx="125" cy="118" r="3.5" fill="#fff" />
              </g>
            )}
          </svg>
        </motion.div>

        {/* Hover hint */}
        <div className="absolute -bottom-2 text-[11px] text-[#8a8f98] opacity-0 group-hover:opacity-80 transition-opacity">
          Click to tap egg
        </div>
      </div>

      {/* Incubation Meter */}
      <div className="w-full max-w-xs mt-3">
        <div className="flex justify-between items-center text-xs text-[#8a8f98] mb-1.5 font-medium">
          <span>{hours.toFixed(1)}h Incubated</span>
          <span>Next: {nextTierName} ({nextTierHours}h)</span>
        </div>

        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: tierMeta.color,
              boxShadow: `0 0 10px ${tierMeta.glow}`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (hours / nextTierHours) * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Threshold indicators */}
        <div className="flex justify-between text-[10px] text-[#636872] mt-1 font-mono">
          <span>0h (Common)</span>
          <span>4h (Rare)</span>
          <span>8h (Epic)</span>
          <span>12h+ (Legendary)</span>
        </div>
      </div>

      {/* Action Buttons: Hatch Now / Auto-hatch note */}
      <div className="flex flex-col items-center gap-2 mt-6">
        <button
          id="btn-hatch-egg-now"
          onClick={onHatchClick}
          className="px-6 py-2.5 rounded-xl font-medium text-sm text-[#0c0e12] transition-all transform active:scale-95 shadow-lg flex items-center gap-2"
          style={{
            backgroundColor: tierMeta.color,
            boxShadow: `0 0 20px -2px ${tierMeta.glow}`,
          }}
        >
          <Sparkles className="w-4 h-4" />
          Hatch Egg Now ({tierMeta.label})
        </button>

        <p className="text-[11px] text-[#717682] flex items-center gap-1.5 mt-1">
          <Clock className="w-3 h-3 opacity-60" />
          Hatch anytime, or autohatch in {hoursUntilMidnight}h {minsUntilMidnight}m (12:00 AM)
        </p>
      </div>
    </div>
  );
};
