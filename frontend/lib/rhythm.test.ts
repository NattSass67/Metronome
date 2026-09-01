import { describe, it, expect } from "vitest";
import {
  getStepsPerMeasure,
  isValidTimeSignatureAndSubdivision,
  SUBDIVISION_DENOMINATOR,
} from "./rhythm";
describe("rhythm utilities", () => {
  describe("SUBDIVISION_DENOMINATOR (note value relationships)", () => {
    it("maps each subdivision to correct denominator", () => {
      expect(SUBDIVISION_DENOMINATOR.quarter).toBe(4);
      expect(SUBDIVISION_DENOMINATOR.eighth).toBe(8);
      expect(SUBDIVISION_DENOMINATOR.sixteenth).toBe(16);
    });
  });

  describe("getStepsPerMeasure", () => {
    it("4/4 + quarter = 4", () => {
      expect(getStepsPerMeasure({ numerator: 4, denominator: 4 }, "quarter")).toBe(4);
    });
    it("4/4 + eighth = 8", () => {
      expect(getStepsPerMeasure({ numerator: 4, denominator: 4 }, "eighth")).toBe(8);
    });
    it("4/4 + sixteenth = 16", () => {
      expect(getStepsPerMeasure({ numerator: 4, denominator: 4 }, "sixteenth")).toBe(16);
    });
    it("3/4 + eighth = 6", () => {
      expect(getStepsPerMeasure({ numerator: 3, denominator: 4 }, "eighth")).toBe(6);
    });
    it("3/4 + sixteenth = 12", () => {
      expect(getStepsPerMeasure({ numerator: 3, denominator: 4 }, "sixteenth")).toBe(12);
    });
    it("6/8 + eighth = 6", () => {
      expect(getStepsPerMeasure({ numerator: 6, denominator: 8 }, "eighth")).toBe(6);
    });
    it("6/8 + sixteenth = 12", () => {
      expect(getStepsPerMeasure({ numerator: 6, denominator: 8 }, "sixteenth")).toBe(12);
    });
    it("5/4 + quarter = 5", () => {
      expect(getStepsPerMeasure({ numerator: 5, denominator: 4 }, "quarter")).toBe(5);
    });
    it("7/8 + eighth = 7", () => {
      expect(getStepsPerMeasure({ numerator: 7, denominator: 8 }, "eighth")).toBe(7);
    });
    it("4/4 + triplet = 12 (3 steps per beat)", () => {
      expect(getStepsPerMeasure({ numerator: 4, denominator: 4 }, "triplet")).toBe(12);
    });
    it("3/4 + triplet = 9", () => {
      expect(getStepsPerMeasure({ numerator: 3, denominator: 4 }, "triplet")).toBe(9);
    });
    it("6/8 + triplet = 18", () => {
      expect(getStepsPerMeasure({ numerator: 6, denominator: 8 }, "triplet")).toBe(18);
    });
  });

  describe("isValidTimeSignatureAndSubdivision", () => {
    it("returns true for valid combinations", () => {
      expect(
        isValidTimeSignatureAndSubdivision({ numerator: 4, denominator: 4 }, "quarter")
      ).toBe(true);
      expect(
        isValidTimeSignatureAndSubdivision({ numerator: 6, denominator: 8 }, "sixteenth")
      ).toBe(true);
    });
    it("returns true for triplet with any positive numerator", () => {
      expect(
        isValidTimeSignatureAndSubdivision({ numerator: 4, denominator: 4 }, "triplet")
      ).toBe(true);
      expect(
        isValidTimeSignatureAndSubdivision({ numerator: 7, denominator: 8 }, "triplet")
      ).toBe(true);
    });
    it("returns false when steps would be fractional", () => {
      // 4/4 + whole => 4*1/4 = 1, valid. Try 2/3 + quarter => 2*4/3 = 8/3, invalid
      expect(
        isValidTimeSignatureAndSubdivision({ numerator: 2, denominator: 3 }, "quarter")
      ).toBe(false);
    });
  });
});
