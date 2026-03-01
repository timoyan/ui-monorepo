# Unit Testing (repo)

How unit tests are run and how to write them in this repo. Today all tests live in **packages/nextjs-pandacss-ark** (Vitest, React Testing Library, MSW).

---

## Repo-level policy

- **Runner**: [Vitest](https://vitest.dev/) — ESM-friendly, `describe` / `it` / `expect` / `vi`
- **DOM**: [React Testing Library](https://testing-library.com/react) — `render`, `screen`, `userEvent`; query by role/label/text
- **API**: [MSW](https://msw.io/) (Node server) — mock HTTP per test with `server.use(...)`
- **Assertions**: Explicit only. **No snapshot tests** (`toMatchSnapshot` / `toMatchInlineSnapshot`). Use `expect(...).toBe()`, `expect(...).toHaveBeenCalledWith(...)`, and DOM/state queries so intent is clear and tests stay stable.

From root: `pnpm test:unit` runs tests in the app package. See [ONBOARDING.md](ONBOARDING.md) for all test commands.

---

## Where tests live

- **App package**: `packages/nextjs-pandacss-ark`
  - Tests next to code: `**/__tests__/*.test.{ts,tsx}` or `*.test.{ts,tsx}` beside the module
  - Shared setup: `packages/nextjs-pandacss-ark/test/setup.ts` (MSW, jest-dom, globals)
  - Redux helper: `packages/nextjs-pandacss-ark/test/renderWithRedux.tsx`
  - Config: `packages/nextjs-pandacss-ark/vitest.config.ts` → `setupFiles: ["./test/setup.ts"]`

If you add more packages with tests later, follow the same layout (test/setup, render helpers, no snapshots) and wire a root script (e.g. `pnpm test:unit` running each package’s test:run).

---

## Redux in tests

- **Component does not use Redux**: use plain `render(ui)`. No Provider, no store.
- **Component uses Redux** (e.g. RTK Query hooks, `useSelector`): use `createReduxRender()` from `@/test/renderWithRedux` and render with `renderWithStore(ui)`.

Do **not** share one global store across all tests. Each test file that needs Redux should call `createReduxRender()` once (or per `describe`). That gives an isolated store per file/group and avoids state leaking.

### Redux test pattern

1. Get a dedicated store and render helper:

   ```ts
   import { createReduxRender } from "@/test/renderWithRedux";

   const { store, renderWithStore } = createReduxRender();
   ```

2. Clear RTK Query cache between tests:

   ```ts
   import { apiSlice } from "@/apis/apiSlice";

   beforeEach(() => {
     store.dispatch(apiSlice.util.resetApiState());
   });
   ```

3. Render with the store: `renderWithStore(<YourComponent />)`.

4. (Optional) Seed state via `preloadedState` in `createReduxRender({ preloadedState: { ... } })`.

---

## Test data and API mocks: scope-local only

Each scope (feature, module, component) must use **only its own test data and mock API**:

- **Scope-local fixtures**: Define mock data (e.g. `createMockCartItem`) in the test file or in a `__tests__/fixtures.ts` next to the test. Do not import from cross-scope shared fixture modules.
- **Scope-local handlers**: Each test mocks only the endpoints it needs with `server.use(...)`. Define handlers inline or in a helper in the same `__tests__` folder.

This keeps tests self-contained and makes dependencies explicit.

---

## Mocking APIs (MSW)

The test MSW server starts with **no handlers**. Any test that triggers an API call must mock the endpoints it needs with `server.use(...)` (in the test or in a `beforeEach` for that block). Unmocked requests fail (config: `onUnhandledRequest: "error"`).

Use the same base URL/path the code under test actually calls (e.g. from app config / `getBaseUrlForEndpoint`).

---

## Mocking other modules (e.g. toast)

For non-Redux, non-HTTP modules (e.g. `@/core/toast`), use Vitest’s `vi.mock()` and, if needed, `vi.mocked(...).mockReturnValue(...)` in `beforeEach` so each test gets a clean mock.

---

## Assertions

- Prefer user-facing queries: `getByRole`, `getByLabelText`, `getByText`; `getByTestId` only if necessary.
- Use async helpers when content appears after fetch: `findBy*`, `waitFor`.
- Assert on behavior and visible outcome. Do **not** use `toMatchSnapshot` or `toMatchInlineSnapshot`.

---

## Commands (from repo root)

| Task        | Command |
|-------------|---------|
| Run once    | `pnpm test:unit` |
| Watch       | `pnpm --filter nextjs-pandacss-ark run test` |
| Coverage    | `pnpm --filter nextjs-pandacss-ark run test:coverage` |
| Lint tests  | `pnpm --filter nextjs-pandacss-ark run lint:test` (fails if snapshot assertions exist) |

---

## Summary

| Concern           | Practice |
|-------------------|----------|
| Redux             | `createReduxRender()` per file/group; no global shared store |
| Reset between tests | `beforeEach` → `store.dispatch(apiSlice.util.resetApiState())` |
| Test data & mocks | Scope-local only; no shared cross-scope fixture modules |
| API               | Mock only what the test needs with `server.use(...)` |
| Assertions        | Explicit `expect(...)`; no snapshots |
| Other deps        | `vi.mock` + `beforeEach` for isolated mocks |
