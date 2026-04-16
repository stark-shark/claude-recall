import * as fs from "node:fs";

export interface RecallConfig {
  maintainIndex: boolean;
  indexFile: string;
  indexMaxLines: number;
  registryFile: string;
  notationEnforcement: "strict" | "warn" | "off";
  headerFields: {
    dates: boolean;
    accessCount: boolean;
    links: boolean;
  };
  healthChecks: {
    staleDays: number;
    staleMinAccess: number;
    compressionTolerancePct: number;
  };
}

export const DEFAULT_CONFIG: RecallConfig = {
  maintainIndex: true,
  indexFile: "MEMORY.md",
  indexMaxLines: 200,
  registryFile: "REGISTRY.md",
  notationEnforcement: "warn",
  headerFields: {
    dates: true,
    accessCount: true,
    links: true,
  },
  healthChecks: {
    staleDays: 30,
    staleMinAccess: 2,
    compressionTolerancePct: 10,
  },
};

function stripJsoncComments(text: string): string {
  return text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

export function loadConfig(configPath: string): RecallConfig {
  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const stripped = stripJsoncComments(raw);
  const userConfig = JSON.parse(stripped);

  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
    headerFields: {
      ...DEFAULT_CONFIG.headerFields,
      ...(userConfig.headerFields ?? {}),
    },
    healthChecks: {
      ...DEFAULT_CONFIG.healthChecks,
      ...(userConfig.healthChecks ?? {}),
    },
  };
}
