import type { Pattern, TriggerLevel } from "./types";

export type Preset = {
  id: string;
  name: string;
  pattern: Pattern;
};

const DEFAULT_BPM = 120;

/** Built-in presets: useful rhythm examples. */
export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "4-4-quarter",
    name: "Standard 4/4 quarter",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 4, denominator: 4 },
      subdivision: "quarter",
      steps: ["high", "mid", "mid", "mid"] as TriggerLevel[],
    },
  },
  {
    id: "4-4-eighth",
    name: "4/4 eighth-note pulse",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 4, denominator: 4 },
      subdivision: "eighth",
      steps: [
        "high",
        "low",
        "mid",
        "low",
        "mid",
        "low",
        "mid",
        "low",
      ] as TriggerLevel[],
    },
  },
  {
    id: "3-4-waltz",
    name: "3/4 waltz",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 3, denominator: 4 },
      subdivision: "quarter",
      steps: ["high", "low", "low"] as TriggerLevel[],
    },
  },
  {
    id: "6-8-compound",
    name: "6/8 compound feel",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 6, denominator: 8 },
      subdivision: "eighth",
      steps: [
        "high",
        "low",
        "low",
        "mid",
        "low",
        "low",
      ] as TriggerLevel[],
    },
  },
  {
    id: "7-8-example",
    name: "7/8 example",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 7, denominator: 8 },
      subdivision: "eighth",
      steps: [
        "high",
        "low",
        "low",
        "high",
        "low",
        "low",
        "low",
      ] as TriggerLevel[],
    },
  },
  {
    id: "syncopated-funk",
    name: "Syncopated / funk",
    pattern: {
      bpm: DEFAULT_BPM,
      timeSignature: { numerator: 4, denominator: 4 },
      subdivision: "sixteenth",
      steps: [
        "high",
        "off",
        "mid",
        "off",
        "high",
        "off",
        "mid",
        "off",
        "high",
        "off",
        "mid",
        "off",
        "high",
        "off",
        "mid",
        "off",
      ] as TriggerLevel[],
    },
  },
];
