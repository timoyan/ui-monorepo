# ui-react19

React 19 compatible UI component library with React 19 features support.

## Requirements

- **React**: `>=19.0.0`
- **React DOM**: `>=19.0.0`

⚠️ **Important**: This package requires React 19. Do not use with React 18 or earlier.

## Installation

```bash
pnpm add ui-react19
# or
npm install ui-react19
# or
yarn add ui-react19
```

## Usage

```tsx
import { Button, Card } from "ui-react19";
import "ui-react19/main/style.css";

function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Card title="Title">Content</Card>
    </div>
  );
}
```

## Components

### Button

A button component with multiple variants.

```tsx
import { Button } from "ui-react19/Button";
import "ui-react19/Button/style.css";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
```

### Card

A card component with header, body, and footer sections.

```tsx
import { Card } from "ui-react19/Card";
import "ui-react19/Card/style.css";

<Card title="Card Title" footer="Footer">
  Card content
</Card>
```

## Hooks

This package may include hooks that use React 19-specific features such as:
- `useActionState`
- `useOptimistic`
- `useFormStatus`
- `useFormState`

⚠️ **Note**: Hooks using React 19 features are only available in this package. Use `ui-react18` for React 18 compatibility.

### Example: React 19 Hook

```tsx
/**
 * Example hook using React 19 features
 * 
 * @requires React 19.0.0 or higher
 * @package ui-react19
 */
import { useActionState } from 'react';
import { useMyActionState } from 'ui-react19/hooks';

function MyComponent() {
  const [state, action, isPending] = useMyActionState(...);
  // ...
}
```

## Peer Dependencies

This package requires React 19.x. Make sure your project has:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## TypeScript

Full TypeScript support is included. Types are exported from the package.

```tsx
import type { ButtonProps, CardProps } from "ui-react19";
```

## Exports

- `ui-react19` - Main barrel export
- `ui-react19/Button` - Button component
- `ui-react19/Button/style.css` - Button styles
- `ui-react19/Card` - Card component
- `ui-react19/Card/style.css` - Card styles
- `ui-react19/main` - Main entry point
- `ui-react19/main/style.css` - Aggregated styles

## Migration from ui-react18

If you're migrating from `ui-react18` to `ui-react19`:

1. Update React to version 19.x
2. Replace imports: `ui-react18` → `ui-react19`
3. Check for any React 19-specific hooks or features
4. Update TypeScript types if needed

