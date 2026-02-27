# Architecture Philosophy

This document explains the **design philosophy and guiding principles** behind the `nextjs-pandacss-ark` architecture.  
`ARCHITECTURE.md` describes *what* the structure is; this document focuses on *why* it is that way.

---

## 1. Optimize for change, not for demos

Building UI for real products means requirements will change, sometimes dramatically.  
Our primary goal is to make **changing behavior and flows safe and cheap**, even if that adds some upfront structure.

- We accept **more folders and files** in exchange for:
  - Clear ownership (where to put a new behavior, where to modify an existing one)
  - Local reasoning (you can understand a feature by reading a small area)
  - Safer refactors (modules/features/components have explicit responsibilities)
- Small prototypes are allowed to start simple, but once they stabilize, they should be **extracted into modules/features** that follow this architecture.

> Mental model: prefer a structure that makes “changing requirements in three months” easy, rather than one that makes “shipping the first demo” slightly faster.

---

## 2. First-class boundaries: core / pages / modules / components

We split the app into four main vertical layers:

- **core** – app-level concerns (Redux store, routing, error boundaries, global flows)
- **pages** – Next.js pages: entry points that *assemble* domains, not places for heavy business logic
- **modules** – domain modules that aggregate multiple features into a coherent flow
- **components** – reusable UI and independent features

The philosophy is:

- **core** owns cross-cutting concerns and global state.
- **pages** are thin; they describe what the page is made of, not how business rules work in detail.
- **modules** own *domain orchestration* (how several features work together).
- **components** own purely UI-level concerns and small business features, designed for reuse and testability.

By enforcing these boundaries, we avoid the common “everything ends up in pages/ or components/” problem.

---

## 3. State lives where it is needed – and no further

State management is a source of complexity and coupling.  
Our philosophy is to **place state at the minimum necessary scope**:

- **Redux store (global, including module-owned slices)** when:
  - Multiple modules/features or core need to share the same state
  - The state is part of a long-lived flow (e.g. checkout step, cart, user)
- **Module-level state** via `useState`/Context when:
  - Several features inside a module need to coordinate
  - The state does not need to be visible outside the module
- **Component-level local state** when:
  - The state only affects one component (e.g. input value, UI toggle)
- **Props and callbacks** are preferred over “just using Redux” when:
  - The parent naturally owns the decision and children simply report events

This is encoded as a decision tree in `ARCHITECTURE.md`, but the philosophy is simple:

> Do not promote state “upwards” unless there is a clear need. Global state is a powerful tool and also a long-term liability.

---

## 4. Modules as domain orchestrators

Modules exist to make **domain flows explicit and composable**.  
Their job is not just to group files, but to encode how several features cooperate.

Philosophy:

- A module:
  - Knows which features are involved in a domain scenario
  - Coordinates data flow and events between them
  - Decides which state goes to Redux and which stays local
  - Exposes a small, clear interface to pages (often a single React component)
- Features inside a module should stay focused and composable:
  - They handle one business sub-problem (e.g. list, form, summary, map)
  - They communicate with the module via props and callbacks

This keeps **cross-feature logic in one place** (the module) instead of being sprinkled across multiple components or pages.

### ViewModel vs View

Conceptually we treat:

- **ViewModel layer** = `modules/**` + selected **domain hooks** (e.g. `useCart`, `useFlow`, `useCheckoutStep`) that live in `core/` or `hooks/`.
  - Responsibilities:
    - Translate Redux / RTK Query / other infra into **UI-ready view models** (plain props, booleans, derived labels).
    - Encode domain workflows and side effects (e.g. “when address is saved, update cart and go to next step”).
    - Own domain-specific slices in the Redux store where needed.
  - Consumers:
    - `pages/**` (for page-level composition).
    - `components/features/**` (through props or these hooks, and through `import type` of ViewModel types).
- **View layer** = `components/**`（特別是 `components/features/**`）
  - Responsibilities:
    - Render UI based on already-prepared view models.
    - Emit user intents as callbacks/events (e.g. `onSubmit`, `onSelectItem`, `onRemove`).
    - Stay agnostic to *where* data comes from or *how* side effects are handled.

