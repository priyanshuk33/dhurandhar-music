import React, { useState } from 'react';
import { EditionKey } from '../data/musicData';
import partOnePosterImg from '../data/partone.png';
import revengePosterImg from '../data/revenge.png';

interface BackgroundViewProps {
  currentEdition: EditionKey;
  posterUrl?: string;
  fallbackPosterUrl?: string;
  isPlaying: boolean;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({
  currentEdition,
  isPlaying,
}) => {
  const [partOneSrc, setPartOneSrc] = useState<string>(partOnePosterImg || '/partone.png');
  const [revengeSrc, setRevengeSrc] = useState<string>(revengePosterImg || '/revenge.png');

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none bg-neutral-950">
      {/* Layer 1: Part One Background Poster */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          currentEdition === 'part-one' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={partOneSrc}
          onError={() => setPartOneSrc('/partone.png')}
          alt="Dhurandhar Part One Poster Background"
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out"
          style={{
            filter: 'brightness(0.75) contrast(1.1) saturate(1.05)',
            transform: isPlaying && currentEdition === 'part-one' ? 'scale(1.02)' : 'scale(1.0)',
          }}
        />
      </div>

      {/* Layer 2: The Revenge Background Poster */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          currentEdition === 'the-revenge' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={revengeSrc}
          onError={() => setRevengeSrc('/revenge.png')}
          alt="Dhurandhar The Revenge Poster Background"
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out"
          style={{
            filter: 'brightness(0.72) contrast(1.15) saturate(1.1)',
            transform: isPlaying && currentEdition === 'the-revenge' ? 'scale(1.02)' : 'scale(1.0)',
          }}
        />
      </div>

      {/* Subtle Soft Contrast Vignette for readability while letting full poster artwork shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      {/* Ambient Red Glow for The Revenge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background:
            currentEdition === 'the-revenge'
              ? 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
