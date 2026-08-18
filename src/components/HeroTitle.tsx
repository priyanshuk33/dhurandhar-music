import React from 'react';

export const HeroTitle: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center select-none pt-2 sm:pt-4 pb-1">
      {/* Elegantly Proportioned Title placed higher up */}
      <div id="hero-dhurandhar-title" className="relative group">
        <h1
          id="title-english"
          className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#f2f2f2] drop-shadow-xl select-none"
          style={{
            fontFamily: "'Playfair Display', 'Rozha One', Georgia, serif",
            textShadow: '0 4px 25px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 255, 255, 0.12)',
          }}
        >
          DHURANDHAR
        </h1>
      </div>
    </div>
  );
};
