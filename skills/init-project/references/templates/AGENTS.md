# AGENTS.md

Working instructions for coding agents in this repository. Tool-independent: written for any agent harness (Claude Code, Codex, others). Read this file before any task; read the primary spec before any task that touches a contract, credential, or data boundary it defines.

## What this project is

{{ONE_PARAGRAPH_PITCH}} — what it is, who it is for, and what it is not.

**Status ({{DATE}}):** {{CURRENT_STATE}} — what exists and is verified, what is next, and where the evidence lives.

## Source of truth, in order

1. `{{PRIMARY_SPEC_PATH}}` — authoritative for product scope, contracts, semantics, limits, and acceptance criteria.
2. This file — repository mechanics and working conventions.
3. `docs/decisions/*.md` — short numbered decision records for anything that departs from or refines the spec.
4. Everything else.

Per-milestone plans and brainstorm notes are working documents (gitignored). Anything that must outlive a plan goes into the spec, a decision record, or this file.

If code must diverge from the spec, record why in `docs/decisions/` and update the spec in the same change. Do not let the spec silently rot.

## How the project is planned

Two modes; the interview picks one and the other mode's block is deleted.

### Shared docs (both modes)

- `docs/NORTH-STAR.md`: the end goal and the principles that do not change.
- `docs/ROADMAP.md`: numbered phases. Past and current phases are committed. Every future phase is direction and may be rewritten by the pull request that learns something.
- `docs/ARCHITECTURE.md`: what exists and runs today, plus the dated decisions in force. It follows the code: the pull request that changes the architecture updates it. Nothing planned goes in it.
- `docs/DEVELOPMENT.md`: how to run and check things locally, plus a dated log of gotchas and lessons learned. Add an entry whenever something surprises you or costs time.

Rules for both modes:

- **No document references a historical document** or says what it was derived from. Git history is the provenance. Folded-in files are deleted, not archived.
- **Future phases are not promises.** Reorder, rescope, or drop them in the pull request that learns why.

### Mode A — OpenSpec (default)

- `openspec/specs/`: what the product does today, per capability, as requirements with WHEN/THEN scenarios. A spec describes current truth plus the active phase's delta, never a future phase. Every scenario ends with an `*Evidence:*` line naming the test that proves it, or `none yet` when nothing proves it yet.
- `openspec/changes/<name>/`: the active phase's work. The spec delta is **what** it builds; `design.md` and `tasks.md` are **how**; the `tasks.md` checkboxes are its status. Archiving merges the delta into the specs.

Rules that follow from this:

- **The active change's spec is the implementer's contract.** Do not drift from it silently, and do not refuse work because of it: when the code or a discovery contradicts it, propose a spec change (edit the delta, then the design and tasks) and say so in the pull request under judgment calls.
- **A spec change updates the plan.** If the delta changes, `design.md` and `tasks.md` change in the same commit. When a revision touches behaviour that is already implemented, uncheck the affected tasks and add the task that re-proves the new behaviour; a checked box is a claim that the current spec is met.
- **Archiving records completion, it does not establish it.** Archive a change only when every task is checked, the local gate and CI are green, and the delta is synced into the specs. Delete an abandoned change instead of archiving it.

### Mode B — Planning-lite (small projects)

- `docs/DESIGN.md`: the single design doc — authoritative for scope, contracts, semantics, limits, and acceptance criteria. Keep it current; it rots the moment it disagrees with the code.

Delete the mode that does not apply, including its rules above.

## Commands

{{COMMANDS_BLOCK}} — list every command with a one-line comment. Example shape:

```bash
{{DEV_COMMAND}}          # run locally with reload
{{BUILD_COMMAND}}        # type-check / build without deploying
{{LINT_COMMAND}}         # lint + format check
{{TEST_COMMAND}}         # full suite: no network, no credentials
{{TEST_SINGLE}}          # single test file / single test
{{DEPLOY_COMMAND}}       # only ever run when explicitly authorized
```

**Local gate before every push.** Two layers, kept distinct:

- **Scaffold checks** (created by init-project as `.github/workflows/scaffold.yml`, runnable now): placeholder scan, planning-mode validation. These are the only checks CI runs until the implementation gate exists.
- **Implementation checks** (proposed, not yet created): the application's own lint/type/test gate. Add each check here and to CI in the same change that introduces it. Until then, this section names the gate; it does not claim it exists.

## Architecture

{{ARCHITECTURE_SUMMARY}} — one paragraph plus the module/directory map. Deep implementation detail lives in `docs/ARCHITECTURE.md`, not here.

```
{{DIRECTORY_TREE}}
```

**Invariants that hold for all future code:**

- {{INVARIANT_1}}
- {{INVARIANT_2}}
- {{INVARIANT_3}}

State the things that must always be true, separately from describing what exists. Keep this list short; every entry must be load-bearing.

## Hard rules

{{HARD_RULES}} — the non-negotiables. These are release gates; do not trade them away for convenience. Keep this section small: if everything is a hard rule, nothing is.

