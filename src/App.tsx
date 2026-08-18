import React, { useState, useEffect } from 'react';
import { MOVIE_EDITIONS, EditionKey, FAQ_ITEMS } from './data/musicData';
import { youtubeEngine, YouTubeTrackInfo } from './utils/youtubeEngine';
import { Header } from './components/Header';
import { EditionSwitcher } from './components/EditionSwitcher';
import { MusicPlayer } from './components/MusicPlayer';
import { BackgroundView } from './components/BackgroundView';
import { Modals } from './components/Modals';
import { PlaylistModal } from './components/PlaylistModal';
import { Track } from './types';

export default function App() {
  // Movie Edition State ('part-one' | 'the-revenge')
  const [currentEdition, setCurrentEdition] = useState<EditionKey>('part-one');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(214);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  const activeEdition = MOVIE_EDITIONS[currentEdition];
  const isRevenge = currentEdition === 'the-revenge';

  const [currentTrack, setCurrentTrack] = useState<YouTubeTrackInfo>({
    title: activeEdition.tracks[0]?.title || 'Dhurandhar - Title Track',
    artist: activeEdition.tracks[0]?.artist || 'Shashwat Sachdev',
    coverUrl: activeEdition.tracks[0]?.coverUrl || activeEdition.posterUrl,
    videoId: activeEdition.tracks[0]?.id || 'WzoSWtDDo1M',
    duration: activeEdition.tracks[0]?.duration || 214,
  });

  // Modal States
  const [activeModal, setActiveModal] = useState<
    'about' | 'faq' | 'spotify' | 'ytmusic' | 'playlist' | null
  >(null);

  // Initialize YouTube Engine
  useEffect(() => {
    youtubeEngine.onTrackChange = (track) => {
      setCurrentTrack(track);
      if (track.duration > 0) {
        setDuration(track.duration);
      }
      // Update track index if matching
      const idx = activeEdition.tracks.findIndex((t) => t.id === track.videoId);
      if (idx !== -1) {
        setActiveTrackIndex(idx);
      }
    };

    youtubeEngine.onPlayStateChange = (playing) => {
      setIsPlaying(playing);
    };

    youtubeEngine.onTimeUpdate = (cur, dur) => {
      setCurrentTime(cur);
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    };

    youtubeEngine.mountPlayer('youtube-mount-element');
    youtubeEngine.loadTarget(activeEdition.youtubePlaylistUrl, false);
  }, []);

  const handleTogglePlay = () => {
    youtubeEngine.togglePlay();
  };

  const handleNextTrack = () => {
    const nextIdx = (activeTrackIndex + 1) % activeEdition.tracks.length;
    const nextTrack = activeEdition.tracks[nextIdx];
    if (nextTrack) {
      setActiveTrackIndex(nextIdx);
      setCurrentTrack({
        title: nextTrack.title,
        artist: nextTrack.artist,
        coverUrl: nextTrack.coverUrl,
        videoId: nextTrack.id,
        duration: nextTrack.duration,
      });
      setDuration(nextTrack.duration);
      setCurrentTime(0);
      youtubeEngine.playTrack(nextTrack.id, nextIdx);
    } else {
      youtubeEngine.next();
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (activeTrackIndex - 1 + activeEdition.tracks.length) % activeEdition.tracks.length;
    const prevTrack = activeEdition.tracks[prevIdx];
    if (prevTrack) {
      setActiveTrackIndex(prevIdx);
      setCurrentTrack({
        title: prevTrack.title,
        artist: prevTrack.artist,
        coverUrl: prevTrack.coverUrl,
        videoId: prevTrack.id,
        duration: prevTrack.duration,
      });
      setDuration(prevTrack.duration);
      setCurrentTime(0);
      youtubeEngine.playTrack(prevTrack.id, prevIdx);
    } else {
      youtubeEngine.prev();
    }
  };

  const handleSeek = (seconds: number) => {
    youtubeEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  // Switch between "Part One" and "The Revenge"
  const handleSelectEdition = (edition: EditionKey, autoPlay?: boolean) => {
    if (edition === currentEdition && !autoPlay) return;
    setCurrentEdition(edition);
    setCurrentTime(0);
    setActiveTrackIndex(0);
    const targetEdition = MOVIE_EDITIONS[edition];
    if (targetEdition && targetEdition.tracks.length > 0) {
      const firstTrack = targetEdition.tracks[0];
      setCurrentTrack({
        title: firstTrack.title,
        artist: firstTrack.artist,
        coverUrl: firstTrack.coverUrl,
        videoId: firstTrack.id,
        duration: firstTrack.duration,
      });
      setDuration(firstTrack.duration);
      youtubeEngine.loadTarget(
        targetEdition.youtubePlaylistUrl,
        autoPlay !== undefined ? autoPlay : isPlaying
      );
    }
  };

  // Click any track in the Playlist Viewer
  const handlePlayTrackFromPlaylist = (edition: EditionKey, index: number, track: Track) => {
    if (edition !== currentEdition) {
      setCurrentEdition(edition);
    }
    setActiveTrackIndex(index);
    setCurrentTrack({
      title: track.title,
      artist: track.artist,
      coverUrl: track.coverUrl,
      videoId: track.id,
      duration: track.duration,
    });
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    youtubeEngine.playTrack(track.id, index);
    setActiveModal(null);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        youtubeEngine.setVolume(youtubeEngine.getVolume() + 5);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        youtubeEngine.setVolume(youtubeEngine.getVolume() - 5);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        youtubeEngine.toggleMute();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePrevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, isPlaying, activeTrackIndex, currentEdition]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-[#f2f2f2] font-sans antialiased">
      {/* Background Poster View (Full Website Background) */}
      <BackgroundView
        currentEdition={currentEdition}
        posterUrl={activeEdition.posterUrl}
        fallbackPosterUrl={activeEdition.fallbackPosterUrl}
        isPlaying={isPlaying}
      />

      {/* Top Header with Live Date & Time Pill, Playlist Button, and Nav */}
      <div className="relative z-20 w-full">
        <Header
          onOpenPlaylist={() => setActiveModal('playlist')}
          onOpenAbout={() => setActiveModal('about')}
          onOpenFAQ={() => setActiveModal('faq')}
          onOpenSpotify={() => setActiveModal('spotify')}
          onOpenYTMusic={() => setActiveModal('ytmusic')}
        />
      </div>

      {/* Main Center Stage: Poster Focus with Controller in Bottom Middle */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-end w-full max-w-3xl mx-auto px-4 pb-6 sm:pb-10 space-y-3.5 sm:space-y-4">
        {/* Slideable Chapter / Edition Switcher ("Part One" <-> "The Revenge") */}
        <div className="w-full flex justify-center">
          <EditionSwitcher
            currentEdition={currentEdition}
            onSelectEdition={(ed) => handleSelectEdition(ed)}
          />
        </div>

        {/* Balanced Soft Round Music Player Card in Bottom Middle */}
        <div className="w-full flex justify-center">
          <MusicPlayer
            currentTrack={{
              id: currentTrack.videoId || 'yt-track',
              title: currentTrack.title,
              artist: currentTrack.artist,
              album: activeEdition.label,
              tag: 'YouTube',
              duration: duration,
              coverUrl: currentTrack.coverUrl || activeEdition.posterUrl,
              audioUrl: '',
            }}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            isRevenge={isRevenge}
            onTogglePlay={handleTogglePlay}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            onSeek={handleSeek}
          />
        </div>
      </main>

      {/* Slideable Playlist Viewer Modal */}
      <PlaylistModal
        isOpen={activeModal === 'playlist'}
        onClose={() => setActiveModal(null)}
        currentEdition={currentEdition}
        onSelectEdition={(ed) => handleSelectEdition(ed)}
        activeTrackTitle={currentTrack.title}
        isPlaying={isPlaying}
        onPlayTrackIndex={handlePlayTrackFromPlaylist}
      />

      {/* About & FAQ & Streaming Modals */}
      <Modals
        activeModal={activeModal === 'playlist' ? null : activeModal}
        onClose={() => setActiveModal(null)}
        tracks={activeEdition.tracks}
        currentTrack={{
          id: currentTrack.videoId || 'yt-track',
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: activeEdition.label,
          tag: 'YouTube',
          duration: duration,
          coverUrl: currentTrack.coverUrl || activeEdition.posterUrl,
          audioUrl: '',
        }}
        isPlaying={isPlaying}
        onSelectTrack={(t) => {
          const idx = activeEdition.tracks.findIndex((x) => x.id === t.id);
          handlePlayTrackFromPlaylist(currentEdition, Math.max(0, idx), t);
        }}
        scenes={[]}
        currentScene={{ id: '1', name: 'Default', imageUrl: '', accentColor: '', overlayOpacity: 0.5 }}
        onSelectScene={() => {}}
        faqItems={FAQ_ITEMS}
      />

      {/* Hidden YouTube Engine Mount Element */}
      <div
        className="fixed -bottom-96 -right-96 w-48 h-48 pointer-events-none opacity-0 overflow-hidden"
        aria-hidden="true"
      >
        <div id="youtube-mount-element" />
      </div>
    </div>
  );
}
