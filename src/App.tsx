import React, { useState, useEffect, useCallback } from 'react';
import { FocusMode, UserSanctuaryState, Egg, PetDefinition } from './types';
import {
  loadSanctuaryState,
  saveSanctuaryState,
  processHatchEgg,
  createNewEgg,
  AutoHatchResult,
} from './utils/storage';
import { PET_REGISTRY } from './data/petsData';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { FocusTimer } from './components/FocusTimer';
import { Nursery } from './components/Nursery';
import { Playground } from './components/Playground';
import { TasksModal } from './components/TasksModal';
import { HatchModal } from './components/HatchModal';
import { EggDisplay } from './components/EggDisplay';
import { Sparkles, Moon, Flame, Heart, AlertCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<UserSanctuaryState>(() => loadSanctuaryState().state);
  const [activeTab, setActiveTab] = useState<'focus' | 'nursery' | 'playground' | 'tasks'>('focus');
  const [focusMode, setFocusMode] = useState<FocusMode>('casual');

  // Hatching Modal State
  const [hatchingPet, setHatchingPet] = useState<{
    pet: PetDefinition;
    isDuplicate: boolean;
    bonusHoursAdded: number;
  } | null>(null);

  // Auto-hatch notification on launch if midnight passed
  const [autoHatchBanner, setAutoHatchBanner] = useState<AutoHatchResult | null>(null);
  const [streakBanner, setStreakBanner] = useState<boolean>(false);

  // Initial load check for midnight auto-hatch or streak reward
  useEffect(() => {
    const { autoHatched, streakRewarded } = loadSanctuaryState();
    if (autoHatched) {
      setAutoHatchBanner(autoHatched);
    }
    if (streakRewarded) {
      setStreakBanner(true);
    }
  }, []);

  // Update storage whenever state changes
  const updateState = useCallback((updater: (prev: UserSanctuaryState) => UserSanctuaryState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSanctuaryState(next);
      return next;
    });
  }, []);

  // Companion pet instance
  const companionPet = state.ownedPets.find((p) => p.instanceId === state.activeCompanionPetId) || null;

  // Session completed (from timer)
  const handleSessionComplete = (durationSeconds: number, isDeepMode: boolean) => {
    const hoursEarned = durationSeconds / 3600;

    updateState((prev) => {
      // 1. Add hours to active egg (if exists and not destroyed)
      let updatedActiveEgg = prev.activeEgg;
      if (updatedActiveEgg && !updatedActiveEgg.isDestroyed) {
        updatedActiveEgg = {
          ...updatedActiveEgg,
          focusHours: updatedActiveEgg.focusHours + hoursEarned,
        };
      }

      // 2. Add hours to active companion pet's age
      const updatedPets = prev.ownedPets.map((p) => {
        if (p.instanceId === prev.activeCompanionPetId) {
          return {
            ...p,
            ageHours: p.ageHours + hoursEarned,
          };
        }
        return p;
      });

      // 3. Update task progress
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id === 'task_deep_focus_1' && isDeepMode && durationSeconds >= 25 * 60) {
          const newCurr = Math.min(task.target, task.current + 1);
          return { ...task, current: newCurr, completed: newCurr >= task.target };
        }
        if (task.id === 'task_focus_hours_2' && updatedActiveEgg) {
          const newCurr = Math.min(task.target, Number(updatedActiveEgg.focusHours.toFixed(1)));
          return { ...task, current: newCurr, completed: newCurr >= task.target };
        }
        if (task.id === 'task_legend_focus' && updatedActiveEgg) {
          const newCurr = Math.min(task.target, Number(updatedActiveEgg.focusHours.toFixed(1)));
          return { ...task, current: newCurr, completed: newCurr >= task.target };
        }
        if (task.id === 'task_companion_bond' && prev.activeCompanionPetId) {
          const companion = updatedPets.find((p) => p.instanceId === prev.activeCompanionPetId);
          const age = companion ? Math.min(task.target, Number(companion.ageHours.toFixed(1))) : task.current;
          return { ...task, current: age, completed: age >= task.target };
        }
        return task;
      });

      return {
        ...prev,
        activeEgg: updatedActiveEgg,
        ownedPets: updatedPets,
        totalFocusSeconds: prev.totalFocusSeconds + durationSeconds,
        totalSessionsCompleted: prev.totalSessionsCompleted + 1,
        tasks: updatedTasks,
      };
    });
  };

  // Egg destroyed during deep focus break
  const handleEggDestroyed = () => {
    updateState((prev) => {
      if (!prev.activeEgg) return prev;
      return {
        ...prev,
        activeEgg: {
          ...prev.activeEgg,
          isDestroyed: true,
        },
      };
    });
  };

  // Manual Hatch Trigger
  const handleTriggerHatch = () => {
    if (!state.activeEgg || state.activeEgg.isDestroyed) return;

    const result = processHatchEgg(state, state.activeEgg);
    setState(result.updatedState);

    // Open cinematic hatching modal
    setHatchingPet({
      pet: result.pet,
      isDuplicate: result.isDuplicate,
      bonusHoursAdded: result.bonusHoursAdded,
    });
  };

  // Claim fresh egg from nest if destroyed or hatched
  const handleClaimFreshEgg = () => {
    updateState((prev) => {
      let nextEgg: Egg;
      let nextStored = [...prev.storedEggs];
      if (nextStored.length > 0) {
        nextEgg = nextStored.shift()!;
      } else {
        nextEgg = createNewEgg('daily');
      }
      return {
        ...prev,
        activeEgg: nextEgg,
        storedEggs: nextStored,
      };
    });
  };

  // Activate a specific stored egg
  const handleActivateStoredEgg = (eggId: string) => {
    updateState((prev) => {
      const targetIndex = prev.storedEggs.findIndex((e) => e.id === eggId);
      if (targetIndex < 0) return prev;

      const target = prev.storedEggs[targetIndex];
      const remainingStored = prev.storedEggs.filter((e) => e.id !== eggId);

      // If there's an existing un-destroyed active egg, return it to stored
      const newStored = prev.activeEgg && !prev.activeEgg.isDestroyed
        ? [...remainingStored, prev.activeEgg]
        : remainingStored;

      return {
        ...prev,
        activeEgg: target,
        storedEggs: newStored,
      };
    });
  };

  // Set companion pet
  const handleSelectCompanion = (instanceId: string) => {
    updateState((prev) => ({
      ...prev,
      activeCompanionPetId: instanceId,
    }));
  };

  // Claim task reward
  const handleClaimReward = (taskId: string) => {
    updateState((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex < 0) return prev;
      const task = prev.tasks[taskIndex];
      if (!task.completed || task.claimed) return prev;

      const updatedTasks = [...prev.tasks];
      updatedTasks[taskIndex] = { ...task, claimed: true };

      let updatedStoredEggs = [...prev.storedEggs];
      let updatedPets = [...prev.ownedPets];

      if (task.rewardType === 'egg') {
        for (let i = 0; i < task.rewardAmount; i++) {
          updatedStoredEggs.push(createNewEgg('task_reward'));
        }
      } else if (task.rewardType === 'pet_age' && prev.activeCompanionPetId) {
        updatedPets = updatedPets.map((p) => {
          if (p.instanceId === prev.activeCompanionPetId) {
            return {
              ...p,
              ageHours: p.ageHours + task.rewardAmount,
            };
          }
          return p;
        });
      }

      return {
        ...prev,
        tasks: updatedTasks,
        storedEggs: updatedStoredEggs,
        ownedPets: updatedPets,
      };
    });
  };

  // Sound preferences
  const handleAmbientChange = (type: 'none' | 'rain' | 'theta' | 'bowl' | 'stream') => {
    updateState((prev) => ({ ...prev, ambientSound: type }));
  };

  const handleToggleMute = () => {
    const nextMute = !state.soundMuted;
    sound.setMute(nextMute);
    updateState((prev) => ({ ...prev, soundMuted: nextMute }));
  };

  // Data Export / Import for GitHub Pages
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kanso_focus_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.ownedPets)) {
            setState(parsed);
            saveSanctuaryState(parsed);
            alert('Sanctuary data successfully restored!');
          }
        } catch {
          alert('Invalid sanctuary backup file.');
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#ede8df] flex flex-col font-sans selection:bg-[#c8a97e]/25 selection:text-[#fff]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeEgg={state.activeEgg}
        petCount={state.ownedPets.length}
        streak={state.currentStreak}
        isMuted={state.soundMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Midnight Auto-Hatch Notification Banner if occurred */}
      {autoHatchBanner && (
        <div className="bg-[#1c2230] border-b border-white/10 px-4 py-3 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-[#c8a97e]" />
          <span className="text-xs text-[#ede8df]">
            <strong>Midnight Auto-Hatch Complete!</strong> Your yesterday egg incubated to{' '}
            <strong className="text-[#c8a97e]">{autoHatchBanner.pet.name}</strong> ({autoHatchBanner.pet.rarity}).
            {autoHatchBanner.isDuplicate && ' +12 hours infused to age!'}
          </span>
          <button
            onClick={() => {
              setHatchingPet({
                pet: autoHatchBanner.pet,
                isDuplicate: autoHatchBanner.isDuplicate,
                bonusHoursAdded: autoHatchBanner.bonusHoursAdded,
              });
              setAutoHatchBanner(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#c8a97e] text-[#0c0e12] text-[11px] font-medium ml-2"
          >
            View Reveal
          </button>
          <button
            onClick={() => setAutoHatchBanner(null)}
            className="text-[#8a8f98] hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 7-Day Streak Bonus Banner */}
      {streakBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center flex items-center justify-center gap-2 text-xs text-amber-200">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>7-Day Streak Milestone Reached! +1 Extra Companion Egg placed in your reserve nest!</span>
          <button onClick={() => setStreakBanner(false)} className="text-amber-400/80 hover:text-white ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col justify-start items-center w-full">
        {activeTab === 'focus' && (
          <div className="w-full py-4 sm:py-8">
            <FocusTimer
              mode={focusMode}
              onModeChange={setFocusMode}
              activeEgg={state.activeEgg}
              companionPet={companionPet}
              onSessionComplete={handleSessionComplete}
              onEggDestroyed={handleEggDestroyed}
              ambientSound={state.ambientSound}
              onAmbientChange={handleAmbientChange}
              isMuted={state.soundMuted}
              onToggleMute={handleToggleMute}
            />

            {/* Quick incubation status bar below timer */}
            {state.activeEgg && !state.activeEgg.isDestroyed && (
              <div className="max-w-md mx-auto mt-6 px-4">
                <div
                  onClick={() => setActiveTab('nursery')}
                  className="p-3.5 rounded-2xl bg-[#141720]/80 border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 rounded-full bg-gradient-to-b from-[#fff] to-[#998b7c] shadow-inner flex items-center justify-center text-[10px] font-bold text-[#0c0e12]">
                      ✦
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#ede8df] group-hover:text-white flex items-center gap-1.5">
                        Active Egg Incubating
                        <span className="text-[10px] font-mono text-[#c8a97e]">
                          ({state.activeEgg.focusHours.toFixed(1)}h)
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98]">
                        Tap to inspect in Hatchery or hatch now
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8a8f98] group-hover:text-[#ede8df] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nursery' && (
          <Nursery
            activeEgg={state.activeEgg}
            storedEggs={state.storedEggs}
            onHatchActiveEgg={handleTriggerHatch}
            onActivateStoredEgg={handleActivateStoredEgg}
            onClaimFreshEgg={handleClaimFreshEgg}
            streakCount={state.currentStreak}
          />
        )}

        {activeTab === 'playground' && (
          <Playground
            ownedPets={state.ownedPets}
            activeCompanionPetId={state.activeCompanionPetId}
            onSelectCompanion={handleSelectCompanion}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksModal
            tasks={state.tasks}
            onClaimReward={handleClaimReward}
            streak={state.currentStreak}
            longestStreak={state.longestStreak}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Cinematic Hatching Modal */}
      {hatchingPet && (
        <HatchModal
          pet={hatchingPet.pet}
          isDuplicate={hatchingPet.isDuplicate}
          bonusHoursAdded={hatchingPet.bonusHoursAdded}
          onClose={() => setHatchingPet(null)}
          onSetCompanion={() => {
            const petInstance = state.ownedPets.find((p) => p.petDefId === hatchingPet.pet.id);
            if (petInstance) {
              handleSelectCompanion(petInstance.instanceId);
            }
          }}
          isCurrentCompanion={companionPet?.petDefId === hatchingPet.pet.id}
        />
      )}

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/5 py-4 px-6 text-center text-xs text-[#626773] flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="font-serif italic text-[#8a8f98]">
          &ldquo;Stillness in action is the pinnacle of mastery.&rdquo;
        </span>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono text-[11px]">
          <span>Kanso Focus Sanctuary</span>
          <span>•</span>
          <span>GitHub Pages Compatible</span>
        </div>
      </footer>
    </div>
  );
}
