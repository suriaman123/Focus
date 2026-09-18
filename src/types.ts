export type PetRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';

export type FocusMode = 'casual' | 'deep';

export interface PetDefinition {
  id: string;
  name: string;
  title: string;
  rarity: PetRarity;
  element: 'earth' | 'water' | 'air' | 'fire' | 'celestial' | 'void';
  description: string;
  quote: string;
  baseColor: string;
  accentColor: string;
  glowColor: string;
  silhouetteType: 'owl' | 'fox' | 'crane' | 'panther' | 'deer' | 'phoenix' | 'whale' | 'dragon' | 'moth' | 'serpent' | 'wolf' | 'kirin';
}

export interface OwnedPet {
  instanceId: string;
  petDefId: string;
  ageHours: number; // Focus hours accompanied + 12h bonus if duplicate
  duplicateCount: number;
  obtainedAt: string; // ISO string
  nickname?: string;
}

export interface Egg {
  id: string;
  createdAt: string;
  dateKey: string; // YYYY-MM-DD
  focusHours: number; // Accumulated focus hours on this egg
  isDestroyed?: boolean;
  source: 'daily' | 'streak_bonus' | 'task_reward';
}

export interface QuestTask {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  rewardType: 'egg' | 'pet_age';
  rewardAmount: number;
  completed: boolean;
  claimed: boolean;
  category: 'daily' | 'milestone';
}

export interface UserSanctuaryState {
  activeEgg: Egg | null;
  storedEggs: Egg[]; // extra eggs from streaks and tasks
  ownedPets: OwnedPet[];
  activeCompanionPetId: string | null; // instanceId
  lastLoginDate: string; // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  totalFocusSeconds: number;
  totalSessionsCompleted: number;
  tasks: QuestTask[];
  ambientSound: 'none' | 'rain' | 'theta' | 'bowl' | 'stream';
  ambientVolume: number;
  soundMuted: boolean;
  soundEffectsVolume: number;
}
