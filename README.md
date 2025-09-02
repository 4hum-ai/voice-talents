## Movie Dubie Studio

A studio for movies localization using Voice AI technologies.

### Tech stack

- Vue 3, TypeScript, Vite
- TailwindCSS, Headless UI
- Pinia (state), Vue Router
- Firebase Auth

### Development Guidelines

- **Icons**: Use Material Design Icons (MDI) via unplugin-icons. See [Icon Usage Guide](docs/ICON_USAGE.md) for conventions.
- **Styling**: Tailwind CSS classes only
- **State Management**: Pinia stores
- **API**: Use composables and services, not direct fetch calls

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
