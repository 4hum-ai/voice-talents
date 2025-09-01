# Query Types Documentation

This directory contains TypeScript type definitions for query parameters used throughout the admin application.

## Files

- `query.ts` - Query parameter types for resource service operations
- `ui-config.ts` - UI configuration types
- `events.ts` - Event bus types
- `toast.ts` - Toast notification types

## Query Types Overview

The `query.ts` file provides strongly-typed interfaces for querying resources through the API. These types ensure consistency and provide better developer experience with TypeScript.

### Main Types

#### `ResourceQuery`

The main interface for query parameters:

```typescript
interface ResourceQuery {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  search?: string;
  searchField?: string;
  searchFields?: string;

  // Sorting
  sort?: string; // format: "field:direction"

  // Filters
  filters?: Record<string, FieldFilter>;

  // Additional parameters
  [key: string]: any;
}
```

#### `FieldFilter`

Represents different types of field filters:

```typescript
type FieldFilter =
  | string
  | number
  | boolean
  | Date
  | DateRangeFilter
  | Record<string, any>;
```

#### `DateRangeFilter`

Special filter for date ranges:

```typescript
interface DateRangeFilter {
  $between?: [string, string]; // [from, to]
  $gte?: string; // greater than or equal
  $lte?: string; // less than or equal
}
```

### Usage Examples

#### Basic List Query

```typescript
import type { ResourceQuery } from "@/types/query";

const query: ResourceQuery = {
  page: 1,
  limit: 20,
  sort: "createdAt:desc",
};
```

#### Search with Filters

```typescript
const searchQuery: ResourceQuery = {
  search: "movie",
  searchField: "title",
  page: 1,
  limit: 10,
  filters: {
    status: "active",
    rating: { $gte: 4.0 },
    genre: "action",
  },
};
```

#### Date Range Filtering

```typescript
const dateQuery: ResourceQuery = {
  page: 1,
  limit: 50,
  filters: {
    createdAt: {
      $between: ["2024-01-01", "2024-12-31"],
    },
  },
};
```

### Integration with Resource Service

The `useResourceService` composable now uses these types:

```typescript
import { useResourceService } from "@/composables/useResourceService";
import type { ResourceQuery } from "@/types/query";

const { list } = useResourceService();

// TypeScript will now provide autocomplete and validation
const result = await list("titles", {
  page: 1,
  limit: 20,
  search: "spider",
  filters: {
    status: "active",
    rating: { $gte: 4.0 },
  },
});
```

### Integration with Query Builder

The `useQueryBuilder` composable also uses these types for consistency:

```typescript
import { useQueryBuilder } from "@/composables/useQueryBuilder";
import type { FieldFilter } from "@/types/query";

const { setFilters } = useQueryBuilder({
  resource: () => "titles",
  uiConfig: () => uiConfig,
});

// TypeScript validates the filter structure
setFilters({
  status: "active",
  rating: { $gte: 4.0 },
});
```

### Strongly-Typed Filters

For entity-specific filtering, you can use the `TypedFilters` utility type:

```typescript
interface Movie {
  id: string;
  title: string;
  rating: number;
  status: "draft" | "published" | "archived";
  releaseDate: string;
  genre: string[];
}

const movieFilters: TypedFilters<Movie> = {
  title: "Spider-Man",
  rating: { $gte: 4.0 },
  status: "published",
};
```

## Benefits

1. **Type Safety**: Prevents runtime errors by catching type mismatches at compile time
2. **IntelliSense**: Provides autocomplete and documentation in IDEs
3. **Consistency**: Ensures all query parameters follow the same structure
4. **Maintainability**: Makes it easier to refactor and update query structures
5. **Documentation**: Serves as living documentation for the query API

## Migration

If you're updating existing code, simply replace `Record<string, any>` with `ResourceQuery` for query parameters:

```typescript
// Before
const list = async (resource: string, query?: Record<string, any>) => { ... }

// After
const list = async (resource: string, query?: ResourceQuery) => { ... }
```

See `examples/query-usage.ts` for more detailed examples.
