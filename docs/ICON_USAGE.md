# Icon Usage Conventions

This document outlines the standardized approach for using icons in the Movie Dubie Studio project.

## 🎯 **Icon System Overview**

We use **unplugin-icons** with **Material Design Icons (MDI)** as our primary icon system. This approach provides:

- Consistent icon usage across all components
- Optimal performance with tree-shaking
- Type-safe icon imports
- Easy maintenance and updates

## 📦 **Dependencies**

```json
{
  "devDependencies": {
    "@iconify-json/mdi": "^1.2.3",
    "unplugin-icons": "^22.2.0"
  }
}
```

## ⚙️ **Vite Configuration**

```typescript
// vite.config.ts
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Icons({
      autoInstall: true,
      collections: ['mdi'],
    }),
  ],
})
```

## 🚀 **Icon Usage Patterns**

### ✅ **Pattern A: Direct MDI Imports (RECOMMENDED)**

**Use this approach for static icons known at build time:**

```vue
<script setup lang="ts">
import PlayIcon from '~icons/mdi/play-circle-outline'
import SearchIcon from '~icons/mdi/magnify'
import CloseIcon from '~icons/mdi/close'
import PlusIcon from '~icons/mdi/plus'
import GridIcon from '~icons/mdi/view-grid'
</script>

<template>
  <PlayIcon class="h-5 w-5 text-blue-600" />
  <SearchIcon class="h-4 w-4 text-gray-500" />
  <CloseIcon class="h-6 w-6 text-red-500" />
</template>
```

**Benefits:**

- 🚀 **Best Performance**: Static analysis and tree-shaking
- 🎯 **Type Safety**: Full TypeScript support
- 📦 **Bundle Optimization**: Icons bundled with components
- 🔍 **IntelliSense**: Auto-completion and error checking

### ⚠️ **Pattern B: Icon Component (Use Sparingly)**

**Only use for dynamic icons or runtime icon selection:**

```vue
<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'

// Dynamic icon name from props or computed
const iconName = computed(() => `mdi:${props.iconType}`)
</script>

<template>
  <Icon :name="iconName" class="h-5 w-5" />
</template>
```

**When to use:**

- Icon names come from API/database
- Conditional icon rendering based on user input
- Dynamic icon selection at runtime

**When NOT to use:**

- Static icons known at build time
- Icons used multiple times in the same component
- Performance-critical components

## 🎨 **Icon Styling Guidelines**

### **Size Classes**

Use Tailwind size classes for consistent icon sizing:

```vue
<!-- ✅ Consistent sizing -->
<PlayIcon class="h-4 w-4" />
<!-- Small -->
<SearchIcon class="h-5 w-5" />
<!-- Medium -->
<CloseIcon class="h-6 w-6" />
<!-- Large -->
```

### **Color Classes**

Use semantic Tailwind color classes:

```vue
<!-- ✅ Semantic colors -->
<SuccessIcon class="h-5 w-5 text-green-600" />
<ErrorIcon class="h-5 w-5 text-red-600" />
<WarningIcon class="h-5 w-5 text-yellow-600" />
<InfoIcon class="h-5 w-5 text-blue-600" />
```

### **Accessibility**

Always include proper accessibility attributes:

```vue
<!-- ✅ Accessible icons -->
<PlayIcon class="h-5 w-5" aria-hidden="true" />
<SearchIcon class="h-5 w-5" role="img" aria-label="Search" />
```

## 🔍 **Finding MDI Icons**

### **Iconify Collections**

Browse available MDI icons at: https://icon-sets.iconify.design/mdi/

### **Common Icon Categories**

#### **Navigation & Actions**

- `mdi:chevron-left` - Back/Previous
- `mdi:chevron-right` - Next/Forward
- `mdi:close` - Close/Remove
- `mdi:plus` - Add/Create
- `mdi:minus` - Remove/Delete

#### **Search & Filter**

- `mdi:magnify` - Search
- `mdi:filter` - Filter
- `mdi:sort` - Sort
- `mdi:view-grid` - Grid view
- `mdi:view-list` - List view

#### **Media & Content**

- `mdi:play-circle-outline` - Play
- `mdi:pause` - Pause
- `mdi:stop` - Stop
- `mdi:music-note-outline` - Audio
- `mdi:video` - Video
- `mdi:image` - Image

#### **Status & Feedback**

- `mdi:check-circle-outline` - Success
- `mdi:error-outline` - Error
- `mdi:warning-outline` - Warning
- `mdi:information-outline` - Info
- `mdi:loading` - Loading/Spinner

## ❌ **What NOT to Do**

### **Avoid Direct lucide-vue-next Imports**

```vue
<!-- ❌ DON'T DO THIS -->
import { TrendingUp } from 'lucide-vue-next'
```

### **Avoid Inline SVGs**

```vue
<!-- ❌ DON'T DO THIS -->
<svg class="h-5 w-5" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

### **Avoid Generic Icon Names**

```vue
<!-- ❌ DON'T DO THIS -->
<Icon name="play" />
<!-- Missing collection prefix -->
```

## 🔄 **Migration Guide**

### **From lucide-vue-next to MDI**

```vue
<!-- Before -->
import { TrendingUp } from 'lucide-vue-next'

<!-- After -->
import TrendingUpIcon from '~icons/mdi/trending-up'
```

### **From Inline SVG to MDI**

```vue
<!-- Before -->
<svg class="h-5 w-5" viewBox="0 0 24 24">
  <path d="M12 6.75a.75.75 0 01.75.75..." />
</svg>

<!-- After -->
import PlusIcon from '~icons/mdi/plus'
<PlusIcon class="h-5 w-5" />
```

## 🧪 **Testing Icons**

### **Component Testing**

```typescript
// ✅ Test icon rendering
import { mount } from '@vue/test-utils'
import PlayIcon from '~icons/mdi/play-circle-outline'

const wrapper = mount(PlayIcon)
expect(wrapper.exists()).toBe(true)
```

### **Icon Props Testing**

```typescript
// ✅ Test icon component with dynamic names
const wrapper = mount(Icon, {
  props: { name: 'mdi:play' },
})
expect(wrapper.exists()).toBe(true)
```

## 📚 **Examples by Component Type**

### **Button Icons**

```vue
<IconButton aria-label="Add item" @click="addItem">
  <PlusIcon class="h-4 w-4" />
</IconButton>
```

### **Form Icons**

```vue
<div class="relative">
  <SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <input class="pl-10" />
</div>
```

### **Status Icons**

```vue
<div class="flex items-center gap-2">
  <SuccessIcon class="h-5 w-5 text-green-600" />
  <span>Operation completed successfully</span>
</div>
```

## 🚨 **Troubleshooting**

### **Icon Not Loading**

1. Check if icon name exists in MDI collection
2. Verify import path: `~icons/mdi/icon-name`
3. Ensure Vite configuration includes MDI collection

### **Build Errors**

1. Verify all icon imports are valid
2. Check for typos in icon names
3. Ensure unplugin-icons is properly configured

### **Performance Issues**

1. Use direct imports instead of Icon component for static icons
2. Avoid importing unused icons
3. Check bundle size with build analysis tools

## 📖 **Additional Resources**

- [Material Design Icons](https://materialdesignicons.com/)
- [Iconify Collections](https://icon-sets.iconify.design/)
- [unplugin-icons Documentation](https://github.com/antfu/unplugin-icons)
- [Vue 3 Icon Best Practices](https://vuejs.org/guide/best-practices/performance.html)

---

**Remember**: Always prefer **Pattern A (Direct MDI Imports)** for static icons, and only use the Icon component when you need dynamic icon selection at runtime.
