import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { ChevronDown, RefreshCw } from 'lucide-react';

interface QuoteCardProps {
  quotes: Quote[];
  onScrollOrExplore?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quotes, onScrollOrExplore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentQuote = quotes[currentIndex] || quotes[0];

  const handleNextQuote = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setIsFading(false);
    }, 200);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextQuote();
    }, 18000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-xl px-4 my-1 sm:my-2 pb-2">
      {/* Editorial Dialogue Box with Hairline Border */}
      <div
        id="nostalgia-quote-box"
        onClick={handleNextQuote}
        className="group relative w-full bg-[#0d0d0d]/90 hover:bg-[#141414] border border-[#ffffff1a] hover:border-[#ffffff33] px-6 py-4 text-center cursor-pointer transition-all duration-200"
        title="Click to cycle quote archives"
      >
        {/* Subtle cycle icon */}
        <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity">
          <RefreshCw className="w-3 h-3 text-white" />
        </div>

        {/* Micro Category Tag */}
        <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-mono mb-2">
          DIALOGUE LOG // {currentQuote.tag || 'ARCHIVE'}
        </div>

        {/* Italic Editorial Typography */}
        <p
          id="quote-text"
          className={`text-[#f2f2f2] font-serif italic text-xs sm:text-sm md:text-base leading-relaxed tracking-normal transition-opacity duration-200 ${
            isFading ? 'opacity-0' : 'opacity-90'
          }`}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          {currentQuote.text}
        </p>

        {/* Attributed Author in Archival Mono */}
        <div
          id="quote-author"
          className={`mt-2.5 text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 transition-opacity duration-200 flex items-center justify-center gap-2 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="opacity-30">—</span>
          <span>{currentQuote.author}</span>
        </div>
      </div>

      {/* Down Chevron / System Index trigger */}
      <div
        id="bottom-scroll-arrow"
        onClick={onScrollOrExplore}
        className="mt-3 text-white/40 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest"
        title="Explore Archive & Themes"
      >
        <span>COLLECTIONS & SCENES</span>
        <ChevronDown className="w-3 h-3 animate-bounce" />
      </div>
    </div>
  );
};
