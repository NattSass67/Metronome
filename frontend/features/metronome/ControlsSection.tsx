"use client";

import { useRef, useCallback } from "react";
import { Minus, Plus, Hand } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { BPM_MIN, BPM_MAX } from "@/lib/constants";
import type { Pattern, Subdivision, TimeSignature } from "@/lib/types";
import { isValidTimeSignatureAndSubdivision } from "@/lib/rhythm";
import { resizePatternForNewSettings } from "@/lib/pattern";
import { recordTap, getBPMFromTaps } from "@/lib/tapTempo";
import { cn } from "@/lib/utils";

const SUBDIVISIONS: Subdivision[] = [
  "whole",
  "half",
  "quarter",
  "eighth",
  "sixteenth",
];

const DENOMINATORS = [2, 4, 8];
const DENOMINATOR_ITEMS = DENOMINATORS.map(String);
const NUMERATOR_MIN = 1;
const NUMERATOR_MAX = 16;
const BPM_STEP = 1;

type ControlsSectionProps = {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  className?: string;
};

export function ControlsSection({
  pattern,
  onPatternChange,
  className,
}: ControlsSectionProps) {
  const { bpm, timeSignature, subdivision } = pattern;
  const tapTimestampsRef = useRef<number[]>([]);

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

  const bpmClamped = Math.max(BPM_MIN, Math.min(BPM_MAX, bpm));

  const setTimeSignature = (numerator: number, denominator: number) => {
    const newTs: TimeSignature = { numerator, denominator };
    if (!isValidTimeSignatureAndSubdivision(newTs, subdivision)) return;
    onPatternChange(resizePatternForNewSettings(pattern, newTs, subdivision));
  };

  const setSubdivision = (sub: Subdivision) => {
    if (!isValidTimeSignatureAndSubdivision(timeSignature, sub)) return;
    onPatternChange(resizePatternForNewSettings(pattern, timeSignature, sub));
  };

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <div className="space-y-2 md:col-span-2">
        <Label id="bpm-label" className="text-zinc-600 dark:text-zinc-300">BPM</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 min-w-11 min-h-11 touch-manipulation"
              onClick={() => setBpm(bpmClamped - BPM_STEP)}
              aria-label="Decrease BPM"
            >
              <Minus className="size-4" aria-hidden />
            </Button>
            <div className="flex flex-col items-center gap-0.5">
              <span
                className="text-3xl sm:text-4xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 select-none"
                aria-hidden
              >
                {bpmClamped}
              </span>
              <Input
                id="bpm"
                type="number"
                min={BPM_MIN}
                max={BPM_MAX}
                step={BPM_STEP}
                value={bpmClamped}
                onChange={(e) => setBpm(Number(e.target.value) || BPM_MIN)}
                aria-labelledby="bpm-label"
                aria-label="Beats per minute"
                className="w-16 h-8 text-center tabular-nums text-sm"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 min-w-11 min-h-11 touch-manipulation"
              onClick={() => setBpm(bpmClamped + BPM_STEP)}
              aria-label="Increase BPM"
            >
              <Plus className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTapTempo}
              aria-label="Tap tempo: tap in time to set BPM from your rhythm"
              title="Tap in time with your rhythm to set the BPM automatically (tap at least twice)"
              className="shrink-0 min-h-11 touch-manipulation"
            >
              <Hand className="size-4 mr-2" aria-hidden />
              Tap
            </Button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tap the button in time with your rhythm to set BPM automatically.
          </p>
          <Slider
            min={BPM_MIN}
            max={BPM_MAX}
            step={BPM_STEP}
            value={[bpmClamped]}
            onValueChange={(v) => setBpm(v[0] ?? bpmClamped)}
            aria-labelledby="bpm-label"
            aria-label="BPM slider"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label id="num-label">Time signature</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={NUMERATOR_MIN}
            max={NUMERATOR_MAX}
            value={timeSignature.numerator}
            onChange={(e) =>
              setTimeSignature(Number(e.target.value) || 1, timeSignature.denominator)
            }
            aria-labelledby="num-label"
            className="w-16"
          />
          <span className="text-muted-foreground">/</span>
          <Combobox
            value={String(timeSignature.denominator)}
            onValueChange={(v) =>
              v != null && setTimeSignature(timeSignature.numerator, Number(v))
            }
            items={DENOMINATOR_ITEMS}
          >
            <ComboboxInput placeholder="—" className="min-w-[5rem] h-8" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      <div className="space-y-2">
        <Label id="subdivision-label">Subdivision</Label>
        <Combobox
          value={subdivision}
          onValueChange={(v) => v != null && setSubdivision(v as Subdivision)}
          items={SUBDIVISIONS}
        >
          <ComboboxInput placeholder="Subdivision" className="min-w-[8rem] h-8" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
