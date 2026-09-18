import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusMode, Egg, OwnedPet, PetDefinition } from '../types';
import { PET_REGISTRY, RARITY_INFO } from '../data/petsData';
import { PetArtwork, getPetStage } from './PetArtwork';
import { sound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';

interface FocusTimerProps {
  mode: FocusMode;
  onModeChange: (mode: FocusMode) => void;
  activeEgg: Egg | null;
  companionPet: OwnedPet | null;
  onSessionComplete: (durationSeconds: number, isDeepMode: boolean) => void;
  onEggDestroyed: () => void;
  ambientSound: 'none' | 'rain' | 'theta' | 'bowl' | 'stream';
  onAmbientChange: (soundType: 'none' | 'rain' | 'theta' | 'bowl' | 'stream') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const PRESET_DURATIONS = [
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
  { label: '90m', minutes: 90 },
];

export const FocusTimer: React.FC<FocusTimerProps> = ({
  mode,
  onModeChange,
  activeEgg,
  companionPet,
  onSessionComplete,
  onEggDestroyed,
  ambientSound,
  onAmbientChange,
  isMuted,
  onToggleMute,
}) => {
  // Target duration in minutes (used for deep mode countdown, and optional for casual)
  const [targetMinutes, setTargetMinutes] = useState<number>(25);
  // Seconds remaining (for countdown) or elapsed (for open casual)
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showDeepBreakModal, setShowDeepBreakModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const companionDef: PetDefinition | null = companionPet
    ? PET_REGISTRY[companionPet.petDefId] || null
    : null;

  // Reset when preset minutes changes in countdown mode
  const handleSelectPreset = (minutes: number) => {
    if (isRunning) return;
    setTargetMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setSecondsElapsed(0);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);

        if (mode === 'deep') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              // Deep session successfully completed!
              clearInterval(timerRef.current!);
              setIsRunning(false);
              sound.playSingingBowl(528, 4.5);
              onSessionComplete(targetMinutes * 60, true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, targetMinutes, onSessionComplete]);

  // Handle Play/Start
  const handleStart = () => {
    sound.playSingingBowl(432, 3);
    setIsRunning(true);
    if (ambientSound !== 'none') {
      sound.setAmbient(ambientSound);
    }
  };

  // Handle Pause
  const handlePause = () => {
    if (mode === 'deep') {
      // In deep mode, pausing triggers destruction covenant warning!
      setShowDeepBreakModal(true);
    } else {
      setIsRunning(false);
      sound.stopAmbient();
    }
  };

  // User confirms to abandon Deep Focus and destroy the egg
  const handleConfirmDestroyEgg = () => {
    setIsRunning(false);
    setShowDeepBreakModal(false);
    sound.stopAmbient();
    sound.playDestroy();
    onEggDestroyed();
  };

  // Casual Finish Session
  const handleFinishCasual = () => {
    if (secondsElapsed < 10) {
      setIsRunning(false);
      setSecondsElapsed(0);
      return;
    }
    setIsRunning(false);
    sound.stopAmbient();
    sound.playSingingBowl(528, 4);
    onSessionComplete(secondsElapsed, false);
    setSecondsElapsed(0);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Formatting helpers
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Progress percentage for circular ring
  const totalTargetSec = targetMinutes * 60;
  const progressFraction =
    mode === 'deep'
      ? Math.max(0, Math.min(1, (totalTargetSec - secondsLeft) / totalTargetSec))
      : (secondsElapsed % 3600) / 3600;

  const strokeDashoffset = 754 * (1 - progressFraction);

  return (
    <div
      id="focus-timer-sanctuary"
      className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-2 px-4"
    >
      {/* Focus Mode Selector Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#151821] border border-white/10 rounded-2xl mb-6 shadow-inner">
        <button
          id="btn-mode-casual"
          onClick={() => {
            if (!isRunning) onModeChange('casual');
          }}
          disabled={isRunning}
          className={`px-5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
            mode === 'casual'
              ? 'bg-[#222736] text-[#f4efe6] shadow-sm'
              : 'text-[#858c9b] hover:text-[#ede8df]'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Casual Focus
        </button>

        <button
          id="btn-mode-deep"
          onClick={() => {
            if (!isRunning) onModeChange('deep');
          }}
          disabled={isRunning}
          className={`px-5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
            mode === 'deep'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
              : 'text-[#858c9b] hover:text-[#ede8df]'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          Deep Focus (Strict)
        </button>
      </div>

      {/* Mode Subtext & Warning */}
      <div className="h-6 text-center mb-4">
        {mode === 'deep' ? (
          <p className="text-xs text-amber-400/90 flex items-center justify-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Deep Covenant: Pausing or abandoning will shatter your incubating egg!
          </p>
        ) : (
          <p className="text-xs text-[#8a8f98]">
            Gentle flow mode: Pause or resume anytime at your own cadence.
          </p>
        )}
      </div>

      {/* Preset Duration Buttons (Deep Mode or when not running) */}
      {mode === 'deep' && !isRunning && (
        <div className="flex items-center gap-2 mb-6">
          {PRESET_DURATIONS.map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => handleSelectPreset(preset.minutes)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                targetMinutes === preset.minutes
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-semibold'
                  : 'bg-white/[0.02] border-white/5 text-[#8a8f98] hover:bg-white/5'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Central Circular Dial / Companion Display */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
        {/* SVG Radial Track & Progress Bar */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r="115"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="130"
            cy="130"
            r="115"
            stroke={mode === 'deep' ? '#f59e0b' : '#c8a97e'}
            strokeWidth="7"
            strokeDasharray={722}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDashoffset: 722 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>

        {/* Interior Container: Companion Pet & Digital Timer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {/* Active Companion Pet if equipped */}
          {companionDef ? (
            <div className="relative -mt-3 mb-1">
              <PetArtwork
                pet={companionDef}
                stage={getPetStage(companionPet?.ageHours || 0)}
                size={isRunning ? 88 : 100}
                interactive={true}
                onPetClick={() => sound.playPetChime()}
                showAura={true}
              />
              <span className="text-[10px] uppercase tracking-wider text-[#a0a5b2] font-mono block -mt-1">
                {companionDef.name} ({companionPet?.ageHours.toFixed(1)}h)
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-[#717682] uppercase tracking-widest font-mono mb-2">
              Sanctuary Flow
            </div>
          )}

          {/* Big Digital Readout */}
          <div className="font-serif text-5xl sm:text-6xl font-light tracking-tight text-[#ede8df] drop-shadow-sm font-variant-numeric-tabular">
            {mode === 'deep' ? formatTime(secondsLeft) : formatTime(secondsElapsed)}
          </div>

          <div className="text-xs text-[#8a8f98] font-mono mt-1">
            {mode === 'deep' ? (isRunning ? 'Deep Immersion' : 'Ready') : isRunning ? 'Elapsed Focus' : 'Ready to begin'}
          </div>
        </div>
      </div>

      {/* Primary Timer Controls */}
      <div className="flex items-center gap-4 mt-6">
        {!isRunning ? (
          <button
            id="btn-start-focus"
            onClick={handleStart}
            className="px-8 py-3.5 rounded-2xl font-medium text-sm text-[#0c0e12] flex items-center gap-2.5 shadow-lg transition-transform active:scale-95"
            style={{
              backgroundColor: mode === 'deep' ? '#f59e0b' : '#c8a97e',
              boxShadow:
                mode === 'deep'
                  ? '0 0 25px -4px rgba(245, 158, 11, 0.4)'
                  : '0 0 25px -4px rgba(200, 169, 126, 0.35)',
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            Begin {mode === 'deep' ? 'Deep Focus' : 'Focus'}
          </button>
        ) : (
          <>
            <button
              id="btn-pause-focus"
              onClick={handlePause}
              className={`px-6 py-3.5 rounded-2xl font-medium text-sm flex items-center gap-2 border transition-all active:scale-95 ${
                mode === 'deep'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-white/10 hover:bg-white/15 text-[#ede8df] border-white/10'
              }`}
            >
              <Pause className="w-4 h-4" />
              {mode === 'deep' ? 'Break Covenant' : 'Pause'}
            </button>

            {mode === 'casual' && (
              <button
                id="btn-finish-casual-focus"
                onClick={handleFinishCasual}
                className="px-6 py-3.5 rounded-2xl font-medium text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish Session
              </button>
            )}
          </>
        )}
      </div>

      {/* Ambient Soundscape & Utility Dock */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8 p-2 rounded-2xl bg-[#13161f]/60 border border-white/5">
        {/* Soundscape Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#787e8d] px-2 font-mono uppercase tracking-wider">
            Soundscape:
          </span>
          {(['none', 'rain', 'theta', 'bowl', 'stream'] as const).map((snd) => (
            <button
              key={snd}
              onClick={() => {
                onAmbientChange(snd);
                if (isRunning) sound.setAmbient(snd);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                ambientSound === snd
                  ? 'bg-white/15 text-[#ede8df] font-medium'
                  : 'text-[#787e8d] hover:text-[#ede8df]'
              }`}
            >
              {snd}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-lg text-[#858c9b] hover:text-[#ede8df] hover:bg-white/5 transition-colors"
          title={isMuted ? 'Unmute Zen Sounds' : 'Mute Sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-[#858c9b] hover:text-[#ede8df] hover:bg-white/5 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Zen Mode'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Deep Focus Break Warning Modal */}
      <AnimatePresence>
        {showDeepBreakModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#161313] border border-red-900/50 rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center text-red-400 mb-3">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-red-100 mb-2">Break Deep Focus?</h3>
              <p className="text-xs text-red-200/80 leading-relaxed mb-6">
                You committed to a deep focus covenant. <strong>Pausing or surrendering now will shatter and destroy your active incubating egg!</strong>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeepBreakModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-[#ede8df] border border-white/10 transition-colors"
                >
                  Stay Focused (Protect Egg)
                </button>
                <button
                  onClick={handleConfirmDestroyEgg}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-red-800 hover:bg-red-700 text-white transition-colors"
                >
                  Surrender & Shatter Egg
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
