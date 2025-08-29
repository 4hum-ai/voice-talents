## Admin UI

A low‑code, schema‑driven admin interface. Modules, lists, details, forms, and alternative layouts (gallery, kanban, calendar) are rendered dynamically from backend‑provided configuration.

### Features

- [x] Low‑code modules via server‑provided UI config
- [x] Table, Gallery, Kanban (drag & drop), and Calendar views
- [x] Detail view with configurable sections
- [x] Dynamic Form Sidebar with basic validation
- [x] URL‑synced search, sorting, pagination, and time filters
- [x] Firebase Authentication (email/password + OAuth providers)
- [x] Toast notifications and modern Tailwind UI

### Tech stack

- Vue 3, TypeScript, Vite
- TailwindCSS, Headless UI
- Pinia (state), Vue Router
- Firebase Auth

### Quick start

```bash
# 1) Copy environment and fill values
cp env.example .env
# 2) Install dependencies
pnpm install
# 3) Start the dev server
pnpm dev
# 4) Build for production
pnpm build
# 5) Preview production build
pnpm preview
```

### Environment variables

Defined in `.env` (see `env.example` for all keys):

- VITE_PUBLIC_API_URL: Base URL for the API gateway.
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

### How it works (low‑code flow)

- Router: `/:module` → list, `/:module/:id` → detail. A guard fetches the module registry and blocks unknown modules.
- UI config: Fetched from `GET /api/admin-ui/modules/:module/config` and used to render views and forms.
- Data: CRUD via `/api/:module` endpoints with pagination and common filters.
- Auth: Firebase client; ID token is attached as `Authorization: Bearer <token>` to API requests. Token refresh is retried on 401.

### Project structure (high‑level)

- `src/views` — Route pages
- `src/components` — Shared components, organized as atomic design pattern
- `src/composables` — Auth, theme, movie service, toast, preferences
- `src/utils` — data fetch layer and other utility composables.
- `src/stores` — Pinia stores
