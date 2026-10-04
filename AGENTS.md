# AGENTS.md

Working instructions for coding agents in this repository.

## What this project is

**Skill-InitProject**: the `init-project` agent skill — an interview-driven scaffolder for new software projects. Ships as a Claude Code plugin (`wastedlands`), a Codex skill (`$init-project`), and via the WastedLands marketplace repo. The skill generates `AGENTS.md` for *other* projects; this repo's own conventions live here.

**Status (2026-10-04):** draft 0.1.0, private. Not yet published to any directory.

## Source of truth, in order

1. `skills/init-project/SKILL.md` — the skill's behavior contract.
2. `skills/init-project/references/templates/AGENTS.md` — the master template the skill generates from.
3. This file — repo mechanics and working conventions.
4. `VERSIONS.md` — skill versions and changelog.

## Commands

```bash
node scripts/validate-skill.mjs            # spec + repo conventions (hard gate)
node scripts/validate-skill.mjs --strict   # warnings become errors
npx -y skills-ref validate skills/init-project  # advisory: flags disable-model-invocation (intentional, see below)
```

## Conventions

- SKILL.md frontmatter keeps the six Agent Skills spec fields plus `disable-model-invocation: true` (Claude-Code-documented; symmetric with Codex's `allow_implicit_invocation: false` in `agents/openai.yaml`). This is an intentional, documented deviation — `skills-ref` flags it, our validator allows it.
- `metadata.version` bumps on any shipped skill change; `VERSIONS.md` gets a row update and changelog entry in the same PR. Versioning: x = restructure/breaking, y = new skill, z = skill update.
- Every file under `skills/init-project/references/` must be referenced from SKILL.md or another reference file (no orphans) — enforced by the validator.
- Keep SKILL.md under 500 lines; details live in `references/`.
- Bump versions in the same PR that ships the change, not as a follow-up.
