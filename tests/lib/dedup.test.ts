import { describe, it, expect } from "vitest";
import { hashContent, findDuplicate } from "../../src/lib/dedup.js";

describe("hashContent", () => {
  it("is consistent", () => {
    expect(hashContent("rule: FK")).toBe(hashContent("rule: FK"));
  });

  it("differs for different content", () => {
    expect(hashContent("a")).not.toBe(hashContent("b"));
  });

  it("normalizes whitespace", () => {
    expect(hashContent("rule:  FK  ")).toBe(hashContent("rule: FK"));
  });
});

describe("findDuplicate", () => {
  it("finds duplicate", () => {
    const files = new Map([["a.md", "rule: FK"]]);
    expect(findDuplicate("rule: FK", files)).toBe("a.md");
  });

  it("returns null for no match", () => {
    const files = new Map([["a.md", "rule: FK"]]);
    expect(findDuplicate("new content", files)).toBeNull();
  });
});
