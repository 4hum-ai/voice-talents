# useResourceService Guide

The `useResourceService` composable is a powerful data management solution that provides CRUD operations, loading states, error handling, and reactive data management for any API resource.

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Loading States](#loading-states)
- [Error Handling](#error-handling)
- [Reactive Data](#reactive-data)
- [CRUD Operations](#crud-operations)
- [Search and Filtering](#search-and-filtering)
- [Pagination](#pagination)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

`useResourceService` provides a complete data management solution with:

- **CRUD Operations**: Create, Read, Update, Delete
- **Loading States**: Track operation progress
- **Error Handling**: Built-in error management
- **Reactive Data**: Automatic UI updates
- **Pagination**: Built-in pagination support
- **Search & Filtering**: Query building and execution

## Basic Usage

```typescript
import { useResourceService } from "@/composables/useResourceService";

// Create a service instance for a specific resource
const api = useResourceService("movie/api");

// Load data
await api.list("titles", { page: 1, limit: 20 });

// Access reactive data
console.log(api.items.value); // Array of items
console.log(api.pagination.value); // Pagination info
console.log(api.isLoading.value); // Loading state
```

## API Reference

### Constructor

```typescript
useResourceService(base?: string)
```

**Parameters:**

- `base` (optional): API base path, defaults to `"movie/api"`

**Returns:** Resource service instance with methods and reactive data

### Methods

#### `list(resource, query?, signal?)`

Fetch a paginated list of items.

```typescript
const result = await api.list("titles", {
  page: 1,
  limit: 20,
  search: "search term",
  sort: "title:asc",
});
```

#### `getById(resource, id, signal?)`

Fetch a single item by ID.

```typescript
const item = await api.getById("titles", "123");
```

#### `create(resource, body, signal?)`

Create a new item.

```typescript
const newItem = await api.create("titles", {
  title: "New Title",
  description: "Description",
});
```

#### `update(resource, id, body, signal?)`

Update an existing item.

```typescript
const updatedItem = await api.update("titles", "123", {
  title: "Updated Title",
});
```

#### `remove(resource, id, signal?)`

Delete an item.

```typescript
await api.remove("titles", "123");
```

### Reactive Data

#### `items`

Array of items from list operations.

```typescript
const titles = api.items.value; // Array of title objects
```

#### `item`

Single item from getById operations.

```typescript
const currentTitle = api.item.value; // Single title object or null
```

#### `pagination`

Pagination information.

```typescript
const { page, limit, total, totalPages } = api.pagination.value;
```

#### `error`

Current error message.

```typescript
const errorMessage = api.error.value; // String or null
```

### Loading States

#### `isLoading`

Boolean indicating if any operation is loading.

```typescript
const anyLoading = api.isLoading.value;
```

#### `isOperationLoading(operation)`

Check if a specific operation is loading.

```typescript
const isSearching = api.isOperationLoading("list:titles");
const isCreating = api.isOperationLoading("create:titles");
const isUpdating = api.isOperationLoading("update:titles:123");
```

### Computed Helpers

#### `hasItems`

Boolean indicating if there are items.

```typescript
const hasData = api.hasItems.value;
```

#### `isEmpty`

Boolean indicating if no items and not loading.

```typescript
const noData = api.isEmpty.value;
```

#### `hasError`

Boolean indicating if there's an error.

```typescript
const hasError = api.hasError.value;
```

### Utility Methods

#### `clearError()`

Clear the current error.

```typescript
api.clearError();
```

#### `clearData()`

Reset all data to initial state.

```typescript
api.clearData();
```

## Loading States

The service automatically tracks loading states for all operations:

```vue
<template>
  <div>
    <!-- Global loading indicator -->
    <div v-if="api.isLoading" class="loading-overlay">Loading...</div>

    <!-- Operation-specific loading -->
    <div v-if="api.isOperationLoading('list:titles')">Loading titles...</div>

    <div v-if="api.isOperationLoading('create:titles')">Creating title...</div>

    <!-- Content -->
    <div v-if="!api.isLoading">
      <!-- Your content here -->
    </div>
  </div>
</template>
```

### Operation Identifiers

Each operation has a unique identifier:

- `list:resource` - List/search operations
- `get:resource:id` - Get single item
- `create:resource` - Create new item
- `update:resource:id` - Update existing item
- `delete:resource:id` - Delete item

## Error Handling

The service provides built-in error handling:

```vue
<template>
  <div>
    <!-- Error display -->
    <div v-if="api.hasError" class="error-message">
      {{ api.error }}
      <button @click="api.clearError()">Dismiss</button>
    </div>

    <!-- Content -->
    <div v-if="!api.hasError">
      <!-- Your content here -->
    </div>
  </div>
</template>
```

## Reactive Data

The service automatically updates reactive data:

```vue
<template>
  <div>
    <!-- Items list -->
    <div v-for="title in api.items" :key="title.id">
      {{ title.name }}
    </div>

    <!-- Single item -->
    <div v-if="api.item">
      <h1>{{ api.item.title }}</h1>
      <p>{{ api.item.description }}</p>
    </div>

    <!-- Pagination info -->
    <div>
      Page {{ api.pagination.page }} of {{ api.pagination.totalPages }} ({{
        api.pagination.total
      }}
      total items)
    </div>
  </div>
</template>
```

## CRUD Operations

### Create

```typescript
async function createTitle() {
  try {
    const newTitle = await api.create("titles", {
      title: "New Movie",
      description: "A great movie",
      year: 2024,
    });

    // items.value is automatically updated with the new item
    console.log("Created:", newTitle);
  } catch (error) {
    // error.value is automatically set
    console.error("Create failed:", api.error.value);
  }
}
```

### Read

```typescript
// List items
async function loadTitles() {
  await api.list("titles", { page: 1, limit: 20 });
  // items.value is automatically populated
}

// Get single item
async function loadTitle(id: string) {
  await api.getById("titles", id);
  // item.value is automatically populated
}
```

### Update

```typescript
async function updateTitle(id: string) {
  try {
    const updated = await api.update("titles", id, {
      title: "Updated Title",
    });

    // Both item.value and items.value are automatically updated
    console.log("Updated:", updated);
  } catch (error) {
    console.error("Update failed:", api.error.value);
  }
}
```

### Delete

```typescript
async function deleteTitle(id: string) {
  try {
    await api.remove("titles", id);

    // Item is automatically removed from items.value
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Delete failed:", api.error.value);
  }
}
```

## Search and Filtering

The service supports comprehensive search and filtering:

```typescript
// Basic search
await api.list("titles", {
  search: "action movie",
  page: 1,
  limit: 20,
});

// Advanced filtering
await api.list("titles", {
  search: "action",
  searchFields: ["title", "description"],
  filters: {
    year: 2024,
    genre: "action",
    rating: { $gte: 7 },
  },
  sort: "title:asc",
  page: 1,
  limit: 20,
});

// Date range filtering
await api.list("titles", {
  from: new Date("2024-01-01"),
  to: new Date("2024-12-31"),
  filters: {
    status: "published",
  },
});
```

## Pagination

Built-in pagination support:

```typescript
// Load first page
await api.list("titles", { page: 1, limit: 20 });

// Load next page
await api.list("titles", {
  page: api.pagination.value.page + 1,
  limit: 20,
});

// Check pagination info
const { page, totalPages, total } = api.pagination.value;
const hasNextPage = page < totalPages;
const hasPrevPage = page > 1;
```

## Advanced Patterns

### Multiple Resource Instances

```typescript
// Different instances for different resources
const titlesApi = useResourceService("movie/api");
const usersApi = useResourceService("movie/api");

// Each has its own state
const titles = titlesApi.items;
const users = usersApi.items;
```

### Abort Controller for Cancellation

```typescript
let abortController: AbortController;

async function searchTitles(query: string) {
  // Cancel previous request
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();

  try {
    await api.list(
      "titles",
      {
        search: query,
        page: 1,
        limit: 20,
      },
      abortController.signal,
    );
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request cancelled");
    }
  }
}
```

### Preset Queries

```typescript
const presets = {
  recent: { sort: "createdAt:desc", limit: 10 },
  popular: { sort: "rating:desc", limit: 20 },
  upcoming: { filters: { status: "upcoming" } },
};

async function loadPreset(presetName: keyof typeof presets) {
  await api.list("titles", presets[presetName]);
}
```

## Best Practices

### 1. Use TypeScript for Better Type Safety

```typescript
interface Title {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
}

// Type the service
const api = useResourceService<Title>("movie/api");
```

### 2. Handle Loading States Properly

```vue
<template>
  <div>
    <!-- Show loading state -->
    <div v-if="api.isOperationLoading('list:titles')" class="loading">
      Loading titles...
    </div>

    <!-- Show empty state -->
    <div v-else-if="api.isEmpty" class="empty">No titles found</div>

    <!-- Show content -->
    <div v-else>
      <div v-for="title in api.items" :key="title.id">
        {{ title.title }}
      </div>
    </div>
  </div>
</template>
```

### 3. Clear Data When Component Unmounts

```typescript
import { onUnmounted } from "vue";

onUnmounted(() => {
  api.clearData();
});
```

### 4. Use Error Boundaries

```vue
<template>
  <div>
    <!-- Error display -->
    <div v-if="api.hasError" class="error-boundary">
      <h3>Something went wrong</h3>
      <p>{{ api.error }}</p>
      <button @click="retry">Retry</button>
      <button @click="api.clearError()">Dismiss</button>
    </div>

    <!-- Normal content -->
    <div v-else>
      <!-- Your content -->
    </div>
  </div>
</template>
```

### 5. Optimize for Performance

```typescript
// Use debounced search
import { debounce } from "lodash-es";

const debouncedSearch = debounce(async (query: string) => {
  await api.list("titles", { search: query, page: 1, limit: 20 });
}, 300);

// Use in input handler
function onSearchInput(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  debouncedSearch(query);
}
```

## Examples

### Complete List Component

```vue
<template>
  <div class="titles-list">
    <!-- Search -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Search titles..."
        class="search-input"
      />
    </div>

    <!-- Loading -->
    <div v-if="api.isOperationLoading('list:titles')" class="loading">
      <Spinner />
      Loading titles...
    </div>

    <!-- Error -->
    <div v-else-if="api.hasError" class="error">
      <Alert type="error">
        {{ api.error }}
        <button @click="retry">Retry</button>
      </Alert>
    </div>

    <!-- Empty -->
    <div v-else-if="api.isEmpty" class="empty">
      <EmptyState message="No titles found" />
    </div>

    <!-- Results -->
    <div v-else class="results">
      <div v-for="title in api.items" :key="title.id" class="title-card">
        <h3>{{ title.title }}</h3>
        <p>{{ title.description }}</p>
        <div class="meta">
          <span>{{ title.year }}</span>
          <span>Rating: {{ title.rating }}/10</span>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current="api.pagination.page"
        :total="api.pagination.totalPages"
        :total-items="api.pagination.total"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useResourceService } from "@/composables/useResourceService";
import { debounce } from "lodash-es";

interface Title {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
}

const api = useResourceService<Title>("movie/api");
const searchQuery = ref("");

// Debounced search
const debouncedSearch = debounce(async (query: string) => {
  await api.list("titles", {
    search: query,
    page: 1,
    limit: 20,
  });
}, 300);

// Event handlers
function onSearch() {
  debouncedSearch(searchQuery.value);
}

function onPageChange(page: number) {
  api.list("titles", {
    search: searchQuery.value,
    page,
    limit: 20,
  });
}

function retry() {
  api.clearError();
  onSearch();
}

// Load initial data
onMounted(() => {
  api.list("titles", { page: 1, limit: 20 });
});
</script>
```

### Detail View Component

```vue
<template>
  <div class="title-detail">
    <!-- Loading -->
    <div v-if="api.isOperationLoading(`get:titles:${id}`)" class="loading">
      <Spinner />
      Loading title details...
    </div>

    <!-- Error -->
    <div v-else-if="api.hasError" class="error">
      <Alert type="error">
        {{ api.error }}
        <button @click="retry">Retry</button>
      </Alert>
    </div>

    <!-- Content -->
    <div v-else-if="api.item" class="content">
      <h1>{{ api.item.title }}</h1>
      <p>{{ api.item.description }}</p>

      <div class="meta">
        <span>Year: {{ api.item.year }}</span>
        <span>Rating: {{ api.item.rating }}/10</span>
      </div>

      <!-- Edit form -->
      <button @click="showEditForm = true">Edit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useResourceService } from "@/composables/useResourceService";

interface Title {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
}

const props = defineProps<{ id: string }>();
const api = useResourceService<Title>("movie/api");
const showEditForm = ref(false);

function retry() {
  api.clearError();
  api.getById("titles", props.id);
}

onMounted(() => {
  api.getById("titles", props.id);
});
</script>
```

This guide covers all the essential features and patterns for using the `useResourceService` composable effectively. The service provides a complete data management solution that reduces boilerplate and provides a consistent API across your application.
