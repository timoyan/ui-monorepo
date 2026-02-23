# Centralized Toast

Toast messages are controlled by a **single toaster instance** (`core/toast`). One `<AppToaster />` is rendered in `_app.tsx`, so all toasts show in one place (placement, duration, max count are configured in `createToaster.ts`).

**External usage must go through `useToast()` only.** Do not import `toast` or `toaster` from `@/core/toast` in app code; use the hook and then call `toast.*` or `registerAndToast` from its return value.

## Show / hide

- **Show**: Call `toast.*` from the object returned by `useToast()`, or use `registerAndToast()` for registry-backed toasts. Toasts auto-dismiss by duration (configurable per call).
- **Hide**: `toast.dismiss(id)` from `useToast()` return value, or close button in the toast UI.

## Usage

### 1. From components (event handlers)

Use `useToast()` and call `toast.*` in handlers.

```tsx
import { useToast } from "@/core/toast";

function SaveButton() {
  const { toast } = useToast();
  const handleSave = () => {
    saveData();
    toast.success({ title: "Saved", description: "Your changes have been saved." });
  };
  return <button onClick={handleSave}>Save</button>;
}
```

### 2. From components (useEffect / useLayoutEffect)

Use `useToast()` and defer the toast call with `queueMicrotask` to avoid React `flushSync` warnings:

```tsx
import { useToast } from "@/core/toast";

function MyComponent() {
  const { toast } = useToast();
  useEffect(() => {
    queueMicrotask(() => {
      toast.success({ title: "Loaded", description: "Data ready." });
    });
  }, []);
  return <div />;
}
```

### 3. From hooks

Use `useToast()` and call `toast.*` or `registerAndToast` from the return value.

```tsx
import { useToast } from "@/core/toast";

function useSubmit() {
  const { toast } = useToast();
  const submit = async () => {
    try {
      await api.post(...);
      toast.success({ title: "Done" });
    } catch {
      toast.error({ title: "Failed", description: "Please try again." });
    }
  };
  return { submit };
}
```

### 4. From Redux middleware

Middleware runs outside React and cannot use `useToast()`. The store’s toast middleware imports the toast API from the internal module `@/core/toast/toastApi` to show toasts on specific actions (e.g. cart remove). For new middleware that needs toasts, keep using that internal import; app components must still use `useToast()` only.

## API (from `useToast()`)

`useToast()` returns `{ toast, registerAndToast }`:

- **`toast.create(options)`** – Generic toast (optional `type`: `"info" | "warning" | "success" | "error"`).
- **`toast.success(options)`** – Success toast.
- **`toast.error(options)`** – Error toast.
- **`toast.info(options)`** – Info toast (via create with type).
- **`toast.warning(options)`** – Warning toast (via create with type).
- **`toast.dismiss(id)`** – Dismiss a toast by id.
- **`registerAndToast(content, options?)`** – Register content, show toast, and by default unregister when dismissed (see registry section).

Options typically include `title`, `description`, and optionally `duration` (ms; default from toaster config).

### Plain text

Toast renders `title` and `description` from options as **plain text only**. The toast layer does **not** parse HTML strings. For icons, custom styles, or HTML, use the **registry** or `registerAndToast` (see below).

```tsx
const { toast } = useToast();
toast.success({
  title: "Added to cart",
  description: "Sample Product has been added.",
});
```

### Custom content via registry (contentKey) — icons / styles / HTML

The registry is **global scope**: register entries (e.g. at module load or in `_app`) **before** showing toasts; the Toaster looks up by `meta.contentKey` when rendering.

Use the registry to supply **icons**, **styled UI**, or **HTML**. To show HTML in the description, render it **in the registry entry yourself** (e.g. `<span dangerouslySetInnerHTML={{ __html: safeHtml }} />` or a small component). The toast layer does **not** interpret HTML strings.

1. **Register an entry** (e.g. in `toastContentRegistry.tsx` or in your feature module):

```tsx
import { registerToastContent } from "@/components/ui/toast";

// At module load or in _app so it runs before any toast
registerToastContent("success-save", {
  title: "Saved",
  description: "Your changes have been saved.",
  icon: <CheckIcon />,
});

// HTML example: render in the registry entry, not as a string
registerToastContent("success-html", {
  title: "Done",
  description: <span dangerouslySetInnerHTML={{ __html: "You can use <strong>bold</strong> here." }} />,
});
```

2. **Call toast with only a string in meta** (no React in state):

```tsx
import { useToast } from "@/core/toast";

const { toast } = useToast();
toast.success({
  title: "Saved",   // fallback if registry has no title
  description: "Done.",
  meta: { contentKey: "success-save" },
});
```

3. The **Toaster** reads from the global registry by `toast.meta?.contentKey` and renders `config.icon`, `config.title ?? toast.title`, `config.description ?? toast.description`. Components live in the registry (React scope), not in Zag.js state.

### Dynamic content and cleanup (avoid memory leaks)

For **static** content (e.g. `"success-save"`, `"error-auth"`), register once and leave entries in the registry. Do **not** set `unregisterOnDismiss`.

For **dynamic** content, use **`registerAndToast()`** so the entry is unregistered when the toast is dismissed:

```tsx
const { registerAndToast } = useToast();

registerAndToast(
  {
    title: "Added to cart",
    description: <span dangerouslySetInnerHTML={{ __html: productName }} />,
  },
  { type: "success", unregisterOnDismiss: true },
);
// When the toast is dismissed, the Toaster automatically unregisters the contentKey.
```

You can still call **`unregisterToastContent(key)`** yourself if needed. For **plain dynamic text** (no HTML), prefer passing `title`/`description` as strings in toast options instead of the registry — no cleanup needed.

### No React elements in toast options

Do **not** pass React elements in `title`, `description`, or `meta` (except the string `meta.contentKey`). Zag.js stores options in its state machine; React 19 can throw **`'run' called with illegal receiver`**. Use **plain strings** or the **contentKey registry** for custom UI.

For advanced use (e.g. custom ids, update), use **`toaster`** from `@/core/toast` directly; it exposes the full Ark UI toaster API.
