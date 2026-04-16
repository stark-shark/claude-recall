import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

export interface MemoryDirEntry {
  projectHash: string;
  memoryDir: string;
}

const DEFAULT_PROJECTS_ROOT = path.join(
  os.homedir(),
  ".claude",
  "projects"
);

export function projectPathToHash(projectPath: string): string {
  return projectPath
    .replace(/:/g, "-")
    .replace(/[\\/]/g, "-");
}

export function getMemoryDir(
  projectHash: string,
  projectsRoot: string = DEFAULT_PROJECTS_ROOT
): string | null {
  const memDir = path.join(projectsRoot, projectHash, "memory");
  return fs.existsSync(memDir) ? memDir : null;
}

export function getCurrentProjectHash(): string {
  return projectPathToHash(process.cwd());
}

export function discoverAllMemoryDirs(
  projectsRoot: string = DEFAULT_PROJECTS_ROOT
): MemoryDirEntry[] {
  if (!fs.existsSync(projectsRoot)) {
    return [];
  }

  const entries: MemoryDirEntry[] = [];

  for (const name of fs.readdirSync(projectsRoot)) {
    const memDir = path.join(projectsRoot, name, "memory");
    if (fs.existsSync(memDir) && fs.statSync(memDir).isDirectory()) {
      entries.push({ projectHash: name, memoryDir: memDir });
    }
  }

  return entries;
}

export function ensureMemoryDir(
  projectHash: string,
  projectsRoot: string = DEFAULT_PROJECTS_ROOT
): string {
  const memDir = path.join(projectsRoot, projectHash, "memory");
  fs.mkdirSync(memDir, { recursive: true });
  return memDir;
}
