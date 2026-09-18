import { Egg, OwnedPet, UserSanctuaryState, PetDefinition } from '../types';
import { INITIAL_TASKS } from '../data/tasksData';
import { getRarityTierForHours, getRandomPetByRarity, PET_REGISTRY } from '../data/petsData';

const STORAGE_KEY = 'kanso_focus_sanctuary_v1';

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createNewEgg(source: 'daily' | 'streak_bonus' | 'task_reward' = 'daily'): Egg {
  return {
    id: `egg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    dateKey: getTodayDateKey(),
    focusHours: 0,
    source,
  };
}

const DEFAULT_STATE: UserSanctuaryState = {
  activeEgg: createNewEgg('daily'),
  storedEggs: [],
  ownedPets: [],
  activeCompanionPetId: null,
  lastLoginDate: getTodayDateKey(),
  currentStreak: 1,
  longestStreak: 1,
  totalFocusSeconds: 0,
  totalSessionsCompleted: 0,
  tasks: INITIAL_TASKS,
  ambientSound: 'none',
  ambientVolume: 0.5,
  soundMuted: false,
  soundEffectsVolume: 0.7,
};

export interface AutoHatchResult {
  egg: Egg;
  pet: PetDefinition;
  isDuplicate: boolean;
  bonusHoursAdded: number;
}

export function loadSanctuaryState(): {
  state: UserSanctuaryState;
  autoHatched: AutoHatchResult | null;
  streakRewarded: boolean;
} {
  let state = DEFAULT_STATE;
  let autoHatched: AutoHatchResult | null = null;
  let streakRewarded = false;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    state = DEFAULT_STATE;
  }

  const today = getTodayDateKey();

  // Check if calendar date changed (Day Rollover / Autohatch at 12am)
  if (state.lastLoginDate !== today) {
    const lastDate = new Date(state.lastLoginDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // 1. Auto-hatch active egg from previous day if it exists and wasn't destroyed
    if (state.activeEgg && !state.activeEgg.isDestroyed) {
      const eggToHatch = state.activeEgg;
      const rarity = getRarityTierForHours(eggToHatch.focusHours);
      const petDef = getRandomPetByRarity(rarity);

      // Apply duplicate rule: if already owned, add 12 hours to age
      const existingPetIndex = state.ownedPets.findIndex((p) => p.petDefId === petDef.id);
      let isDuplicate = false;
      let bonusHours = 0;

      if (existingPetIndex >= 0) {
        isDuplicate = true;
        bonusHours = 12;
        state.ownedPets[existingPetIndex].ageHours += 12;
        state.ownedPets[existingPetIndex].duplicateCount = (state.ownedPets[existingPetIndex].duplicateCount || 0) + 1;
      } else {
        const newPet: OwnedPet = {
          instanceId: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          petDefId: petDef.id,
          ageHours: 0,
          duplicateCount: 0,
          obtainedAt: new Date().toISOString(),
        };
        state.ownedPets.push(newPet);
        if (!state.activeCompanionPetId) {
          state.activeCompanionPetId = newPet.instanceId;
        }
      }

      autoHatched = {
        egg: eggToHatch,
        pet: petDef,
        isDuplicate,
        bonusHoursAdded: bonusHours,
      };
      state.activeEgg = null;
    }

    // 2. Streak logic
    if (diffDays === 1) {
      state.currentStreak += 1;
      if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
      }
      // 7-day streak reward: extra bonus egg!
      if (state.currentStreak % 7 === 0) {
        state.storedEggs.push(createNewEgg('streak_bonus'));
        streakRewarded = true;
      }
    } else if (diffDays > 1) {
      state.currentStreak = 1;
    }

    // 3. Daily free egg for today if no active egg
    if (!state.activeEgg) {
      if (state.storedEggs.length > 0) {
        // Can make a fresh daily egg
        state.activeEgg = createNewEgg('daily');
      } else {
        state.activeEgg = createNewEgg('daily');
      }
    }

    // Refresh daily tasks for the new day
    state.tasks = state.tasks.map((task) => {
      if (task.category === 'daily') {
        return {
          ...task,
          current: 0,
          completed: false,
          claimed: false,
        };
      }
      return task;
    });

    state.lastLoginDate = today;
    saveSanctuaryState(state);
  }

  // Ensure active egg exists
  if (!state.activeEgg && state.storedEggs.length > 0) {
    state.activeEgg = state.storedEggs.shift() || null;
    saveSanctuaryState(state);
  } else if (!state.activeEgg) {
    state.activeEgg = createNewEgg('daily');
    saveSanctuaryState(state);
  }

  return { state, autoHatched, streakRewarded };
}

export function saveSanctuaryState(state: UserSanctuaryState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

/**
 * Hatch an egg explicitly (user triggers manual hatch or auto-hatch)
 */
export function processHatchEgg(
  state: UserSanctuaryState,
  targetEgg: Egg
): {
  updatedState: UserSanctuaryState;
  pet: PetDefinition;
  isDuplicate: boolean;
  bonusHoursAdded: number;
} {
  const rarity = getRarityTierForHours(targetEgg.focusHours);
  const petDef = getRandomPetByRarity(rarity);

  const ownedPets = [...state.ownedPets];
  const existingIndex = ownedPets.findIndex((p) => p.petDefId === petDef.id);
  let isDuplicate = false;
  let bonusHoursAdded = 0;

  if (existingIndex >= 0) {
    isDuplicate = true;
    bonusHoursAdded = 12;
    ownedPets[existingIndex] = {
      ...ownedPets[existingIndex],
      ageHours: ownedPets[existingIndex].ageHours + 12,
      duplicateCount: (ownedPets[existingIndex].duplicateCount || 0) + 1,
    };
  } else {
    const newPet: OwnedPet = {
      instanceId: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      petDefId: petDef.id,
      ageHours: 0,
      duplicateCount: 0,
      obtainedAt: new Date().toISOString(),
    };
    ownedPets.push(newPet);
  }

  // Remove hatched egg
  let newActiveEgg: Egg | null = null;
  const newStoredEggs = [...state.storedEggs];

  if (state.activeEgg && state.activeEgg.id === targetEgg.id) {
    // If we have stored eggs, promote next egg to active
    if (newStoredEggs.length > 0) {
      newActiveEgg = newStoredEggs.shift() || null;
    } else {
      // User can incubate next egg tomorrow or use a bonus egg
      newActiveEgg = null;
    }
  } else {
    // Egg was in storedEggs
    const storedIndex = newStoredEggs.findIndex((e) => e.id === targetEgg.id);
    if (storedIndex >= 0) {
      newStoredEggs.splice(storedIndex, 1);
    }
    newActiveEgg = state.activeEgg;
  }

  // Update tasks for hatching
  const updatedTasks = state.tasks.map((task) => {
    if (task.id === 'task_hatch_master') {
      const newCurrent = Math.min(task.target, task.current + 1);
      return {
        ...task,
        current: newCurrent,
        completed: newCurrent >= task.target,
      };
    }
    return task;
  });

  const updatedState: UserSanctuaryState = {
    ...state,
    activeEgg: newActiveEgg,
    storedEggs: newStoredEggs,
    ownedPets,
    tasks: updatedTasks,
  };

  saveSanctuaryState(updatedState);
  return { updatedState, pet: petDef, isDuplicate, bonusHoursAdded };
}
