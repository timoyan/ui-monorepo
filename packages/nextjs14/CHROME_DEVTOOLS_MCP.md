# Using Chrome DevTools MCP with Next.js 14

This guide explains how to use Chrome DevTools MCP (Model Context Protocol) tools to interact with and debug your Next.js 14 application.

## What is Chrome DevTools MCP?

Chrome DevTools MCP provides browser automation and debugging capabilities through Cursor's MCP integration. It allows you to:
- Navigate to your Next.js app
- Take screenshots
- Inspect page elements
- Interact with the page (click, type, fill forms)
- Check console messages and network requests
- Debug issues programmatically

## Prerequisites

1. **Start your Next.js 14 development server:**
   ```bash
   pnpm --filter nextjs14 dev
   ```
   This will start the app on `http://localhost:3000` (default Next.js port).

2. **Ensure the browser MCP extension is available in Cursor** (it should be available by default).

## Available Browser MCP Tools

### Navigation
- `browser_navigate` - Navigate to a URL
- `browser_navigate_back` - Go back to previous page
- `browser_resize` - Resize browser window

### Inspection
- `browser_snapshot` - Get accessibility snapshot of the page
- `browser_take_screenshot` - Capture screenshot (PNG/JPEG)
- `browser_console_messages` - Get console messages
- `browser_network_requests` - Get network request logs

### Interaction
- `browser_click` - Click elements
- `browser_type` - Type text into inputs
- `browser_fill_form` - Fill multiple form fields
- `browser_select_option` - Select dropdown options
- `browser_hover` - Hover over elements
- `browser_drag` - Drag and drop

### Utilities
- `browser_wait_for` - Wait for text/elements to appear
- `browser_evaluate` - Execute JavaScript on the page
- `browser_handle_dialog` - Handle alerts/confirms
- `browser_tabs` - Manage browser tabs

## Example Usage

### 1. Navigate to Your App and Take a Screenshot

```typescript
// In Cursor, you can ask:
// "Navigate to http://localhost:3000 and take a screenshot"
```

The MCP tools will:
1. Navigate to `http://localhost:3000`
2. Wait for the page to load
3. Take a screenshot

### 2. Inspect Page Elements

```typescript
// "Get a snapshot of the page at http://localhost:3000"
```

This returns an accessibility snapshot showing all interactive elements.

### 3. Interact with Components

```typescript
// "Click the Primary button on the page"
// "Fill a form with test data"
// "Check console for errors"
```

### 4. Debug Issues

```typescript
// "Navigate to localhost:3000, check console messages, and take a screenshot"
// "Get network requests from the page"
```

## Practical Workflow

### Testing Your Next.js 14 App

1. **Start the dev server:**
   ```bash
   pnpm --filter nextjs14 dev
   ```

2. **In Cursor, use natural language to interact:**
   - "Navigate to http://localhost:3000 and show me what's on the page"
   - "Take a screenshot of the Next.js app"
   - "Click the Primary button and check for console errors"
   - "Inspect the Card component on the page"

### Example: Automated Testing Flow

You can use MCP tools to:
1. Navigate to your app
2. Verify elements are present
3. Interact with buttons/components
4. Check for console errors
5. Verify network requests
6. Take screenshots for visual regression

## Integration with Your Current Setup

Your Next.js 14 app (`packages/nextjs14`) already has:
- Button components from `ui-react18`
- Card components from `ui-react18`
- A simple page at `/` (index.tsx)

You can use MCP tools to:
- Test button interactions
- Verify card rendering
- Check CSS loading
- Debug any runtime issues

## Tips

1. **Always start your dev server first** - MCP tools need a running application
2. **Use snapshots for accessibility** - `browser_snapshot` is better than screenshots for understanding page structure
3. **Check console messages** - Use `browser_console_messages` to debug JavaScript errors
4. **Monitor network requests** - Use `browser_network_requests` to verify API calls and resource loading
5. **Wait for elements** - Use `browser_wait_for` if elements load asynchronously

## Troubleshooting

- **Connection refused**: Make sure your Next.js dev server is running
- **Elements not found**: The page might not be fully loaded; use `browser_wait_for`
- **Port conflicts**: If port 3000 is in use, Next.js will use 3001, 3002, etc.

## Next Steps

You can extend this by:
- Creating automated test scripts using MCP tools
- Setting up visual regression testing
- Monitoring performance metrics
- Debugging production builds locally

