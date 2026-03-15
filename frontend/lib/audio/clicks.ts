/**
 * Synthesized click sounds via Web Audio API.
 * Kept separate from React UI; used by the playback scheduler.
 */

export type ClickLevel = "high" | "mid" | "low";

const CLICK_DURATION = 0.03; // seconds

/** Gain (volume) per level: accented > medium > weak */
const GAIN: Record<ClickLevel, number> = {
  high: 0.35,
  mid: 0.2,
  low: 0.1,
};

/** Base frequency (Hz). Slightly brighter for accent. */
const FREQUENCY: Record<ClickLevel, number> = {
  high: 1200,
  mid: 1000,
  low: 800,
};

/**
 * Play a single synthesized click at the given time on the given context.
 * Uses a short sine burst; no samples required.
 */
export function playClick(
  context: AudioContext,
  type: ClickLevel,
  when: number = context.currentTime
): void {
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0, when);
  gainNode.gain.linearRampToValueAtTime(GAIN[type], when + 0.001);
  gainNode.gain.exponentialRampToValueAtTime(0.001, when + CLICK_DURATION);
  gainNode.connect(context.destination);

  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(FREQUENCY[type], when);
  osc.connect(gainNode);
  osc.start(when);
  osc.stop(when + CLICK_DURATION);
}

/**
 * Resume a suspended AudioContext (e.g. after user gesture).
 * Call before playback if context.state === "suspended".
 */
export async function resumeContext(context: AudioContext): Promise<void> {
  if (context.state === "suspended") {
    await context.resume();
  }
}
