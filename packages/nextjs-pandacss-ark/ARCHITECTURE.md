# Project Architecture

This document describes the folder structure and organization principles of the `nextjs-pandacss-ark` project.

## Directory Structure

```
nextjs-pandacss-ark/
├── core/                    # App-level concerns
│   ├── store/              # Redux store configuration
│   ├── router/             # URL routing logic, step management
│   ├── flow/               # Multi-step flow state (e.g. checkout flow)
│   ├── toast/              # Toast state and registry
│   └── error-boundary/     # Error handling
│
├── pages/                  # Next.js pages (Pages Router)
│   ├── _app.tsx            # App entry, combines core providers
│   ├── _document.tsx       # Document shell
│   ├── index.tsx           # Home page
│   └── api/                # API routes
│       └── msw/            # MSW handler for dev/local
│
├── modules/                # Aggregate features (combine multiple features)
│   ├── a/                  # Module A (example)
│   │   ├── index.tsx       # Module entry
│   │   └── __tests__/
│   ├── b/                  # Module B (example)
│   │   ├── index.tsx
│   │   └── __tests__/
│   └── c/                  # Module C (cart + flow + toast demo)
│       ├── index.tsx
│       └── __tests__/
│
├── components/             # Reusable UI components
│   ├── atomics/            # Base UI primitives (Button, Dialog, Accordion, Input)
│   │   ├── accordion/
│   │   ├── button/
│   │   ├── dialog/
│   │   └── input/
│   ├── composed/           # UI compositions from atomics (e.g. Autocomplete)
│   │   │                   # May use: components/atomics only
│   │   └── autocomplete/
│   ├── layout/             # Layout components (ModuleContainer, etc.)
│   │   │                   # May use: components/atomics, components/composed
│   │   └── module-container/
│   └── features/           # Independent features (can be used by multiple modules)
│       │                   # May use: components/atomics, components/layout
│       │                   # Do NOT use Redux directly; use wrapped APIs (e.g. useFlow, useCart)
│       ├── cart/
│       │   ├── CartSample.tsx
│       │   ├── __tests__/
│       │   └── index.ts
│       └── dialogs/        # CookieConfirmDialog, CurrencySwitchDialog, etc.
│
├── apis/                   # RTK Query API slices
│   ├── apiSlice.ts         # Base API slice
│   ├── cart.ts             # Cart API endpoints
│   └── helpers/            # API helpers (e.g. getBaseUrlForEndpoint)
│
├── hooks/                  # Shared hooks
│   └── useMSWReady.ts
│
├── utils/                  # Shared utilities (no UI, no Redux)
│   └── guards/             # Type guards and predicate helpers
│       ├── index.tsx
│       └── __tests__/
│
├── mocks/                  # MSW configuration (for development and testing)
│   ├── handlers.ts
│   ├── browser.ts
│   ├── server.ts
│   ├── config.ts
│   ├── index.ts
│   ├── fixtures/           # Shared mock data (e.g. cart)
│   └── local-dev-store/    # Local dev store helpers (e.g. cartStore)
│
├── test/                   # Test setup and shared test utilities
│   ├── setup.ts
│   ├── renderWithRedux.tsx
│   └── __tests__/
│
├── scripts/                # Build/dev scripts (e.g. ensure-https-certs)
├── theme/                  # Theming configuration
└── styled-system/          # Panda CSS generated output (css, jsx, patterns, tokens, types)
```

**Note:** `apis/helpers/` holds API-layer helpers (e.g. `getBaseUrlForEndpoint`). The root `utils/` folder is for app-wide, domain-agnostic utilities (e.g. type guards in `utils/guards/`).

## Layer Responsibilities & Trade-offs

### Core (App-level)

**Purpose**: Handle app-level concerns

**Responsibilities**:
- **Step navigation**: Manage multi-step flows (e.g., checkout flow)
  - URL handling (route parameters, query strings)
  - Read state from Redux store
- **Error handling**: Global error boundaries and error dispatching
- **Store configuration**: Redux store setup and type definitions

**State Management**:
- Use Redux to manage state across modules/features
- Manage app-level state (e.g., current step, global errors)

**Example**:
```typescript
// core/router/useStepNavigation.ts
// Manage step navigation logic, read Redux state, update URL
```

### Pages (Page-level)

**Purpose**: Next.js pages that combine domains/features/components

**Responsibilities**:
- Combine modules, features, components
- Report page-scoped state to Redux store
- Handle page-level routing logic

**State Management**:
- Read Redux store
- Dispatch Redux actions
- Should not contain complex business logic (delegate to Modules/Features)

**Example**:
```typescript
// pages/index.tsx (or any page that composes modules)
import { ModuleC } from '@/modules/c';

export default function HomePage() {
  return <ModuleC />;
}
```

### Modules (Aggregate Features)

**Purpose**: Aggregate multiple related features to form a complete module

**Responsibilities**:
- Aggregate multiple features
- Coordinate interactions between features
- Report module-scoped state
  - To Redux store (state shared across features)
  - To parent component via callback (local state)

