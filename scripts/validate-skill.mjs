#!/usr/bin/env node
// Validate the init-project skill: Agent Skills spec conformance (via a real
// YAML parser) plus repo conventions. Usage: node scripts/validate-skill.mjs [--strict]
// Exit 0 = pass, 1 = errors (or warnings with --strict).
//
// Run `npm ci` first (js-yaml is a devDependency).

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SKILL_DIR = resolve(ROOT, "skills/init-project");
const SKILL_FILE = resolve(SKILL_DIR, "SKILL.md");
const strict = process.argv.includes("--strict");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => (strict ? errors : warnings).push(m);

const fmText = (text) => text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/)?.[1];

if (!existsSync(SKILL_FILE)) {
  err("skills/init-project/SKILL.md is missing");
  console.log(errors.map((e) => `error: ${e}`).join("\n"));
  process.exit(1);
}
const skill = readFileSync(SKILL_FILE, "utf8");
const raw = fmText(skill);
if (raw === undefined) err("SKILL.md: missing YAML frontmatter (--- markers)");

// Duplicate top-level keys: js-yaml silently takes the last, so check first.
if (raw !== undefined) {
  const seen = new Set();
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):/);
    if (m) {
      if (seen.has(m[1])) err(`SKILL.md: duplicate frontmatter key "${m[1]}"`);
      seen.add(m[1]);
    }
  }
}

// Real YAML parse — catches malformed scalars (e.g. unquoted "project: it").
let fm = {};
if (raw !== undefined) {
  try {
    fm = yaml.load(raw) ?? {};
  } catch (e) {
    err(`SKILL.md: frontmatter is not valid YAML: ${e.message.split("\n")[0]}`);
  }
}
if (fm === null || typeof fm !== "object" || Array.isArray(fm)) {
  err("SKILL.md: frontmatter must be a mapping");
  fm = {};
}

// --- spec fields ---
const SPEC_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
  // Intentional, documented extension (Claude-Code-documented; symmetric with
  // Codex's allow_implicit_invocation: false). skills-ref flags it; allowed here.
  "disable-model-invocation",
]);
for (const k of Object.keys(fm)) {
  if (!SPEC_FIELDS.has(k)) err(`SKILL.md: unexpected frontmatter field "${k}"`);
}

const name = fm.name;
if (typeof name !== "string" || !name) err("SKILL.md: frontmatter `name` is required");
else {
  if (name !== "init-project") err(`SKILL.md: name must be "init-project", got "${name}"`);
  if (!/^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/.test(name) || name.includes("--"))
    err("SKILL.md: name must be 1-64 chars, lowercase alphanumerics/hyphens, no leading/trailing/consecutive hyphens");
  if (basename(SKILL_DIR) !== name) err(`SKILL.md: name "${name}" must match directory "${basename(SKILL_DIR)}"`);
}

const desc = fm.description;
if (typeof desc !== "string" || !desc) err("SKILL.md: frontmatter `description` is required");
else {
  if (desc.length > 1024) err(`SKILL.md: description must be 1-1024 chars (got ${desc.length})`);
  if (!/when/i.test(desc)) warn("SKILL.md: description should say when to use the skill");
}

if (fm.metadata !== undefined) {
  if (fm.metadata === null || typeof fm.metadata !== "object" || Array.isArray(fm.metadata)) {
    err("SKILL.md: metadata must be a string->string map");
  } else {
    for (const [k, v] of Object.entries(fm.metadata)) {
      if (typeof v !== "string") err(`SKILL.md: metadata.${k} must be a string (no nesting)`);
    }
    if (typeof fm.metadata.version !== "string") warn("SKILL.md: metadata.version is missing (needed for update checks)");
  }
}

// --- invocation policy: both harnesses must agree that this skill never auto-fires ---
if (fm["disable-model-invocation"] !== true) {
  err('SKILL.md: disable-model-invocation must be boolean true (this interview skill never auto-fires on Claude)');
}
const openaiYaml = resolve(SKILL_DIR, "agents/openai.yaml");
if (existsSync(openaiYaml)) {
  try {
    const o = yaml.load(readFileSync(openaiYaml, "utf8"));
    if (o?.policy?.allow_implicit_invocation !== false) {
      err("agents/openai.yaml: policy.allow_implicit_invocation must be false (must match disable-model-invocation: true)");
    }
  } catch (e) {
    err(`agents/openai.yaml: not valid YAML: ${e.message.split("\n")[0]}`);
  }
} else {
  warn("agents/openai.yaml is missing (Codex invocation policy undefined)");
}

// --- body conventions ---
const lines = skill.split("\n").length;
if (lines > 500) err(`SKILL.md: ${lines} lines exceeds the 500-line guideline`);
// The literal {{PLACEHOLDER}} is the documented convention example —
// flag any other {{UPPER_SNAKE}} token as an unfilled placeholder.
const placeholders = [...skill.matchAll(/\{\{([A-Z][A-Z0-9_]*)\}\}/g)].filter((m) => m[1] !== "PLACEHOLDER");
if (placeholders.length)
  err(`SKILL.md: unfilled placeholder(s): ${[...new Set(placeholders.map((m) => m[0]))].join(", ")}`);

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
  const rel = p.slice(SKILL_DIR.length + 1);
  const base = basename(p);
  const parent = rel.slice(0, rel.lastIndexOf("/"));
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
  if (typeof mv === "string" && !versions.includes(`| init-project | ${mv} |`)) {
    err(`VERSIONS.md: no row matching init-project ${mv}`);
  }
} else {
  warn("VERSIONS.md is missing");
}

// --- plugin manifest versions stay in sync with the skill ---
// `claude plugin update` compares the manifest version, not the skill's
// metadata.version — if these drift, users silently keep a stale install.
for (const mp of [".claude-plugin/plugin.json", "plugin.json"]) {
  const mpPath = resolve(ROOT, mp);
  if (existsSync(mpPath)) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(mpPath, "utf8"));
    } catch {
      err(`${mp}: invalid JSON`);
      continue;
    }
    if (parsed.version !== fm.metadata?.version) {
      err(`${mp}: version ${parsed.version ?? "missing"} != skill metadata.version ${fm.metadata?.version}`);
    }
  } else {
    warn(`${mp} is missing`);
  }
}

// --- report ---
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
