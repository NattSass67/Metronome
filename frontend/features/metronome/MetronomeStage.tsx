"use client";

import { useState, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { BpmDisplay } from "@/features/metronome/BpmDisplay";
import { MeterPickerDialog } from "@/features/metronome/MeterPickerDialog";
import { PresetsSection } from "@/features/metronome/PresetsSection";
import { StepGrid } from "@/features/metronome/StepGrid";
import {
  TransportSection,
  type TransportSectionHandle,
} from "@/features/metronome/TransportSection";
import { getStepsPerBeat } from "@/lib/rhythm";
import { SUBDIVISION_LABELS } from "@/lib/subdivisionDisplay";
import type { Pattern, TriggerLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SubdivisionNoteIcon } from "@/features/metronome/SubdivisionNoteIcon";

type MetronomeStageProps = {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  activeStepIndex: number | null;
  onActiveStepChange: (index: number | null) => void;
  onStepChange: (index: number, level: TriggerLevel) => void;
  className?: string;
};

export const MetronomeStage = forwardRef<TransportSectionHandle, MetronomeStageProps>(
  function MetronomeStage(
    {
      pattern,
      onPatternChange,
      activeStepIndex,
      onActiveStepChange,
      onStepChange,
      className,
    },
    ref
  ) {
    const [meterOpen, setMeterOpen] = useState(false);
    const { timeSignature, subdivision } = pattern;

    return (
      <div
        className={cn(
          "rounded-2xl border border-zinc-200/80 dark:border-zinc-800",
          "bg-white dark:bg-zinc-900",
          "shadow-sm dark:shadow-zinc-950/50",
          "px-5 py-8 sm:px-10 sm:py-10",
          "space-y-8 sm:space-y-10",
          className
        )}
        aria-label="Metronome"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <BpmDisplay pattern={pattern} onPatternChange={onPatternChange} />
          <button
            type="button"
            onClick={() => setMeterOpen(true)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm tabular-nums",
              "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
              "dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800",
              "transition-colors touch-manipulation"
            )}
            aria-label={`Meter: ${timeSignature.numerator}/${timeSignature.denominator}, ${SUBDIVISION_LABELS[subdivision]}. Tap to change.`}
          >
            {timeSignature.numerator}/{timeSignature.denominator}
            <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
              ·
            </span>
            <SubdivisionNoteIcon subdivision={subdivision} className="size-5" />
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </button>
        </div>

        <MeterPickerDialog
          open={meterOpen}
          onOpenChange={setMeterOpen}
          pattern={pattern}
          onPatternChange={onPatternChange}
        />

        <TransportSection
          ref={ref}
          pattern={pattern}
          onActiveStepChange={onActiveStepChange}
          variant="stage"
          className="justify-center"
        />

        <div className="border-t border-zinc-200/80 dark:border-zinc-800 pt-8 sm:pt-10 space-y-8">
          <StepGrid
            steps={pattern.steps}
            stepsPerBeat={getStepsPerBeat(pattern.timeSignature, pattern.subdivision)}
            activeStepIndex={activeStepIndex}
            onStepChange={onStepChange}
            className="items-center"
          />
          <PresetsSection
            pattern={pattern}
            onPatternChange={onPatternChange}
            className="justify-center"
          />
        </div>
      </div>
    );
  }
);
