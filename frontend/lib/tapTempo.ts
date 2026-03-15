/**
 * Tap tempo: derive BPM from recent tap intervals.
 * Ignores too-fast, too-slow, and stale tap sequences.
 */

/** Reset tap sequence if gap since last tap exceeds this (ms). */
const TAP_RESET_MS = 2000;

/** Shortest valid interval (ms) ~ 300 BPM. */
const MIN_INTERVAL_MS = 200;

/** Longest valid interval (ms) ~ 20 BPM. */
const MAX_INTERVAL_MS = 3000;

/** Keep at most this many tap timestamps. */
const MAX_TAPS = 8;

/** Use this many most recent intervals to average (smoother). */
const INTERVALS_TO_USE = 4;

/**
 * Record a tap at `now` (ms). Returns updated timestamps.
 * Drops the sequence if the gap since the last tap exceeds TAP_RESET_MS.
 */
export function recordTap(timestamps: number[], now: number): number[] {
  if (timestamps.length > 0 && now - timestamps[timestamps.length - 1]! > TAP_RESET_MS) {
    return [now];
  }
  return [...timestamps, now].slice(-MAX_TAPS);
}

/**
 * Derive BPM from tap timestamps, or null if not enough valid data.
 * Uses the most recent valid intervals and clamps to [minBPM, maxBPM].
 */
export function getBPMFromTaps(
  timestamps: number[],
  minBPM: number,
  maxBPM: number
): number | null {
  if (timestamps.length < 2) return null;

  const intervalsMs: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const interval = timestamps[i]! - timestamps[i - 1]!;
    if (interval >= MIN_INTERVAL_MS && interval <= MAX_INTERVAL_MS) {
      intervalsMs.push(interval);
    }
  }
  if (intervalsMs.length === 0) return null;

  const toUse = intervalsMs.slice(-INTERVALS_TO_USE);
  const avgMs = toUse.reduce((a, b) => a + b, 0) / toUse.length;
  const bpm = Math.round(60000 / avgMs);
  return Math.max(minBPM, Math.min(maxBPM, bpm));
}
