// Web Audio API Synthesizer Sound Engine for Overkill Sci-Fi/Anime E-Commerce

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Lazy initialize on first interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isBgmPlaying) {
      this.stopBGM();
    } else if (!this.isMuted && !this.isBgmPlaying) {
      this.startBGM();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. Crystal UI Hover Chime
  public playHover() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = 1200 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext fallback handling
    }
  }

  // 2. Holographic UI Click / Trigger
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  // 3. Dimensional Slash / Blade Strike
  public playSlash() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // White Noise burst with lowpass filter sweep
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.22);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  // 4. Space Warp / Hyperdrive Blast
  public playWarp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.6);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  // 5. Gacha Thunder & Angelic Burst
  public playGachaThunder() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Thunder rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);

      // Angelic Chords (SSR Sparkle)
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major arpeggio
      chords.forEach((freq, idx) => {
        const chordOsc = this.ctx!.createOscillator();
        const chordGain = this.ctx!.createGain();

        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        chordGain.gain.setValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08);
        chordGain.gain.linearRampToValueAtTime(0.08, this.ctx!.currentTime + idx * 0.08 + 0.05);
        chordGain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.9);

        chordOsc.connect(chordGain);
        chordGain.connect(this.ctx!.destination);

        chordOsc.start(this.ctx!.currentTime + idx * 0.08);
        chordOsc.stop(this.ctx!.currentTime + idx * 0.08 + 0.9);
      });
    } catch {}
  }

  // 6. Item Equip / Cart Add Powerup
  public playEquip() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [330, 440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.04, this.ctx!.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.04);
        osc.stop(this.ctx!.currentTime + i * 0.04 + 0.12);
      });
    } catch {}
  }

  // 7. Ambient Cyber Synthwave BGM Loop Generator
  public startBGM() {
    if (this.isBgmPlaying || this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isBgmPlaying = true;
      const bpm = 110;
      const stepTime = 60 / bpm / 2; // 1/8th note

      const bassNotes = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 98.00];
      let step = 0;

      this.bgmInterval = window.setInterval(() => {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const noteFreq = bassNotes[step % bassNotes.length];

        // Bass Synth
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteFreq / 2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + stepTime);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + stepTime);

        // Ambient Arp high note
        if (step % 2 === 0) {
          const arpOsc = this.ctx.createOscillator();
          const arpGain = this.ctx.createGain();
          arpOsc.type = 'sine';
          arpOsc.frequency.setValueAtTime(noteFreq * 4, now);
          arpGain.gain.setValueAtTime(0.015, now);
          arpGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.5);

          arpOsc.connect(arpGain);
          arpGain.connect(this.ctx.destination);
          arpOsc.start(now);
          arpOsc.stop(now + stepTime * 1.5);
        }

        step++;
      }, stepTime * 1000);
    } catch {}
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();
