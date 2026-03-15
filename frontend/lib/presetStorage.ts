import { z } from "zod";
import { BPM_MIN, BPM_MAX } from "./constants";
import type { Pattern } from "./types";
import type { Preset } from "./presets";

const STORAGE_KEY = "metronome-custom-presets";

const triggerLevelSchema = z.enum(["off", "low", "mid", "high"]);
const subdivisionSchema = z.enum([
  "whole",
  "half",
  "quarter",
  "eighth",
  "sixteenth",
]);

const patternSchema = z.object({
  bpm: z.number().min(BPM_MIN).max(BPM_MAX),
  timeSignature: z.object({
    numerator: z.number().int().min(1).max(16),
    denominator: z.number().int().min(2).max(8),
  }),
  subdivision: subdivisionSchema,
  steps: z.array(triggerLevelSchema),
});

const storedPresetSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  pattern: patternSchema,
});

const storedPresetsSchema = z.array(storedPresetSchema);

function readRaw(): unknown {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Load custom presets from localStorage. Invalid entries are skipped.
 */
export function getCustomPresets(): Preset[] {
  const result = z.array(storedPresetSchema).safeParse(readRaw());
  if (!result.success) return [];
  return result.data;
}

/**
 * Save a new custom preset. Returns the saved preset (with id).
 */
export function saveCustomPreset(name: string, pattern: Pattern): Preset {
  const id = crypto.randomUUID();
  const preset: Preset = { id, name: name.trim(), pattern };
  const list = getCustomPresets();
  list.push(preset);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  return preset;
}

/**
 * Delete a custom preset by id.
 */
export function deleteCustomPreset(id: string): void {
  const list = getCustomPresets().filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}
