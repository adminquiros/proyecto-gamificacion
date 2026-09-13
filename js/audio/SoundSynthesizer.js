/**
 * FinGo - Sintetizador de Audio Procedural con Web Audio API
 * Genera música synthwave/chiptune y efectos de sonido en tiempo real sin requerir
 * ningún archivo de audio externo ni descargas pesadas (100% compatible y sin fallos 404).
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem("fingo_sound_muted") === "true";
    this.musicGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.noteIndex = 0;

    // Escala musical FinTech Synthwave (Pentatónica menor en Re / D minor)
    this.bassline = [146.83, 146.83, 174.61, 196.00, 146.83, 130.81, 164.81, 146.83];
    this.melody = [
      587.33, 0, 659.25, 698.46, 880.00, 783.99, 659.25, 0,
      587.33, 698.46, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25
    ];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);

        this.musicGain = this.audioCtx.createGain();
        this.musicGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.audioCtx.createGain();
        this.sfxGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    localStorage.setItem("fingo_sound_muted", this.isMuted);

    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : 0.4,
        this.audioCtx.currentTime + 0.05
      );
    }
    return this.isMuted;
  }

  playMusic() {
    if (this.isMusicPlaying) return;
    this.init();
    this.isMusicPlaying = true;
    this.stepMusic();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  stepMusic() {
    if (!this.isMusicPlaying || !this.audioCtx || this.isMuted) {
      if (this.isMusicPlaying) {
        this.musicTimer = setTimeout(() => this.stepMusic(), 200);
      }
      return;
    }

    const t = this.audioCtx.currentTime;
    const tempo = 135; // BPM
    const stepDuration = 60 / tempo / 2; // Semifusa/Corchea

    // 1. Sintetizar bajo rítmico (Bass synth)
    const bassFreq = this.bassline[this.noteIndex % this.bassline.length];
    if (bassFreq > 0) {
      const bassOsc = this.audioCtx.createOscillator();
      const bassEnv = this.audioCtx.createGain();
      const bassFilter = this.audioCtx.createBiquadFilter();

      bassOsc.type = "sawtooth";
      bassOsc.frequency.setValueAtTime(bassFreq, t);

      bassFilter.type = "lowpass";
      bassFilter.frequency.setValueAtTime(450, t);
      bassFilter.Q.setValueAtTime(4, t);

      bassEnv.gain.setValueAtTime(0.35, t);
      bassEnv.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.9);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassEnv);
      bassEnv.connect(this.musicGain);

      bassOsc.start(t);
      bassOsc.stop(t + stepDuration);
    }

    // 2. Sintetizar melodía cyberpunk/arpegio FinTech
    const melFreq = this.melody[this.noteIndex % this.melody.length];
    if (melFreq > 0 && Math.random() > 0.15) {
      const melOsc = this.audioCtx.createOscillator();
      const melEnv = this.audioCtx.createGain();

      melOsc.type = "triangle";
      melOsc.frequency.setValueAtTime(melFreq, t);

      melEnv.gain.setValueAtTime(0.2, t);
      melEnv.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.85);

      melOsc.connect(melEnv);
      melEnv.connect(this.musicGain);

      melOsc.start(t);
      melOsc.stop(t + stepDuration);
    }

    // 3. Hi-hat rítmico
    if (this.noteIndex % 2 === 1) {
      this.playHiHat(t);
    }

    this.noteIndex++;
    this.musicTimer = setTimeout(() => this.stepMusic(), stepDuration * 1000);
  }

  playHiHat(t) {
    if (!this.audioCtx || this.isMuted) return;
    const bufferSize = this.audioCtx.sampleRate * 0.04;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(7000, t);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(t);
  }

  /* --- EFECTOS DE SONIDO (SFX) --- */

  playLaneChange() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playJump() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playSlide() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.22);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playCoin() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;

    // Doble campana armónica
    const playBeep = (freq, delay) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.25, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + delay);
      osc.stop(t + delay + 0.1);
    };

    playBeep(987.77, 0);       // Si5
    playBeep(1318.51, 0.06);    // Mi6
  }

  playPowerup() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.3);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playCrash() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;

    // Ruido blanco percusivo (impacto)
    const bufferSize = this.audioCtx.sampleRate * 0.25;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    noise.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(t);

    // Oscilador grave de golpe
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);

    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playLevelComplete() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // Do Mayor brillante

    chord.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.6);
    });
  }

  playGameOver() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const tones = [392.00, 349.23, 311.13, 261.63]; // Descenso menor

    tones.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t + idx * 0.15);

      gain.gain.setValueAtTime(0.25, t + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.15 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.15);
      osc.stop(t + idx * 0.15 + 0.35);
    });
  }

  playClick() {
    this.init();
    if (this.isMuted || !this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.03);
  }
}
