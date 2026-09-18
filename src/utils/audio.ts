/**
 * Web Audio API based ambient soundscapes and subtle zen chimes.
 * Fully self-contained, no external mp3 or internet connection needed!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeAmbientNodes: { stop: () => void }[] = [];
  private isMuted: boolean = false;
  private ambientVolume: number = 0.5;
  private sfxVolume: number = 0.7;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.ambientVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  /**
   * Zen Singing Bowl chime for focus start, break, or completion
   */
  public playSingingBowl(freq = 432, duration = 3.5) {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.6, 0.25, 0.12, 0.05];

      harmonics.forEach((h, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * h, now);

        gain.gain.setValueAtTime(gains[idx] * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Egg cracking sound
   */
  public playCrack() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.8 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } catch {
      // ignore
    }
  }

  /**
   * Celestial chime fanfares for pet hatching reveal
   */
  public playHatchFanfare(isLegendaryOrMythic = false) {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const notes = isLegendaryOrMythic
        ? [432, 540, 648, 864, 1080, 1296]
        : [330, 392, 494, 659, 784];

      notes.forEach((freq, index) => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime + index * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Pet interaction gentle purr / sparkle sound
   */
  public playPetChime() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Egg fracture / destruction warning sound for deep focus break
   */
  public playDestroy() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

      gain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // ignore
    }
  }

  /**
   * Ambient Soundscape Generator
   */
  public setAmbient(type: 'none' | 'rain' | 'theta' | 'bowl' | 'stream') {
    this.stopAmbient();
    if (type === 'none') return;

    try {
      this.init();
      if (!this.ctx || !this.ambientGain) return;

      if (type === 'theta') {
        // Binaural 432Hz deep focus drone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        const gain2 = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // 216Hz

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(222, this.ctx.currentTime); // +6Hz theta wave beat

        gain1.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain2.gain.setValueAtTime(0.15, this.ctx.currentTime);

        osc1.connect(gain1);
        gain1.connect(this.ambientGain);

        osc2.connect(gain2);
        gain2.connect(this.ambientGain);

        osc1.start();
        osc2.start();

        this.activeAmbientNodes.push({
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {
              // ignore
            }
          },
        });
      } else if (type === 'rain' || type === 'stream') {
        // Filtered white/pink noise for gentle rain or stream
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 500, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain);

        whiteNoise.start();

        this.activeAmbientNodes.push({
          stop: () => {
            try {
              whiteNoise.stop();
            } catch {
              // ignore
            }
          },
        });
      } else if (type === 'bowl') {
        // Soft meditative repeating drone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(144, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

        osc.connect(gain);
        gain.connect(this.ambientGain);
        osc.start();

        this.activeAmbientNodes.push({
          stop: () => {
            try {
              osc.stop();
            } catch {
              // ignore
            }
          },
        });
      }
    } catch {
      // Audio context handling
    }
  }

  public stopAmbient() {
    this.activeAmbientNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeAmbientNodes = [];
  }
}

export const sound = new SoundEngine();
