import type { Subdivision } from "@/lib/types";

export const SUBDIVISION_IMAGES: Record<Subdivision, string> = {
  quarter: "/sub1.webp",
  eighth: "/sub2.webp",
  triplet: "/sub3.webp",
  sixteenth: "/sub4.webp",
};

export const SUBDIVISION_LABELS: Record<Subdivision, string> = {
  quarter: "Quarter note",
  eighth: "Eighth note",
  triplet: "Triplet",
  sixteenth: "Sixteenth note",
};

export const SUBDIVISION_OPTIONS: { value: Subdivision; label: string }[] = [
  { value: "quarter", label: SUBDIVISION_LABELS.quarter },
  { value: "eighth", label: SUBDIVISION_LABELS.eighth },
  { value: "triplet", label: SUBDIVISION_LABELS.triplet },
  { value: "sixteenth", label: SUBDIVISION_LABELS.sixteenth },
];
