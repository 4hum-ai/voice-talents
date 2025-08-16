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


