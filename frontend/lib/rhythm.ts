import type { Subdivision, TimeSignature } from "./types";

type DenominatorSubdivision = Exclude<Subdivision, "triplet">;

/**
 * Note value as denominator: quarter=4, eighth=8, sixteenth=16.
 * Triplet is handled separately (3 steps per beat).
 */
export const SUBDIVISION_DENOMINATOR: Record<DenominatorSubdivision, number> = {
  quarter: 4,
  eighth: 8,
  sixteenth: 16,
};

/**
 * Number of subdivision steps that fit in one measure.
 * Formula: (numerator / denominator) * subdivision_denom = numerator * subdivision_denom / denominator.
 * Must be an integer for a valid combination.
 */
export function getStepsPerMeasure(
  timeSignature: TimeSignature,
  subdivision: Subdivision
): number {
  const { numerator, denominator } = timeSignature;
  if (subdivision === "triplet") {
    return numerator * 3;
  }
  const subdivDenom = SUBDIVISION_DENOMINATOR[subdivision];
  return (numerator * subdivDenom) / denominator;
}

/**
 * True if this time signature + subdivision yields an integer number of steps per measure.
 */
export function isValidTimeSignatureAndSubdivision(
  timeSignature: TimeSignature,
  subdivision: Subdivision
): boolean {
  if (subdivision === "triplet") {
    return timeSignature.numerator > 0;
  }
  const steps = getStepsPerMeasure(timeSignature, subdivision);
  return Number.isInteger(steps) && steps > 0;
}

/**
 * Steps per beat (for display or scheduling): steps per measure / numerator.
 */
export function getStepsPerBeat(
  timeSignature: TimeSignature,
  subdivision: Subdivision
): number {
  const steps = getStepsPerMeasure(timeSignature, subdivision);
  return steps / timeSignature.numerator;
}
