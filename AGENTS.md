# AI Agent Instructions (Single Source of Truth)

This file is the **canonical project rules** for AI coding agents. It is read by Cursor, GitHub Copilot, Claude Code, Windsurf, and other tools that support [AGENTS.md](https://agents.md). Keep this file in sync so that everyone (VSCode + Gemini, Cursor, Antigravity, etc.) gets the same guidance.

---

## Code & Comments

- **Comments in English**: Write all code comments, block comments, JSDoc/TSDoc, and TODO/FIXME in **English** for consistency across locales.

---

## Context & Efficiency

- **Strict file access**: Do not read `node_modules/`, `dist/`, `build/`, `.git/`, or large `.log`/`.json` unless explicitly requested.
- **Modular edits**: Focus on the relevant component or function; avoid project-wide scans for simple changes.
- **Incremental updates**: Change only the affected parts; do not rewrite entire files.

---

## Testing (nextjs-pandacss-ark)

- In `packages/nextjs-pandacss-ark/`: **Do not use snapshot tests** (`toMatchSnapshot`, `toMatchInlineSnapshot`). Prefer explicit assertions (e.g. `expect(...).toBe()`, DOM/state queries) so tests stay stable and intent is clear.
- **Unit testing guide**: When writing or editing tests in that package, follow `packages/nextjs-pandacss-ark/UNIT_TESTING.md` (Redux isolation, MSW, createReduxRender, no global store).

---

## Git Commits

- Use **English** and **Conventional Commits**: `type(scope): subject` (e.g. `feat(ui): add button`, `fix(api): resolve CORS`). Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

---

## Tool-specific (optional)

- **Gemini** (VSCode): `.gemini/instructions.md` — points here; only way for Gemini to get repo rules. Remove if no one uses Gemini.
- **Antigravity**: `.agent/rules/follow-agents-md.mdc` — tells Antigravity to follow this file (repo-level, for everyone).

Cursor and other AGENTS.md–aware tools read this file directly. When you change team standards, update **AGENTS.md** first.
