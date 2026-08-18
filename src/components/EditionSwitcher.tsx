import React from 'react';
import { EditionKey } from '../data/musicData';

interface EditionSwitcherProps {
  currentEdition: EditionKey;
  onSelectEdition: (edition: EditionKey) => void;
}

export const EditionSwitcher: React.FC<EditionSwitcherProps> = ({
  currentEdition,
  onSelectEdition,
}) => {
  const isRevenge = currentEdition === 'the-revenge';

  return (
    <div className="flex items-center justify-center select-none">
      {/* Soft Round Slideable Capsule Container with Zero Flicker CSS Transition */}
      <div
        id="edition-switcher-pill"
        className={`relative w-64 sm:w-72 h-10 bg-black/80 backdrop-blur-2xl border p-1 rounded-full flex items-center transition-colors duration-500 shadow-xl shadow-black/40 ${
          isRevenge ? 'border-red-600/50 ring-1 ring-red-600/30' : 'border-white/20 ring-1 ring-white/10'
        }`}
      >
        {/* Sliding Indicator Pill (Pure CSS - Zero Re-render Flicker) */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out shadow-md ${
            isRevenge
              ? 'translate-x-[calc(100%+4px)] bg-gradient-to-r from-red-700 via-red-600 to-rose-700'
              : 'translate-x-0 bg-white'
          }`}
        />

        {/* Part One Option Button */}
        <button
          id="edition-btn-part-one"
          onClick={() => onSelectEdition('part-one')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
            !isRevenge ? 'text-black font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          Part One
        </button>

        {/* The Revenge Option Button */}
        <button
          id="edition-btn-the-revenge"
          onClick={() => onSelectEdition('the-revenge')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
            isRevenge ? 'text-white font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          The Revenge
        </button>
      </div>
    </div>
  );
};
