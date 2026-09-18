import React from 'react';
import { motion } from 'motion/react';
import { PetDefinition } from '../types';

interface PetArtworkProps {
  pet: PetDefinition;
  stage?: 'hatchling' | 'fledgling' | 'ascended';
  size?: number;
  interactive?: boolean;
  onPetClick?: () => void;
  showAura?: boolean;
}

export function getPetStage(ageHours: number): 'hatchling' | 'fledgling' | 'ascended' {
  if (ageHours >= 48) return 'ascended';
  if (ageHours >= 12) return 'fledgling';
  return 'hatchling';
}

export const STAGE_TITLES: Record<'hatchling' | 'fledgling' | 'ascended', string> = {
  hatchling: 'Hatchling',
  fledgling: 'Fledgling',
  ascended: 'Ascended Elder',
};

export const PetArtwork: React.FC<PetArtworkProps> = ({
  pet,
  stage = 'hatchling',
  size = 180,
  interactive = true,
  onPetClick,
  showAura = true,
}) => {
  const { silhouetteType, baseColor, accentColor, glowColor } = pet;

  // Determine aura ring effects based on evolution stage
  const auraRays = stage === 'ascended' ? 12 : stage === 'fledgling' ? 6 : 0;

  const renderSilhouette = () => {
    switch (silhouetteType) {
      case 'owl':
        return (
          <g>
            {/* Owl Body */}
            <motion.path
              d="M100 45 C75 45, 60 70, 60 110 C60 150, 75 165, 100 165 C125 165, 140 150, 140 110 C140 70, 125 45, 100 45 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
            {/* Wing details */}
            <path d="M62 90 C50 115, 55 145, 75 155" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M138 90 C150 115, 145 145, 125 155" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Feather geometric chest marks */}
            <path d="M85 110 L100 125 L115 110" stroke={accentColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M88 128 L100 140 L112 128" stroke={accentColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Brow Tufts */}
            <polygon points="75,52 60,32 82,45" fill={accentColor} />
            <polygon points="125,52 140,32 118,45" fill={accentColor} />
            {/* Eyes */}
            <circle cx="85" cy="72" r="9" fill="#0f172a" stroke={accentColor} strokeWidth="2" />
            <circle cx="115" cy="72" r="9" fill="#0f172a" stroke={accentColor} strokeWidth="2" />
            <circle cx="85" cy="72" r="3.5" fill="#fff" />
            <circle cx="115" cy="72" r="3.5" fill="#fff" />
            {/* Beak */}
            <polygon points="97,80 103,80 100,90" fill={accentColor} />
          </g>
        );

      case 'crane':
        return (
          <g>
            {/* Crane elegant neck and body */}
            <path
              d="M100 150 C75 150, 70 120, 85 110 C92 105, 96 90, 94 70 C92 50, 102 38, 108 38 C115 38, 120 45, 114 65 C109 82, 110 98, 115 110 C125 125, 120 150, 100 150 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
            {/* Beak */}
            <path d="M108 40 L145 44" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Crest */}
            <path d="M105 38 C98 32, 90 32, 85 35" stroke={accentColor} strokeWidth="2" fill="none" />
            {/* Eye */}
            <circle cx="106" cy="42" r="2.5" fill="#fff" />
            {/* Long legs */}
            <line x1="92" y1="150" x2="92" y2="185" stroke={accentColor} strokeWidth="2" />
            <line x1="108" y1="150" x2="108" y2="185" stroke={accentColor} strokeWidth="2" />
            {/* Wing curve */}
            <path d="M78 118 C65 130, 68 152, 95 145" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'deer':
        return (
          <g>
            {/* Deer body */}
            <path
              d="M80 160 C65 155, 65 125, 80 115 C90 108, 92 88, 95 72 C98 62, 108 62, 112 70 C116 80, 118 100, 125 115 C138 128, 132 155, 115 160 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
            {/* Antlers (blossoming branches) */}
            <path d="M96 64 C90 45, 78 35, 68 32 M82 42 C72 45, 65 44, 60 50 M88 52 C78 55, 72 58, 68 64" stroke={accentColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M110 64 C116 45, 128 35, 138 32 M124 42 C134 45, 141 44, 146 50 M118 52 C128 55, 134 58, 138 64" stroke={accentColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="98" cy="74" rx="2" ry="3" fill="#fff" />
            <ellipse cx="108" cy="74" rx="2" ry="3" fill="#fff" />
            {/* Muzzle */}
            <circle cx="103" cy="84" r="2.5" fill={accentColor} />
            {/* Sacred constellation marks */}
            <circle cx="103" cy="120" r="2" fill={accentColor} />
            <circle cx="95" cy="132" r="1.5" fill={accentColor} />
            <circle cx="111" cy="132" r="1.5" fill={accentColor} />
          </g>
        );

      case 'panther':
      case 'wolf':
        return (
          <g>
            {/* Head & torso */}
            <path
              d="M75 155 C65 140, 68 110, 80 98 L85 70 C88 58, 112 58, 115 70 L120 98 C132 110, 135 140, 125 155 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
            {/* Ears */}
            <polygon points="85,70 75,46 92,60" fill={accentColor} />
            <polygon points="115,70 125,46 108,60" fill={accentColor} />
            {/* Eyes glowing */}
            <polygon points="90,75 96,78 92,82" fill="#fff" />
            <polygon points="110,75 104,78 108,82" fill="#fff" />
            {/* Nose & Jaw */}
            <polygon points="100,88 97,84 103,84" fill={accentColor} />
            {/* Tail curve */}
            <path d="M125 150 C145 155, 155 135, 150 115 C146 100, 155 90, 158 85" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'phoenix':
        return (
          <g>
            {/* Phoenix Majestic Wings */}
            <motion.path
              d="M100 120 C80 90, 45 75, 25 90 C40 115, 65 130, 85 140 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ originX: '100px', originY: '120px' }}
            />
            <motion.path
              d="M100 120 C120 90, 155 75, 175 90 C160 115, 135 130, 115 140 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
              animate={{ rotate: [2, -3, 2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ originX: '100px', originY: '120px' }}
            />
            {/* Body */}
            <path d="M100 70 C90 70, 88 100, 92 135 C95 148, 105 148, 108 135 C112 100, 110 70, 100 70 Z" fill={baseColor} stroke={accentColor} strokeWidth="2" />
            {/* Crown Plumes */}
            <path d="M100 68 C96 42, 85 30, 75 25 M100 68 C100 38, 100 25, 100 18 M100 68 C104 42, 115 30, 125 25" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Flowing radiant tail feathers */}
            <path d="M96 145 C85 165, 78 185, 82 205" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M100 148 C100 170, 100 190, 100 210" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M104 145 C115 165, 122 185, 118 205" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Solar Core */}
            <circle cx="100" cy="100" r="7" fill={accentColor} />
            <circle cx="100" cy="100" r="3" fill="#fff" />
          </g>
        );

      case 'dragon':
      case 'kirin':
      case 'serpent':
        return (
          <g>
            {/* Mythical Celestial Serpent / Dragon */}
            <path
              d="M75 160 C50 135, 60 95, 95 85 C125 75, 140 55, 130 40 C118 25, 90 28, 80 45 C75 55, 65 60, 58 55"
              stroke={baseColor}
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M75 160 C50 135, 60 95, 95 85 C125 75, 140 55, 130 40 C118 25, 90 28, 80 45 C75 55, 65 60, 58 55"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Horns / Whiskers */}
            <path d="M130 40 L155 25" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M132 44 L158 42" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            {/* Orb of Focus */}
            <circle cx="100" cy="120" r="11" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="100" cy="120" r="5" fill={accentColor} />
            <circle cx="100" cy="120" r="2" fill="#fff" />
            {/* Constellation nodes along spine */}
            <circle cx="75" cy="160" r="3" fill={accentColor} />
            <circle cx="62" cy="115" r="3" fill={accentColor} />
            <circle cx="112" cy="78" r="3" fill={accentColor} />
            <circle cx="130" cy="40" r="3.5" fill="#fff" />
          </g>
        );

      case 'moth':
        return (
          <g>
            {/* Moth wings */}
            <path d="M100 100 C70 60, 30 70, 40 120 C50 145, 80 140, 100 115" fill={baseColor} stroke={accentColor} strokeWidth="2" />
            <path d="M100 100 C130 60, 170 70, 160 120 C150 145, 120 140, 100 115" fill={baseColor} stroke={accentColor} strokeWidth="2" />
            {/* Body */}
            <ellipse cx="100" cy="110" rx="7" ry="24" fill={accentColor} />
            {/* Antennae */}
            <path d="M96 90 C88 70, 75 60, 65 62" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M104 90 C112 70, 125 60, 135 62" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Eyespots on wings */}
            <circle cx="68" cy="105" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="68" cy="105" r="3" fill="#fff" />
            <circle cx="132" cy="105" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="132" cy="105" r="3" fill="#fff" />
          </g>
        );

      default:
        // Default graceful spirit fox
        return (
          <g>
            {/* Spirit Fox */}
            <path
              d="M70 155 C60 145, 62 115, 78 100 L84 72 C87 60, 113 60, 116 72 L122 100 C138 115, 140 145, 130 155 Z"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
            {/* Large pointed ears */}
            <polygon points="84,72 70,42 94,62" fill={accentColor} />
            <polygon points="116,72 130,42 106,62" fill={accentColor} />
            {/* Eyes */}
            <ellipse cx="90" cy="80" rx="3" ry="4" fill="#fff" />
            <ellipse cx="110" cy="80" rx="3" ry="4" fill="#fff" />
            {/* Snout */}
            <polygon points="100,92 96,88 104,88" fill={accentColor} />
            {/* Big fluffy tail */}
            <path
              d="M130 150 C160 145, 175 110, 160 85 C148 70, 135 80, 145 105 C150 120, 140 140, 125 152"
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="2"
            />
          </g>
        );
    }
  };

  return (
    <div
      id={`pet-artwork-${pet.id}`}
      onClick={onPetClick}
      className={`relative flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      }`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow */}
      {showAura && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: glowColor }}
          animate={{
            scale: [0.85, 1.08, 0.85],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Evolution Halo for Ascended & Fledgling */}
      {showAura && stage !== 'hatchling' && (
        <motion.div
          className="absolute inset-2 border rounded-full pointer-events-none"
          style={{
            borderColor: accentColor,
            opacity: stage === 'ascended' ? 0.6 : 0.3,
            borderStyle: stage === 'ascended' ? 'solid' : 'dashed',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Ascended rays */}
      {stage === 'ascended' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          {[...Array(auraRays)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-full"
              style={{
                transform: `rotate(${(360 / auraRays) * i}deg)`,
                background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main SVG Container */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-md"
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={interactive ? { scale: 1.06, y: -6 } : {}}
        whileTap={interactive ? { scale: 0.94 } : {}}
      >
        <defs>
          <radialGradient id={`glowGrad-${pet.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {renderSilhouette()}
      </motion.svg>
    </div>
  );
};
