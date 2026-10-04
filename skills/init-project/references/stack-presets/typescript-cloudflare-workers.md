# Stack preset: TypeScript on Cloudflare Workers

## Stack

- TypeScript, strict mode; `npm` with a committed lockfile
- Cloudflare Workers runtime; Wrangler for deploys (deploy only when explicitly authorized)
- Zod (or equivalent) for runtime validation of inputs, outputs, and config
- Vitest for tests; Biome for lint + format
- Pin exact versions at scaffold time and record them in `AGENTS.md`

## Suggested commands

```bash
npm run dev        # local dev with reload
npm run build      # type-check + bundle, no deploy
npm run typecheck  # tsc --noEmit
npm run lint       # lint + format check
npm test           # full suite: no network, no credentials
npm test -- <path> # single test file
npm run deploy     # explicitly authorized deploys only
```

## Layout hints

```
src/        # one directory per layer; dependencies point one way
tests/      # fixtures live in tests/fixtures/, one folder per external API
docs/       # design doc, decisions, operator docs
openspec/   # specs + changes
```

## .gitignore keys

Common, Secrets, Node/TypeScript, Cloudflare/Wrangler, OpenSpec working notes.

## Notes

- CI must pass with no credentials configured; tests use synthetic bindings only.
- Compatibility date pinned in `wrangler.jsonc`; record it in `AGENTS.md`.
