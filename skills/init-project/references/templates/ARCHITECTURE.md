# Architecture: {{PROJECT_NAME}}

What exists and runs today, plus the dated decisions in force. **This document follows the code**: the pull request that changes the architecture updates it. Nothing planned goes in it — plans live in `openspec/changes/` (OpenSpec mode) or `docs/DESIGN.md` (planning-lite mode); delete the inapplicable reference. The chosen stack is recorded in the active change's `design.md` until it is built; this file records what is actually running.

## Overview

{{ARCHITECTURE_OVERVIEW}} — the system's shape in a paragraph: processes, stores, boundaries, and how they talk to each other.

## Modules / layout

{{MODULE_MAP}} — directory or component map with one-line responsibilities. Keep it aligned with the repo.

## Decisions in force

Dated, load-bearing decisions. Newest first. Each: date, what was decided, why (one or two lines).

- **{{DATE}}** — {{DECISION}}: {{WHY}}

Superseded decisions are removed, not struck through — git history is the archive. Investigation records that explain a decision live in `docs/investigation/` and are linked from the decision, not deleted as clutter.

## Invariants

The cross-cutting rules the code relies on (mirrors the invariants in `AGENTS.md`; keep the two in sync):

- {{INVARIANT_1}}
- {{INVARIANT_2}}
