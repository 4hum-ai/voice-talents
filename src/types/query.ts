/**
 * Query parameter types for resource service operations
 */

// Basic query operators supported by the backend
export type QueryOperator =
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "in"
  | "not-in"
  | "array-contains"
  | "array-contains-any";

// Filter structure for individual field filters
export interface QueryFilter {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

// Date range filter structure (commonly used in the admin app)
export interface DateRangeFilter {
  $between?: [string, string]; // [from, to] dates
  $gte?: string; // greater than or equal
  $lte?: string; // less than or equal
}

// Field filter that can be either a direct value or an object with operators
export type FieldFilter =
  | string
  | number
  | boolean
  | Date
  | DateRangeFilter
  | Record<string, unknown>;

// Main query parameters structure
export interface ResourceQuery {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  search?: string;
  searchField?: string;
  searchFields?: string;

  // Sorting
  sort?: string; // format: "field:direction" e.g., "createdAt:desc"

  // Filters - can be field-specific or generic
  filters?: Record<string, FieldFilter>;

  // Additional query parameters
  [key: string]: unknown;
}

// Specific query types for common operations
export interface ListQuery extends ResourceQuery {
  // Override to make pagination more explicit
  page?: number;
  limit?: number;
}

export interface SearchQuery extends ResourceQuery {
  // Override to make search required
  search: string;
  searchField?: string;
  searchFields?: string;
}

// Helper type for creating strongly-typed filters
export type TypedFilters<T> = {
  [K in keyof T]?: FieldFilter;
};

// Example usage:
// const query: ResourceQuery = {
//   page: 1,
//   limit: 20,
//   search: "movie",
//   searchField: "title",
//   sort: "createdAt:desc",
//   filters: {
//     status: "active",
//     createdAt: { $between: ["2024-01-01", "2024-12-31"] },
//     rating: { $gte: 4.0 }
//   }
// };
