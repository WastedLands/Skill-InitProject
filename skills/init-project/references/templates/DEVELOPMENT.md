# Development: {{PROJECT_NAME}}

How to run, test, and check things locally. If a command here disagrees with `AGENTS.md`, `AGENTS.md` wins and this file gets fixed.

## Prerequisites

{{PREREQUISITES}} — runtimes, tools, and versions (pin exact versions where it matters).

## First run

```bash
{{SETUP_COMMANDS}}
```

## Local gate

Scaffold checks (runnable now):

```bash
{{SCAFFOLD_GATE_COMMANDS}}
```

Implementation checks (proposed — add the real commands with the first implementation slice, and mirror them in CI):

```bash
{{GATE_COMMANDS}}
```

Run the runnable checks before every push. Do not claim CI runs checks that don't exist yet.

## Gotchas and lessons learned

Dated log. Add an entry whenever something surprises you or costs time — future agents (and future you) will thank you.

- **{{DATE}}** — {{GOTCHA}}: {{WHAT_YOU_LEARNED}}
