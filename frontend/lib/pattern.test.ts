import { describe, it, expect } from "vitest";
import type { TriggerLevel } from "./types";
import {
  createDefaultPattern,
  generateDefaultSteps,
  resizeSteps,
  resizePatternForNewSettings,
  DEFAULT_BPM,
  DEFAULT_TIME_SIGNATURE,
  DEFAULT_SUBDIVISION,
} from "./pattern";

describe("pattern utilities", () => {
  describe("generateDefaultSteps", () => {
    it("returns array of given length with all off", () => {
      const steps = generateDefaultSteps(4);
      expect(steps).toHaveLength(4);
      expect(steps).toEqual(["off", "off", "off", "off"]);
    });
    it("returns empty array for 0", () => {
      expect(generateDefaultSteps(0)).toEqual([]);
    });
  });

  describe("resizeSteps", () => {
    it("preserves existing steps when shrinking", () => {
      const current: TriggerLevel[] = ["high", "mid", "low", "off"];
      expect(resizeSteps(current, 2)).toEqual(["high", "mid"]);
    });
    it("preserves existing and fills new with off when growing", () => {
      const current: TriggerLevel[] = ["high", "mid"];
      expect(resizeSteps(current, 4)).toEqual(["high", "mid", "off", "off"]);
    });
    it("returns copy of current when same length", () => {
      const current: TriggerLevel[] = ["high", "off"];
      const result = resizeSteps(current, 2);
      expect(result).toEqual(["high", "off"]);
      expect(result).not.toBe(current);
    });
    it("returns empty when newStepCount is 0", () => {
      const current: TriggerLevel[] = ["high", "mid"];
      expect(resizeSteps(current, 0)).toEqual([]);
    });
  });

  describe("resizePatternForNewSettings", () => {
    it("resizes steps when changing 4/4 quarter to 4/4 eighth", () => {
      const pattern = createDefaultPattern();
      expect(pattern.steps).toHaveLength(4);
      const updated = resizePatternForNewSettings(
        pattern,
        { numerator: 4, denominator: 4 },
        "eighth"
      );
      expect(updated.steps).toHaveLength(8);
      expect(updated.timeSignature).toEqual({ numerator: 4, denominator: 4 });
      expect(updated.subdivision).toBe("eighth");
      expect(updated.bpm).toBe(pattern.bpm);
    });
    it("preserves existing step values by index when growing", () => {
      const pattern = createDefaultPattern();
      pattern.steps[0] = "high";
      pattern.steps[1] = "mid";
      const updated = resizePatternForNewSettings(
        pattern,
        { numerator: 4, denominator: 4 },
        "eighth"
      );
      expect(updated.steps[0]).toBe("high");
      expect(updated.steps[1]).toBe("mid");
      expect(updated.steps[2]).toBe("off");
      expect(updated.steps[7]).toBe("off");
    });
    it("truncates when changing to fewer steps", () => {
      const pattern = createDefaultPattern({
        timeSignature: { numerator: 4, denominator: 4 },
        subdivision: "eighth",
        steps: [
          "high",
          "mid",
          "low",
          "off",
          "off",
          "off",
          "off",
          "off",
        ] as TriggerLevel[],
      });
      const updated = resizePatternForNewSettings(
        pattern,
        { numerator: 4, denominator: 4 },
        "quarter"
      );
      expect(updated.steps).toEqual(["high", "mid", "low", "off"]);
    });
  });

  describe("createDefaultPattern", () => {
    it("returns 4/4 quarter with 4 steps and default BPM", () => {
      const p = createDefaultPattern();
      expect(p.bpm).toBe(DEFAULT_BPM);
      expect(p.timeSignature).toEqual(DEFAULT_TIME_SIGNATURE);
      expect(p.subdivision).toBe(DEFAULT_SUBDIVISION);
      expect(p.steps).toHaveLength(4);
      expect(p.steps.every((s) => s === "off")).toBe(true);
    });
    it("accepts overrides for bpm, timeSignature, subdivision", () => {
      const p = createDefaultPattern({
        bpm: 80,
        timeSignature: { numerator: 3, denominator: 4 },
        subdivision: "eighth",
      });
      expect(p.bpm).toBe(80);
      expect(p.timeSignature).toEqual({ numerator: 3, denominator: 4 });
      expect(p.subdivision).toBe("eighth");
      expect(p.steps).toHaveLength(6);
    });
  });
});
