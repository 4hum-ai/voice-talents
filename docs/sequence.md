### Gallery view: change "Sorted by" sequence

This documents what happens when the user changes the sort option in the Gallery view.

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant G as GalleryView.vue
  participant T as ItemListTemplate.vue
  participant V as ItemListView.vue
  participant R as Vue Router
  participant W as watchDebounced
  participant S as useMovieService
  participant B as Movie Service API

  U->>G: Selects new sort (e.g., title:asc)
  G->>T: emit('sort', field, direction)
  T->>V: emit('sort', field, direction)
  Note over V: onSort does not fetch
  V->>R: router.replace({ query: { ... , sort: "field:dir", page: "1" } })
  R-->>V: route.query updated
  V->>W: canonicalQueryString changed
  W-->>V: Debounce (120ms), then invoke load(1)
  Note over V: Abort previous request if any
  V->>S: listModuleItems(module, { page, limit, sort, search, filters })
  S->>S: Serialize params with bracket notation (filters[...], pagination[...])
  S->>B: GET /api/{module}?sort=...&filters[...]=...&page=1&limit=...
  B-->>S: 200 { data, pagination }
  S-->>V: Parsed JSON
  V->>V: Update items, pagination, error state
  V->>G: Re-render with new sorted data
```

Key notes
- onSort only updates the URL; fetching is centralized via a debounced watcher on a canonical query string.
- The debounced watcher coalesces rapid changes and triggers a single load(1).
- Request building uses backend-style query params (e.g., `filters[dateField][$between]`).
- In-flight requests are aborted before a new fetch to avoid races.
- Pagination resets to page 1 on sort change.

Error handling
- Network or server errors are caught; the error message is surfaced in the view.
- Non-JSON responses are guarded in `useMovieService.request` with helpful diagnostics.

Extensibility
- To add additional filters, write them to the URL in backend format; the canonical watcher will fetch.
- To adjust debounce behavior, tune the `watchDebounced` timing in `ItemListView.vue`.


