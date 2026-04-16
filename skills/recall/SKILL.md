---
name: recall
description: Use when reading, writing, searching, or managing memories. Handles all recall_* MCP tool interactions with proper task display and multi-topic retrieval.
---

# Recall — Memory Operations

You have access to the Recall MCP server which provides 8 tools for managing compressed memories. This skill governs how you use them.

## Tools

| Tool | When to use |
|---|---|
| `recall_save` | Writing or updating a memory. Enforces Recall notation, checks for duplicates, validates registry entries, updates MEMORY.md index. |
| `recall_load` | Reading a specific memory by name or filename. Increments access count. Use `expanded: true` for plain English. |
| `recall_search` | Finding memories by keyword, type, or project. Returns headers only — use `recall_load` to get full content. |
| `recall_check` | Running health checks: staleness, registry drift, broken links, stats. Use `checks: ["all"]` for a full report. |
| `recall_decode` | Expanding Recall notation to plain English. |
| `recall_registry` | Managing entity shortcodes ($hub, $ac, etc.) in REGISTRY.md. |
| `recall_export` | Backing up memories to a JSON file. |
| `recall_import` | Restoring memories from a JSON backup. |

## Task Display (MANDATORY)

EVERY `recall_*` tool call MUST be wrapped in `TaskCreate` / `TaskUpdate`. This controls how memory operations appear — without it, output is noisy inline text.

**Spinner text:** Set `activeForm` on the FIRST task to describe the recall operation:
- Loading/searching → `"Recalling memories…"`
- Saving → `"Storing memories…"`
- Health checks → `"Checking memory health…"`
- Decoding → `"Decoding memories…"`

**Task subjects:** Short descriptions WITHOUT a "Recall —" prefix. The spinner text already brands the operation.

**Example — user asks about two topics:**

```
TaskCreate({ subject: "Loading GP Integration", activeForm: "Recalling memories…" })
TaskCreate({ subject: "Searching for SharePoint" })
```

Pinned display:
```
✻ Recalling memories…
  ⎿  ✔ Loading GP Integration
     ◼ Searching for SharePoint
```

**Flow:**
1. Identify ALL distinct topics in the request
2. Create ALL tasks upfront — user sees full scope before work begins
3. Mark each in_progress → call recall tool → mark complete
4. Respond with combined results

## When to Use Recall

Use recall tools (not manual file Read/Write) for ALL memory operations:

- **User asks about a project/feature** → `recall_search` then `recall_load`
- **Saving new knowledge** → `recall_save` with Recall notation
- **End of meaningful work** → `recall_save` at mid-session triggers (version bump, plan completion, architecture decision, 3+ fixes, project switch)
- **Health check requested** → `recall_check`
- **User asks to decode/explain a memory** → `recall_decode`

## Recall Notation

Memories use compressed notation with these symbols:
`->` (maps to), `::` (because), `(+)` (apply when), `!` (not), `>>` (results in), `@` (at/context), `~` (approx), `!=` (is not)

Entity shortcodes: `$hub`, `$ac`, `$sb`, etc. — defined in REGISTRY.md.

When saving, always use Recall notation. Drop articles, filler, hedging. Preserve technical identifiers, paths, SQL, numbers.

## Memory Header Format

```
---
T:<type> | <name>
D:<one-line description>
C:<created date>
U:<updated date>
A:<access count>
L:<comma-separated linked memories>
---
```

Types: `fb` (feedback), `proj` (project), `ref` (reference), `usr` (user)
