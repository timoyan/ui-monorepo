# Flow — Global user flow control

This module holds **per-module state** for the app. Flow logic lives in the page or app layer (`pages/index.tsx` or `_app.tsx`). **modulesState** is the app-wide single source of truth in the Redux store (`flow` slice); **setModuleState** adds or updates one module by name.

## Architecture

- **Page / app (client)** — Calls `useFlow()` in `pages/index.tsx` or `_app.tsx`. Receives **modulesState** (read-only) and **setModuleState**. Pass **setModuleState** down (e.g. via context) so modules can report state (ModuleStatePayload).
- **Modules** — Call **setModuleState** with `{ name, state, message?, data? }`. If the module exists, data is merged and `timestamp` is updated; if not, it is added with a new `timestamp`.

So: **modules call setModuleState(payload) → Redux flow slice updates modulesState → every useFlow() sees the same data.**

## Types

- **ModuleStatePayload** — `name: "A" | "B" | "C"`, `state: "INIT" | "PROCESSING" | "COMPLETED" | "FAILED"`, optional `message`, `data`.
- **ModuleState** — ModuleStatePayload + `timestamp` (set by the slice).
- **ModulesState** — `Partial<Record<ModuleName, ModuleState>>` (keyed by module name).

## Dialogs (cookie confirm, currency switch)

- **Cookie confirm** — `cookieConfirmResult` is `{ isAccept: true | false | null }`. `isAccept === null` means the user has not chosen yet (show dialog). Both **setCookieConfirm(true)** (accept) and **setCookieConfirm(false)** (decline) close the dialog; the value is persisted in **sessionStorage** so the dialog does not reappear on refresh. On client mount, `useFlow` syncs from sessionStorage into Redux.
- **Currency switch** — **currencySwitchDialogOpen** is a boolean controlled by user operations. Call **setCurrencySwitchDialogOpen(true)** to open (e.g. from a header “Currency” button) and **setCurrencySwitchDialogOpen(false)** to close. Whether to show the dialog is derived from current user operation state (e.g. after user triggers a currency change).

See `CookieConfirmDialog` and `CurrencySwitchDialog` in `features/dialogs/` for usage.

## Active module

- **activeModuleId** — The Ui panel id (a | b-1 | b-2 | c) that is currently active. Recomputed when **setModuleState** runs: active = first module in order whose state is not COMPLETED. When **all** modules are COMPLETED, there is no active module (**activeModuleId** is null).
- **setActiveModuleId** — Set active panel directly (e.g. when user toggles accordion). **isModuleActive(name)** — whether that module is the active one.

## Usage

- Call `useFlow()` in `pages/index.tsx` or `_app.tsx` (client-side). Must be under Redux `Provider` (e.g. NextReduxWrapper).
- Read **modulesState** to drive UI (e.g. show loading per module).
- Call **setModuleState({ name: "A", state: "PROCESSING", message: "Loading..." })** from pages or modules to add/update that module.
- Use **activeModuleId** / **setActiveModuleId** / **isModuleActive** to drive accordion value/onValueChange in ModuleContainer.

See `useFlow.example.ts` for patterns.
