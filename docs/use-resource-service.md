# useResourceService

The `useResourceService` composable is a powerful data management solution that provides CRUD operations, loading states, error handling, and reactive data management for any API resource.

## 📚 Documentation

This composable is fully documented with JSDoc comments. For the complete API reference with examples, see the generated documentation or view the inline comments in the source file.

**Source:** `src/composables/useResourceService.ts`

## 🚀 Quick Start

```typescript
import { useResourceService } from "@/composables/useResourceService";

// Create a service instance
const api = useResourceService();

// Load data
await api.list("titles", { page: 1, limit: 20 });

// Access reactive data
console.log(api.items.value); // Array of items
console.log(api.pagination.value); // Pagination info
console.log(api.isLoading.value); // Loading state
```

## ✨ Key Features

- **CRUD Operations**: Create, Read, Update, Delete with automatic reactive updates
- **Loading States**: Track operation progress with granular control
- **Error Handling**: Built-in error state management
- **Reactive Data**: Automatic UI updates when data changes
- **Pagination**: Built-in pagination support
- **Search & Filtering**: Comprehensive query building and execution
- **Type Safety**: Full TypeScript support with generics

## 📖 Usage Examples

### Basic List with Search

```vue
<template>
  <div>
    <!-- Loading state -->
    <div v-if="api.isOperationLoading('list:titles')">Loading titles...</div>

    <!-- Error state -->
    <div v-if="api.hasError" class="error">
      {{ api.error }}
    </div>

    <!-- Results -->
    <div v-if="api.hasItems">
      <div v-for="title in api.items" :key="title.id">
        {{ title.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceService } from "@/composables/useResourceService";

const api = useResourceService();

// Load initial data
api.list("titles", { page: 1, limit: 20 });
</script>
```

### CRUD Operations

```typescript
// Create
const newTitle = await api.create("titles", {
  title: "New Movie",
  description: "A great movie",
});

// Read
const title = await api.getById("titles", "123");

// Update
const updated = await api.update("titles", "123", {
  title: "Updated Title",
});

// Delete
await api.remove("titles", "123");
```

## 🔧 API Overview

### Methods

- `list(resource, query?, signal?)` - Fetch paginated list
- `getById(resource, id, signal?)` - Fetch single item
- `create(resource, body, signal?)` - Create new item
- `update(resource, id, body, signal?)` - Update existing item
- `remove(resource, id, signal?)` - Delete item

### Reactive Data

- `items` - Array of items from list operations
- `item` - Single item from getById operations
- `pagination` - Pagination information
- `error` - Current error message

### Loading States

- `isLoading` - Boolean indicating if any operation is loading
- `isOperationLoading(operation)` - Check specific operation loading state

### Computed Helpers

- `hasItems` - Boolean indicating if there are items
- `isEmpty` - Boolean indicating if no items and not loading
- `hasError` - Boolean indicating if there's an error

### Utility Methods

- `clearError()` - Clear current error
- `clearData()` - Reset all data to initial state

## 📋 Supported Resources

Currently supported resource types:

- `"titles"`
- `"organizations"`
- Custom string values (for other resources)

## 🛠️ Development

### Generating Documentation

To generate documentation from the JSDoc comments:

```bash
# Using TypeDoc
npx typedoc src/composables/useResourceService.ts

# Using JSDoc
npx jsdoc src/composables/useResourceService.ts
```

### TypeScript Support

The composable supports TypeScript generics for type safety:

```typescript
interface Title {
  id: string;
  title: string;
  description: string;
  year: number;
}

const api = useResourceService<Title>();
```

## 📝 Notes

- All operations automatically update reactive data
- Loading states are tracked per operation
- Error handling is built-in with automatic error state management
- The service integrates with the global event bus for CRUD notifications
- AbortController support for request cancellation

For complete API documentation with examples, see the JSDoc comments in the source file.
