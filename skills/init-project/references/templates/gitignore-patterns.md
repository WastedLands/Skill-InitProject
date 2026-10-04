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

```
.env
.env.*
!.env.example
*.pem
*.key
*secret*
*credentials*
.dev.vars
.dev.vars.*
```

Local harness integrations (project-local, never committed):

```
.agents/
.claude/
.codex/
.mcp.json
```

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
