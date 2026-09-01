/** BPM limits used by controls, keyboard shortcuts, and preset validation. */
export const BPM_MIN = 20;
export const BPM_MAX = 300;

export type TimeSignatureOption = {
  id: string;
  label: string;
  name?: string;
  numerator: number;
  denominator: number;
};

/** Common time signatures for the gallery picker. */
export const TIME_SIGNATURE_OPTIONS: TimeSignatureOption[] = [
  { id: "2-4", label: "2/4", name: "March", numerator: 2, denominator: 4 },
  { id: "3-4", label: "3/4", name: "Waltz", numerator: 3, denominator: 4 },
  { id: "4-4", label: "4/4", name: "Common", numerator: 4, denominator: 4 },
  { id: "5-4", label: "5/4", numerator: 5, denominator: 4 },
  { id: "6-8", label: "6/8", name: "Compound", numerator: 6, denominator: 8 },
  { id: "7-8", label: "7/8", numerator: 7, denominator: 8 },
  { id: "9-8", label: "9/8", numerator: 9, denominator: 8 },
  { id: "12-8", label: "12/8", numerator: 12, denominator: 8 },
];
