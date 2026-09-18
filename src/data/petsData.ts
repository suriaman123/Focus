import { PetDefinition, PetRarity } from '../types';

export const PET_REGISTRY: Record<string, PetDefinition> = {
  // COMMON PETS (0 - 4h tier)
  'kanso_owl': {
    id: 'kanso_owl',
    name: 'Kanso Owl',
    title: 'Silent Observer of Dawn',
    rarity: 'common',
    element: 'air',
    description: 'A tranquil nocturnal guardian that perches beside still waters, treasuring quiet dedication.',
    quote: 'In quietude, the deepest thoughts find their wings.',
    baseColor: '#8a7f72',
    accentColor: '#d6cbbe',
    glowColor: 'rgba(214, 203, 190, 0.4)',
    silhouetteType: 'owl',
  },
  'moss_hare': {
    id: 'moss_hare',
    name: 'Moss Hare',
    title: 'Dweller of the Undergrowth',
    rarity: 'common',
    element: 'earth',
    description: 'Gentle and swift, its velvet ears sense the subtle rhythm of a focused mind.',
    quote: 'Patience transforms small moments into grand sanctuaries.',
    baseColor: '#6e7a68',
    accentColor: '#b4c4ab',
    glowColor: 'rgba(180, 196, 171, 0.4)',
    silhouetteType: 'fox',
  },
  'dune_fox': {
    id: 'dune_fox',
    name: 'Sable Fox',
    title: 'Nomad of the Silent Sands',
    rarity: 'common',
    element: 'earth',
    description: 'Treads with feather-light steps across barren dunes, finding clarity in vast emptiness.',
    quote: 'Solitude is not absence, but the fertile ground of creation.',
    baseColor: '#967456',
    accentColor: '#e0bb97',
    glowColor: 'rgba(224, 187, 151, 0.4)',
    silhouetteType: 'fox',
  },
  'mist_crane': {
    id: 'mist_crane',
    name: 'Mist Crane',
    title: 'Herald of Still Ponds',
    rarity: 'common',
    element: 'water',
    description: 'Stands unmoving in misty waters for hours, a living testament to poised stillness.',
    quote: 'Do not hurry the river; it knows the way to the sea.',
    baseColor: '#788896',
    accentColor: '#c7d6e5',
    glowColor: 'rgba(199, 214, 229, 0.4)',
    silhouetteType: 'crane',
  },

  // RARE PETS (4 - 8h tier)
  'sylvan_deer': {
    id: 'sylvan_deer',
    name: 'Sylvan Deer',
    title: 'Keeper of Ancient Groves',
    rarity: 'rare',
    element: 'earth',
    description: 'Antlers blossoming with radiant flora, it steps through ancient woods with solemn grace.',
    quote: 'Root deeply into the present, and your spirit will touch the canopy.',
    baseColor: '#3d6350',
    accentColor: '#6ee7b7',
    glowColor: 'rgba(110, 231, 183, 0.5)',
    silhouetteType: 'deer',
  },
  'cobalt_falcon': {
    id: 'cobalt_falcon',
    name: 'Cobalt Falcon',
    title: 'Sovereign of the Stratosphere',
    rarity: 'rare',
    element: 'air',
    description: 'Soars above clouds with laser precision, gliding effortlessly without flapping a wing.',
    quote: 'From great elevation, all distractions dwindle into insignificance.',
    baseColor: '#2b4c7e',
    accentColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.5)',
    silhouetteType: 'owl',
  },
  'moon_crane': {
    id: 'moon_crane',
    name: 'Moonlight Crane',
    title: 'Weaver of Silver Ripples',
    rarity: 'rare',
    element: 'water',
    description: 'Its plumage catches the silver sheen of midnight, radiating calm reflective energy.',
    quote: 'The moon reflects clearly only in waters that are tranquil.',
    baseColor: '#475569',
    accentColor: '#93c5fd',
    glowColor: 'rgba(147, 197, 253, 0.5)',
    silhouetteType: 'crane',
  },
  'frost_wolf': {
    id: 'frost_wolf',
    name: 'Glacier Wolf',
    title: 'Sentinel of the Tundra',
    rarity: 'rare',
    element: 'water',
    description: 'Its eyes reflect crystalline clarity. It moves with unwavering focus through icy blizzards.',
    quote: 'Stand firm against the chill of hesitation.',
    baseColor: '#334155',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    silhouetteType: 'wolf',
  },

  // EPIC PETS (8 - 12h tier)
  'obsidian_panther': {
    id: 'obsidian_panther',
    name: 'Obsidian Panther',
    title: 'Phantom of Twilight Focus',
    rarity: 'epic',
    element: 'void',
    description: 'Sleek as molten glass, unseen in shadows, it embodies the intense power of deep flow states.',
    quote: 'In total absorption, the boundary between observer and deed dissolves.',
    baseColor: '#18181b',
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.6)',
    silhouetteType: 'panther',
  },
  'solar_lynx': {
    id: 'solar_lynx',
    name: 'Solar Lynx',
    title: 'Igniter of the Inner Flame',
    rarity: 'epic',
    element: 'fire',
    description: 'Possesses tufted ears of living gold amber, channeling raw creative vitality.',
    quote: 'Ignite your purpose; let distractions turn to ash.',
    baseColor: '#78350f',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    silhouetteType: 'fox',
  },
  'abyssal_whale': {
    id: 'abyssal_whale',
    name: 'Abyssal Whale',
    title: 'Singer of Ocean Depths',
    rarity: 'epic',
    element: 'water',
    description: 'Drifts across fathomless abysses with ancient resonance, unaffected by surface tempests.',
    quote: 'Descend beneath surface noise into profound stillness.',
    baseColor: '#0f172a',
    accentColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.6)',
    silhouetteType: 'whale',
  },
  'storm_moth': {
    id: 'storm_moth',
    name: 'Thunder Moth',
    title: 'Seeker of Divine Luminescence',
    rarity: 'epic',
    element: 'air',
    description: 'Wing spans veined with subtle static lightning, drawn exclusively to authentic mastery.',
    quote: 'Seek the true light, not the flickering lures.',
    baseColor: '#312e81',
    accentColor: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.6)',
    silhouetteType: 'moth',
  },

  // LEGENDARY PETS (12h+ tier)
  'aether_phoenix': {
    id: 'aether_phoenix',
    name: 'Aether Phoenix',
    title: 'Incarnate of Unyielding Will',
    rarity: 'legendary',
    element: 'celestial',
    description: 'Forged in the crucible of countless disciplined hours, reborn with wings of radiant amber gold.',
    quote: 'Through discipline, time ceases to be a shackle and becomes pure wings.',
    baseColor: '#451a03',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.8)',
    silhouetteType: 'phoenix',
  },
  'chrono_dragon': {
    id: 'chrono_dragon',
    name: 'Chrono Wyrm',
    title: 'Guardian of Timeless Hours',
    rarity: 'legendary',
    element: 'celestial',
    description: 'Scales carved with cosmic sundials. He who focuses twelve hours bends time to his will.',
    quote: 'Master yourself, and every second expands into eternity.',
    baseColor: '#1e1b4b',
    accentColor: '#e2e8f0',
    glowColor: 'rgba(234, 179, 8, 0.75)',
    silhouetteType: 'dragon',
  },
  'celestial_kirin': {
    id: 'celestial_kirin',
    name: 'Celestial Kirin',
    title: 'Auspicious Sage of Harmony',
    rarity: 'legendary',
    element: 'celestial',
    description: 'Leaves trails of sacred starlight with each deliberate step, bringing serene focus to its master.',
    quote: 'Grace is simply strength disciplined by harmony.',
    baseColor: '#142a36',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.8)',
    silhouetteType: 'kirin',
  },

  // MYTHICAL PETS (Hidden 5th Tier - Revealed under mystical devotion)
  'astral_oroboros': {
    id: 'astral_oroboros',
    name: 'Astral Ouroboros',
    title: 'The Eternal Cycle of Focus',
    rarity: 'mythical',
    element: 'void',
    description: 'A mythical secret celestial entity wrapped in stardust and event horizons. Awakens only for masters of extreme dedication.',
    quote: 'The beginning is the end, and the journey itself is the prize.',
    baseColor: '#09090b',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.9)',
    silhouetteType: 'serpent',
  },
  'void_starweaver': {
    id: 'void_starweaver',
    name: 'Void Starweaver',
    title: 'Architect of the Cosmos',
    rarity: 'mythical',
    element: 'celestial',
    description: 'A mythical hidden patron that weaves nebulae from uninterrupted focus. Known only in whispered legends.',
    quote: 'When silence is absolute, constellations begin to hum.',
    baseColor: '#020617',
    accentColor: '#e879f9',
    glowColor: 'rgba(232, 121, 249, 0.9)',
    silhouetteType: 'dragon',
  },
};

