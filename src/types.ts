export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  tag: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  synthesizerPreset?: 'chill' | 'lofi_piano' | 'retro_synth' | 'ambient_guitar' | 'nostalgia_pad';
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  tag?: string;
}

export interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  accentColor: string;
  overlayOpacity: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}
