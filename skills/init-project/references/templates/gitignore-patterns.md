# .gitignore pattern library

Pick the sections that fit the stack. The **Common** and **Secrets** sections apply to every project.

## Common (always)

```
.DS_Store
Thumbs.db
*.swp
*.swo
*~
.idea/
.vscode/
```

## Secrets and local config (always)

Precise patterns only. Broad globs like `*secret*` or `*credentials*` hide legitimate files (e.g. `tests/test_secrets.py`, `config/credentials.example.toml`) — don't use them.

```
.env
.env.*
!.env.example
.dev.vars
.dev.vars.*
*.pem
*.key
```

## Agent harness local state (always)

Keep vendored skills, ignore the rest. Use the `/*` form (not a trailing slash): excluding the bare directory (`.claude/`) stops git from ever descending into it, so the negations below would silently fail. The negations re-include the canonical skill dirs and their mirrors; everything else harness-local stays out.

```
.claude/*
!.claude/skills/
!.claude/skills/**
.codex/
.mcp.json
.agents/*
!.agents/skills/
!.agents/skills/**
```

OpenSpec-managed tool dirs (installed by `openspec init --tools`) are generated files — commit them intentionally; they are versioned with the CLI that generated them.

If the project intentionally commits a repo-scoped marketplace or other harness config, un-ignore that path explicitly with a comment saying why.

## Node / TypeScript

```
node_modules/
dist/
build/
.next/
.turbo/
*.tsbuildinfo
```

## Python

```
__pycache__/
*.py[cod]
.venv/
venv/
.pytest_cache/
*.egg-info/
```

## Cloudflare / Wrangler

```
.wrangler/
```

## OpenSpec working notes (keep specs, ignore scratch)

```
openspec/changes/*/notes/
```

Project-specific additions go at the bottom with a one-line comment saying why.
