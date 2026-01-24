import { audioEngine } from "./AudioEngine";
import { AUDIO_LIBRARY } from "./library";

let currentPhase = null;

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function setAudioPhase(phase) {

  if (phase === currentPhase && audioEngine.unlocked) return; //a small bug that caused the player to not play.

  currentPhase = phase;

  if (phase === "HOME") {
      console.log('setAudioPhaseHOME')
    audioEngine.play(randomFrom(AUDIO_LIBRARY.HOME), {
      volume: 0.35
    });
  }

  if (phase === "LOADING") {
    console.log('setAudioPhaseLOADING')
    const prev = audioEngine.currentTrack;
    console.log("Prev in useAudio.js is :  ",prev)

  const reverse =AUDIO_LIBRARY.LOADING[prev]
    audioEngine.play(reverse, {
      loop: false,
      volume: 0.5
    });
  }

  if (phase === "SLIDES") {
     console.log('setAudioPhaseSLIDES')
     audioEngine.crossfadeTo(
  randomFrom(AUDIO_LIBRARY.SLIDES),
  { volume: 0.45 }
);

    // audioEngine.play(randomFrom(), {
    //   volume: 0.45
    // });
  }
}
