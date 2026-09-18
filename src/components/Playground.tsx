import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OwnedPet, PetDefinition, PetRarity } from '../types';
import { PET_REGISTRY, RARITY_INFO } from '../data/petsData';
import { PetArtwork, getPetStage, STAGE_TITLES } from './PetArtwork';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Check, Clock, ShieldCheck, Compass, Info, Feather } from 'lucide-react';

interface PlaygroundProps {
  ownedPets: OwnedPet[];
  activeCompanionPetId: string | null;
  onSelectCompanion: (instanceId: string) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  ownedPets,
  activeCompanionPetId,
  onSelectCompanion,
}) => {
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [inspectPet, setInspectPet] = useState<{ owned: OwnedPet; def: PetDefinition } | null>(null);
  const [pettingFeedbackId, setPettingFeedbackId] = useState<string | null>(null);

  // Group owned pets by definition
  const totalRegistryCount = Object.keys(PET_REGISTRY).length;
  const uniqueOwnedCount = new Set(ownedPets.map((p) => p.petDefId)).size;
  const totalBondedHours = ownedPets.reduce((acc, p) => acc + p.ageHours, 0);

  // Filter list
  const filteredOwned = ownedPets.filter((op) => {
    const def = PET_REGISTRY[op.petDefId];
    if (!def) return false;
    if (selectedRarity === 'all') return true;
    return def.rarity === selectedRarity;
  });

  const handlePet = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    sound.playPetChime();
    setPettingFeedbackId(instanceId);
    setTimeout(() => {
      setPettingFeedbackId((prev) => (prev === instanceId ? null : prev));
    }, 1200);
  };

  return (
    <div id="sanctuary-playground" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c8a97e] mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            Celestial Fauna Compendium
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] font-light">
            Sanctuary Playground
          </h1>
          <p className="text-xs sm:text-sm text-[#8a8f98] max-w-lg mt-1">
            Where your hatched companions rest and evolve. Every hour focused together deepens their age and unlocks transcendent celestial stages.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-[#141720]/80 p-3.5 rounded-2xl border border-white/5 shrink-0">
          <div>
            <div className="text-[10px] text-[#8a8f98] uppercase tracking-wider font-mono">Discovered</div>
            <div className="font-serif text-xl text-[#ede8df]">
              {uniqueOwnedCount} <span className="text-xs text-[#8a8f98] font-sans">/ {totalRegistryCount}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-[10px] text-[#8a8f98] uppercase tracking-wider font-mono">Total Bond</div>
            <div className="font-serif text-xl text-[#c8a97e]">
              {totalBondedHours.toFixed(1)} <span className="text-xs font-sans">hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedRarity('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            selectedRarity === 'all'
              ? 'bg-[#ede8df] text-[#0c0e12]'
              : 'bg-[#151821] text-[#8a8f98] hover:text-[#ede8df] border border-white/5'
          }`}
        >
          All Creatures ({ownedPets.length})
        </button>

        {(['common', 'rare', 'epic', 'legendary', 'mythical'] as PetRarity[]).map((r) => {
          const info = RARITY_INFO[r];
          const count = ownedPets.filter((p) => PET_REGISTRY[p.petDefId]?.rarity === r).length;
          return (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                selectedRarity === r
                  ? 'text-white'
                  : 'text-[#8a8f98] hover:text-[#ede8df] bg-[#151821]/60'
              }`}
              style={{
                borderColor: selectedRarity === r ? info.borderColor : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: selectedRarity === r ? info.badgeBg : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOwned.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#13161f]/40 border border-white/5 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#8a8f98] mb-3">
            <Feather className="w-6 h-6 opacity-40" />
          </div>
          <h3 className="font-serif text-xl text-[#ede8df] mb-1">
            {selectedRarity === 'all' ? 'Your Sanctuary is Quiet' : `No ${selectedRarity} companions yet`}
          </h3>
          <p className="text-xs text-[#8a8f98] max-w-sm">
            Nurture your daily eggs with focus hours to hatch creatures of this tier into your playground.
          </p>
        </div>
      )}

      {/* Pets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredOwned.map((owned) => {
          const def = PET_REGISTRY[owned.petDefId];
          if (!def) return null;

          const isCompanion = activeCompanionPetId === owned.instanceId;
          const stage = getPetStage(owned.ageHours);
          const rarityMeta = RARITY_INFO[def.rarity];
          const isPetting = pettingFeedbackId === owned.instanceId;

          return (
            <motion.div
              key={owned.instanceId}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setInspectPet({ owned, def })}
              className={`group relative p-5 rounded-3xl bg-[#13161f] border transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:border-white/20 hover:shadow-xl ${
                isCompanion ? 'ring-1 ring-amber-400/40 border-amber-500/30' : 'border-white/5'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between z-10">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border"
                  style={{
                    color: rarityMeta.color,
                    borderColor: rarityMeta.borderColor,
                    backgroundColor: rarityMeta.badgeBg,
                  }}
                >
                  {rarityMeta.label}
                </span>

                {isCompanion && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Check className="w-3 h-3" /> Companion
                  </span>
                )}
              </div>

              {/* Artwork stage */}
              <div className="relative h-44 flex items-center justify-center my-1">
                <PetArtwork
                  pet={def}
                  stage={stage}
                  size={140}
                  interactive={true}
                  onPetClick={() => {}}
                />

                {/* Floating Heart / Sparkle on Petting */}
                <AnimatePresence>
                  {isPetting && (
                    <motion.div
                      initial={{ scale: 0.5, y: 0, opacity: 1 }}
                      animate={{ scale: 1.4, y: -45, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-30 pointer-events-none flex items-center gap-1 text-rose-400"
                    >
                      <Heart className="w-5 h-5 fill-rose-400" />
                      <span className="text-[11px] font-mono text-rose-300">+Bond</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Info */}
              <div className="z-10 mt-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-serif text-lg font-medium text-[#ede8df] group-hover:text-white transition-colors">
                    {def.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#a0a5b2]">{STAGE_TITLES[stage]}</span>
                </div>

                <p className="text-[11px] text-[#787e8d] line-clamp-1 italic mb-3">
                  &ldquo;{def.quote}&rdquo;
                </p>

                {/* Age & Quick Action bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-[#c8a97e] font-mono">
                    <Clock className="w-3.5 h-3.5 opacity-75" />
                    <span>{owned.ageHours.toFixed(1)}h age</span>
                    {owned.duplicateCount > 0 && (
                      <span className="text-[10px] text-[#717682] ml-0.5">
                        (+{owned.duplicateCount * 12}h dupe)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handlePet(e, owned.instanceId)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8a8f98] hover:text-rose-400 transition-colors"
                      title="Pet your companion"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>

                    {!isCompanion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompanion(owned.instanceId);
                          sound.playSingingBowl(528, 2);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 hover:bg-white/10 text-[#ede8df] border border-white/10 transition-colors"
                        title="Accompany during focus"
                      >
                        Accompany
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Inspect Pet Modal / Drawer */}
      <AnimatePresence>
        {inspectPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#12151d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Ambient Glow */}
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: inspectPet.def.glowColor }}
              />

              {/* Close button */}
              <button
                onClick={() => setInspectPet(null)}
                className="absolute top-5 right-5 text-[#8a8f98] hover:text-white text-sm"
              >
                ✕
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Pet visual */}
                <PetArtwork
                  pet={inspectPet.def}
                  stage={getPetStage(inspectPet.owned.ageHours)}
                  size={160}
                  interactive={true}
                  onPetClick={() => sound.playPetChime()}
                />

                <span
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border my-2"
                  style={{
                    color: RARITY_INFO[inspectPet.def.rarity].color,
                    borderColor: RARITY_INFO[inspectPet.def.rarity].borderColor,
                    backgroundColor: RARITY_INFO[inspectPet.def.rarity].badgeBg,
                  }}
                >
                  {RARITY_INFO[inspectPet.def.rarity].label} • {inspectPet.def.element}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#ede8df] font-medium mt-1">
                  {inspectPet.def.name}
                </h2>
                <p className="text-xs uppercase tracking-wider text-[#8a8f98] mb-4">
                  {inspectPet.def.title}
                </p>

                {/* Lore / Quote */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left mb-5 w-full">
                  <p className="text-xs italic font-serif text-[#c8a97e] mb-2">
                    &ldquo;{inspectPet.def.quote}&rdquo;
                  </p>
                  <p className="text-xs text-[#8a8f98] leading-relaxed">
                    {inspectPet.def.description}
                  </p>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-3 gap-2 w-full mb-6">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#787e8d] font-mono uppercase">Age / Bond</div>
                    <div className="text-sm font-semibold text-[#ede8df] mt-0.5">
                      {inspectPet.owned.ageHours.toFixed(1)} hrs
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#787e8d] font-mono uppercase">Stage</div>
                    <div className="text-sm font-semibold text-[#c8a97e] mt-0.5">
                      {STAGE_TITLES[getPetStage(inspectPet.owned.ageHours)]}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#787e8d] font-mono uppercase">Duplicates</div>
                    <div className="text-sm font-semibold text-[#ede8df] mt-0.5">
                      {inspectPet.owned.duplicateCount} (+{inspectPet.owned.duplicateCount * 12}h)
                    </div>
                  </div>
                </div>

                {/* Companion Toggle Button */}
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => {
                      onSelectCompanion(inspectPet.owned.instanceId);
                      sound.playSingingBowl(528, 2);
                      setInspectPet(null);
                    }}
                    className={`flex-1 py-3 rounded-2xl text-xs font-medium transition-all ${
                      activeCompanionPetId === inspectPet.owned.instanceId
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#ede8df] text-[#0c0e12] hover:bg-white'
                    }`}
                  >
                    {activeCompanionPetId === inspectPet.owned.instanceId
                      ? 'Active Companion'
                      : 'Choose as Focus Companion'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
