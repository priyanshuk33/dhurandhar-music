import React from 'react';
import { Track, Scene, FAQItem } from '../types';
import { X, Play, Pause, ExternalLink } from 'lucide-react';

interface ModalsProps {
  activeModal: 'about' | 'faq' | 'spotify' | 'ytmusic' | 'community' | 'playlist' | 'scenes' | null;
  onClose: () => void;
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  scenes: Scene[];
  currentScene: Scene;
  onSelectScene: (scene: Scene) => void;
  faqItems: FAQItem[];
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  scenes,
  currentScene,
  onSelectScene,
  faqItems,
}) => {
  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#f2f2f2] max-h-[88vh] overflow-y-auto ring-1 ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Round Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ABOUT MODAL */}
        {activeModal === 'about' && (
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-mono text-white/60">
              MANIFESTO
            </div>
            <h2 className="text-2xl font-normal tracking-tight text-white font-serif">
              Dhurandhar <span className="italic font-serif opacity-70">Soundscape</span>
            </h2>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              An archival listening experience curated with warm analogue warmth, vintage frequencies, and timeless melodies.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="opacity-50">AUDIO ENGINE</span>
                <span className="font-semibold text-white">DUAL HYBRID LOSSLESS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-50">ANALOGUE TEXTURE</span>
                <span className="font-semibold text-white">VINYL CRACKLE MATRIX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-50">ATMOSPHERES</span>
                <span className="font-semibold text-white">INTERACTIVE SCENERY</span>
              </div>
            </div>
          </div>
        )}

        {/* FAQ MODAL */}
        {activeModal === 'faq' && (
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-mono text-white/60">
              GUIDE & CONTROLS
            </div>
            <h2 className="text-xl font-normal tracking-tight text-white font-serif">Frequently Addressed</h2>
            <div className="space-y-2.5 mt-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                  <h3 className="text-xs font-mono font-medium text-white">{item.question}</h3>
                  <p className="text-[11px] text-white/60 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPOTIFY MODAL */}
        {activeModal === 'spotify' && (
          <div className="space-y-5 text-center py-3">
            <div className="inline-block px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 text-[10px] uppercase tracking-widest font-mono text-[#1DB954]">
              SPOTIFY ARCHIVE
            </div>
            <h2 className="text-2xl font-normal tracking-tight text-white font-serif">Stream Curated Collection</h2>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Direct access to the full uncompressed mixtape library on Spotify.
            </p>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold text-xs rounded-full uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(29,185,84,0.4)] active:scale-95"
            >
              <span>Open in Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* YT MUSIC MODAL */}
        {activeModal === 'ytmusic' && (
          <div className="space-y-5 text-center py-3">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/20 text-[10px] uppercase tracking-widest font-mono text-[#FF5555]">
              YOUTUBE BROADCAST
            </div>
            <h2 className="text-2xl font-normal tracking-tight text-white font-serif">YouTube Music Feed</h2>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Explore vintage recordings, bootlegs, and live acoustic sessions.
            </p>
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0000] hover:bg-[#ff2222] text-white font-semibold text-xs rounded-full uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)] active:scale-95"
            >
              <span>Open YT Music</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* PLAYLIST & SCENES DRAWER */}
        {(activeModal === 'playlist' || activeModal === 'scenes') && (
          <div className="space-y-5">
            <div className="flex justify-between items-end pb-3 border-b border-white/10">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-mono text-white/60">
                  PLAYLIST
                </span>
                <h2 className="text-xl font-normal tracking-tight text-white mt-1 font-serif">
                  Audio Archives
                </h2>
              </div>
              <span className="text-[10px] font-mono opacity-50 px-2.5 py-1 rounded-full bg-white/5">
                {tracks.length} TRACKS
              </span>
            </div>

            {/* Track rows in soft rounded pills */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {tracks.map((t, idx) => {
                const isCurrent = t.id === currentTrack.id;
                const formattedIdx = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
                const minutes = Math.floor(t.duration / 60);
                const seconds = Math.floor(t.duration % 60);
                const durStr = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTrack(t)}
                    className={`group flex items-center justify-between py-2.5 px-3.5 rounded-2xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-white/15 border border-white/20 shadow-sm'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`text-[10px] font-mono ${isCurrent ? 'text-white font-bold' : 'opacity-40'}`}>
                        {formattedIdx}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs truncate ${isCurrent ? 'text-white font-semibold' : 'text-white/80'}`}>
                          {t.title}
                        </span>
                        <span className="text-[10px] font-mono opacity-40 truncate">
                          {t.artist}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className={`text-[10px] font-mono ${isCurrent ? 'text-white' : 'opacity-40'}`}>
                        {durStr}
                      </span>
                      {isCurrent && isPlaying ? (
                        <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                          <Pause className="w-3 h-3 fill-current" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-white/20 text-white flex items-center justify-center transition-all">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Atmosphere Backdrop Switcher */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-wider font-mono text-white/50 mb-2">
                Atmospheric Scenes
              </div>
              <div className="grid grid-cols-2 gap-2">
                {scenes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectScene(s)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      s.id === currentScene.id
                        ? 'border-white bg-white/15 shadow-sm'
                        : 'border-white/10 hover:border-white/25 bg-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-mono uppercase tracking-wide text-white">
                      {s.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
