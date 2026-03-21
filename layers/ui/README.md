# UI Layer – Shared Components

Reusable, customizable UI components for apps that extend this layer.

## Usage

Extend in your app's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['../layers/base', '../layers/ui'],
})
```

## Required Setup

1. **Root class** – Add `class="app-root"` to your app's root element so button styles apply.
2. **Theme variables** – Define in your app's CSS (`:root` and `.dark`):

```css
:root {
  --app-accent: #059669;
  --app-accent-hover: #10b981;
  --app-surface-elevated: #f8fafc;
  --app-border: #e2e8f0;
  --app-text-muted: #64748b;
  --app-text: #0f172a;
}
.dark {
  --app-accent: #34d399;
  --app-accent-hover: #6ee7b7;
  /* ... dark theme values */
}
```

## AppBtn

Pill-shaped button with variants and sizes.

**Props:** `variant` | `size` | `plain` | `loading` | `disabled` | `block` | `customClass`

**Variants:** `primary` | `secondary` | `success` | `danger` | `ghost` | `outline`

**Sizes:** `small` | `default` | `large`

```vue
<AppBtn variant="primary" size="small">Save</AppBtn>
<AppBtn variant="secondary" custom-class="!rounded-2xl">Custom</AppBtn>
```

## AppTag

Thin wrapper around Element Plus `el-tag`. Supports all `el-tag` props (type, size, effect, etc.).

```vue
<AppTag type="success" size="small">Easy</AppTag>
```

## Customization

- **Theme:** Override `--app-*` variables in your app CSS.
- **Per-component:** Use `custom-class` on AppBtn or pass `class` via `$attrs`.
- **Fallbacks:** Layer styles include fallback values if variables are not set.
