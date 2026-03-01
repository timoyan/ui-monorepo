# local-dev-store

In-memory state used **only by MSW dev handlers** when running the app locally (browser worker). It simulates a single backend data source so that add/update/remove operations share the same state across requests.

## Not used in unit tests

Unit tests use `mocks/server.ts` with an **empty** handler list and mock endpoints per test via `server.use()`. They do not use these stores, so tests stay isolated and explicit.

## Pattern for adding a new store

1. Add a new module under `local-dev-store/` (e.g. `wishlistStore.ts`) with:
   - In-memory state and getter(s)
   - Mutations that match your API shape
   - A `reset*Store()` function for tests if the store is ever used in test setup
2. In `mocks/handlers.ts`, add handlers to `devHandlers` that call into the new store.
3. Re-export from `mocks/index.ts` only what is needed (e.g. for tests or tooling).

## Current stores

- **cartStore** – Cart CRUD; used by cart API dev handlers. `resetCartStore()` is used in tests that need a clean cart state.