**State Management Decisions**:
- **Redux**: When state needs to be shared across features or used by core
- **Callback props**: When state is only used within the module or needs to be passed to parent

**Example**:
```typescript
// modules/c/index.tsx — aggregates cart feature, flow, and toast
import { CartSample } from '@/components/features/cart';
import { useGetCartQuery, useAddToCartMutation } from '@/apis/cart';
import { useToast } from '@/core/toast';

export function ModuleC() {
  const { data, isLoading } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const { toast } = useToast();
  // Map API data to feature props; handle mutations and toast in the module
  return (
    <CartSample
      items={data ?? []}
      isLoading={isLoading}
      onAddItem={() => addToCart({ productId: 'x', productName: 'Y', quantity: 1 }).unwrap().then(() => toast.success({ title: 'Added' }))}
      onRemoveItem={() => {}}
    />
  );
}
```

### Features (Feature-level)

Features live under **`components/features/`** (a subfolder of `components/`). They are reusable UI feature blocks, not top-level modules.

**Purpose**: Independent business features that can be used by multiple modules, or as sub-features within a module.

**Rule — no direct Redux in `components/features/`**: Code in `components/features/` must **not** use Redux directly (no `useSelector`, `useDispatch`, or RTK Query hooks like `useGetCartQuery`). Use **wrapped APIs** provided by core or other layers instead (e.g. `useFlow`, `useCart`). This keeps features decoupled from the store and testable with plain props/mocks. This rule is also enforced by Biome (see "Linting & Constraints").

**Rule — avoid API types in components**: UI components (`components/**`, especially `components/features/**`) should not import API-layer types (e.g. from `@/apis/*`). Prefer defining UI props interfaces in the UI layer and mapping from API types in upper layers (modules, hooks). The only exception is when a component is the direct caller of an RTK Query hook and needs that type for the hook itself; in that case the component should usually live outside `components/features/` (e.g. in a module or page).

**Responsibilities**:
- Implement a single business feature
- Combine components
- Report feature-scoped state via wrapped hooks or callbacks (not raw Redux)

**State Management**:
- **Wrapped hooks** (e.g. `useFlow()`, `useCart()`): When state is shared across modules/features; the hook encapsulates Redux/RTK Query inside core or hooks.
- **Callback props**: When state is only used within the feature or passed to parent.

**Two Ways to Use Features**:

1. **Independent Features** (in `components/features/` directory): Can be used by multiple modules. Use wrapped APIs, not Redux directly.
   ```typescript
   // components/features/cart/CartSample.tsx — presentational only; no Redux
   // Parent (e.g. ModuleC) uses useGetCartQuery/useToast and passes props
   <CartSample items={items} isLoading={...} onAddItem={...} ... />
   ```

2. **Module-specific Features** (in `modules/{module-name}/features/` directory): Only used within that module. When a module aggregates several sub-features, each can live under `modules/{name}/features/` and may use Redux if the module owns that state.
   ```typescript
   // modules/example/features/some-list/index.tsx
   export function SomeListFeature({ onSelect, onAddNew }: Props) {
     const items = useSelector(selectItems);
     return (
       <ul>
         {items.map((item) => (
           <li key={item.id} onClick={() => onSelect(item)}>{item.name}</li>
         ))}
         <button type="button" onClick={onAddNew}>Add</button>
       </ul>
     );
   }
   ```

### Components (Component-level)

**Purpose**: Define reusable UI components. Layering within `components/`:

- **atomics**: Base UI primitives (Button, Dialog, Accordion, Input). No dependency on other component folders.
- **composed**: UI compositions built from atomics (e.g. Autocomplete, SearchField). May use **atomics** only. Use when combining primitives into a reusable compound component without business logic.
- **layout**: Layout components (e.g. ModuleContainer). May use **atomics** and **composed**.
- **features**: Independent business features. May use **atomics**, **composed**, and **layout** (not other features).

**Responsibilities**:
- Implement reusable UI components
- Report component-scoped state to parent component via callback

**State Management**:
- **Local state (useState)**: Internal component state
- **Callback props**: Communicate with parent

**Example**:
```typescript
// components/atomics/button/index.tsx
export function Button({ onClick, children, ...props }) {
  // Use callback to communicate with parent
  return <button onClick={onClick} {...props}>{children}</button>;
}
```

## State Management Decision Tree

```
Does state need to be used across modules/features or core?
├─ Yes → Redux Store (including module-owned slices)
│   └─ Examples: Cart data, user info, current step, flow step, toast registry
│
└─ No → Does it need to be shared across multiple components?
    ├─ Yes → Callback props or Context
    │   └─ Examples: Form validation state, module internal coordination
    │
    └─ No → Local state (useState)
        └─ Examples: Input value, expand/collapse state
```

## Test Organization

Tests are placed next to the feature/component they cover (e.g. a co-located `__tests__` folder, or `*.test.tsx` / `*.test.ts` files).

**Scope-local test data and mocks**: Each scope (feature, module, component) must use only its own test data and mock API. Define fixtures and handlers in the test file or within the same `__tests__` folder. Do not create or import shared/generic fixture modules that are reused across scopes.

