/**
 * Lookahead scheduler for metronome playback.
 * Uses Web Audio time; a lightweight timer only wakes to schedule notes ahead.
 */

import type { Pattern } from "@/lib/types";
import { playClick } from "./clicks";
import type { ClickLevel } from "./clicks";

const LOOKAHEAD_MS = 100;
const SCHEDULE_INTERVAL_MS = 25;

function getStepDurationSeconds(pattern: Pattern): number {
  const { bpm, timeSignature, steps } = pattern;
  const stepsPerBeat = steps.length / timeSignature.numerator;
  return 60 / (bpm * stepsPerBeat);
}

export type SchedulerHandle = {
  /** Start with a getter so the scheduler always uses the latest pattern (e.g. step edits apply immediately). */
  start: (getPattern: () => Pattern) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: () => boolean;
  isPaused: () => boolean;
  /** Current step index (0-based) when playing or paused; null when stopped. Aligned with audio. */
  getCurrentStepIndex: () => number | null;
};

/**
 * Creates a scheduler that uses the given AudioContext.
 * Call start(pattern) to begin playback; the scheduler will schedule clicks
 * in small lookahead windows so timing stays accurate.
 */
export function createScheduler(context: AudioContext): SchedulerHandle {
  let timerId: ReturnType<typeof setInterval> | null = null;
  let startTime = 0;
  let getPattern: (() => Pattern) | null = null;
  let paused = false;

  function runSchedule(): void {
    const pattern = getPattern?.();
    if (!pattern) return;
    const now = context.currentTime;
    const stepDuration = getStepDurationSeconds(pattern);
    const lookaheadSec = LOOKAHEAD_MS / 1000;
    const kMin = Math.ceil((now - startTime) / stepDuration);
    const kMax = Math.floor((now + lookaheadSec - startTime) / stepDuration);
    const steps = pattern.steps;

    for (let k = kMin; k <= kMax; k++) {
      const stepIndex = k % steps.length;
      const level = steps[stepIndex];
      if (level === "off") continue;
      const when = startTime + k * stepDuration;
      playClick(context, level as ClickLevel, when);
    }
  }

  function start(getPatternFn: () => Pattern): void {
    if (timerId) return;
    getPattern = getPatternFn;
    startTime = context.currentTime;
    paused = false;
    timerId = setInterval(runSchedule, SCHEDULE_INTERVAL_MS);
  }

  function pause(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    paused = true;
  }

  function resume(): void {
    if (!getPattern || !paused) return;
    paused = false;
    timerId = setInterval(runSchedule, SCHEDULE_INTERVAL_MS);
  }

  function stop(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    getPattern = null;
    paused = false;
  }

  function reset(): void {
    startTime = context.currentTime;
  }

  function isRunning(): boolean {
    return timerId !== null;
  }

  function isPaused(): boolean {
    return paused && getPattern !== null;
  }

  function getCurrentStepIndex(): number | null {
    const pattern = getPattern?.();
    if (!pattern) return null;
    const elapsed = context.currentTime - startTime;
    const stepDuration = getStepDurationSeconds(pattern);
    const k = Math.floor(elapsed / stepDuration);
    if (k < 0) return 0;
    return k % pattern.steps.length;
  }

  return { start, pause, resume, stop, reset, isRunning, isPaused, getCurrentStepIndex };
}
