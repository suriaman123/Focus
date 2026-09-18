import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PetDefinition } from '../types';
import { PetArtwork } from './PetArtwork';
import { RARITY_INFO } from '../data/petsData';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Check, Clock, Feather } from 'lucide-react';

interface HatchModalProps {
  pet: PetDefinition;
  isDuplicate: boolean;
  bonusHoursAdded: number;
  onClose: () => void;
  onSetCompanion: () => void;
  isCurrentCompanion: boolean;
}

export const HatchModal: React.FC<HatchModalProps> = ({
  pet,
  isDuplicate,
  bonusHoursAdded,
  onClose,
  onSetCompanion,
  isCurrentCompanion,
}) => {
  // Sequence phases: 'anticipation' -> 'cracking' -> 'revealed'
  const [phase, setPhase] = useState<'anticipation' | 'cracking' | 'revealed'>('anticipation');
  const [hasInteracted, setHasInteracted] = useState(false);
  const rarityMeta = RARITY_INFO[pet.rarity];

  useEffect(() => {
    // Start hatching animation sequence
    const t1 = setTimeout(() => {
      setPhase('cracking');
      sound.playCrack();
    }, 1200);

    const t2 = setTimeout(() => {
      sound.playCrack();
    }, 2000);

    const t3 = setTimeout(() => {
      setPhase('revealed');
      sound.playHatchFanfare(pet.rarity === 'legendary' || pet.rarity === 'mythical');

      // Trigger elegant confetti
      const confettiColors = [rarityMeta.color, '#ede8df', '#c8a97e'];
      confetti({
        particleCount: pet.rarity === 'mythical' || pet.rarity === 'legendary' ? 120 : 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: confettiColors,
        disableForReducedMotion: true,
      });
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pet, rarityMeta]);

  const handlePetCompanion = () => {
    sound.playPetChime();
    setHasInteracted(true);
  };

  return (
    <div id="hatch-cinematic-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090c]/90 backdrop-blur-md">
      {/* Background ambient lighting */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at center, ${rarityMeta.glow} 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'revealed' ? 0.6 : 0.2 }}
        transition={{ duration: 1.5 }}
      />

      <div className="relative z-10 w-full max-w-lg bg-[#12151c]/95 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center overflow-hidden">
        {/* Top Hatching Phase Title */}
        <div className="mb-4">
          <span
            className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border inline-block"
            style={{
              borderColor: rarityMeta.borderColor,
              color: rarityMeta.color,
              backgroundColor: rarityMeta.badgeBg,
            }}
          >
            {phase === 'revealed' ? `${rarityMeta.label} Awakened` : 'Incubation Complete'}
          </span>
        </div>

        {/* Dynamic Animation Area */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          <AnimatePresence mode="wait">
            {phase !== 'revealed' ? (
              <motion.div
                key="egg-cracking-visual"
                className="relative flex items-center justify-center"
                animate={
                  phase === 'cracking'
                    ? {
                        x: [-6, 6, -5, 5, -2, 2, 0],
                        y: [-2, 2, -3, 3, 0],
                        scale: [1, 1.08, 1.15],
                      }
                    : {
                        y: [-4, 4, -4],
                      }
                }
                transition={
                  phase === 'cracking'
                    ? { duration: 1.6, ease: 'easeInOut' }
                    : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                {/* Glowing light rays leaking from shell */}
                {phase === 'cracking' && (
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl pointer-events-none"
                    style={{ backgroundColor: rarityMeta.color }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.9 }}
                    transition={{ duration: 1.5 }}
                  />
                )}

                <svg viewBox="0 0 200 260" className="w-40 h-52 drop-shadow-2xl">
                  <defs>
                    <radialGradient id="modalEggGrad" cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="45%" stopColor={rarityMeta.color} />
                      <stop offset="100%" stopColor="#1a1c23" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M100,10 C155,10 185,85 185,160 C185,225 145,250 100,250 C55,250 15,225 15,160 C15,85 45,10 100,10 Z"
                    fill="url(#modalEggGrad)"
                  />
                  {phase === 'cracking' && (
                    <motion.path
                      d="M100,20 L115,60 L85,95 L125,140 L75,185 L100,240"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="pet-revealed-visual"
                initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                className="relative flex items-center justify-center"
              >
                <PetArtwork
                  pet={pet}
                  size={200}
                  interactive={true}
                  onPetClick={handlePetCompanion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Narrative & Reveal Information */}
        {phase === 'revealed' ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-3xl font-semibold text-[#ede8df] tracking-wide mb-1">
              {pet.name}
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#a1a7b5] mb-2 font-medium">
              {pet.title}
            </p>

            {/* Duplicate Notice */}
            {isDuplicate ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="my-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2 max-w-sm"
              >
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Duplicate Discovered!</strong> Nurturing your existing bond:{' '}
                  <span className="font-bold text-amber-300">+{bonusHoursAdded} Hours</span> added to its Age!
                </span>
              </motion.div>
            ) : (
              <div className="my-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Sanctuary Companion Welcomed!</span>
              </div>
            )}

            {/* Pet Quote & Lore */}
            <div className="my-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 max-w-md">
              <p className="text-xs italic text-[#c4b5a2] font-serif mb-1.5">
                &ldquo;{pet.quote}&rdquo;
              </p>
              <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                {pet.description}
              </p>
            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 w-full">
              <button
                id="btn-pet-revealed-companion"
                onClick={handlePetCompanion}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#ede8df] flex items-center gap-1.5 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${hasInteracted ? 'text-rose-400 fill-rose-400' : 'text-[#8a8f98]'}`} />
                {hasInteracted ? 'Bonded!' : 'Pet Companion'}
              </button>

              <button
                id="btn-set-revealed-active-companion"
                onClick={onSetCompanion}
                disabled={isCurrentCompanion}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                  isCurrentCompanion
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/10 hover:bg-white/15 text-[#ede8df] border border-white/15'
                }`}
              >
                {isCurrentCompanion ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Active Companion
                  </>
                ) : (
                  <>
                    <Feather className="w-3.5 h-3.5" /> Set as Focus Companion
                  </>
                )}
              </button>

              <button
                id="btn-close-hatch-modal"
                onClick={onClose}
                className="px-6 py-2 rounded-xl font-medium text-xs text-[#0c0e12] transition-transform active:scale-95 shadow-md"
                style={{ backgroundColor: rarityMeta.color }}
              >
                Continue to Sanctuary
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2">
            <p className="text-sm font-serif text-[#ede8df] animate-pulse">
              {phase === 'cracking' ? 'The shell is fracturing with radiant starlight...' : 'Attuning with your dedicated focus...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
