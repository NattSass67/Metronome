import { getStepsPerMeasure, getStepsPerBeat } from "./rhythm";
import type { Pattern, TimeSignature, TriggerLevel, Subdivision } from "./types";

/** Default BPM for new patterns. */
export const DEFAULT_BPM = 120;

/** Default time signature: 4/4. */
export const DEFAULT_TIME_SIGNATURE: TimeSignature = {
  numerator: 4,
  denominator: 4,
};

/** Default subdivision: quarter. */
export const DEFAULT_SUBDIVISION: Subdivision = "quarter";

/**
 * Returns an array of `stepCount` steps, all "off".
 */
export function generateDefaultSteps(stepCount: number): TriggerLevel[] {
  return Array.from({ length: stepCount }, (): TriggerLevel => "off");
}

/**
 * Returns steps with an accent on the first subdivision of each beat; others off.
 */
export function generateDownbeatSteps(
  timeSignature: TimeSignature,
  subdivision: Subdivision
): TriggerLevel[] {
  const stepCount = getStepsPerMeasure(timeSignature, subdivision);
  const stepsPerBeat = getStepsPerBeat(timeSignature, subdivision);
  return Array.from({ length: stepCount }, (_, i): TriggerLevel =>
    i % stepsPerBeat === 0 ? "high" : "off"
  );
}

/**
 * Resizes a steps array to `newStepCount`.
 * Preserves existing step values by index; fills new slots with "off".
 * If shrinking, truncates (keeps first `newStepCount` steps).
 */
export function resizeSteps(
  currentSteps: TriggerLevel[],
  newStepCount: number
): TriggerLevel[] {
  if (newStepCount <= 0) return [];
  if (newStepCount <= currentSteps.length) {
    return currentSteps.slice(0, newStepCount);
  }
  const fillCount = newStepCount - currentSteps.length;
  const filled: TriggerLevel[] = Array.from(
    { length: fillCount },
    (): TriggerLevel => "off"
  );
  return [...currentSteps, ...filled];
}

/**
 * Returns a new pattern with the given time signature and subdivision.
 * BPM is unchanged. When time signature or subdivision changes, steps are
 * re-initialized with accents on each downbeat.
 */
export function resizePatternForNewSettings(
  pattern: Pattern,
  newTimeSignature: TimeSignature,
  newSubdivision: Subdivision
): Pattern {
  const settingsChanged =
    pattern.timeSignature.numerator !== newTimeSignature.numerator ||
    pattern.timeSignature.denominator !== newTimeSignature.denominator ||
    pattern.subdivision !== newSubdivision;

  const steps = settingsChanged
    ? generateDownbeatSteps(newTimeSignature, newSubdivision)
    : resizeSteps(pattern.steps, getStepsPerMeasure(newTimeSignature, newSubdivision));

  return {
    ...pattern,
    timeSignature: newTimeSignature,
    subdivision: newSubdivision,
    steps,
  };
}

/**
 * Creates a default pattern: 4/4, quarter subdivision, default BPM, downbeat accents.
 * Optional overrides; steps are only used if their length matches the (possibly overridden) time sig + subdivision.
 */
export function createDefaultPattern(overrides?: Partial<Pattern>): Pattern {
  const timeSignature = overrides?.timeSignature ?? DEFAULT_TIME_SIGNATURE;
  const subdivision = overrides?.subdivision ?? DEFAULT_SUBDIVISION;
  const stepCount = getStepsPerMeasure(timeSignature, subdivision);
  const steps =
    overrides?.steps?.length === stepCount
      ? overrides.steps
      : generateDownbeatSteps(timeSignature, subdivision);

  return {
    bpm: overrides?.bpm ?? DEFAULT_BPM,
    timeSignature,
    subdivision,
    steps,
  };
}
