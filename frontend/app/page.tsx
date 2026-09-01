"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { MetronomeStage } from "@/features/metronome/MetronomeStage";
import type { TransportSectionHandle } from "@/features/metronome/TransportSection";
import { BPM_MIN, BPM_MAX } from "@/lib/constants";
import { createDefaultPattern } from "@/lib/pattern";
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
      <MetronomeStage
        ref={transportRef}
        pattern={pattern}
        onPatternChange={setPattern}
        activeStepIndex={activeStepIndex}
        onActiveStepChange={setActiveStepIndex}
        onStepChange={handleStepChange}
      />
    </PageLayout>
  );
}
