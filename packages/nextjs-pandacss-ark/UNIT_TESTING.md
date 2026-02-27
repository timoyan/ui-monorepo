# Unit Testing Guide

How to write and run unit tests in this package (Vitest, React Testing Library, MSW).

---

## Stack and conventions

- **Runner**: [Vitest](https://vitest.dev/) — fast, ESM-friendly, `describe` / `it` / `expect` / `vi`
- **DOM**: [React Testing Library](https://testing-library.com/react) — `render`, `screen`, `userEvent`; query by role/label/text
- **API**: [MSW](https://msw.io/) (Node server) — mock HTTP per test with `server.use(...)`
- **Assertions**: Explicit only. **Do not use snapshot tests** (`toMatchSnapshot` / `toMatchInlineSnapshot`). Use `expect(...).toBe()`, `expect(...).toHaveBeenCalledWith(...)`, and DOM/state queries so intent is clear and tests stay stable.

---

## File layout

- Tests live next to the code: `**/__tests__/*.test.{ts,tsx}` or `*.test.{ts,tsx}` beside the module.
- Shared test utilities: `test/setup.ts` (MSW, jest-dom, globals), `test/renderWithRedux.tsx` (Redux render helper).
- Global setup is in `vitest.config.ts` → `setupFiles: ["./test/setup.ts"]`.

---

## When to use Redux in tests

- **Component does not use Redux** (no `useSelector`, no RTK Query hooks): use plain `render(ui)`. No Provider, no store.
- **Component uses Redux** (e.g. `useGetCartQuery`, `useSelector`): use `createReduxRender()` from `@/test/renderWithRedux` and render with `renderWithStore(ui)`.

Do **not** share one global store across all tests. Each test file that needs Redux should call `createReduxRender()` once (or per `describe` if you prefer a fresh store per group). That gives an isolated store per file/group and avoids state leaking between tests.

---

## Redux tests: store and reset

1. Get a dedicated store and render helper:

   ```ts
   import { createReduxRender } from "@/test/renderWithRedux";

   const { store, renderWithStore } = createReduxRender();
   ```

2. Clear RTK Query cache between tests so one test’s data does not affect another:

   ```ts
   import { apiSlice } from "@/apis/apiSlice";

   beforeEach(() => {
     store.dispatch(apiSlice.util.resetApiState());
   });
   ```

3. Render the component with the store:

   ```ts
   renderWithStore(<YourComponent />);
   ```

4. (Optional) Seed state without dispatching actions by passing `preloadedState` (deep partial):

   ```ts
   const { store, renderWithStore } = createReduxRender({
     preloadedState: {
       api: { queries: { "getCart(undefined)": { status: "fulfilled", data: [] } } },
     },
   });
   ```

---

## Test data and API mocks: scope-local only

Each scope (feature, module, component) must use **only its own test data and mock API**. Do not create or import shared/generic fixtures modules.

- **Scope-local fixtures**: Define mock data (e.g. `createMockCartItem`) inside the test file or in a `__tests__/fixtures.ts` next to the test. Do not import from cross-scope shared fixture modules.
- **Scope-local mock handlers**: Each test mocks only the endpoints it needs with `server.use(...)`. Define handlers inline in the test or in a helper within the same `__tests__` folder.
- **Rationale**: Keeps tests self-contained, avoids coupling between scopes, and makes it clear what data each test depends on.

---

## Mocking APIs (MSW)

The test MSW server starts with **no handlers**. Any test that triggers an API call must mock the endpoints it needs.

- Use `server.use(...)` inside the test (or in a `beforeEach` for that describe block).
- Unmocked requests cause the test to fail (config: `onUnhandledRequest: "error"`).

Example (with scope-local fixtures):

```ts
import { HttpResponse, http } from "msw";
import { server } from "@/mocks/server";

// Define fixtures locally in this test file or __tests__/fixtures.ts
function createMockCartItem(overrides?: Partial<CartItem>): CartItem {
  return { id: "cart-1", productId: "prod-1", productName: "Sample", quantity: 1, ...overrides };
}

it("shows empty cart when API returns []", async () => {
  server.use(
    http.get("http://test.com/api/cart", () => HttpResponse.json([])),
  );
  renderWithStore(<ModuleC />);
  await screen.findByText(/cart is empty/i);
  // ...
});
```

Base URL for API calls in tests comes from your app/config (e.g. `getBaseUrlForEndpoint`). Use the same host/path the code under test actually calls.

---

## Mocking other modules (e.g. toast)

For modules that are not Redux or HTTP (e.g. `@/core/toast`), use Vitest’s `vi.mock()` and, if needed, `vi.mocked(...).mockReturnValue(...)` in `beforeEach` so each test gets a clean mock.

Example:

```ts
import { vi } from "vitest";
import { useToast } from "@/core/toast";

const mockToast = {
  create: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  // ...
};

vi.mock("@/core/toast", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/toast")>();
  return { ...actual, useToast: vi.fn() };
});

beforeEach(() => {
  vi.mocked(useToast).mockReturnValue({
    toast: mockToast,
    registerAndToast: vi.fn(),
  });
  mockToast.success.mockClear();
});
```

---

## Assertions

- Prefer queries that reflect how users see the app: `getByRole`, `getByLabelText`, `getByText`, then `getByTestId` only if necessary.
- Use async helpers when content appears after fetch: `findBy*`, `waitFor`.
- Assert on behavior and visible outcome, e.g. `expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument()` and `expect(mockToast.success).toHaveBeenCalledWith({ ... })`.
- Do **not** use `toMatchSnapshot` or `toMatchInlineSnapshot`.

---

## Commands

- `pnpm test` — watch mode
- `pnpm test:run` — single run (CI)
- `pnpm test:coverage` — coverage report
- `pnpm lint:test` — fails if snapshot assertions are present (no snapshots policy)

---

## Summary

| Concern              | Practice                                                                 |
|----------------------|--------------------------------------------------------------------------|
| Redux                | Use `createReduxRender()` per file/group; never a global shared store.  |
| Reset between tests  | `beforeEach` → `store.dispatch(apiSlice.util.resetApiState())`.          |
| Test data & mocks    | Scope-local only. Define fixtures and handlers in the test file or `__tests__/`; do not use shared cross-scope fixture modules. |
| API                  | Mock only what the test needs with `server.use(...)`.                   |
| Assertions           | Explicit `expect(...)`; no snapshots.                                    |
| Other deps (toast…) | `vi.mock` + `beforeEach` for stable, isolated mocks.                     |