export const RARITY_INFO: Record<PetRarity, {
  label: string;
  minHours: number;
  color: string;
  badgeBg: string;
  borderColor: string;
  glow: string;
}> = {
  common: {
    label: 'Common',
    minHours: 0,
    color: '#d6cbbe',
    badgeBg: 'rgba(214, 203, 190, 0.1)',
    borderColor: 'rgba(214, 203, 190, 0.25)',
    glow: 'rgba(214, 203, 190, 0.3)',
  },
  rare: {
    label: 'Rare',
    minHours: 4,
    color: '#60a5fa',
    badgeBg: 'rgba(96, 165, 250, 0.12)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
    glow: 'rgba(96, 165, 250, 0.4)',
  },
  epic: {
    label: 'Epic',
    minHours: 8,
    color: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.12)',
    borderColor: 'rgba(192, 132, 252, 0.3)',
    glow: 'rgba(192, 132, 252, 0.45)',
  },
  legendary: {
    label: 'Legendary',
    minHours: 12,
    color: '#fbbf24',
    badgeBg: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.35)',
    glow: 'rgba(251, 191, 36, 0.55)',
  },
  mythical: {
    label: 'Mythical (Hidden)',
    minHours: 14,
    color: '#f43f5e',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    glow: 'rgba(244, 63, 94, 0.65)',
  },
};

/**
 * Determine hatching tier from accumulated focus hours
 */
export function getRarityTierForHours(hours: number): PetRarity {
  if (hours >= 14) {
    // 35% chance to unlock hidden Mythical if focus is 14h+, else guaranteed Legendary
    return Math.random() < 0.4 ? 'mythical' : 'legendary';
  }
  if (hours >= 12) return 'legendary';
  if (hours >= 8) return 'epic';
  if (hours >= 4) return 'rare';
  return 'common';
}

/**
 * Pick a random pet definition based on target rarity
 */
export function getRandomPetByRarity(targetRarity: PetRarity): PetDefinition {
  const pool = Object.values(PET_REGISTRY).filter((p) => p.rarity === targetRarity);
  if (pool.length === 0) {
    // fallback
    return Object.values(PET_REGISTRY)[0];
  }
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
