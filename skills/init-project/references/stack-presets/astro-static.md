# Stack preset: Astro static site

## Stack

- Astro (static output), TypeScript
- Content collections for structured content (projects, posts, docs) — schemas in `src/content.config.ts`
- Cloudflare Workers + Static Assets for hosting, or any static host
- Design tokens via CSS variables; never raw values in components

## Suggested commands

```bash
npm run dev            # Astro dev server
npm run build          # astro build -> dist/
npm run check          # astro check (TypeScript)
npm test               # smoke tests (routing, links)
npm run check:links    # every local link, asset, and #fragment must resolve
npm run verify:deploy  # build + refuse unwritten copy / broken links
npm run deploy         # verify:deploy + deploy (explicitly authorized)
```

## Layout hints

```
src/pages/      # routes
src/components/ # design-system ports vs site-specific, kept separate
src/content/    # collections (markdown/yaml), never hardcoded page data
src/styles/     # verbatim vendor CSS stays untouched; site CSS separate
public/         # static assets
```

## .gitignore keys

Common, Secrets, Node/TypeScript.

## Notes

- Content rules live in `AGENTS.md` (language, date format, no invented statistics).
- Unwritten copy gets a placeholder marker; `verify:deploy` refuses to ship it.
- When something is replaced, delete the old file — git history is the archive.
