# ui-react18

React 18 compatible UI component library.

## Requirements

- **React**: `>=18.0.0`
- **React DOM**: `>=18.0.0`

## Installation

```bash
pnpm add ui-react18
# or
npm install ui-react18
# or
yarn add ui-react18
```

## Usage

```tsx
import { Button, Card } from "ui-react18";
import "ui-react18/main/style.css";

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
import { Button } from "ui-react18/Button";
import "ui-react18/Button/style.css";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
```

### Card

A card component with header, body, and footer sections.

```tsx
import { Card } from "ui-react18/Card";
import "ui-react18/Card/style.css";

<Card title="Card Title" footer="Footer">
  Card content
</Card>
```

## Hooks

All hooks in this package are compatible with React 18.x.

⚠️ **Note**: This package does not include React 19-specific hooks. Use `ui-react19` if you need React 19 features.

## Peer Dependencies

This package requires React 18.x. Make sure your project has:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## TypeScript

Full TypeScript support is included. Types are exported from the package.

```tsx
import type { ButtonProps, CardProps } from "ui-react18";
```

## Exports

- `ui-react18` - Main barrel export
- `ui-react18/Button` - Button component
- `ui-react18/Button/style.css` - Button styles
- `ui-react18/Card` - Card component
- `ui-react18/Card/style.css` - Card styles
- `ui-react18/main` - Main entry point
- `ui-react18/main/style.css` - Aggregated styles

