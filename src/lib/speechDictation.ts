// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Native Web Speech API Dictation & Audio-Shadowing Engine
// Runs 100% offline in browser, reading text at variable WPM for auditory typing
// ═══════════════════════════════════════════════════════════════════════════════

export interface DictationOptions {
  wpm: number; // Target 30 - 120 WPM
  pitch?: number; // 0.5 - 1.5
  onBoundary?: (charIndex: number, word: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class SpeechDictationController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public speak(text: string, options: DictationOptions) {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Approximate speech rate: Web Speech rate 1.0 is ~140-160 WPM depending on voice.
    // Normalized formula: rate = targetWpm / 140
    const normalizedRate = Math.max(0.4, Math.min(2.0, options.wpm / 140));
    utterance.rate = normalizedRate;
    utterance.pitch = options.pitch ?? 1.0;

    // Pick English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en-') && !v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onboundary = (e) => {
      if (options.onBoundary && e.name === 'word') {
        const word = text.slice(e.charIndex).split(/\s+/)[0] || '';
        options.onBoundary(e.charIndex, word);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onError) options.onError(e);
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.isSpeaking) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechDictation = new SpeechDictationController();
