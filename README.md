# Skill-InitProject

Interview-driven scaffolding for new software projects, as an agent skill. It conducts a structured discussion with the project owner — recon, interview, draft reconciliation, stack proposal — and generates a coherent repository skeleton: `AGENTS.md`, planning docs, an OpenSpec skeleton, `.gitignore`, and (after explicit confirmation) git/GitHub setup.

The skill ships its templates under `skills/init-project/references/`:

- `templates/AGENTS.md` — the master working-instructions template (placeholders + conditional blocks)
- `templates/` — `NORTH-STAR.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, gitignore pattern library
- `stack-presets/` — known-good starting points (TypeScript/Cloudflare Workers, Python stdlib, Astro static)

## Layout

```
skills/init-project/
  SKILL.md                 # the skill (spec-pure frontmatter; works in any harness)
  agents/openai.yaml       # Codex sidecar (explicit invocation only)
  references/              # templates + stack presets (loaded on demand)
.claude-plugin/plugin.json # Claude Code plugin wrapper (name: wastedlands)
plugin.json                # portable plugin manifest (OpenAI universal directory)
```

## Install

**Claude Code** (via the [WastedLands marketplace](https://github.com/WastedLands/Skills)):

```bash
claude plugin marketplace add WastedLands/Skills
claude plugin install wastedlands@wastedlands
```

Then run `/wastedlands:init-project`.

**Codex**: copy or symlink `skills/init-project` into `~/.agents/skills/` (or a repo's `.agents/skills/`), then run `$init-project`. (Codex reads the open Agent Skills format natively; no extra packaging needed.)

**skills.sh**: listing is seeded after testing — not yet.

## Validation

```bash
node scripts/validate-skill.mjs              # spec + repo conventions (hard gate)
node scripts/validate-skill.mjs --strict     # warnings become errors
npx -y skills-ref validate skills/init-project  # advisory only
claude plugin validate --strict .            # Claude packaging (local)
```

`skills-ref` flags `disable-model-invocation` as an unexpected frontmatter field. That field is Claude-Code-documented and intentional — it mirrors Codex's `allow_implicit_invocation: false` so this heavyweight interview skill never auto-fires. Every other frontmatter field stays within the six-field Agent Skills spec. Our validator is the hard gate; `skills-ref` stays advisory.

CI runs the hard gate. Before publishing, also do the manual round-trips: install from a local-path marketplace in Claude Code, and the marketplace-add round-trip in a throwaway Codex home.

## Status

Draft (0.1.0). Not yet published to any directory. A companion `sync-project` skill (backport template improvements into existing projects) is planned for the same plugin.
