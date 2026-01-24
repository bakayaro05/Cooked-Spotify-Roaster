  class AudioEngine {
    audio = new Audio();
    unlocked = false;

    unlock() {
      if (this.unlocked){
      console.log('Already unlocked') 
      return;
      }
      console.log('locked-->unlocked') 
      this.audio.volume = 0;
      this.audio.play().catch(() => {});
      this.audio.pause();
      this.audio.currentTime = 0;
      this.unlocked = true;
      this.currentTrack = null;
    }

    play(src, { volume = 0.4, loop = true } = {}) {
      if (!this.unlocked) return;
       this.currentTrack = src;
      this.audio.pause(); //since setaudioPhase comes two times immediately one after another - hence web browser might stop it. For that we do thi
      this.audio.currentTime = 0;
      this.audio.src = src;
      this.audio.loop = loop;
      this.audio.volume = volume;
       this.audio.load(); // REQUIRED for buffering.
      this.audio.play().catch(() => {});
      console.log("PLAY", src, "unlocked:", this.unlocked);
    }

    fadeTo(targetVolume, duration = 0.6) {
  const start = this.audio.volume;
  const delta = targetVolume - start;
  const startTime = performance.now();

  const tick = (now) => {
    const t = Math.min((now - startTime) / (duration * 1000), 1);
    this.audio.volume = start + delta * t;
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

fadeFrom(from, to, duration = 0.8) {
  this.audio.volume = from;
  this.fadeTo(to, duration);
}


    fadeOut(ms = 300) {
      const step = this.audio.volume / (ms / 16);
      const fade = setInterval(() => {
        this.audio.volume = Math.max(0, this.audio.volume - step);
        if (this.audio.volume <= 0) clearInterval(fade);
      }, 16);
    }

    crossfadeTo(src, {
  fadeOut = 0.6,
  fadeIn = 0.8,
  volume = 0.6
}) {
  const old = this.audio;

  if (old) {
    this.fadeTo(0, fadeOut);
  }

  setTimeout(() => {
    this.play(src, { volume });
    this.fadeFrom(0, volume, fadeIn);
  }, fadeOut * 1000);
}

  }

  export const audioEngine = new AudioEngine();

  if (import.meta.env.DEV) {
  window.audioEngine = audioEngine;
}