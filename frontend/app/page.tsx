"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PageLayout, PageHeader, SectionCard } from "@/components/layout";
import { Separator } from "@/components/ui/separator";
import { ControlsSection } from "@/features/metronome/ControlsSection";
import { PresetsSection } from "@/features/metronome/PresetsSection";
import { StepGrid } from "@/features/metronome/StepGrid";
import { TransportSection, type TransportSectionHandle } from "@/features/metronome/TransportSection";
import { BPM_MIN, BPM_MAX } from "@/lib/constants";
import { createDefaultPattern } from "@/lib/pattern";
import { getStepsPerBeat } from "@/lib/rhythm";
import type { Pattern, TriggerLevel } from "@/lib/types";

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  const role = target.getAttribute("role");
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable || role === "combobox" || role === "listbox";
}

export default function Home() {
  const [pattern, setPattern] = useState<Pattern>(() => createDefaultPattern());
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const transportRef = useRef<TransportSectionHandle>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableElement(e.target)) return;
      if (e.code === "Space") {
        e.preventDefault();
        transportRef.current?.togglePlayPause();
        return;
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setPattern((prev) => ({
          ...prev,
          bpm: Math.min(BPM_MAX, prev.bpm + (e.shiftKey ? 5 : 1)),
        }));
        return;
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setPattern((prev) => ({
          ...prev,
          bpm: Math.max(BPM_MIN, prev.bpm - (e.shiftKey ? 5 : 1)),
        }));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleStepChange = useCallback(
    (index: number, level: TriggerLevel) => {
      const next = [...pattern.steps];
      next[index] = level;
      setPattern({ ...pattern, steps: next });
    },
    [pattern]
  );

  return (
    <PageLayout>
      <PageHeader
        title="Rhythm Trainer"
        description="Programmable metronome for timing and subdivision practice"
      />

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <SectionCard title="Controls" aria-label="Controls" className="p-4 sm:p-5">
        <ControlsSection pattern={pattern} onPatternChange={setPattern} />
      </SectionCard>

      <SectionCard
        title="Step grid"
        aria-label="Step grid"
        className="p-5 sm:p-8 md:py-10 ring-1 ring-zinc-200/80 dark:ring-zinc-700/60 bg-zinc-100/40 dark:bg-zinc-900/60"
      >
        <StepGrid
          steps={pattern.steps}
          stepsPerBeat={getStepsPerBeat(pattern.timeSignature, pattern.subdivision)}
          activeStepIndex={activeStepIndex}
          onStepChange={handleStepChange}
        />
      </SectionCard>

      <SectionCard title="Transport" aria-label="Transport" className="p-4 sm:p-5">
        <TransportSection
          ref={transportRef}
          pattern={pattern}
          onActiveStepChange={setActiveStepIndex}
        />
      </SectionCard>

      <SectionCard title="Presets" aria-label="Presets" className="p-4 sm:p-5">
        <PresetsSection pattern={pattern} onPatternChange={setPattern} />
      </SectionCard>
    </PageLayout>
  );
}
