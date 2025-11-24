# Version Requirements Documentation Guide

This guide shows how to document version requirements for hooks and components.

## JSDoc Comments

Use comprehensive JSDoc comments to document version requirements:

```typescript
/**
 * Hook description.
 * 
 * **Version Requirements:**
 * - Requires React 18.0.0 or higher
 * - Compatible with React 18.x
 * 
 * @package ui-react18
 * @requires React >=18.0.0
 */
export function useMyHook() {
  // Implementation
}
```

## Package.json Documentation

Always include peer dependencies in `package.json`:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

## README Documentation

Include version requirements in package README:

```markdown
## Requirements

- **React**: `>=18.0.0`
- **React DOM**: `>=18.0.0`
```

## Code Comments

Add inline comments for version-specific code:

```typescript
// React 18 compatible implementation
// This hook works with React 18.x
export function useFeature() {
  // Uses only React 18 APIs
}
```

## TypeScript Types

Document version requirements in TypeScript:

```typescript
/**
 * @requires React >=18.0.0
 * @package ui-react18
 */
export interface HookReturn {
  // Types
}
```

