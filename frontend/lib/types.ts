export type TriggerLevel = "off" | "low" | "mid" | "high";

export type Subdivision =
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "sixteenth";

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
