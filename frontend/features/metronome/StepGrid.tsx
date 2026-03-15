"use client";

import type { TriggerLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const TRIGGER_ORDER: TriggerLevel[] = ["off", "low", "mid", "high"];

/** Returns opacity for each trigger level. */
function levelOpacity(level: TriggerLevel): string {
  switch (level) {
    case "off":
      return "opacity-10";
    case "low":
      return "opacity-20";
    case "mid":
      return "opacity-50";
    case "high":
      return "opacity-100";
    default:
      return "opacity-100";
  }
}

function nextLevel(current: TriggerLevel): TriggerLevel {
  const i = TRIGGER_ORDER.indexOf(current);
  return TRIGGER_ORDER[(i + 1) % TRIGGER_ORDER.length];
}

type StepGridProps = {
  steps: TriggerLevel[];
  stepsPerBeat: number;
  activeStepIndex?: number | null;
  onStepChange: (index: number, level: TriggerLevel) => void;
  className?: string;
};

const PIP_SIZE = "size-3 md:size-4"; // subdivision; larger on desktop
const PIP_SIZE_BEAT = "size-4 md:size-5"; // beat (numerator) — larger

const LEGEND: { level: TriggerLevel; label: string }[] = [
  { level: "off", label: "Silent" },
  { level: "low", label: "Weak click" },
  { level: "mid", label: "Medium click" },
  { level: "high", label: "Accent" },
];

// Use the same color for all—red-500 (dark:red-400)—and adjust opacity per level
function pipClasses(level: TriggerLevel, isBeat?: boolean) {
  return cn(
    "rounded-full shrink-0",
    isBeat ? PIP_SIZE_BEAT : PIP_SIZE,
    // Common color for all filled levels, border for "off"
    level === "off"
      ? "bg-red-500 dark:bg-red-400 border-2 border-zinc-300 dark:border-zinc-600"
      : "bg-red-500 dark:bg-red-400 border border-red-600 dark:border-red-300",
    levelOpacity(level)
  );
}

export function StepGrid({ steps, stepsPerBeat, activeStepIndex, onStepChange, className }: StepGridProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn("flex flex-wrap gap-1.5 justify-start items-center")}
        role="group"
        aria-label="Step grid"
      >
        {steps.map((level, index) => {
          const isBeat = stepsPerBeat > 0 && index % stepsPerBeat === 0;
          const isActive =
            activeStepIndex !== undefined &&
            activeStepIndex !== null &&
            activeStepIndex === index;
          return (
            <button
              key={index}
              type="button"
              className={cn(
                "min-w-11 min-h-11 flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation",
                isActive &&
                  "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              onClick={() => onStepChange(index, nextLevel(level))}
              aria-label={`Step ${index + 1}: ${level}${isBeat ? " (beat)" : ""}${isActive ? " (playing)" : ""}. Click to cycle.`}
            >
              <span
                className={cn("rounded-full shrink-0 block", pipClasses(level, isBeat))}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400" aria-hidden>
        {LEGEND.map(({ level, label }) => (
          <span key={level} className="inline-flex items-center gap-1.5 mr-4">
            <span className={cn("rounded-full shrink-0", PIP_SIZE, pipClasses(level))} />
            <span>{label}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
