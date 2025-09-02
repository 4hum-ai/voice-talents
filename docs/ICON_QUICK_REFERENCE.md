# Icon Usage - Quick Reference

## 🚀 **Quick Start**

### **Import Icons**
```vue
import PlayIcon from '~icons/mdi/play-circle-outline'
import SearchIcon from '~icons/mdi/magnify'
import CloseIcon from '~icons/mdi/close'
```

### **Use Icons**
```vue
<PlayIcon class="h-5 w-5 text-blue-600" />
<SearchIcon class="h-4 w-4 text-gray-500" />
<CloseIcon class="h-6 w-6 text-red-500" />
```

## 📋 **Common Icons**

| Icon | Import | Usage |
|------|--------|-------|
| Plus | `~icons/mdi/plus` | Add/Create buttons |
| Close | `~icons/mdi/close` | Close/Remove buttons |
| Search | `~icons/mdi/magnify` | Search inputs |
| Play | `~icons/mdi/play-circle-outline` | Media controls |
| Back | `~icons/mdi/chevron-left` | Navigation |
| Grid | `~icons/mdi/view-grid` | Layout toggles |
| Success | `~icons/mdi/check-circle-outline` | Success states |
| Error | `~icons/mdi/error-outline` | Error states |

## ⚡ **Performance Rules**

1. **✅ Use Direct Imports** for static icons
2. **❌ Avoid Icon Component** for static icons
3. **❌ No Inline SVGs**
4. **❌ No lucide-vue-next imports**

## 🎨 **Styling**

```vue
<!-- Sizes -->
<Icon class="h-4 w-4" />    <!-- Small -->
<Icon class="h-5 w-5" />    <!-- Medium -->
<Icon class="h-6 w-6" />    <!-- Large -->

<!-- Colors -->
<Icon class="text-green-600" />  <!-- Success -->
<Icon class="text-red-600" />    <!-- Error -->
<Icon class="text-blue-600" />   <!-- Info -->
<Icon class="text-gray-500" />   <!-- Muted -->
```

## 🔍 **Find Icons**

Browse: https://icon-sets.iconify.design/mdi/

---

**Full Documentation**: See `ICON_USAGE.md` for detailed guidelines.
