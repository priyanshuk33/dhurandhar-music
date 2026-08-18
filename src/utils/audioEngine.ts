/**
 * Audio Engine with Dual Mode:
 * 1. Native HTML5 Audio streaming
 * 2. Web Audio API Procedural Lo-Fi Synthesizer & Vinyl Crackle Generator
 */

class AudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private vinylGainNode: GainNode | null = null;
  private vinylBufferNode: AudioBufferSourceNode | null = null;
  private synthGainNode: GainNode | null = null;
  private synthInterval: number | null = null;
  private isUsingSynth: boolean = false;
  private volume: number = 0.8;
  private vinylVolume: number = 0.35;
  private isVinylCrackleActive: boolean = true;
  private analyser: AnalyserNode | null = null;

  public onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  public onEnded: (() => void) | null = null;
  public onError: ((err: any) => void) | null = null;
  public onPlayStateChange: ((isPlaying: boolean) => void) | null = null;

  private synthChords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.0], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63], // Dm7
  ];
  private currentChordIdx = 0;
  private synthTime = 0;
  private synthDuration = 218;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = 'anonymous';
      this.audioEl.preload = 'auto';

      this.audioEl.addEventListener('timeupdate', () => {
        if (!this.isUsingSynth && this.audioEl && this.onTimeUpdate) {
          const cur = this.audioEl.currentTime || 0;
          const dur = this.audioEl.duration && !isNaN(this.audioEl.duration) ? this.audioEl.duration : 200;
          this.onTimeUpdate(cur, dur);
        }
      });

      this.audioEl.addEventListener('ended', () => {
        if (this.onEnded) this.onEnded();
      });

      this.audioEl.addEventListener('play', () => {
        if (this.onPlayStateChange) this.onPlayStateChange(true);
      });

      this.audioEl.addEventListener('pause', () => {
        if (!this.isUsingSynth && this.onPlayStateChange) {
          this.onPlayStateChange(false);
        }
      });

      this.audioEl.addEventListener('error', () => {
        // Switch gracefully to procedural lo-fi generator
        console.warn('Audio stream error, engaging procedural lo-fi synth');
        this.fallbackToSynth();
      });
    }
  }

  private initAudioCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;

        this.synthGainNode = this.audioCtx.createGain();
        this.synthGainNode.gain.value = this.volume;
        this.synthGainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.vinylGainNode = this.audioCtx.createGain();
        this.vinylGainNode.gain.value = this.isVinylCrackleActive ? this.vinylVolume : 0;
        this.vinylGainNode.connect(this.audioCtx.destination);

        this.startVinylNoise();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private startVinylNoise() {
    if (!this.audioCtx || !this.vinylGainNode) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter with vinyl pops
        const pink = (lastOut + (0.02 * white)) / 1.02;
        lastOut = pink;
        const pop = Math.random() > 0.998 ? (Math.random() * 0.4 - 0.2) : 0;
        data[i] = (pink * 0.04 + pop) * 0.4;
      }

      this.vinylBufferNode = this.audioCtx.createBufferSource();
      this.vinylBufferNode.buffer = buffer;
      this.vinylBufferNode.loop = true;
      this.vinylBufferNode.connect(this.vinylGainNode);
      this.vinylBufferNode.start();
    } catch (e) {
      console.warn('Vinyl noise init error', e);
    }
  }

  public setVinylCrackle(enabled: boolean) {
    this.isVinylCrackleActive = enabled;
    if (this.vinylGainNode) {
      this.vinylGainNode.gain.value = enabled ? this.vinylVolume : 0;
    }
  }

  public getVinylCrackle(): boolean {
    return this.isVinylCrackleActive;
  }

  public loadTrack(url: string, durationSec: number = 200) {
    this.initAudioCtx();
    this.stopSynth();
    this.isUsingSynth = false;
    this.synthDuration = durationSec;
    this.synthTime = 0;

    if (this.audioEl) {
      this.audioEl.src = url;
      this.audioEl.volume = this.volume;
      this.audioEl.load();
    }
  }

  public async play(): Promise<void> {
    this.initAudioCtx();
    if (this.isUsingSynth) {
      this.startSynth();
      if (this.onPlayStateChange) this.onPlayStateChange(true);
      return;
    }

    if (this.audioEl && this.audioEl.src) {
      try {
        await this.audioEl.play();
        if (this.onPlayStateChange) this.onPlayStateChange(true);
      } catch (err) {
        console.warn('Playback blocked or stream failed, activating lo-fi synth:', err);
        this.fallbackToSynth();
      }
    } else {
      this.fallbackToSynth();
    }
  }

  public pause() {
    if (this.audioEl && !this.isUsingSynth) {
      this.audioEl.pause();
    }
    if (this.isUsingSynth) {
      this.stopSynth();
    }
    if (this.onPlayStateChange) this.onPlayStateChange(false);
  }

  public seek(seconds: number) {
    if (!this.isUsingSynth && this.audioEl && !isNaN(seconds)) {
      this.audioEl.currentTime = Math.max(0, Math.min(seconds, this.audioEl.duration || 300));
    } else if (this.isUsingSynth) {
      this.synthTime = Math.max(0, Math.min(seconds, this.synthDuration));
      if (this.onTimeUpdate) this.onTimeUpdate(this.synthTime, this.synthDuration);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    if (this.synthGainNode) {
      this.synthGainNode.gain.value = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private fallbackToSynth() {
    this.isUsingSynth = true;
    this.startSynth();
    if (this.onPlayStateChange) this.onPlayStateChange(true);
  }

  private startSynth() {
    this.stopSynth();
    if (!this.audioCtx) this.initAudioCtx();
    if (!this.audioCtx || !this.synthGainNode) return;

    this.playChordStep();
    this.synthInterval = window.setInterval(() => {
      this.synthTime += 1;
      if (this.synthTime >= this.synthDuration) {
        this.synthTime = 0;
        if (this.onEnded) this.onEnded();
        return;
      }

      if (this.synthTime % 4 === 0) {
        this.playChordStep();
      }

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.synthTime, this.synthDuration);
      }
    }, 1000);
  }

  private playChordStep() {
    if (!this.audioCtx || !this.synthGainNode) return;
    const chord = this.synthChords[this.currentChordIdx % this.synthChords.length];
    this.currentChordIdx++;

    const now = this.audioCtx.currentTime;
    chord.forEach((freq, i) => {
      if (!this.audioCtx || !this.synthGainNode) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sine');
      // Subtle vintage detune
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.004 - 0.002)), now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / (i + 1), now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.synthGainNode);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  }

  private stopSynth() {
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const audioEngine = new AudioEngine();
