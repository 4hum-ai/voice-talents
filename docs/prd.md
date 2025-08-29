## Product Requirements Document (PRD) — Movie Dubie Admin UI

### 1) Overview

The Admin UI is a low‑code, schema‑driven Vue 3 application for managing backend data. It renders list/detail/forms and alternative layouts (gallery, kanban, calendar, table) from local json files or server‑provided UI configuration.

Primary users are internal operators and admins who need efficient CRUD, filtering, workflow changes, and media operations.

### 2) Goals and Non‑Goals

- Goals
  - Provide a fast, low‑code admin for core entities using server‑driven UI configs
  - Support multiple data presentation modes: table, gallery, kanban, calendar
  - Enable robust list querying: pagination, sorting, search, time windows, filters
  - Provide reliable CRUD with optimistic UX and clear error surfacing via toasts

- Non‑Goals
  - Public customer‑facing features (separate apps)
  - Complex role‑based authorization (planned; see Open Questions)


### 3) Personas

- Studio Operator: triages content, updates statuses, edits metadata, manages relationships
- Admin: manages users and organizations, configures modules, audits data quality
- Engineer: extends modules declaratively, observes logs, validates API contracts


### 4) Frontend Functional Requirements

- Routing
  - `/:module` renders list; `/:module/:id` renders detail
  - Route guard initializes auth and sets document title; unknown modules are tolerated but UI config drives rendering

- Authentication
  - Firebase authentication: email/password + OAuth providers
  - Admin UI attaches `Authorization: Bearer <idToken>` to each request
  - On 401, client retries once after token refresh

- List Views
  - Table view with sortable columns, pagination, and server‑side filtering
  - Gallery view with load‑more pagination
  - Kanban view with drag‑drop status updates via `groupByField`
  - Calendar view with date‑based windowing (query window managed by query builder)
  - Filters, search, sort, pagination are reflected in URL and debounced
  - Active filter chips shown; individual and bulk clear supported

- Detail View
  - Fetches item and UI config; supports Update/Delete via service
  - Navigates back preserving list state

- Error Handling
  - Network errors surfaced via `useToast.push(...)`
  - Non‑JSON responses raise actionable hints about incorrect base URL


### 5) Query & Filtering Contract (canonical)

- Pagination: `page`, `limit` or `pagination[page]`, `pagination[pageSize]`
- Sort: `sort=field:asc|desc` (first entry used if multiple)
- Search: `search` with scope narrowed by `searchFields=name,email`
- Filters (mapped in backend):
  - Equality: `filters[status]=active` (alias of `$eq`)
  - Operators: `$ne,$gt,$gte,$lt,$lte,$in,$notIn,$between,$null,$notNull`
  - Date values accept ISO or `YYYY-MM-DD`

### 6) Non‑Functional Requirements

- Performance
  - Backend list endpoints must stream/limit results appropriately and return `pagination.hasMore`
  - Admin UI should debounce query changes (already implemented) and cancel in‑flight requests

- Security
  - Client sends Firebase ID tokens
  - Backend auth middleware is planned (see Open Questions); once enabled, validate tokens and map user claims to permissions


