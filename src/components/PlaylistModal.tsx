import React, { useState } from 'react';
import { X, Play, Disc3, ListMusic } from 'lucide-react';
import { MOVIE_EDITIONS, EditionKey } from '../data/musicData';
import { Track } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEdition: EditionKey;
  onSelectEdition: (edition: EditionKey) => void;
  activeTrackTitle: string;
  isPlaying: boolean;
  onPlayTrackIndex: (edition: EditionKey, index: number, track: Track) => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  currentEdition,
  onSelectEdition,
  activeTrackTitle,
  isPlaying,
  onPlayTrackIndex,
}) => {
  // Local sliding tab state inside the playlist viewer
  const [viewEdition, setViewEdition] = useState<EditionKey>(currentEdition);

  // Sync with currentEdition when opened
  React.useEffect(() => {
    if (isOpen) {
      setViewEdition(currentEdition);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEditionData = MOVIE_EDITIONS[viewEdition];
  const tracks = currentEditionData.tracks;
  const isRevenge = viewEdition === 'the-revenge';

  const formatDuration = (secs: number) => {
    if (!secs) return '3:45';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      {/* Click Outside Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content Box */}
      <div
        id="playlist-viewer-modal"
        className={`relative z-10 w-full max-w-lg bg-[#0e0e0e] border rounded-3xl p-5 sm:p-6 shadow-2xl transition-colors duration-300 ${
          isRevenge ? 'border-red-600/50 ring-1 ring-red-600/30' : 'border-white/20 ring-1 ring-white/10'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isRevenge ? 'bg-red-600/20 text-red-400' : 'bg-white/10 text-white'
              }`}
            >
              <ListMusic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                Playlist Viewer
              </h2>
              <p className="text-[11px] text-white/50 font-mono">
                {tracks.length} Tracks • {currentEditionData.label}
              </p>
            </div>
          </div>

          <button
            id="close-playlist-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slideable Movie Switcher Inside Playlist Viewer (Flicker-Free CSS Slider) */}
        <div className="flex justify-center my-4">
          <div
            id="modal-edition-slider"
            className={`relative w-60 h-9 p-1 rounded-full flex items-center border transition-colors duration-300 ${
              isRevenge ? 'bg-black/90 border-red-600/40' : 'bg-black/90 border-white/15'
            }`}
          >
            {/* Sliding Background Indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out shadow-sm ${
                isRevenge
                  ? 'translate-x-[calc(100%+4px)] bg-gradient-to-r from-red-700 via-red-600 to-rose-700'
                  : 'translate-x-0 bg-white'
              }`}
            />

            <button
              onClick={() => {
                setViewEdition('part-one');
                onSelectEdition('part-one');
              }}
              className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                !isRevenge ? 'text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Part One
            </button>

            <button
              onClick={() => {
                setViewEdition('the-revenge');
                onSelectEdition('the-revenge');
              }}
              className={`relative z-10 w-1/2 h-full flex items-center justify-center rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                isRevenge ? 'text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              The Revenge
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
          {tracks.map((track, idx) => {
            const isThisTrackPlaying =
              currentEdition === viewEdition &&
              (activeTrackTitle === track.title || activeTrackTitle.includes(track.title));

            return (
              <div
                key={track.id || `${track.title}-${idx}`}
                onClick={() => onPlayTrackIndex(viewEdition, idx, track)}
                className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all duration-150 cursor-pointer border ${
                  isThisTrackPlaying
                    ? isRevenge
                      ? 'bg-red-950/60 border-red-600/60 text-white shadow-lg shadow-red-950/40'
                      : 'bg-white/15 border-white/30 text-white shadow-lg shadow-black/30'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-white/80 hover:text-white'
                }`}
              >
                {/* Track Number / Playing Disc */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {isThisTrackPlaying && isPlaying ? (
                      <Disc3
                        className={`w-4 h-4 ${isRevenge ? 'text-red-400' : 'text-white'} animate-spin`}
                        style={{ animationDuration: '3s' }}
                      />
                    ) : (
                      <span className="text-[11px] font-mono text-white/40">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
                      {track.title}
                    </p>
                    <p
                      className={`text-[10px] font-mono truncate tracking-wider mt-0.5 ${
                        isThisTrackPlaying
                          ? isRevenge
                            ? 'text-red-300'
                            : 'text-white/80'
                          : 'text-white/40'
                      }`}
                    >
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Duration & Play Action Icon */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-mono text-white/50">
                    {formatDuration(track.duration)}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                      isThisTrackPlaying
                        ? isRevenge
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-white border-white text-black'
                        : 'bg-white/5 border-white/15 text-white/60 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
          <span>Click any track to play instantly</span>
          <span>Official Dhurandhar Soundtrack</span>
        </div>
      </div>
    </div>
  );
};
