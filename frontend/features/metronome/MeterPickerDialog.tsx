"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubdivisionNoteIcon } from "@/features/metronome/SubdivisionNoteIcon";
import { TIME_SIGNATURE_OPTIONS } from "@/lib/constants";
import { resizePatternForNewSettings } from "@/lib/pattern";
import { isValidTimeSignatureAndSubdivision } from "@/lib/rhythm";
import { SUBDIVISION_OPTIONS } from "@/lib/subdivisionDisplay";
import type { Pattern, Subdivision, TimeSignature } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUBDIVISIONS = SUBDIVISION_OPTIONS;

function isSameTimeSignature(a: TimeSignature, b: TimeSignature): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

type MeterPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
};

export function MeterPickerDialog({
  open,
  onOpenChange,
  pattern,
  onPatternChange,
}: MeterPickerDialogProps) {
  const { timeSignature, subdivision } = pattern;

  const selectTimeSignature = (numerator: number, denominator: number) => {
    const newTs: TimeSignature = { numerator, denominator };
    if (!isValidTimeSignatureAndSubdivision(newTs, subdivision)) return;
    onPatternChange(resizePatternForNewSettings(pattern, newTs, subdivision));
  };

  const selectSubdivision = (sub: Subdivision) => {
    if (!isValidTimeSignatureAndSubdivision(timeSignature, sub)) return;
    onPatternChange(resizePatternForNewSettings(pattern, timeSignature, sub));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meter</DialogTitle>
          <DialogDescription>Choose time signature and subdivision.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Time signature
            </p>
            <div
              role="listbox"
              aria-label="Time signature"
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
            >
              {TIME_SIGNATURE_OPTIONS.map((opt) => {
                const ts: TimeSignature = {
                  numerator: opt.numerator,
                  denominator: opt.denominator,
                };
                const selected = isSameTimeSignature(timeSignature, ts);
                const valid = isValidTimeSignatureAndSubdivision(ts, subdivision);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={!valid}
                    onClick={() => selectTimeSignature(opt.numerator, opt.denominator)}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors touch-manipulation",
                      selected &&
                        "border-red-500 bg-red-500/10 ring-2 ring-red-500/40 dark:border-red-400 dark:ring-red-400/40",
                      !selected &&
                        "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500",
                      !valid && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span className="text-xl font-semibold tabular-nums">{opt.label}</span>
                    {opt.name && (
                      <span className="text-[10px] leading-tight text-muted-foreground">
                        {opt.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Subdivision
            </p>
            <div
              role="listbox"
              aria-label="Subdivision"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {SUBDIVISIONS.map(({ value, label }) => {
                const selected = subdivision === value;
                const valid = isValidTimeSignatureAndSubdivision(timeSignature, value);

                return (
                  <button
                    key={value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={!valid}
                    onClick={() => selectSubdivision(value)}
                    className={cn(
                      "flex h-14 flex-col items-center justify-center rounded-xl border px-2 py-2 transition-colors touch-manipulation",
                      selected &&
                        "border-red-500 bg-red-500/10 text-red-700 ring-2 ring-red-500/40 dark:border-red-400 dark:text-red-300 dark:ring-red-400/40",
                      !selected &&
                        "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500",
                      !valid && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span className="flex w-full items-center justify-center">
                      <SubdivisionNoteIcon subdivision={value} />
                    </span>
                    <span className="sr-only">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
