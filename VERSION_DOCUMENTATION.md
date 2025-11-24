# Version Requirements Documentation Guide

This document outlines best practices for documenting React version requirements in this monorepo.

## Documentation Levels

### 1. Package.json (Enforcement)

**Purpose**: Enforce version requirements at install time

**Location**: `packages/ui-react18/package.json` and `packages/ui-react19/package.json`

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

**Benefits**:
- Package managers (pnpm/npm/yarn) will warn users if wrong version is installed
- Prevents accidental installation with incompatible React versions
- Clear version requirements visible in package registry

### 2. README Files (User Documentation)

**Purpose**: Inform users about version requirements before installation

**Locations**:
- `packages/ui-react18/README.md`
- `packages/ui-react19/README.md`
- Root `README.md`

**Key Sections**:
```markdown
## Requirements

- **React**: `>=18.0.0`
- **React DOM**: `>=18.0.0`

⚠️ **Important**: This package requires React 18. Do not use with React 19.
```

### 3. JSDoc Comments (Code Documentation)

**Purpose**: Document version requirements directly in code for IDE tooltips and documentation generation

**Example**:
```typescript
/**
 * Custom hook using React 19 features.
 * 
 * **Version Requirements:**
 * - Requires React 19.0.0 or higher
 * - Only available in `ui-react19` package
 * 
 * @requires React >=19.0.0
 * @package ui-react19
 * 
 * @example
 * ```tsx
 * import { useMyHook } from 'ui-react19/hooks';
 * ```
 */
export function useMyHook() {
  // Implementation
}
```

**JSDoc Tags to Use**:
- `@requires` - Minimum version required
- `@package` - Which package contains this code
- `@since` - Version when feature was added
- `@throws` - What errors occur with wrong version

### 4. TypeScript Types (Type Safety)

**Purpose**: Provide type-level documentation and catch errors at compile time

**Example**:
```typescript
/**
 * @requires React >=19.0.0
 * @package ui-react19
 */
export interface React19HookReturn {
  state: State;
  action: Action;
  isPending: boolean;
}
```

### 5. Inline Comments (Implementation Details)

**Purpose**: Document version-specific code sections

**Example**:
```typescript
// React 19 only - uses useActionState hook
// This will not work in React 18
const [state, action] = useActionState(...);
```

## Documentation Checklist

When creating a new hook or component:

- [ ] Add peer dependencies to `package.json`
- [ ] Update package README with version requirements
- [ ] Add JSDoc comments with `@requires` and `@package` tags
- [ ] Include usage examples showing correct React version
- [ ] Add warnings for wrong version usage
- [ ] Document in main README if it's a major feature

## Examples

### React 18 Hook Documentation

```typescript
/**
 * Hook compatible with React 18.x
 * 
 * @package ui-react18
 * @requires React >=18.0.0
 */
export function useReact18Hook() {
  // React 18 compatible code
}
```

### React 19 Hook Documentation

```typescript
/**
 * Hook using React 19's useActionState.
 * 
 * ⚠️ **Requires React 19.0.0 or higher**
 * 
 * @package ui-react19
 * @requires React >=19.0.0
 * 
 * @example
 * ```tsx
 * // Only works with React 19
 * import { useActionState } from 'react';
 * ```
 */
export function useReact19Hook() {
  // React 19 only code
}
```

## Package Structure

```
packages/
  ui-react18/
    README.md              # Version requirements
    package.json           # Peer dependencies
    src/
      ui/
        hooks/
          useHook.ts       # JSDoc comments
  ui-react19/
    README.md              # Version requirements
    package.json           # Peer dependencies
    src/
      ui/
        hooks/
          useHook.ts       # JSDoc comments
```

## Version Detection

If you need runtime version detection:

```typescript
/**
 * Checks if React 19 is available.
 * 
 * @returns true if React 19 is available
 */
export function isReact19Available(): boolean {
  try {
    const reactVersion = require("react").version;
    const majorVersion = parseInt(reactVersion.split(".")[0], 10);
    return majorVersion >= 19;
  } catch {
    return false;
  }
}
```

## Common Mistakes to Avoid

1. ❌ **Don't** put React 19 hooks in `ui-react18` package
2. ❌ **Don't** forget to update peer dependencies
3. ❌ **Don't** skip JSDoc comments
4. ❌ **Don't** mix packages in the same project
5. ✅ **Do** document version requirements clearly
6. ✅ **Do** use peer dependencies for enforcement
7. ✅ **Do** provide examples in documentation

## Tools for Documentation

- **JSDoc**: Generate documentation from comments
- **TypeDoc**: TypeScript documentation generator
- **package.json**: Peer dependencies enforcement
- **README.md**: User-facing documentation

