# Content Library

Centralized content management system for markdown content with loading, parsing, caching, and rendering.

## Structure

```
src/lib/content/
├── composable/          # Content composables
│   ├── useContent.ts    # Main content composable
│   └── index.ts         # Re-exports
├── type/                # TypeScript types
│   └── index.ts         # All content-related types
├── component/           # Content components
│   ├── viewer/          # Viewer components
│   │   ├── ContentViewer.vue  # Modal/sidebar viewer
│   │   └── ContentRenderer.vue  # Core renderer component
│   └── index.ts         # Re-exports
├── util/                # Content utilities
│   ├── markdown.ts      # Markdown parsing utilities
│   └── index.ts         # Re-exports
├── view/                # Content view pages
│   └── ContentPage.vue  # Full page content view
├── index.ts             # Main entry point
└── README.md            # Documentation
```

## Usage

### Basic Usage with Composable

```typescript
import { useContent } from '@/lib/content'

const content = useContent({
  slug: 'terms-of-service',
  extractTitle: true,
  removeH1: true,
})

// Access reactive state
content.loading.value // boolean
content.error.value // string | null
content.html.value // string (parsed HTML)
content.markdown.value // string (raw markdown)
content.metadata.value // ContentMetadata
content.title.value // string | undefined

// Methods
content.load() // Load content
content.reload() // Reload (bypass cache)
content.clearCache() // Clear cache for this content
```

### Using ContentViewer Component

```vue
<template>
  <ContentViewer v-model:open="isOpen" slug="terms-of-service" @close="handleClose" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ContentViewer } from '@/lib/content'

const isOpen = ref(false)

const handleClose = () => {
  console.log('Content viewer closed')
}
</script>
```

### Using ContentRenderer Component

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <ContentRenderer :html="content.html.value" />
  </div>
</template>

<script setup lang="ts">
import { useContent, ContentRenderer } from '@/lib/content'

const content = useContent('privacy-policy')
const title = computed(() => content.title.value || 'Content')
</script>
```

### Using ContentPage View

```typescript
// In router configuration
import { ContentPage } from '@/lib/content'

{
  path: '/content/:slug',
  component: ContentPage,
  meta: { requiresAuth: false, layout: 'none' },
}
```

## Features

- ✅ Markdown parsing with `marked` library
- ✅ Automatic title extraction from H1
- ✅ Content caching for performance
- ✅ Frontmatter support (YAML)
- ✅ Reactive state management
- ✅ Type-safe with TypeScript
- ✅ Loading and error states
- ✅ Responsive viewer component (mobile bottom sheet, desktop sidebar)

## Components

### ContentViewer

Modal/sidebar component for displaying content in an overlay.

**Props:**

- `open: boolean` - Whether viewer is open
- `slug: string` - Content slug (filename without .md)

**Events:**

- `update:open` - Emitted when open state changes
- `close` - Emitted when viewer is closed

**Features:**

- Mobile: Bottom sheet that expands on scroll
- Desktop: Sidebar from right
- Escape key to close
- Link to open in new tab
- Body scroll lock when open

### ContentRenderer

Core component for rendering parsed markdown HTML.

**Props:**

- `html: string` - Parsed HTML content

**Features:**

- Consistent styling for markdown elements
- Accessible markup
- Responsive design

### ContentPage

Full page view for content display.

**Features:**

- Uses route params for slug
- Card layout
- Loading and error states
- Title display

## Composables

### useContent

Main composable for content management.

**Options:**

```typescript
interface UseContentOptions {
  slug: string // Content slug (required)
  cache?: boolean // Enable caching (default: true)
  basePath?: string // Content base path (default: '/content')
  extractTitle?: boolean // Extract title from H1 (default: true)
  removeH1?: boolean // Remove H1 from content (default: true)
  fetchOptions?: RequestInit // Custom fetch options
}
```

**Returns:**

```typescript
{
  state: ComputedRef<ContentState>
  loading: ComputedRef<boolean>
  error: ComputedRef<string | null>
  html: ComputedRef<string>
  markdown: ComputedRef<string>
  metadata: ComputedRef<ContentMetadata>
  title: ComputedRef<string | undefined>
  load: () => Promise<void>
  reload: () => Promise<void>
  clearCache: () => void
  clearAllCache: () => void
}
```

## Utilities

### Markdown Utilities

```typescript
import {
  parseMarkdown,
  extractTitle,
  removeH1,
  processContentHtml,
  parseFrontmatter,
  configureMarked,
} from '@/lib/content'

