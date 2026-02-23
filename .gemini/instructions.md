# Project instructions for Gemini Code Assist

**Canonical rules**: Follow the project rules in **AGENTS.md** at the repository root. That file is the single source of truth for this repo and is shared across Cursor, Copilot, Antigravity, and Gemini.

**Quick summary** (see AGENTS.md for full text):

- Comments and docs: English only.
- Avoid reading node_modules, dist, build, .git, large logs/json.
- Edit only the relevant parts; no full-file rewrites.
- In `packages/nextjs-pandacss-ark/`: no snapshot tests; use explicit assertions.
- Git commits: Conventional Commits in English (e.g. `feat(ui): add button`).
