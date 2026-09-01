"use client";

import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import { Play, Square, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pattern } from "@/lib/types";
import { createScheduler, resumeContext, type SchedulerHandle } from "@/lib/audio";
import { cn } from "@/lib/utils";

const ACTIVE_STEP_POLL_MS = 25;

type TransportSectionProps = {
  pattern: Pattern;
  onActiveStepChange?: (index: number | null) => void;
  variant?: "default" | "stage";
  className?: string;
};

export type TransportSectionHandle = {
  togglePlayPause: () => void;
};

type PlaybackState = "stopped" | "playing" | "paused";

export const TransportSection = forwardRef<TransportSectionHandle, TransportSectionProps>(
  function TransportSection({ pattern, onActiveStepChange, variant = "default", className }, ref) {
    const contextRef = useRef<AudioContext | null>(null);
    const schedulerRef = useRef<SchedulerHandle | null>(null);
    const patternRef = useRef<Pattern>(pattern);
    patternRef.current = pattern;
    const [state, setState] = useState<PlaybackState>("stopped");

    useEffect(() => {
      if (state === "stopped") {
        onActiveStepChange?.(null);
        return;
      }
      const id = setInterval(() => {
        const index = schedulerRef.current?.getCurrentStepIndex() ?? null;
        onActiveStepChange?.(index);
      }, ACTIVE_STEP_POLL_MS);
      return () => clearInterval(id);
    }, [state, onActiveStepChange]);

    const getContext = useCallback((): AudioContext => {
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
      }
      return contextRef.current;
    }, []);

    const getScheduler = useCallback((): SchedulerHandle => {
      const ctx = getContext();
      if (!schedulerRef.current) {
        schedulerRef.current = createScheduler(ctx);
      }
      return schedulerRef.current;
    }, [getContext]);

    const handlePlay = useCallback(async () => {
      const scheduler = getScheduler();
      if (state === "playing") return;
      if (state === "paused") {
        const ctx = getContext();
        await resumeContext(ctx);
        scheduler.resume();
        setState("playing");
        return;
      }
      const ctx = getContext();
      await resumeContext(ctx);
      scheduler.start(() => patternRef.current);
      setState("playing");
    }, [state, getContext, getScheduler]);


    const handlePause = useCallback(() => {
      schedulerRef.current?.pause();
      setState("paused");
    }, []);

    const handleStop = useCallback(() => {
      schedulerRef.current?.stop();
      onActiveStepChange?.(null);
      setState("stopped");
    }, [onActiveStepChange]);

    const togglePlayPause = useCallback(() => {
      if (state === "playing") {
        handlePause();
      } else {
        void handlePlay();
      }
    }, [state, handlePause, handlePlay]);

    useImperativeHandle(ref, () => ({ togglePlayPause }), [togglePlayPause]);

    const handleReset = useCallback(() => {
      const s = schedulerRef.current;
      if (!s) return;
      s.reset();
      if (s.isRunning()) {
        setState("playing");
      } else if (s.isPaused()) {
        setState("paused");
      }
    }, []);

    const isPlaying = state === "playing";
    const isPaused = state === "paused";
    const isActive = isPlaying || isPaused;

    if (variant === "stage") {
      return (
        <div className={cn("flex items-center justify-center gap-4 sm:gap-6", className)}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleStop}
            disabled={!isActive}
            aria-label="Stop"
            className="size-11 rounded-full touch-manipulation text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Square className="size-5" aria-hidden />
          </Button>

          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={() => void (isPlaying ? handlePause() : handlePlay())}
            aria-label={isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
            className={cn(
              "size-20 sm:size-24 rounded-full touch-manipulation shadow-lg",
              isPlaying && "ring-4 ring-primary/30"
            )}
          >
            {isPlaying ? (
              <Pause className="size-8 sm:size-9" aria-hidden />
            ) : (
              <Play className="size-8 sm:size-9 ml-1" aria-hidden />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={!isActive}
            aria-label="Reset to start of bar"
            className="size-11 rounded-full touch-manipulation text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <RotateCcw className="size-5" aria-hidden />
          </Button>
        </div>
      );
    }

    return (
      <div className={cn("flex flex-wrap items-center gap-2 sm:gap-3", className)}>
        <Button
          type="button"
          variant="default"
          onClick={handlePlay}
          disabled={isPlaying}
          aria-label="Play"
          className="min-h-11 min-w-11 touch-manipulation"
        >
          <Play className="size-4 mr-2" aria-hidden />
          Play
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handlePause}
          disabled={!isPlaying}
          aria-label="Pause"
          className="min-h-11 min-w-11 touch-manipulation"
        >
          <Pause className="size-4 mr-2" aria-hidden />
          Pause
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleStop}
          disabled={!isActive}
          aria-label="Stop"
          className="min-h-11 min-w-11 touch-manipulation"
        >
          <Square className="size-4 mr-2" aria-hidden />
          Stop
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={!isActive}
          aria-label="Reset to start of bar"
          className="min-h-11 min-w-11 touch-manipulation"
        >
          <RotateCcw className="size-4 mr-2" aria-hidden />
          Reset
        </Button>
      </div>
    );
  });
