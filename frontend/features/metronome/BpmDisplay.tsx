"use client";

import { useRef, useCallback } from "react";
import { Minus, Plus, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BPM_MIN, BPM_MAX } from "@/lib/constants";
import type { Pattern } from "@/lib/types";
import { recordTap, getBPMFromTaps } from "@/lib/tapTempo";
import { cn } from "@/lib/utils";

const BPM_STEP = 1;

type BpmDisplayProps = {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  className?: string;
};

export function BpmDisplay({ pattern, onPatternChange, className }: BpmDisplayProps) {
  const tapTimestampsRef = useRef<number[]>([]);
  const bpmClamped = Math.max(BPM_MIN, Math.min(BPM_MAX, pattern.bpm));

  const setBpm = useCallback(
    (value: number) => {
      const clamped = Math.max(BPM_MIN, Math.min(BPM_MAX, Math.round(value)));
      onPatternChange({ ...pattern, bpm: clamped });
    },
    [pattern, onPatternChange]
  );

  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    tapTimestampsRef.current = recordTap(tapTimestampsRef.current, now);
    const derived = getBPMFromTaps(tapTimestampsRef.current, BPM_MIN, BPM_MAX);
    if (derived !== null) {
      onPatternChange({ ...pattern, bpm: derived });
    }
  }, [pattern, onPatternChange]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="mx-auto w-full max-w-xs text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
          Tempo
        </p>
        <p
          className="font-mono text-6xl sm:text-7xl md:text-8xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50"
          aria-live="polite"
          aria-label={`${bpmClamped} beats per minute`}
        >
          {bpmClamped}
        </p>
        <Slider
          min={BPM_MIN}
          max={BPM_MAX}
          step={BPM_STEP}
          value={[bpmClamped]}
          onValueChange={(v) => setBpm(v[0] ?? bpmClamped)}
          aria-label="BPM"
          className="mt-4 w-full touch-manipulation"
        />
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">BPM</p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-12 rounded-full touch-manipulation"
          onClick={() => setBpm(bpmClamped - BPM_STEP)}
          aria-label="Decrease BPM"
        >
          <Minus className="size-5" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleTapTempo}
          aria-label="Tap tempo"
          className="min-h-12 px-5 rounded-full touch-manipulation"
        >
          <Hand className="size-4 mr-2" aria-hidden />
          Tap
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-12 rounded-full touch-manipulation"
          onClick={() => setBpm(bpmClamped + BPM_STEP)}
          aria-label="Increase BPM"
        >
          <Plus className="size-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
