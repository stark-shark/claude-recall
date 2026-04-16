# Recall Configuration Reference

## Settings

### maintainIndex
- **Type:** boolean
- **Default:** true
- **Description:** When true, recall_save updates MEMORY.md index after every write. Disable if you rely solely on recall_search and don't want the index file.

### indexFile
- **Type:** string
- **Default:** "MEMORY.md"
- **Description:** Name of the index file in each project's memory directory.

### indexMaxLines
- **Type:** number
- **Default:** 200
- **Description:** Maximum number of lines in the index file. Entries beyond this limit are truncated.

### registryFile
- **Type:** string
- **Default:** "REGISTRY.md"
- **Description:** Name of the entity registry file in each project's memory directory.

### notationEnforcement
- **Type:** "strict" | "warn" | "off"
- **Default:** "warn"
- **Values:**
  - `strict` — Rejects saves that don't pass Recall notation validation. Returns error with specific failures.
  - `warn` — Saves the memory but returns warnings about notation issues.
  - `off` — No validation. Raw passthrough.

### headerFields.dates
- **Type:** boolean
- **Default:** true
- **Description:** Auto-populate C: (created) and U: (updated) fields in memory headers on save.

### headerFields.accessCount
- **Type:** boolean
- **Default:** true
- **Description:** Increment A: (access count) field in memory headers on recall_load.

### headerFields.links
- **Type:** boolean
- **Default:** true
- **Description:** Maintain bidirectional L: (links) references. When memory A links to B, automatically add A to B's L: field.

### healthChecks.staleDays
- **Type:** number
- **Default:** 30
- **Description:** Number of days since U: (last updated) before a memory is flagged as stale by recall_check.

### healthChecks.staleMinAccess
- **Type:** number
- **Default:** 2
- **Description:** Memories with A: (access count) below this threshold AND older than staleDays are flagged as stale.

### healthChecks.compressionTolerancePct
- **Type:** number
- **Default:** 10
- **Description:** Allowed percentage above target compression ratio before recall_check flags a memory as verbose.
