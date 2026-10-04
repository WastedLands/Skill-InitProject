---
name: init-project
description: Scaffold a new software project through a structured interview. Use when starting a new repository or project: it inspects the directory, interviews the owner, reconciles existing draft docs, proposes a tech stack, and generates AGENTS.md, project docs, an OpenSpec skeleton, and git/GitHub setup. Does not write code.
license: MIT
compatibility: Requires git and node/npx. The gh CLI is required for GitHub repo creation. OpenSpec is bootstrapped via npx.
metadata:
  author: WastedLands
  version: 0.1.0
---

# init-project

An interview-driven scaffolder for new software projects. It does not write product code. It conducts a structured discussion with the project owner and produces a coherent, convention-following repository skeleton: `AGENTS.md`, planning docs, an OpenSpec skeleton, `.gitignore`, and (after explicit confirmation) git/GitHub setup.

## Principles

- **Pre-existing docs are drafts, not decisions.** If the directory already contains `README.md`, `docs/ROADMAP.md`, `docs/NORTH-STAR.md`, or similar, treat them as raw material. Extract their claims, check each against the interview answers, and propose keep / revise / drop. Never let a shiny new scaffold quietly contradict an existing doc.
- **Interview before scaffolding.** Do not generate files until the discussion has produced: project name, one-paragraph pitch, vision and non-goals, tech stack (proposed by you, approved by the owner), and the planning flavor.
- **Propose, don't presume.** The tech stack, the hard rules, and the planning flavor are your proposals to make and the owner's to approve. Bring evidence (stack signals found during recon, trade-offs) with every proposal.
- **Explicit confirmation before irreversible writes.** Creating a GitHub repo, pushing, and `git init` in a non-empty directory all require the owner's explicit confirmation, stated in the conversation. A general "set it up" is not confirmation for pushing to a remote.
- **Fail closed on secrets.** Never write real credentials, tokens, or keys into scaffolded files. Config templates ship with placeholders and `.gitignore` covers the real files.
- **OpenSpec is the default planning system**, overridable when the project is small enough that a single design doc is more honest. Say which you chose and why.

## When to use / when not to use

Use for: a new repository, a new project in an existing empty directory, or re-scaffolding the conventions of a young project that has no `AGENTS.md` yet.

Do not use for: adding a feature to an existing scaffolded project (follow that repo's `AGENTS.md` instead), or migrating an established project's conventions (that's a future `sync-project` concern).

## Workflow

### Phase 0 — Recon

Before any discussion, inspect the working directory:

1. Is it already a git repo? (`git rev-parse --is-inside-work-tree`) Which remote, if any?
2. List top-level files. Read `README.md`, `docs/*`, `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `wrangler.jsonc`/`wrangler.toml`, `.nvmrc`, `*.csproj`, `requirements*.txt` — whatever exists. These are **stack signals and draft docs**.
3. Note the signals: language, runtime, hosting target, existing docs, existing CI.

Do not act on anything yet. Recon output becomes the opening of Phase 1.

### Phase 1 — Frame the discussion

Propose the discussion structure to the owner before interviewing:

1. What you found in recon (one short summary: repo state, stack signals, existing drafts).
2. The interview plan: project identity → pitch → vision/direction/non-goals → hard rules → tech stack proposal → planning flavor → file generation → git/GitHub.
3. Ask for buy-in or adjustments. Then proceed.

### Phase 2 — Interview

Cover, in this order, in the owner's own words. Ask one topic at a time; keep it conversational, not a form.

1. **Project name** and **repository location**: new or existing directory? Local-only, new GitHub repo (personal account or WastedLands org?), or an existing remote?
2. **Base details**: license (default MIT), public vs private (default private until ready).
3. **The pitch**: one paragraph — what it is, who it's for, what it is not.
4. **Vision / direction / idea**: where it's headed; explicit **non-goals** (what it will never do).
5. **Hard rules**: the 3–5 non-negotiables (auth, money, data, scope). If the owner has none, propose candidates from the pitch and let them strike or keep.
6. **Project shape**: user-facing (needs content/copy rules?) or internal? Will it need project-specific skills? (Optional — default no.)
7. Anything else that comes up.

Record answers verbatim enough that Phase 3 can check drafts against them.

### Phase 3 — Draft reconciliation

For each pre-existing draft doc:

1. Extract its factual claims and commitments as a short list.
2. Check each against the interview answers: **keep**, **revise** (state the new wording), or **drop** (state why).
3. Present the reconciliation as a proposal. Proceed only after the owner approves.

### Phase 4 — Stack proposal

Propose a tech stack grounded in the recon signals and the interview. Consult `references/stack-presets/` for known-good starting points; adapt, don't copy blindly. Present:

- The proposed stack (language, runtime, key deps, hosting, CI) with one-line reasons per choice.
- What you deliberately did *not* choose and why (one line each).
- The local gate commands this implies (they go into `AGENTS.md` and CI).

Proceed after the owner approves. If they counter-propose, adopt theirs and adjust the gate.

### Phase 5 — Scaffold

Generate the files. Fill every `{{PLACEHOLDER}}` in the templates; delete `<!-- OPTIONAL -->` blocks that don't apply rather than leaving them. Never leave a placeholder unfilled.

1. `AGENTS.md` — from `references/templates/AGENTS.md`.
2. `docs/NORTH-STAR.md`, `docs/ROADMAP.md` — from templates, reconciled with interview + drafts.
3. `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md` — skeleton with the "follows the code" rule and a seeded gotchas log.
4. `openspec/` — run `OPENSPEC_TELEMETRY=0 npx openspec init`; then reconcile the generated `openspec/project.md` with `docs/NORTH-STAR.md` so they don't duplicate each other (NORTH-STAR.md is the human doc; `project.md` references it).
5. `.gitignore` — from `references/templates/gitignore-patterns.md`, stack-appropriate subset plus project-specific patterns.
6. `README.md` — one-paragraph pitch, status, pointer to `AGENTS.md` and `docs/`. Keep it short; it is not the spec.
7. If the owner asked for project-specific skills: scaffold `references/` entries per the vendoring convention (canonical dir + harness mirrors + lockfile entry), following the skill's own supply-chain rules.

After writing, run any local validation the stack implies (e.g. `npx -y skills-ref validate` is for skills; here: at minimum confirm no `{{PLACEHOLDER}}` remains unfilled — `grep -r "{{" --include="*.md" .` must be empty).

### Phase 6 — Git & GitHub (gated)

Only after the owner's explicit confirmation, in this order:

1. `git init -b main` if not already a repo.
2. First commit (conventional: `chore: initial project scaffold via init-project`).
3. If a GitHub repo was agreed: `gh repo create <owner>/<name> --private --source . --push` (org vs personal per the interview; private by default).
4. Report the remote URL and stop. Do not configure branch protection, secrets, or environments unprompted — propose them as follow-ups.

## Definition of done

The skill is finished when: the discussion is complete, all details are finalized and approved, every scaffolded file exists with no unfilled placeholders, the OpenSpec skeleton validates (`npx openspec validate --all --strict`, with `OPENSPEC_TELEMETRY=0`), and — if agreed — the git repo is initialized, committed, and pushed after the owner's explicit confirmation.

## Template conventions

Templates live in `references/templates/`. `{{PLACEHOLDER}}` = fill in. `<!-- OPTIONAL: <condition> --> ... <!-- /OPTIONAL -->` = include only when the condition holds, otherwise delete the block. `<!-- EXAMPLE: ... -->` = illustrative content the owner should replace or delete.
