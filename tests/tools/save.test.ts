import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { handleSave } from "../../src/tools/save.js";
import { DEFAULT_CONFIG } from "../../src/lib/config.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("handleSave", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "recall-test-"));
    fs.writeFileSync(path.join(tmpDir, "REGISTRY.md"), "$hub = apps\n$emp = employees\n");
  });

  afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  it("saves new memory with header", () => {
    const result = handleSave({ name: "FK CASCADE", type: "fb", description: "desc", content: "rule: FK\n:: reason\n(+) trigger" }, tmpDir, DEFAULT_CONFIG);
    expect(result.isError).toBeFalsy();
    const written = fs.readFileSync(path.join(tmpDir, "feedback_fk_cascade.md"), "utf-8");
    expect(written).toContain("T:fb | FK CASCADE");
    expect(written).toContain("A:0");
  });

  it("rejects duplicate", () => {
    handleSave({ name: "A", type: "fb", description: "d", content: "rule: x\n:: y\n(+) z" }, tmpDir, DEFAULT_CONFIG);
    const result = handleSave({ name: "B", type: "fb", description: "d", content: "rule: x\n:: y\n(+) z" }, tmpDir, DEFAULT_CONFIG);
    expect(result.isError).toBe(true);
    expect(result.text).toContain("Duplicate");
  });

  it("updates MEMORY.md", () => {
    handleSave({ name: "FK CASCADE", type: "fb", description: "desc", content: "rule: FK\n:: reason\n(+) trigger" }, tmpDir, DEFAULT_CONFIG);
    const index = fs.readFileSync(path.join(tmpDir, "MEMORY.md"), "utf-8");
    expect(index).toContain("[FK CASCADE]");
  });
});