// Parse markdown to HTML
const html = parseMarkdown('# Hello World')

// Extract title from HTML
const title = extractTitle(html)

// Remove H1 from HTML
const htmlWithoutH1 = removeH1(html)

// Process HTML (extract title and optionally remove H1)
const { html: processed, title } = processContentHtml(html, {
  extractTitle: true,
  removeH1: true,
})

// Parse frontmatter
const { frontmatter, content } = parseFrontmatter(markdown)

// Configure marked options
configureMarked()
```

## Types

### ContentMetadata

```typescript
interface ContentMetadata {
  title?: string
  description?: string
  tags?: string[]
  lastModified?: string
  author?: string
  [key: string]: unknown
}
```

### ContentState

```typescript
interface ContentState {
  loading: boolean
  error: string | null
  html: string
  markdown: string
  metadata: ContentMetadata
}
```

### ContentDefinition

```typescript
interface ContentDefinition {
  id: string
  slug: string
  title?: string
  description?: string
  category?: string
  tags?: string[]
  requiresAuth?: boolean
  metadata?: Record<string, unknown>
}
```

## Content Files

Content files should be placed in `public/content/` directory as markdown files:

```
public/content/
├── terms-of-service.md
├── privacy-policy.md
├── agreement-template-service.md
└── ...
```

### Frontmatter Support

Content files can include YAML frontmatter:

```markdown
---
title: Terms of Service
description: Our terms and conditions
author: Legal Team
tags: legal, terms
---

# Terms of Service

Content here...
```

## Caching

Content is automatically cached after first load. To clear cache:

```typescript
import { clearContentCache } from '@/lib/content'

// Clear all cached content
clearContentCache()

// Or clear specific content
const content = useContent('terms-of-service')
content.clearCache()
```

## Examples

### Custom Content Loading

```typescript
import { useContent } from '@/lib/content'

const content = useContent({
  slug: 'custom-content',
  basePath: '/custom',
  extractTitle: false,
  cache: false,
  fetchOptions: {
    headers: {
      Authorization: 'Bearer token',
    },
  },
})
```

### Reactive Slug

```typescript
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '@/lib/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const content = useContent(slug)
```

### Conditional Loading

```typescript
import { watch } from 'vue'
import { useContent } from '@/lib/content'

const shouldLoad = ref(false)
const content = useContent({
  slug: 'terms',
})

watch(shouldLoad, (load) => {
  if (load) {
    content.load()
  }
})
```

## Migration from Old Components

### Before

```vue
<script setup>
import ContentViewer from '@/components/molecules/ContentViewer.vue'
</script>
```

### After

```vue
<script setup>
import { ContentViewer } from '@/lib/content'
</script>
```

### Before

```vue
<script setup>
import Content from '@/views/Content.vue'
</script>
```

### After

```vue
<script setup>
import { ContentPage } from '@/lib/content'
</script>
```

## Best Practices

1. **Use composable for reactive content**: Use `useContent` composable for reactive content loading
2. **Cache enabled by default**: Content is cached automatically for better performance
3. **Extract titles**: Use `extractTitle: true` to automatically extract titles from H1
4. **Remove H1 from content**: Use `removeH1: true` when displaying title separately
5. **Handle errors**: Always check `content.error.value` before rendering
6. **Loading states**: Show loading indicators while `content.loading.value` is true
7. **Type safety**: Use TypeScript types for better development experience
