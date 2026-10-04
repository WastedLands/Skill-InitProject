# Skill-InitProject versions

Current versions of all skills. Agents can compare against local versions to check for updates.

| Skill | Version | Last updated |
|---|---|---|
| init-project | 0.3.0 | 2026-10-04 |

## Changelog

### 0.3.0 — 2026-10-04

Second review round: one canonical placeholder scan used verbatim locally and in CI (exits 0 when clean); source-of-truth section rewritten as a consistent four-level authority (North Star bounds scope, consolidated spec is the baseline, active delta governs the work, AGENTS.md governs conventions); pinned OpenSpec wrapper instruction in the master template (`{{OPENSPEC_VERSION}}` placeholder); dated verification record section in the DEVELOPMENT template; scaffold phase marked done after validation passes.

### 0.2.0 — 2026-10-04

Review-driven hardening after full private interview tests on Claude Code CLI and Codex CLI: methodology preservation requirements in Phase 5 (mandatory vs project-specific vs optional content, coverage review against the master template); Common/Secrets/harness-state gitignore sections mandatory with pre-commit verification; `openspec doctor --json` stderr gate in scaffold workflow and Phase 5 validation (catches malformed config rules that `validate` silently ignores); robust placeholder scan (propagates grep errors, no exclusion pipeline); `CLAUDE.md` bridge as a standard inventory item; `.dev.vars*` moved to the Cloudflare/Wrangler section; READMEs document the tested `$wastedlands:init-project` invocation and private-repo git auth.

### 0.1.0 — 2026-10-04

Initial draft. Interview-driven project scaffolder: recon, discussion framing, interview, draft reconciliation, stack proposal, approved output inventory, scaffold generation (OpenSpec default, planning-lite alternative), gated git/GitHub setup. Ships the AGENTS.md master template (synthesized from five prior project files), doc templates, gitignore pattern library, and three stack presets. Not yet published.