In practice:

- Each module may define its own ViewModel types in a file like `modules/cart/view-model.ts`.
- Features that need those types use **type-only imports**:
  - `import type { CartItemView } from "@/modules/cart/view-model";`
- Modules and domain hooks can use the same ViewModel types with normal imports.

This way, modules remain the single source of truth for their ViewModels, while the View layer depends only on their types (not on module implementations).

This separation keeps domain and infra changes mostly inside modules + hooks (ViewModel), while components/features (View) focus on markup, layout, accessibility, and interaction details.

---

## 5. Features independent from infrastructure

`components/features/` is where we put **reusable business features**.  
To keep them portable and easy to test, we deliberately **ban direct dependencies on Redux and RTK Query** here.

Design intentions:

- A feature should:
  - Be reusable by multiple modules or pages
  - Be testable with props and callbacks only
  - Avoid knowing *how* data is fetched or where it is stored globally
- Infrastructure concerns (Redux store, RTK Query endpoints, MSW handlers) live in:
  - `core/` (store, routing, global flows)
  - `apis/` (RTK Query slices)
  - `mocks/` (development and test mocking)

To make this practical, we use **wrapped hooks** (e.g. `useCart`, `useFlow`) that hide Redux/RTK Query details.  
Features depend on those hooks or on plain props, not on the lower-level infra APIs directly.

> Philosophy: features should think in terms of “business data and events”, not “Redux slices and API clients”.

---

## 6. UI layering: atomics → composed → layout → features

Within `components/`, we use a strict layering:

- **atomics** – small, focused UI primitives (button, input, dialog)
- **composed** – reusable compound components built from atomics (e.g. autocomplete)
- **layout** – components that arrange content (e.g. containers, sections)
- **features** – business features that use the above layers

Why this matters:

- It avoids complex circular dependencies between UI components.
- It makes it obvious where a new UI idea should go:
  - “Generic but low-level” → atomics
  - “Generic pattern made from atomics” → composed
  - “Page/module layout concerns” → layout
  - “Business meaning, possibly reused across domains” → features

The result is a UI toolkit that can grow without becoming a ball of mud.

---

## 7. Architecture enforced by tooling, not just by docs

Architecture that only lives in a document tends to erode.  
We use **Biome overrides and lint rules** to enforce key boundaries:

- In `components/features/**`:
  - Cannot import other features
  - Cannot import Redux/RTK Query or `@/core/store` or `@/apis/*`
- In `components/composed/**`:
  - Cannot import `components/layout`, `components/features`, or `modules`
  - May only compose atomics (plus external libraries)
- In `modules/**`:
  - Modules cannot import each other (cross-module composition happens in pages or above)

Philosophy:

- If a rule is important to the architecture, it should be **checked automatically**.
- New contributors should be able to “follow the compiler/linter” to learn the rules, instead of reading long documentation first.

---

## 8. Testability as a design constraint

Unit testing is not an afterthought; it is a **design constraint**:

- Tests live close to the code they verify (`__tests__` folders, `*.test.tsx` / `*.test.ts`).
- Each scope (feature, module, component) owns its **own fixtures and mocks**:
  - No giant shared “test utils” that mix concerns across domains.
  - Each test declares exactly the behavior it depends on.
- For API calls, MSW is used:
  - In dev, a browser worker with `devHandlers` mocks local APIs selectively.
  - In tests, the MSW server starts with **no handlers**; each test must explicitly register its own handlers.

This forces us to design:

- Features that can be rendered with plain props or small wrappers.
- Modules that can be tested by driving their features and observing outputs.
- Core and APIs that have clear integration points.

For more concrete rules and examples, see `UNIT_TESTING.md`.

---

## 9. Import aliases and explicit boundaries

We use `@/` as an alias for the project root. Beyond convenience, this is a way to **make boundaries explicit in imports**:

- `@/core/...` – you are touching app-level concerns.
- `@/modules/...` – you are entering a domain module.
- `@/components/...` – you are in the reusable UI space.
- `@/apis/...` – you are talking to data-fetching infrastructure.

