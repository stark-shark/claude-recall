import { describe, it, expect } from "vitest";
import { validateNotation } from "../../src/lib/validator.js";

describe("validateNotation", () => {
  it("passes well-formed feedback", () => {
    const result = validateNotation("rule: FK\n:: reason\n(+) trigger", "fb");
    expect(result.valid).toBe(true);
  });

  it("fails feedback without required fields", () => {
    const result = validateNotation("some notes", "fb");
    expect(result.valid).toBe(false);
  });

  it("warns on drop rule violations", () => {
    const result = validateNotation("rule: the FK basically just needs however additionally\n:: reason\n(+) trigger", "fb");
    expect(result.warnings.some((w) => w.includes("drop rule"))).toBe(true);
  });

  it("passes project with symbols", () => {
    const result = validateNotation("## arch\n2 processes @GP:\n1. sync -> 5min\n2. watcher -> persistent\n!implemented", "proj");
    expect(result.valid).toBe(true);
  });
});
