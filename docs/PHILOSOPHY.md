# Architecture Philosophy (repo)

This document explains the **design philosophy and guiding principles** for the app in this repo.  
[packages/nextjs-pandacss-ark/ARCHITECTURE.md](../packages/nextjs-pandacss-ark/ARCHITECTURE.md) describes *what* the structure is; here we focus on *why* it is that way.

---

## 1. Optimize for change, not for demos

Building UI for real products means requirements will change. Our goal is to make **changing behavior and flows safe and cheap**, even if that adds some upfront structure.

- We accept **more folders and files** in exchange for:
  - Clear ownership (where to put or modify behavior)
  - Local reasoning (understand a feature by reading a small area)
  - Safer refactors (modules/features/components have explicit responsibilities)
- Prototypes can start simple; once they stabilize, extract into **modules/features** that follow this architecture.

> Prefer a structure that makes “changing requirements in three months” easy, rather than one that makes “shipping the first demo” slightly faster.

---

## 2. First-class boundaries: core / pages / modules / components

The app is split into four main vertical layers:

- **core** – app-level concerns (Redux store, routing, error boundaries, global flows)
- **pages** – Next.js pages: entry points that *assemble* domains, not places for heavy business logic
- **modules** – domain modules that aggregate multiple features into a coherent flow
- **components** – reusable UI and independent features

- **core** owns cross-cutting concerns and global state.
- **pages** are thin; they describe what the page is made of.
- **modules** own *domain orchestration* (how several features work together).
- **components** own purely UI-level concerns and small business features, designed for reuse and testability.

This avoids “everything ends up in pages/ or components/”.

---

## 3. State lives where it is needed – and no further

Place state at the **minimum necessary scope**:

- **Redux store** when multiple modules/features or core need to share state, or state is part of a long-lived flow (e.g. checkout, cart, user).
- **Module-level state** (useState/Context) when several features inside a module need to coordinate and state does not need to be visible outside.
- **Component-level local state** when it only affects one component.
- **Props and callbacks** are preferred over “just using Redux” when the parent naturally owns the decision.

> Do not promote state upwards unless there is a clear need. Global state is powerful but a long-term liability.

---

## 4. Modules as domain orchestrators

Modules make **domain flows explicit and composable**. They encode how several features cooperate.

- A module: knows which features are involved, coordinates data flow and events, decides what goes to Redux vs local, exposes a small interface to pages (often a single React component).
- Features inside a module stay focused and composable; they communicate with the module via props and callbacks.

**Pages** are top-level entry points: they decide which modules/features are needed, own route-level data fetching if needed, and compose layout. **Modules** translate Redux/RTK Query into UI-ready props and encode domain workflows. The **view layer** (components) renders from props and emits intents via callbacks; it stays agnostic to where data comes from.

---

## 5. Features independent from infrastructure

`components/features/` holds **reusable business features**. To keep them portable and testable, we **do not allow direct dependencies on Redux and RTK Query** there.

- Features should be reusable by multiple modules or pages, testable with props and callbacks only, and avoid knowing how data is fetched or stored globally.
- Infrastructure (Redux, RTK Query, MSW) lives in `core/`, `apis/`, `mocks/`. We use **wrapped hooks** (e.g. `useCart`) so features depend on those or on props, not on low-level infra.

> Features should think in terms of “business data and events”, not “Redux slices and API clients”.

---

## 6. UI layering: atomics → composed (incl. layout) → features

Within `components/`:

- **atomics** – small UI primitives (button, input, dialog)
- **composed** – compound components built from atomics. Includes both compound widgets (e.g. autocomplete) and **layout** (e.g. ModuleContainer under `composed/layout/`). Both use only atomics; other composed must not import `composed/layout`.
- **features** – business features using the above

This avoids circular dependencies and makes it obvious where new UI belongs.

---

## 7. Architecture enforced by tooling

Architecture that only lives in docs tends to erode. We use **Biome/lint rules** to enforce boundaries:

- In `components/features/**`: cannot import other features or Redux/RTK Query or `@/core/store` or `@/apis/*`.
- In `components/composed/**`: cannot import other composed (e.g. composed/layout), features, or modules; only atomics (plus allowed libs). Layout lives under `composed/layout/`.
- In `modules/**`: modules cannot import each other (composition happens in pages or above).

> If a rule is important, it should be checked automatically. Contributors can “follow the compiler/linter” to learn the rules.

---

## 8. Testability as a design constraint

Unit testing is a **design constraint**:

- Tests live close to the code (`__tests__`, `*.test.tsx`).
- Each scope owns its **own fixtures and mocks**; no giant shared test utils that mix domains.
- For API calls, MSW is used; in tests the server starts with **no handlers** and each test registers what it needs.

This forces features that can be rendered with props or small wrappers, and modules with clear integration points. See [docs/UNIT_TESTING.md](UNIT_TESTING.md) for concrete rules and examples.

---

## 9. Import aliases and explicit boundaries

We use `@/` as the app root alias. Imports make boundaries visible:

- `@/core/...` – app-level concerns
- `@/modules/...` – domain module
- `@/components/...` – reusable UI
- `@/apis/...` – data-fetching

This makes it obvious when code reaches across too many layers and works with lint rules to catch violations.

---

## 10. Evolution over time

This architecture is **opinionated but evolvable**:

- As patterns emerge, we extract them into modules/features, add or adjust lint rules, and update docs.
- Goal: a **stable mental model** for everyday development and **safe, incremental refactors** when the product grows.

If you are often unsure “where something should live”, that is a signal to improve the philosophy and tooling, not to bypass the structure.

---

## 11. Practical workflow: adding or changing features

### Decide the scope

1. Cross-cutting concern (routing, global error, app-wide state)? → **core/**
2. Page-level composition of existing modules/features? → **pages/** (keep logic thin)
3. Domain flow combining several sub-features? → **module** in `modules/{domain}/`
4. Reusable business feature (cart, payment, dialog)? → **feature** in `components/features/{name}/`
5. Reusable UI building block? → **atomics** / **composed** (widgets or **composed/layout**) as appropriate

When in doubt, start local (e.g. inside a module) and extract when reuse is clear.

### Where state lives

1. Used across modules/features or core? → **Redux store**
2. Shared only within a module? → **module** (useState/Context), pass via props/callbacks
3. Otherwise → **component local state**

Prefer callbacks and props over “just use Redux” when the parent owns the behavior.

### Wire data and side effects

- RTK Query / store logic: add or extend `apis/`, optionally wrap in hooks in `core/` or `hooks/`.
- In **features**: do not call Redux or RTK Query directly; use props or wrapped hooks.
- In **modules**: use Redux and RTK Query to coordinate; map API/domain data into UI props for children.

### Testing checklist

- Tests next to implementation; scope-local fixtures and MSW handlers ([UNIT_TESTING.md](UNIT_TESTING.md)).
- If code uses Redux/RTK Query: `createReduxRender()`, reset API state in `beforeEach`.
- No snapshot assertions; assert on behaviors and visible outcomes.

### Before PR

- Run lint/format; check that features do not import other features or Redux/apis, composed (incl. layout) only import atomics, modules do not import other modules.

If you fight the lint rules, ask first: **“Am I putting this code in the right layer?”**