<!-- EXAMPLE (delete and write the project's own):
- Fail closed on missing credentials: no unauthenticated fallback, no silent defaults.
- Nothing may silently enable a paid or live call. Limits and feature switches default to off.
- Never commit real secrets, real user data, or resolved local config.
-->

## Do NOT

- {{PROHIBITION_1}}
- {{PROHIBITION_2}}
- Build extensions before the core is usable end to end.
- {{SCOPE_GUARDRAILS}}

Explicit prohibitions beat vague guidance. Name the tempting shortcuts by name.

## Secrets and credentials

- Fail closed before any operation that needs credentials: absent or placeholder credentials block that operation. They do not block unrelated development work.
- Real credentials live in the deployment environment / secret store, never in the repo. Local dev credentials live in gitignored files (see `.gitignore`); never commit them.
- Never log secret values or their hashes. Never echo them into errors, fixtures, or docs.

## Testing rules

Keep the suite small. Every test costs time to write and run at every step, so a test has to catch a real bug that the end-to-end tests would miss. Don't add tests just to cover each step.

- **Write the test first and show that it fails without the change** (stash the implementation, run, pop).
- **Prefer end-to-end tests.** A spec scenario in WHEN/THEN form is a natural E2E test: prefer writing it as one. (WHEN/THEN does not mandate E2E — a scenario is proven however its evidence line says.) At the end of an E2E test, produce a verifiable, repeatable artifact.
- **If you must test a unit in isolation**, first write down the ways it can fail, then write the code.
- {{TESTING_STACK_NOTES}} — e.g. deterministic vs live E2E policy, where secrets must never appear (CI has no secrets).

## Working conventions

- **Vertical slices.** A task is one capability end to end. Do not build all of layer A, then all of layer B.
- **Schema and fixture first.** Define contracts and test fixtures before writing implementation.
- **Tests as the definition of done.** A slice is complete when the gate is green, not when the code looks right.
- **Documented vs verified.** A doc entry proves nothing about live behaviour. Record every verification with date and method.
- **Decisions** that refine or depart from the spec get a short numbered file in `docs/decisions/`.
- **Reference vs implementation.** Design snapshots, UI kits, and prototype exports are reference material, not code to import. Where a reference conflicts with approved content or the spec, the approved content wins — say so explicitly rather than silently following the reference.
- **Style.** {{STYLE_RULES}} — e.g. absolute dates (`2026-10-04`), never "today"; comments explain why, not what.
- **Commits.** {{COMMIT_CONVENTION}} — e.g. conventional prefixes, one logical change per commit, inspect the diff, never stage stray files.
- **Publishing mindset.** The repo may be private now and published later. Anything committed must already be fit for a public repository.
- **No archaeology, but keep the evidence.** When something is replaced, delete the obsolete duplicate — git history is the archive. But preserve investigation records and vendor references that explain *why* (e.g. `docs/investigation/`): a maintained technical record is not clutter. Distinguish "superseded copy" (delete) from "evidence for a decision" (keep, and link it from the decision record).

## Per-task workflow

1. Restate the slice in one sentence and name the directories it touches.
2. Check the spec section(s) it depends on; note any gap or ambiguity before coding.
3. Write or update contracts and fixtures, then tests, then implementation.
4. Run the full local gate.
5. Summarise what changed, what was verified (and how), and what is left open.

<!-- OPTIONAL: include when the project needs a release-gate tracker. -->
<!-- ACCEPTANCE MATRIX:
`docs/acceptance-matrix.md` is the committed release-gate tracker: each row is a release criterion from the spec, with columns for state, evidence, and unresolved gaps. Update it with every slice. A criterion is met only when its evidence column says how.
-->
<!-- /OPTIONAL -->

<!-- OPTIONAL: include when the project has vendored agent skills. -->
<!-- SKILLS:
Vendored skills live in `.claude/skills/` (canonical) and are mirrored to `.agents/skills/` for other harnesses. Each is pinned to an upstream commit in `skills.lock.json` with its license and the local patches.

Changing a vendored skill: edit it under `.claude/skills/`, record the change in its `patches` list, re-lock, and sync the mirror. Updating to a new upstream commit: set `ref`, fetch, re-apply the patches, review the diff for new scripts, `allowed-tools`, `!` command injection, network fetches, install instructions and self-promotion, then lock and sync. Never track an upstream branch.
-->
<!-- /OPTIONAL -->

<!-- OPTIONAL: include when the project is user-facing (app, site, docs for users). -->
<!-- CONTENT RULES:
- {{LANGUAGE}} (e.g. British English), {{DATE_FORMAT}} (e.g. ISO 8601 `YYYY-MM-DD`).
- Never invent statistics, user counts, dates, or captions.
- {{COPY_RULES}} — e.g. sentence case, no emoji, placeholder convention for unwritten copy, and a verify step that refuses to ship placeholders.
-->
<!-- /OPTIONAL -->

## Git and CI

Status: {{GIT_CI_STATUS}} — e.g. "Configured: PR checks on push. Planned: branch protection, signed commits." A scaffold describes its actual initial state; anything not yet configured is listed as planned, not implied.

- `main` is protected (recommended): pull requests, required checks, signed commits. Branch from `main`; keep one logical change per commit; don't force-push or merge — the owner merges.
- Workflows use only GitHub-owned actions pinned to full commit SHAs. Never add `pull_request_target` or third-party actions. Tools install by hash or lockfile integrity.
- Pull request descriptions list: what the PR does, the evidence, judgment calls (every place the spec was interpreted or a default taken), and known gaps. Reply to each review thread with the fixing commit and resolve it.
- **Keep PRs small** enough to pass review in one round.
- Bump versions in the same PR that ships the change (see VERSIONS.md if the project versions its skills).

## Local development integrations

Harness-specific local config is project-local and gitignored: `.agents/`, `.claude/`, `.codex/`, `.mcp.json`, `.env*`. Do not commit resolved local configuration. These development connections are separate from whatever the project itself builds.
