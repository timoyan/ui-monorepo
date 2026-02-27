# Project Architecture

This document describes the folder structure and organization principles of the `nextjs-pandacss-ark` project.

## Directory Structure

```
nextjs-pandacss-ark/
├── core/                    # App-level concerns
│   ├── store/              # Redux store configuration
│   ├── router/             # URL routing logic, step management
│   └── error-boundary/     # Error handling
│
├── pages/                  # Next.js pages (Pages Router)
│   ├── _app.tsx           # App entry, combines core providers
│   ├── index.tsx          # Home page
│   └── checkout.tsx       # Checkout page (combines modules/features)
│
├── modules/                # Aggregate features (Combine multi features)
│   └── shipping-address/   # Shipping address module example
│       ├── index.tsx      # Module entry
│       └── features/      # Features aggregated by this module
│           ├── saved-addresses-list/
│           ├── address-form/      # Add/edit address form
│           └── pickup-map/
│
├── components/            # Reusable UI components
│   ├── atomics/          # Base UI primitives (Button, Dialog, Accordion, Input)
│   │   ├── button/
│   │   ├── dialog/
│   │   ├── accordion/
│   │   └── input/
│   ├── composed/         # UI compositions from atomics (e.g. Autocomplete)
│   │   │                 # May use: components/atomics only
│   │   └── autocomplete/
│   ├── layout/           # Layout components (ModuleContainer, etc.)
│   │   │                 # May use: components/atomics, components/composed
│   │   └── module-container/
│   └── features/         # Independent features (can be used by multiple modules)
│       │                 # May use: components/atomics, components/layout
│       │                 # Do NOT use Redux directly; use wrapped APIs (e.g. useFlow, useCart)
│       ├── cart/
│       │   ├── CartSample.tsx
│       │   ├── __tests__/
│       │   └── index.ts
│       └── dialogs/      # CookieConfirmDialog, CurrencySwitchDialog, etc.
│
├── apis/                  # RTK Query API slices
│   ├── apiSlice.ts       # Base API slice
│   └── cart.ts           # Cart API endpoints
│
├── hooks/                 # Shared hooks
│   └── useMSWReady.ts
│
└── mocks/                 # MSW configuration (for development and testing)
    ├── handlers.ts
    ├── browser.ts
    └── server.ts
```

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
// pages/checkout.tsx
import { ShippingAddressModule } from '@/modules/shipping-address';

export default function CheckoutPage() {
  return <ShippingAddressModule />;
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
// modules/shipping-address/index.tsx
import { SavedAddressesListFeature } from './features/saved-addresses-list';
import { AddressFormFeature } from './features/address-form';
import { PickupMapFeature } from './features/pickup-map';

export function ShippingAddressModule() {
  // Use Redux to manage state shared across features (e.g., selected address)
  const selectedAddress = useSelector(selectSelectedAddress);
  
  // Use callback to handle local state (e.g., form show/hide)
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <SavedAddressesListFeature 
        onSelect={(address) => dispatch(setSelectedAddress(address))}
        onAddNew={() => setShowForm(true)}
      />
      {showForm && (
        <AddressFormFeature 
          onSave={(address) => {
            dispatch(addAddress(address));
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <PickupMapFeature />
    </>
  );
}
```

### Features (Feature-level)

**Purpose**: Independent business features that can be used by multiple modules, or as sub-features within a module

**Rule — no direct Redux in `components/features/`**: Code in the `components/features/` folder must **not** use Redux directly (no `useSelector`, `useDispatch`, or RTK Query hooks like `useGetCartQuery`). Use **wrapped APIs** provided by core or other layers instead (e.g. `useFlow`, `useCart`). This keeps features decoupled from the store and testable with plain props/mocks. This rule is also enforced by Biome (see "Linting & Constraints").

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

2. **Module-specific Features** (in `modules/{module-name}/features/` directory): Only used within that module
   ```typescript
   // modules/shipping-address/features/saved-addresses-list/index.tsx
   export function SavedAddressesListFeature({ 
     onSelect, 
     onAddNew 
   }: {
     onSelect: (address: Address) => void;
     onAddNew: () => void;
   }) {
     const addresses = useSelector(selectSavedAddresses);
     
     return (
       <ul>
         {addresses.map(address => (
           <li key={address.id} onClick={() => onSelect(address)}>
             {address.name}
           </li>
         ))}
         <button onClick={onAddNew}>Add Address</button>
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
│   └─ Examples: Cart data, user info, current step, shipping address state owned by the shipping module
│
└─ No → Does it need to be shared across multiple components?
    ├─ Yes → Callback props or Context
    │   └─ Examples: Form validation state, module internal coordination
    │
    └─ No → Local state (useState)
        └─ Examples: Input value, expand/collapse state
```

## Test Organization

Tests are placed next to the feature/component they cover（例如同層的 `__tests__` 資料夾，或 `*.test.tsx` / `*.test.ts` 檔案）。

**Scope-local test data and mocks**: Each scope (feature, module, component) must use only its own test data and mock API. Define fixtures and handlers in the test file or within the same `__tests__` folder. Do not create or import shared/generic fixture modules that are reused across scopes.

更完整的測試規範（技術棧、Redux 測試策略、MSW 使用方式、禁止 snapshot 的規則等），請參考：

- [`UNIT_TESTING.md`](./UNIT_TESTING.md)

## Naming Conventions

- **Modules**: Use descriptive names that represent aggregated functionality (e.g., `shipping-address`)
- **Features**:
  - Independent features: Use feature names (e.g., `cart`, `payment`)
  - Module-specific features: Use specific feature names (e.g., `saved-addresses-list`, `address-form`, `pickup-map`)
- **Components**: Use UI component names (e.g., `button`, `accordion`, `input`, `autocomplete`)
- **Test files**: `*.test.tsx` or `*.test.ts`

**Trade-off**: This separation improves reusability and testability, but adds some structural overhead for very small features. For quick prototypes or small one-off pages, it is acceptable to start with a simpler structure and extract modules/features once the use case stabilizes.

## Modules vs Features Decision Guide

**When to create a Module?**
- When you need to aggregate multiple related features
- Example: `shipping-address` module aggregates three features: `saved-addresses-list`, `address-form`, `pickup-map`

**When to create an independent Feature (in `components/features/` directory)?**
- When the feature may be used by multiple modules
- Example: `cart` feature may be used by checkout page, product page, and other places

**When to create a Module-specific Feature (in `modules/{module-name}/features/` directory)?**
- When the feature is only used within a specific module, and that module needs to combine multiple related features
- Example: `saved-addresses-list` is only used within the `shipping-address` module

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
import { ShippingAddressModule } from '@/modules/shipping-address';
import { store } from '@/core/store';
// In components/features/: use wrapped hooks (e.g. useFlow, useCart), not useGetCartQuery/useSelector
import { useGetCartQuery } from '@/apis/cart';  // use only outside components/features/ (e.g. in core or a wrapper hook)
```

## Migration Plan

Current project structure:
- `store/` → Will be moved to `core/store/` in the future
- `components/features/cart/` → Features live under components; features may use atomics, composed, and layout
- `components/` → atomics, composed, layout, features (composed uses atomics; layout may use atomics and composed; features may use atomics, composed, and layout)

**Note**: When migrating `store/` to `core/store/`, all import paths need to be updated.
