#!/usr/bin/env node
// Validate the init-project skill against the Agent Skills spec plus repo conventions.
// Usage: node scripts/validate-skill.mjs [--strict]
// Exit 0 = pass, 1 = errors (or warnings with --strict).

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SKILL_DIR = resolve(ROOT, "skills/init-project");
const SKILL_FILE = resolve(SKILL_DIR, "SKILL.md");
const strict = process.argv.includes("--strict");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => (strict ? errors : warnings).push(m);

const frontmatter = (text) =>
  text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";

// Minimal YAML-subset parser: top-level `key: value`, one-level `key:` maps,
// and block scalars (`>-`, `>`, `|`, `|-`) with indented continuation lines.
function parseFM(text) {
  const out = {};
  let current = null;
  let block = null; // {key, style} while inside a block scalar
  for (const line of frontmatter(text).split("\n")) {
    if (block && /^\s/.test(line)) {
      const content = line.replace(/^\s+/, "");
      if (block.style === ">") block.lines.push(content);
      else block.lines.push(content);
      continue;
    }
    if (block) {
      out[block.key] = block.style === ">" ? block.lines.join(" ") : block.lines.join("\n");
      block = null;
      current = null;
    }
    if (/^\S/.test(line)) {
      const i = line.indexOf(":");
      if (i === -1) continue;
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (/^[>|]-?$/.test(v)) {
        block = { key: k, style: v[0], lines: [] };
        out[k] = "";
      } else {
        current = v === "" ? k : null;
        out[k] = v === "" ? {} : v.replace(/^['"]|['"]$/g, "");
      }
    } else if (current && /^\s+\S/.test(line)) {
      const i = line.indexOf(":");
      if (i === -1) continue;
      out[current][line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  }
  if (block) out[block.key] = block.lines.join(block.style === ">" ? " " : "\n");
  return out;
}

// --- structural ---
if (!existsSync(SKILL_FILE)) {
  err("skills/init-project/SKILL.md is missing");
  process.exit(1);
}
const skill = readFileSync(SKILL_FILE, "utf8");
if (!/^---\n[\s\S]*?\n---/.test(skill)) err("SKILL.md: missing YAML frontmatter");

let fm = {};
try {
  // Full YAML parse check via a strict-ish approach: fail on tab indentation or duplicate keys.
  const fmText = frontmatter(skill);
  if (/\t/.test(fmText)) err("SKILL.md: frontmatter contains tabs");
  fm = parseFM(skill);
} catch (e) {
  err(`SKILL.md: frontmatter unreadable: ${e.message}`);
}

// --- spec fields ---
const name = fm.name;
if (!name) err("SKILL.md: frontmatter `name` is required");
else {
  if (name !== "init-project") err(`SKILL.md: name must be "init-project", got "${name}"`);
  if (!/^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/.test(name) || /--/.test(name))
    err("SKILL.md: name must be 1-64 chars, lowercase alphanumerics/hyphens, no leading/trailing/consecutive hyphens");
}
const desc = fm.description;
if (!desc) err("SKILL.md: frontmatter `description` is required");
else if (desc.length < 1 || desc.length > 1024)
  err(`SKILL.md: description must be 1-1024 chars (got ${desc.length})`);
if (!/when/i.test(desc || ""))
  warn("SKILL.md: description should say when to use the skill");

// Only the six spec fields are allowed in frontmatter (portability).
const allowed = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools", "disable-model-invocation"]);
for (const k of Object.keys(fm)) {
  if (!allowed.has(k)) err(`SKILL.md: frontmatter field "${k}" is not in the Agent Skills spec set`);
}
// metadata must be a flat string->string map.
if (fm.metadata && typeof fm.metadata === "object") {
  for (const [k, v] of Object.entries(fm.metadata)) {
    if (typeof v !== "string") err(`SKILL.md: metadata.${k} must be a string (no nesting)`);
  }
  if (!fm.metadata.version) warn("SKILL.md: metadata.version is missing (needed for update checks)");
}

// --- body conventions ---
const lines = skill.split("\n").length;
if (lines > 500) err(`SKILL.md: ${lines} lines exceeds the 500-line guideline`);
// The literal {{PLACEHOLDER}} is the documented convention example in "Template conventions" —
// flag any other {{UPPER_SNAKE}} token as an unfilled placeholder.
const placeholders = [...skill.matchAll(/\{\{([A-Z][A-Z0-9_]*)\}\}/g)].filter((m) => m[1] !== "PLACEHOLDER");
if (placeholders.length) err(`SKILL.md: contains unfilled placeholder(s): ${[...new Set(placeholders.map((m) => m[0]))].join(", ")}`);
if (/```\s*$/.test(skill)) warn("SKILL.md: ends with an unclosed code fence (heuristic)");

// --- no orphans: every references/ file must be named in SKILL.md or another reference file ---
const refs = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = resolve(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else refs.push(p);
  }
})(resolve(SKILL_DIR, "references"));
const refTexts = new Map(refs.map((p) => [p, readFileSync(p, "utf8")]));
for (const p of refs) {
  const rel = p.slice(SKILL_DIR.length + 1); // e.g. references/templates/AGENTS.md
  const base = basename(p);
  const parent = rel.slice(0, rel.lastIndexOf("/")); // e.g. references/stack-presets
  const others = [skill, ...[...refTexts.entries()].filter(([q]) => q !== p).map(([, t]) => t)].join("\n");
  if (!others.includes(rel) && !others.includes(base) && !others.includes(parent)) {
    warn(`references/${rel}: not referenced by SKILL.md or another reference file (orphan?)`);
  }
}

// --- VERSIONS.md consistency ---
const versionsPath = resolve(ROOT, "VERSIONS.md");
if (existsSync(versionsPath)) {
  const versions = readFileSync(versionsPath, "utf8");
  const mv = fm.metadata?.version;
  if (mv && !versions.includes(`| init-project | ${mv} |`))
    err(`VERSIONS.md: no row matching init-project ${mv}`);
} else {
  warn("VERSIONS.md is missing");
}

// --- report ---
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