This makes it visually obvious when a component accidentally reaches across too many layers, and works together with Biome rules to catch architecture violations.

---

## 10. Evolution over time

This architecture is intentionally **opinionated but evolvable**:

- Some folders are marked as “will be migrated” (e.g. moving `store/` into `core/store/`).
- As patterns emerge (e.g. new domain modules, new feature types), we:
  - Extract them into dedicated modules/features
  - Add or adjust lint rules to reflect new boundaries
  - Update docs so that humans and tools stay in sync

The goal is not to freeze the design, but to:

- Provide a **stable mental model** for everyday development.
- Allow **safe, incremental refactors** when the product grows.

If you find yourself often unsure “where something should live”, that is a signal for us to **improve the philosophy and the tooling**, not to bypass the structure.

---

## 11. Practical workflow: adding or changing features

This section turns the philosophy into a concrete checklist you can follow when implementing new behavior.

### 11.1 Decide the scope

1. **Is this a cross-cutting concern (routing, global error, app-wide state)?**
   - Yes → Start in `core/` (and wire into `_app.tsx` / pages as needed).
2. **Is this a page-level composition of existing modules/features?**
   - Yes → Implement in `pages/` by assembling modules and features; keep logic thin.
3. **Is this a domain flow that combines several sub-features?**
   - Yes → Create or extend a **module** in `modules/{domain}/`.
4. **Is this a reusable business feature (cart, payment, dialog) that may be used in multiple places?**
   - Yes → Create a **feature** in `components/features/{feature-name}/`.
5. **Is this primarily a reusable UI building block without domain meaning?**
   - Low-level primitive → `components/atomics/`
   - Compound UI pattern → `components/composed/`
   - Layout container → `components/layout/`

When in doubt, start with a local implementation (e.g. inside a module) and extract to a shared feature/module once reuse becomes clear.

### 11.2 Choose where state lives

Follow this decision tree (also in `ARCHITECTURE.md`):

1. Does the state need to be used across modules/features or core?
   - Yes → Put it in the **Redux store** (under `core/store`).
2. Otherwise, does it need to be shared across multiple components within a module?
   - Yes → Keep it in the **module** using `useState` or Context, pass down via props/callbacks.
3. Otherwise:
   - Keep it as **component local state** with `useState`.

Prefer callbacks and props over “just use Redux” when the parent naturally owns the behavior.

### 11.3 Wire data and side effects

1. **If using RTK Query or complex store logic**:
   - Add or extend endpoints in `apis/` and expose them through `apiSlice`.
   - Optionally wrap them in high-level hooks (e.g. `useCart`) in `core/` or `hooks/`.
2. **In features (`components/features/**`)**:
   - Do **not** call Redux or RTK Query directly.
   - Get data via props or wrapped hooks only.
3. **In modules**:
   - Use Redux and RTK Query freely to coordinate sub-features.
   - Map API data into view-model props for child features/components.

### 11.4 Testing checklist

For any new module/feature/component:

- Create tests next to the implementation (`__tests__` or `*.test.tsx`).
- Use scope-local fixtures and MSW handlers as described in `UNIT_TESTING.md`:
  - No shared cross-scope fixture modules.
  - Each test declares its own `server.use(...)` handlers.
- If the code uses Redux or RTK Query:
  - Use `createReduxRender()` from `test/renderWithRedux.tsx`.
  - Reset API state in `beforeEach` with `apiSlice.util.resetApiState()`.
- Avoid snapshot assertions; assert on behaviors and visible outcomes.

### 11.5 Lint and boundaries sanity-check

Before opening a PR:

- Run lint/format commands and fix violations.
- Check imports:
  - Features do not import other features, Redux, or `@/apis/*`.
  - Composed components only import atomics (plus allowed external libs).
  - Modules do not import other modules.

If you find yourself fighting the lint rules, first ask: **“Am I putting this code in the right layer?”**. Often the fix is to move logic up or down a layer rather than weakening the rules.

