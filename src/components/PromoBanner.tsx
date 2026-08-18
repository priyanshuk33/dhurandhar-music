import React, { useState } from 'react';

interface PromoBannerProps {
  onJoinClick?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onJoinClick }) => {
  const [joined, setJoined] = useState(false);

  const handleClick = () => {
    if (onJoinClick) {
      onJoinClick();
    } else {
      setJoined(true);
    }
  };

  return (
    <div className="w-full max-w-xl px-4 select-none my-1 sm:my-2">
      <div
        id="promo-community-banner"
        className="bg-[#0f0f0f]/90 border border-[#ffffff1a] hover:border-[#ffffff33] px-4 py-2.5 flex items-center justify-between gap-3 transition-colors"
      >
        {/* Left Side: Editorial Micro Tag & Text */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 bg-[#1a1a1a] border border-[#ffffff26] flex items-center justify-center text-white/80 flex-shrink-0 font-mono text-[10px]">
            //
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/40">
                DISPATCH_FEED
              </span>
            </div>
            <span className="text-[#f2f2f2] text-xs font-normal tracking-tight truncate">
              Get new unreleased cassette cuts & salon master tapes
            </span>
          </div>
        </div>

        {/* Action Button: Solid High-Contrast Editorial Style */}
        <button
          id="promo-join-btn"
          onClick={handleClick}
          className={`flex-shrink-0 px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-all cursor-pointer ${
            joined
              ? 'border border-[#ffffff33] text-white/60 bg-transparent'
              : 'bg-white hover:bg-zinc-200 active:scale-95 text-black font-bold shadow-sm'
          }`}
        >
          {joined ? 'Subscribed ✓' : 'Join Free'}
        </button>
      </div>
    </div>
  );
};
