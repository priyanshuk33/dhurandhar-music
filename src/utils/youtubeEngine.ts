import { parseYouTubeUrl } from './youtubeParser';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export interface YouTubeTrackInfo {
  title: string;
  artist: string;
  coverUrl: string;
  videoId: string;
  duration: number;
}

class YouTubeEngine {
  private player: any = null;
  private isApiReady = false;
  private isPlayerReady = false;
  private pollTimer: number | null = null;
  private pendingTarget: string | null = null;
  private pendingAutoPlay = false;
  private volume = 85;
  private isMutedState = false;

  public onTrackChange?: (track: YouTubeTrackInfo) => void;
  public onPlayStateChange?: (isPlaying: boolean) => void;
  public onTimeUpdate?: (currentTime: number, duration: number) => void;
  public onVolumeChange?: (volume: number, isMuted: boolean) => void;
  public onError?: (error: string) => void;

  private currentTrack: YouTubeTrackInfo = {
    title: 'Loading Playlist...',
    artist: 'Dhurandhar Soundtrack',
    coverUrl: '',
    videoId: '',
    duration: 210,
  };

  private isPlayingState = false;

  constructor() {
    // Retrieve stored volume preference
    try {
      const stored = localStorage.getItem('dhurandhar_player_volume');
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
          this.volume = val;
        }
      }
    } catch {
      // ignore
    }
    this.initApi();
  }

  private initApi() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiReady = true;
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      this.isApiReady = true;
      this.createPlayer();
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }

  public mountPlayer(containerId = 'youtube-mount-element') {
    if (this.player) return;
    if (this.isApiReady) {
      this.createPlayer(containerId);
    }
  }

  private createPlayer(containerId = 'youtube-mount-element') {
    if (!window.YT || !window.YT.Player) return;

    let mountEl = document.getElementById(containerId);
    if (!mountEl) {
      mountEl = document.createElement('div');
      mountEl.id = containerId;
      document.body.appendChild(mountEl);
    }

    try {
      const initialTarget = this.pendingTarget || 'PLBODJt-skbXDE8eQSvL9NjCHV8Yy1lZo4';
      const parsed = parseYouTubeUrl(initialTarget);

      this.player = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          listType: parsed.type === 'playlist' ? 'playlist' : undefined,
          list: parsed.type === 'playlist' ? parsed.id : undefined,
        },
        events: {
          onReady: () => {
            this.isPlayerReady = true;
            try {
              this.player.setVolume(this.volume);
              if (this.isMutedState) {
                this.player.mute();
              }
            } catch {
              // ignore
            }

            if (this.pendingTarget) {
              this.loadTarget(this.pendingTarget, this.pendingAutoPlay);
              this.pendingTarget = null;
            } else if (parsed.type === 'playlist') {
              this.syncCurrentTrackData();
            }
          },
          onStateChange: (event: any) => {
            this.handleStateChange(event.data);
          },
          onError: (event: any) => {
            console.warn('[YouTube Player] Event error:', event.data);
            // Automatic recovery: skip unplayable video
            if (this.player && typeof this.player.nextVideo === 'function') {
              this.player.nextVideo();
            }
          },
        },
      });
    } catch (err) {
      console.error('[YouTubeEngine] Init error:', err);
    }
  }

  public loadTarget(urlOrId: string, autoPlay = false) {
    const parsed = parseYouTubeUrl(urlOrId);

    if (!this.isPlayerReady || !this.player) {
      this.pendingTarget = urlOrId;
      this.pendingAutoPlay = autoPlay;
      return;
    }

    try {
      if (parsed.type === 'playlist') {
        if (autoPlay) {
          this.isPlayingState = true;
          this.onPlayStateChange?.(true);
          this.player.loadPlaylist({
            list: parsed.id,
            listType: 'playlist',
            index: 0,
            suggestedQuality: 'small',
          });
        } else {
          this.player.cuePlaylist({
            list: parsed.id,
            listType: 'playlist',
            index: 0,
            suggestedQuality: 'small',
          });
        }
      } else if (parsed.type === 'video') {
        if (autoPlay) {
          this.isPlayingState = true;
          this.onPlayStateChange?.(true);
          this.player.loadVideoById({
            videoId: parsed.id,
            suggestedQuality: 'small',
          });
        } else {
          this.player.cueVideoById({
            videoId: parsed.id,
            suggestedQuality: 'small',
          });
        }
      }
      setTimeout(() => this.syncCurrentTrackData(), 300);
    } catch (err) {
      console.error('[YouTubeEngine] loadTarget error:', err);
    }
  }

  /**
   * Seamlessly play a specific track by videoId or playlist index during active playback
   */
  public playTrack(videoId: string, index?: number) {
    this.isPlayingState = true;
    this.onPlayStateChange?.(true);

    if (!this.player) {
      this.pendingTarget = videoId;
      this.pendingAutoPlay = true;
      return;
    }

    try {
      if (videoId && typeof this.player.loadVideoById === 'function') {
        this.player.loadVideoById({
          videoId: videoId,
          suggestedQuality: 'small',
        });
        setTimeout(() => this.syncCurrentTrackData(), 300);
        return;
      }

      if (index !== undefined && typeof this.player.playVideoAt === 'function') {
        this.player.playVideoAt(index);
        setTimeout(() => this.syncCurrentTrackData(), 300);
        return;
      }
    } catch (e) {
      console.warn('[YouTubeEngine] playTrack error:', e);
    }
  }

  public playIndex(index: number) {
    this.isPlayingState = true;
    this.onPlayStateChange?.(true);
    if (this.player && typeof this.player.playVideoAt === 'function') {
      try {
        this.player.playVideoAt(index);
        setTimeout(() => this.syncCurrentTrackData(), 300);
      } catch (e) {
        console.warn('playIndex error:', e);
      }
    }
  }

  private handleStateChange(stateCode: number) {
    // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING, 5: CUED
    if (stateCode === 1) {
      this.isPlayingState = true;
      this.onPlayStateChange?.(true);
      this.startPolling();
      this.syncCurrentTrackData();
    } else if (stateCode === 2 || stateCode === 0 || stateCode === 5) {
      this.isPlayingState = false;
      this.onPlayStateChange?.(false);
      this.stopPolling();
      this.syncCurrentTrackData();
    } else if (stateCode === 3) {
      this.syncCurrentTrackData();
    }
  }

  private syncCurrentTrackData() {
    if (!this.player || typeof this.player.getVideoData !== 'function') return;

    try {
      const data = this.player.getVideoData();
      const videoId = data.video_id || '';
      const title = data.title || 'Playing Track';
      const author = data.author || 'Dhurandhar OST';
      const duration = this.player.getDuration() || 0;

      const coverUrl = videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : this.currentTrack.coverUrl;

      this.currentTrack = {
        title,
        artist: author,
        coverUrl,
        videoId,
        duration: duration || this.currentTrack.duration || 210,
      };

      this.onTrackChange?.(this.currentTrack);
    } catch {
      // ignore
    }
  }

  private startPolling() {
    this.stopPolling();
    this.pollTimer = window.setInterval(() => {
      if (!this.player) return;
      try {
        const cur = this.player.getCurrentTime?.() || 0;
        const dur = this.player.getDuration?.() || this.currentTrack.duration || 0;
        this.onTimeUpdate?.(cur, dur);

        if (this.currentTrack.title === 'Loading Playlist...' || !this.currentTrack.videoId) {
          this.syncCurrentTrackData();
        }
      } catch {
        // ignore
      }
    }, 200);
  }

  private stopPolling() {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  public play() {
    this.isPlayingState = true;
    this.onPlayStateChange?.(true);
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (e) {
        console.warn('Play error:', e);
      }
    }
  }

  public pause() {
    this.isPlayingState = false;
    this.onPlayStateChange?.(false);
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {
        console.warn('Pause error:', e);
      }
    }
  }

  public togglePlay() {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.play();
    }
  }

  public next() {
    this.isPlayingState = true;
    this.onPlayStateChange?.(true);
    if (this.player && typeof this.player.nextVideo === 'function') {
      try {
        this.player.nextVideo();
        setTimeout(() => this.syncCurrentTrackData(), 300);
      } catch (e) {
        console.warn('Next track error:', e);
      }
    }
  }

  public prev() {
    this.isPlayingState = true;
    this.onPlayStateChange?.(true);
    if (this.player && typeof this.player.previousVideo === 'function') {
      try {
        this.player.previousVideo();
        setTimeout(() => this.syncCurrentTrackData(), 300);
      } catch (e) {
        console.warn('Prev track error:', e);
      }
    }
  }

  public seek(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(seconds, true);
      this.onTimeUpdate?.(seconds, this.currentTrack.duration || 0);
    }
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(100, val));
    this.volume = clamped;
    try {
      localStorage.setItem('dhurandhar_player_volume', clamped.toString());
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(clamped);
        if (clamped > 0 && this.isMutedState) {
          this.player.unMute();
          this.isMutedState = false;
        }
      }
    } catch {
      // ignore
    }
    this.onVolumeChange?.(this.volume, this.isMutedState);
  }

  public toggleMute() {
    this.isMutedState = !this.isMutedState;
    try {
      if (this.player) {
        if (this.isMutedState) {
          this.player.mute?.();
        } else {
          this.player.unMute?.();
          this.player.setVolume?.(this.volume);
        }
      }
    } catch {
      // ignore
    }
    this.onVolumeChange?.(this.volume, this.isMutedState);
  }

  public getVolume(): number {
    return this.volume;
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public getCurrentTrack(): YouTubeTrackInfo {
    return this.currentTrack;
  }
}

export const youtubeEngine = new YouTubeEngine();
