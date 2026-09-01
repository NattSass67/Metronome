export type TriggerLevel = "off" | "low" | "mid" | "high";

export type Subdivision = "quarter" | "eighth" | "triplet" | "sixteenth";

export type TimeSignature = {
  numerator: number;
  denominator: number;
};

export type Pattern = {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  steps: TriggerLevel[];
};
