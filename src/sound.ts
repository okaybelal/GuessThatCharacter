import clickUrl from "./assets/sounds/click.mp3";
import loseUrl from "./assets/sounds/lose.wav";
import winUrl from "./assets/sounds/win.mp3";

let audioCtx: AudioContext | null = null;
let soundEnabled = localStorage.getItem("gtc-sound") !== "off";

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  localStorage.setItem("gtc-sound", enabled ? "on" : "off");
}

export type SoundType = "click" | "yes" | "no" | "pass" | "win" | "lose";

function playFile(url: string, volume = 1) {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(() => {
    // playback blocked (e.g. no user gesture yet) — fail silently
  });
}

function tone(freq: number, duration: number, startOffset: number, type: OscillatorType, gainPeak: number) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playSound(type: SoundType) {
  if (!soundEnabled) return;
  try {
    switch (type) {
      case "click":
        playFile(clickUrl, 0.5);
        break;
      case "yes":
        tone(880, 0.15, 0, "sine", 0.18);
        tone(1175, 0.15, 0.08, "sine", 0.15);
        break;
      case "no":
        tone(180, 0.2, 0, "sawtooth", 0.15);
        break;
      case "pass":
        tone(440, 0.12, 0, "triangle", 0.12);
        tone(330, 0.15, 0.08, "triangle", 0.1);
        break;
      case "win":
        playFile(winUrl, 0.6);
        break;
      case "lose":
        playFile(loseUrl, 0.6);
        break;
    }
  } catch {
    // audio unavailable (e.g. blocked by browser) — fail silently
  }
}
