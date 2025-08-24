# Movie Dubie Admin UI

Internal console to manage organizations/publishers, media administration, revenues, distributions, payouts, and users.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Notes
- Auth: use Firebase; restrict access to `admin` role via custom claims
- Backend: call services via API Gateway
- Configure API URL:
  - Create `.env` in `apps/admin` with:
    ```bash
    VITE_PUBLIC_API_URL=https://<your-api-gateway-domain>
    ```
  - The app will call `${VITE_PUBLIC_API_URL}/movie/...` endpoints.
- Low-code model: mirror Studio patterns for listing modules and forms over `movie-service`

## UI Architecture (hybrid)
- Behavior and a11y: Headless primitives + Floating UI
  - `@headlessui/vue` for menus, popovers, listboxes, dialogs
  - `@floating-ui/dom` for positioning (flip/shift/offset)
- Styling: Tailwind utility classes; atomic folders: `src/components/{atoms,molecules,organisms,templates}`
- Pattern:
  - Create minimal atom wrappers that expose a simple API and enforce project tokens
  - Example: `atoms/ActionsMenu.vue` wraps Headless UI `Menu` and uses Floating UI for placement
- When to use headless primitives vs bespoke components:
  - Headless: complex a11y widgets (menus, dialogs, listbox/combobox, tooltips)
  - Bespoke: simple product-specific UI (cards, headers, banners)

### ActionsMenu usage
```vue
<ActionsMenu
  :items="[
    { key: 'check-connection', label: 'Check connection' },
    { key: 'refresh-stats', label: 'Refresh stats' }
  ]"
  size="sm"
  @select="onSelect"
/>
```
- Emits `select(key)` when an item is chosen.
- Sizes: `sm | md | lg | xl`.
- Items support optional `description` and `value` fields.

### Implementation guidance
- Prefer headless primitives for any interactive overlay or list selection.
- Use `Floating UI` with `computePosition(..., { middleware: [offset(8), flip(), shift({ padding: 8 })] })`.
- Keep wrappers small and typed; add tests for keyboard interactions where behavior is non-trivial.


