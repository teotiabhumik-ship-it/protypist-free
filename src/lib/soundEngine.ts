// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Zero-Dependency Web Audio API Mechanical Sound Engine
// Provides ultra-low latency, 100% offline physical switch sound synthesis
// ═══════════════════════════════════════════════════════════════════════════════

export type SoundProfile = 'cherry-blue' | 'thock' | 'typewriter' | 'pop' | 'silent';

class KeyboardSoundEngine {
  private ctx: AudioContext | null = null;
  private profile: SoundProfile = 'cherry-blue';
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public setProfile(profile: SoundProfile) {
    this.profile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('typepulse_sound_profile', profile);
    }
  }

  public getProfile(): SoundProfile {
    return this.profile;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  public initFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('typepulse_sound_profile') as SoundProfile | null;
      if (saved && ['cherry-blue', 'thock', 'typewriter', 'pop', 'silent'].includes(saved)) {
        this.profile = saved;
      }
    }
  }

  public async ensureResumed(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (_) {
        // Silently fail if resume not allowed
      }
    }
  }

  public getAudioState(): string {
    return this.ctx?.state ?? 'closed';
  }

  public playKeySound(isSpace = false, isBackspace = false, isError = false) {
    if (this.profile === 'silent' || this.volume <= 0) return;

    this.initContext();
    if (!this.ctx) return;
    this.ensureResumed();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isError) {
      // Low-pitch dull buzz for error
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);
      gain.gain.setValueAtTime(0.15 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
      return;
    }

    switch (this.profile) {
      case 'cherry-blue': {
        // High tactile snap + crisp release click
        osc.type = 'triangle';
        const baseFreq = isSpace ? 480 : isBackspace ? 550 : 850 + Math.random() * 180;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.035);

        gain.gain.setValueAtTime(0.22 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.035);
        break;
      }

      case 'thock': {
        // Deep, heavy, acoustic mechanical thock
        osc.type = 'sine';
        const baseFreq = isSpace ? 110 : isBackspace ? 130 : 180 + Math.random() * 35;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.065);

        gain.gain.setValueAtTime(0.35 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.065);
        break;
      }

      case 'typewriter': {
        // Metallic sharp strike with resonance
        osc.type = 'square';
        const baseFreq = isSpace ? 320 : isBackspace ? 400 : 700 + Math.random() * 250;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.045);

        gain.gain.setValueAtTime(0.12 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.045);
        break;
      }

      case 'pop': {
        // Bubble-like tactile pop
        osc.type = 'sine';
        const baseFreq = isSpace ? 280 : 380 + Math.random() * 120;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, t + 0.025);

        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.025);
        break;
      }
    }
  }
}

export const soundEngine = new KeyboardSoundEngine();
soundEngine.initFromStorage();
