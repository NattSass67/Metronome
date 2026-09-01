import { describe, it, expect } from "vitest";
import type { TriggerLevel } from "./types";
import {
  createDefaultPattern,
  generateDefaultSteps,
  generateDownbeatSteps,
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

  describe("generateDownbeatSteps", () => {
    it("accents every beat in 4/4 quarter", () => {
      expect(
        generateDownbeatSteps({ numerator: 4, denominator: 4 }, "quarter")
      ).toEqual(["high", "high", "high", "high"]);
    });
    it("accents downbeats only in 4/4 eighth", () => {
      expect(
        generateDownbeatSteps({ numerator: 4, denominator: 4 }, "eighth")
      ).toEqual(["high", "off", "high", "off", "high", "off", "high", "off"]);
    });
    it("accents every beat in 3/4 quarter", () => {
      expect(
        generateDownbeatSteps({ numerator: 3, denominator: 4 }, "quarter")
      ).toEqual(["high", "high", "high"]);
    });
    it("accents downbeats in 4/4 triplet (3 per beat)", () => {
      expect(
        generateDownbeatSteps({ numerator: 4, denominator: 4 }, "triplet")
      ).toEqual([
        "high",
        "off",
        "off",
        "high",
        "off",
        "off",
        "high",
        "off",
        "off",
        "high",
        "off",
        "off",
      ]);
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
    it("re-initializes downbeats when changing 4/4 quarter to 4/4 eighth", () => {
      const pattern = createDefaultPattern();
      expect(pattern.steps).toHaveLength(4);
      const updated = resizePatternForNewSettings(
        pattern,
        { numerator: 4, denominator: 4 },
        "eighth"
      );
      expect(updated.steps).toEqual([
        "high",
        "off",
        "high",
        "off",
        "high",
        "off",
        "high",
        "off",
      ]);
      expect(updated.timeSignature).toEqual({ numerator: 4, denominator: 4 });
      expect(updated.subdivision).toBe("eighth");
      expect(updated.bpm).toBe(pattern.bpm);
    });
    it("re-initializes downbeats when changing time signature", () => {
      const pattern = createDefaultPattern({
        steps: ["high", "mid", "low", "off"] as TriggerLevel[],
      });
      const updated = resizePatternForNewSettings(
        pattern,
        { numerator: 3, denominator: 4 },
        "quarter"
      );
      expect(updated.steps).toEqual(["high", "high", "high"]);
    });
    it("re-initializes downbeats when changing subdivision to fewer steps", () => {
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
      expect(updated.steps).toEqual(["high", "high", "high", "high"]);
    });
  });

  describe("createDefaultPattern", () => {
    it("returns 4/4 quarter with downbeat accents and default BPM", () => {
      const p = createDefaultPattern();
      expect(p.bpm).toBe(DEFAULT_BPM);
      expect(p.timeSignature).toEqual(DEFAULT_TIME_SIGNATURE);
      expect(p.subdivision).toBe(DEFAULT_SUBDIVISION);
      expect(p.steps).toHaveLength(4);
      expect(p.steps).toEqual(["high", "high", "high", "high"]);
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
      expect(p.steps).toEqual(["high", "off", "high", "off", "high", "off"]);
    });
  });
});
