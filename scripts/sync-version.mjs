// Runs via the npm "version" lifecycle hook: copies package.json's version
// into both plugin manifests so the marketplace never serves a stale version.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { version } = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8"));

for (const rel of [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"]) {
  const file = path.join(root, rel);
  const updated = readFileSync(file, "utf-8").replace(
    /"version":\s*"[^"]+"/,
    `"version": "${version}"`
  );
  writeFileSync(file, updated, "utf-8");
  console.log(`${rel} -> ${version}`);
}
