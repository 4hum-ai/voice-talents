# ItemDetailTemplate Enhanced Slot System

The `ItemDetailTemplate` component now supports a comprehensive slot system that allows for advanced customization while maintaining backward compatibility.

## Overview

The enhanced slot system provides granular control over every aspect of the detail view, from the app bar to individual sections. This allows custom views to:

- Override individual sections without replacing everything
- Add custom sections in specific locations
- Control section visibility and ordering
- Customize the entire layout when needed
- Maintain consistency with the base template when desired

## Slot Reference

### App Bar Slots

#### `app-bar-title`

Customize the app bar title content.

**Props:**

- `item` - The current item data
- `title` - The computed title string

**Example:**

```vue
<template #app-bar-title="{ item, title }">
  <div class="flex items-center gap-3">
    <div class="h-3 w-3 rounded-full" :class="getStatusColor(item?.status)" />
    <span>{{ title }}</span>
  </div>
</template>
```

#### `app-bar-subtitle`

Customize the app bar subtitle content.

**Props:**

- `item` - The current item data
- `subtitle` - The computed subtitle string

#### `app-bar-actions`

Replace the default action buttons in the app bar.

**Props:**

- `item` - The current item data
- `enableEdit` - Whether edit is enabled
- `actionMenuItems` - Array of action menu items
- `handlers` - Object with edit and action menu handlers

**Example:**

```vue
<template #app-bar-actions="{ item, enableEdit, handlers }">
  <div class="flex items-center gap-2">
    <button
      v-if="item?.status === 'draft'"
      class="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
      @click="handlePublish"
    >
      Publish
    </button>
    <button
      v-if="enableEdit"
      class="bg-primary-600 hover:bg-primary-700 rounded-md px-3 py-2 text-sm font-medium text-white"
      @click="handlers.edit"
    >
      Edit
    </button>
  </div>
</template>
```

### Navigation Slots

#### `navigation`

Replace the entire navigation section (including breadcrumbs).

**Props:**

- `item` - The current item data
- `breadcrumbs` - Array of breadcrumb items
- `handlers` - Object with navigation handlers

#### `breadcrumbs`

Customize just the breadcrumb navigation.

**Props:**

- `items` - Array of breadcrumb items

**Example:**

```vue
<template #breadcrumbs="{ items }">
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <router-link v-if="item.to" :to="item.to" class="text-gray-500 hover:text-gray-700">
          {{ item.label }}
        </router-link>
        <span v-else class="font-medium text-gray-900">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
```

### Content Area Slots

#### `loading`

Customize the loading state display.

**Props:**

- `loading` - Loading state boolean
- `detailSections` - Array of detail sections
- `item` - The current item data

**Example:**

```vue
<template #loading="{ loading, detailSections }">
  <div v-if="loading" class="space-y-6">
    <div class="animate-pulse">
      <div class="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
      <div class="space-y-3">
        <div class="h-4 rounded bg-gray-200"></div>
        <div class="h-4 w-5/6 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
</template>
```

#### `error`

Customize the error state display.

**Props:**

- `error` - Error message string
- `item` - The current item data
- `handlers` - Object with retry handler

#### `empty-state`

Customize the empty state when no data is available.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object

#### `details`

Replace the main details content area.

**Props:**

- `item` - The current item data
- `detailSections` - Array of detail sections
- `displayPairs` - Key-value pairs for fallback display
- `handlers` - Object with reference click handler

**Example:**

```vue
<template #details="{ item, detailSections, handlers }">
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Main content -->
    <div class="space-y-6 lg:col-span-2">
      <!-- Your custom details layout -->
    </div>
    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Your custom sidebar content -->
    </div>
  </div>
</template>
```

#### `details-header`

Add content above the main details section.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object
- `handlers` - Object with edit and delete handlers

#### `details-footer`

Add content below the main details section.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object
- `handlers` - Object with edit and delete handlers

### Section Slots

#### `related-items`

Replace the entire related items section.

**Props:**

- `item` - The current item data
- `relatedItems` - Array of related items
- `relatedItemsLoading` - Loading state for related items
- `relatedItemsError` - Error state for related items
- `relatedItemsEmpty` - Empty state for related items
- `groupedByResourceType` - Related items grouped by resource type
- `handlers` - Object with related item click handler

#### `related-items-header`

Customize the related items section header.

**Props:**

- `item` - The current item data
- `relatedItemsCount` - Number of related items

#### `related-items-content`

Customize the related items list content.

**Props:**

- `item` - The current item data
- `relatedItems` - Array of related items
- `relatedItemsLoading` - Loading state for related items
- `relatedItemsError` - Error state for related items
- `relatedItemsEmpty` - Empty state for related items
- `groupedByResourceType` - Related items grouped by resource type
- `handlers` - Object with related item click handler

#### `metadata`

Add additional metadata section.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object

#### `actions`

Add custom action buttons section.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object
- `handlers` - Object with edit and delete handlers

### Layout Slots

#### `sidebar`

Replace the entire sidebar area.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object
- `handlers` - Object with edit and delete handlers

#### `sidebar-header`

Customize the sidebar header.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object

#### `sidebar-content`

Customize the sidebar main content.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object

#### `sidebar-footer`

Customize the sidebar footer.

**Props:**

- `item` - The current item data
- `resourceName` - Name of the resource
- `uiConfig` - UI configuration object

## New Props

### `hideDefaultSections`

Array of section names to hide from the default template.

**Type:** `string[]`
**Default:** `[]`

**Available sections:**

- `navigation` - Hide breadcrumb navigation
- `related-items` - Hide related items section

**Example:**

```vue
<ItemDetailTemplate
  :hide-default-sections="['related-items']"
  <!-- other props -->
/>
```

### `customLayout`

Enable full custom layout mode (experimental).

**Type:** `boolean`
**Default:** `false`

### `sectionOrder`

Control the order of sections (experimental).

**Type:** `string[]`
**Default:** `[]`

## Backward Compatibility

The enhanced slot system is fully backward compatible. Existing usage will continue to work without changes:

- The original `title`, `subtitle`, and `details` slots are still supported
- All existing props and events remain unchanged
- Default behavior is preserved when slots are not provided

## Migration Guide

### From Basic to Enhanced Slots

**Before:**

```vue
<ItemDetailTemplate>
  <template #title>
    Custom Title
  </template>
</ItemDetailTemplate>
```

**After (enhanced):**

```vue
<ItemDetailTemplate>
  <template #app-bar-title="{ item, title }">
    <div class="flex items-center gap-2">
      <StatusIndicator :status="item?.status" />
      <span>{{ title }}</span>
    </div>
  </template>
</ItemDetailTemplate>
```

### Hiding Default Sections

```vue
<ItemDetailTemplate :hide-default-sections="['related-items']">
  <!-- Your custom related items implementation -->
  <template #related-items="{ item, relatedItems, handlers }">
    <!-- Custom related items display -->
  </template>
</ItemDetailTemplate>
```

## Best Practices

1. **Use specific slots** when you only need to customize part of a section
2. **Leverage slot props** to access data and handlers instead of duplicating logic
3. **Maintain consistency** with the design system when customizing
4. **Test thoroughly** when using multiple custom slots together
5. **Consider performance** when implementing complex custom layouts

## Examples

See `src/views/CustomItemDetailView.vue` for a comprehensive example demonstrating all the enhanced slot capabilities.
