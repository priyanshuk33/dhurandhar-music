import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { youtubeEngine } from '../utils/youtubeEngine';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isRevenge?: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  isRevenge = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
}) => {
  const [isMuted, setIsMuted] = useState(() => youtubeEngine.isMuted());
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    youtubeEngine.onVolumeChange = (_vol, muted) => {
      setIsMuted(muted);
    };
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekFromClientX = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetSeconds = clickRatio * (duration || 210);
    setDragTime(targetSeconds);
    return targetSeconds;
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingSeek(true);
    const seekTo = handleSeekFromClientX(e.clientX);
    if (seekTo !== undefined) {
      onSeek(seekTo);
    }
  };

  useEffect(() => {
    if (!isDraggingSeek) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleSeekFromClientX(e.clientX);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDraggingSeek(false);
      const finalSeek = handleSeekFromClientX(e.clientX);
      if (finalSeek !== undefined) {
        onSeek(finalSeek);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSeek, duration]);

  const displayTime = isDraggingSeek ? dragTime : currentTime;
  const progressPercent = duration > 0 ? Math.min(100, (displayTime / duration) * 100) : 0;

  // Single Click Simple Mute / Unmute
  const handleToggleSound = () => {
    youtubeEngine.toggleMute();
    setIsMuted(youtubeEngine.isMuted());
  };

  return (
    <div className="w-full max-w-xl px-2 sm:px-4 select-none">
      {/* Balanced Soft Round Music Player Card (Positioned at bottom center) */}
      <div
        id="main-music-player-bar"
        className={`bg-[#0d0d0d]/95 backdrop-blur-2xl border rounded-3xl sm:rounded-full px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-5 shadow-2xl transition-all duration-300 ${
          isRevenge
            ? 'border-red-600/50 ring-1 ring-red-600/30 shadow-red-950/30'
            : 'border-white/20 ring-1 ring-white/10 shadow-black/60'
        }`}
      >
        {/* Left: Round Thumbnail & Track Title */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0 sm:max-w-[210px]">
          {/* Album Cover */}
          <div
            className={`relative flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border ${
              isRevenge ? 'border-red-500/50' : 'border-white/30'
            }`}
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isPlaying ? 'opacity-100' : 'opacity-80'
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Disc3
                  className={`w-5 h-5 ${isRevenge ? 'text-red-400' : 'text-white'} animate-spin`}
                  style={{ animationDuration: '3.5s' }}
                />
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="flex flex-col min-w-0 flex-1">
            <span
              id="player-track-title"
              className="text-[#f2f2f2] font-semibold text-xs sm:text-sm tracking-tight truncate leading-tight"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </span>
            <span
              id="player-track-subtitle"
              className={`text-[10px] font-mono truncate tracking-wider mt-0.5 ${
                isRevenge ? 'text-red-300/70' : 'text-white/50'
              }`}
            >
              {currentTrack.artist}
            </span>

            {/* Mobile Progress Bar */}
            <div className="sm:hidden w-full mt-2">
              <div
                className="w-full h-2 bg-white/15 rounded-full cursor-pointer relative overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const r = (e.clientX - rect.left) / rect.width;
                  onSeek(r * (duration || 210));
                }}
              >
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    isRevenge ? 'bg-red-600' : 'bg-white'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-white/50 mt-1">
                <span>{formatTime(displayTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Soft Rounded Progress Scrubber */}
        <div className="hidden sm:flex flex-col flex-1 px-1 min-w-[150px]">
          <div
            ref={progressBarRef}
            id="player-progress-bar-container"
            className="w-full h-4 group cursor-pointer relative flex items-center"
            onMouseDown={handleProgressMouseDown}
          >
            <div className="w-full h-1.5 rounded-full bg-white/15 group-hover:h-2 transition-all relative overflow-visible">
              <div
                className={`h-full rounded-full transition-all duration-75 relative ${
                  isRevenge ? 'bg-red-600' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              >
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full scale-0 group-hover:scale-100 transition-transform ${
                    isRevenge ? 'bg-red-400' : 'bg-white'
                  } shadow-md`}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/50 -mt-0.5">
            <span id="player-time-current">{formatTime(displayTime)}</span>
            <span id="player-time-duration">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Playback & Simple 1-Click Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Previous Button */}
          <button
            id="player-prev-btn"
            onClick={onPrevTrack}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#262626] border border-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform cursor-pointer shadow-md"
            title="Previous Track (P)"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Center Round Play/Pause Button */}
          <button
            id="player-play-pause-btn"
            onClick={onTogglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform cursor-pointer border ${
              isRevenge
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg shadow-red-950/40'
                : 'bg-white hover:bg-zinc-200 text-black border-transparent shadow-lg shadow-black/40'
            }`}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4.5 h-4.5 fill-current" />
            ) : (
              <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            id="player-next-btn"
            onClick={onNextTrack}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#262626] border border-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform cursor-pointer shadow-md"
            title="Next Track (N)"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Simple 1-Click Mute / Unmute Button */}
          <button
            id="player-sound-toggle-btn"
            onClick={handleToggleSound}
            className={`w-9 h-9 rounded-full border flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-md ${
              isMuted
                ? 'bg-red-950/40 border-red-600/40 text-red-400 hover:bg-red-900/50 hover:text-red-300'
                : 'bg-[#1a1a1a] hover:bg-[#262626] border-white/15 text-white/80 hover:text-white'
            }`}
            title={isMuted ? 'Click to Unmute (M)' : 'Click to Mute (M)'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