For the full testing guide (tech stack, Redux testing strategy, MSW usage, no-snapshot rules, etc.), see:

- [`UNIT_TESTING.md`](./UNIT_TESTING.md)

## Naming Conventions

### Modules, features, and components (what to name)

- **Modules**: Use descriptive names that represent aggregated functionality (e.g., `c` for a demo module, or `checkout`, `shipping-address` for domain modules)
- **Features**:
  - Independent features: Use feature names (e.g., `cart`, `payment`, `dialogs`)
  - Module-specific features: Use specific feature names (e.g., `saved-addresses-list`, `address-form`)
- **Components**: Use UI component names (e.g., `button`, `accordion`, `input`, `autocomplete`)
- **Test files**: `*.test.tsx` or `*.test.ts`

### Files and folders (casing)

- **Folders**: Lowercase only. Use **kebab-case** for multiple words (e.g. `module-container`, `error-boundary`, `saved-addresses-list`). Single words stay single (e.g. `cart`, `dialogs`, `guards`).
- **React component files**: **PascalCase**, matching the component name (e.g. `CartSample.tsx`, `AutocompleteInput.tsx`).
- **Hooks**: File name matches the hook: `use` prefix + **camelCase** (e.g. `useToast.ts`, `useMSWReady.ts`).
- **Other TypeScript/TSX** (utils, API slices, core logic): **camelCase** (e.g. `getBaseUrlForEndpoint.ts`, `apiSlice.ts`, `flowSlice.ts`).
- **Test files**: `<ModuleOrFileName>.test.ts` or `.test.tsx`, or `index.test.ts(x)` for barrel/scope tests.
- **Barrel files**: `index.ts` or `index.tsx`.
- **Avoid**: PascalCase or camelCase for folder names; camelCase for component files (use PascalCase so components are recognizable).

These conventions are enforced where possible by the Biome rule `useFilenamingConvention` (see `biome.json`).

**Trade-off**: This separation improves reusability and testability, but adds some structural overhead for very small features. For quick prototypes or small one-off pages, it is acceptable to start with a simpler structure and extract modules/features once the use case stabilizes.

## Modules vs Features Decision Guide

**When to create a Module?**
- When you need to aggregate multiple related features
- Example: module `c` aggregates cart UI, flow, and toast; a future `shipping-address` module could aggregate `saved-addresses-list`, `address-form`, `pickup-map`

**When to create an independent Feature (in `components/features/` directory)?**
- When the feature may be used by multiple modules
- Example: `cart` feature is used by module c and can be reused on other pages

**When to create a Module-specific Feature (in `modules/{module-name}/features/` directory)?**
- When the feature is only used within a specific module, and that module needs to combine multiple related features
- Example: `saved-addresses-list` would live under `modules/shipping-address/features/` if that module existed

## Linting & Constraints (Biome)

To keep the layering rules enforceable (not only by documentation), we use Biome overrides in this package:

- **components/features/**
  - **Cannot import other features**: imports from `@/components/features/*` are forbidden. Features must be composed through upper layers (e.g. modules, pages).
  - **Cannot use Redux / RTK Query directly**: imports from `react-redux`, `@reduxjs/toolkit`, `@/core/store`, and `@/apis/*` are forbidden. Use wrapped hooks (e.g. `useCart`, `useFlow`) or props instead.
  - **Own their UI props contracts**: features define their own props types (e.g. `CartSummaryProps`, `AddressListProps`) based on what the UI needs. Pages/modules are responsible for mapping API/domain data into these props, so features do not depend on API response types or any additional intermediate layer.
- **components/composed/**
  - **Can only compose atomics (plus external libs)**: imports from `@/components/composed/*`, `@/components/layout/*`, `@/components/features/*`, and `@/modules/*` are forbidden. Composed components should stay as pure UI compositions built on top of atomics.
- **modules/**
  - **Modules cannot import each other**: imports from `@/modules/*` inside `modules/**` are forbidden (except tests). Cross-module composition should happen in pages or higher-level orchestrators.

These constraints mirror the architecture decisions in this document so that violations are caught automatically during development and CI.

## Import Paths

Use `@/` as an alias for the project root directory:

```typescript
import { Button } from '@/components/atomics/button';
import { AutocompleteInput } from '@/components/composed/autocomplete';
import { CartSample } from '@/components/features/cart';
import { ModuleC } from '@/modules/c';
import { store } from '@/core/store';
// In components/features/: use wrapped hooks (e.g. useFlow, useCart), not useGetCartQuery/useSelector
import { useGetCartQuery } from '@/apis/cart';  // use only outside components/features/ (e.g. in core or a wrapper hook)
```

## Migration Plan

Current project structure:
- `core/` contains store, router, flow, toast, and error-boundary
- `components/features/` — independent features (e.g. cart, dialogs) use atomics, composed, and layout; no direct Redux
- `components/` — atomics, composed, layout, features (composed uses atomics; layout may use atomics and composed; features may use atomics, composed, and layout)
- `modules/` — aggregate features (e.g. modules a, b, c); cross-module composition is done in pages
- `utils/` — shared non-UI helpers (e.g. type guards in `utils/guards/`); no Redux, no components
