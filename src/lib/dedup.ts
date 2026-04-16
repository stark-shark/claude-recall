import { createHash } from "node:crypto";

function normalize(content: string): string {
  return content.replace(/\s+/g, " ").trim();
}

export function hashContent(content: string): string {
  return createHash("sha256").update(normalize(content)).digest("hex");
}

export function findDuplicate(
  content: string,
  existingFiles: Map<string, string>
): string | null {
  const newHash = hashContent(content);

  for (const [filename, existingContent] of existingFiles) {
    if (hashContent(existingContent) === newHash) {
      return filename;
    }
  }

  return null;
}
