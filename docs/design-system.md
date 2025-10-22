# Design System

The Design System page (`/admin/design`) provides an interactive playground for reviewing and testing all atomic and molecular components in your admin UI.

## Overview

This page serves as a comprehensive component library similar to Storybook or other design system tools, allowing developers and designers to:

- **Review Components**: See all available components in one place
- **Test Props**: Interactively modify component properties in real-time
- **View Examples**: See different variations and use cases
- **Live Preview**: Test components with actual data and interactions

## Navigation

The Design System is organized into three main sections:

### 1. Atoms

Basic building blocks that can't be broken down further:

- **Avatar**: User profile pictures with fallback support
- **IconButton**: Icon-only buttons with various styles
- **Card**: Container for grouping related content
- **FormInput**: Form input fields with different types
- **SearchInput**: Search input with debounced handling

### 2. Molecules

Components composed of multiple atoms:

- **AppBar**: Application header with navigation
- **Image**: Cloudflare-optimized image component
- **Pagination**: Page navigation for large datasets
- **FilterSidebar**: Collapsible filtering sidebar

### 3. Templates

Complex page layouts and patterns:

- **TableTemplate**: Data table with sorting and pagination

## Using the Design System

### Component Sections

Each component has three tabs:

1. **Examples**: Pre-built examples showing different use cases
2. **Props**: Interactive controls to modify component properties
3. **Live Preview**: Real-time preview of the component with your settings

### Interactive Props

Most components include interactive controls for:

- **Text inputs**: Modify labels, placeholders, and values
- **Select dropdowns**: Choose from predefined options
- **Number inputs**: Adjust dimensions, counts, and limits
- **Checkboxes**: Toggle boolean properties
- **Range sliders**: Fine-tune numeric values

### Real-time Updates

All changes to props are reflected immediately in the Live Preview tab, making it easy to:

- Test different component states
- Verify responsive behavior
- Check accessibility features
- Validate prop combinations

## Development Workflow

### Adding New Components

1. **Create the component** in the appropriate directory (`atoms/`, `molecules/`, or `templates/`)
2. **Add to Design.vue** with examples, props controls, and live preview
3. **Test thoroughly** using the interactive controls
4. **Document usage** in this file

### Component Structure

Each component section should include:

```vue
<ComponentSection
  title="Component Name"
  description="Brief description of what the component does"
  component="ComponentName"
>
  <template #examples>
    <!-- Show different variations -->
  </template>
  
  <template #props>
    <!-- Interactive controls -->
  </template>
  
  <template #live>
    <!-- Live preview with current props -->
  </template>
</ComponentSection>
```

### Best Practices

- **Examples**: Show 3-4 different use cases
- **Props**: Include all major configurable properties
- **Live Preview**: Make it easy to see changes
- **Documentation**: Clear descriptions and usage notes
- **Accessibility**: Test with screen readers and keyboard navigation

## Access

The Design System is available at `/admin/design` and requires authentication. It's accessible from the Dashboard via the "Design System" card.

## Benefits

- **Developer Experience**: Quick component reference and testing
- **Design Consistency**: Visual verification of component variations
- **Quality Assurance**: Interactive testing of edge cases
- **Documentation**: Living documentation of your component library
- **Onboarding**: New team members can explore components interactively

## Keyboard Shortcuts

The application includes comprehensive keyboard shortcut support to improve user experience and accessibility.

### Button Component Shortcuts

The `Button` component supports keyboard shortcuts through the `shortcut` prop:

```vue
<Button shortcut="Escape" @click="handleCancel">Cancel</Button>
<Button shortcut="Enter" @click="handleSubmit">Submit</Button>
<Button shortcut="Ctrl+S" @click="handleSave">Save</Button>
```

### Supported Shortcut Formats

- **Single Keys**: `Escape`, `Enter`, `Space`
- **Letter Keys**: `s`, `c`, `d` (case-insensitive)
- **Modifier Combinations**: `Ctrl+S`, `Alt+Enter`, `Shift+Escape`

### Visual Indicators

Buttons automatically display keyboard shortcuts in their labels when the `showShortcut` prop is enabled (default: true):

```vue
<!-- Shows "Cancel (Esc)" -->
<Button shortcut="Escape">Cancel</Button>

<!-- Shows "Save (Ctrl+S)" -->
<Button shortcut="Ctrl+S">Save</Button>
```

### Common Shortcut Patterns

#### Cancel Actions

```vue
<Button variant="outline" shortcut="Escape" @click="handleCancel">
  Cancel
</Button>
```

#### Submit Actions

```vue
<Button type="submit" shortcut="Enter" @click="handleSubmit">
  Submit
</Button>
```

#### Save Actions

```vue
<Button shortcut="Ctrl+S" @click="handleSave">
  Save Draft
</Button>
```

### Implementation Guidelines

1. **Consistency**: Use the same shortcuts across similar actions
   - `Escape` for all cancel/close actions
   - `Enter` for all submit/confirm actions
   - `Ctrl+S` for save actions

2. **Accessibility**: Always provide visual indicators for shortcuts
3. **Conflict Prevention**: Avoid conflicts with browser shortcuts
4. **User Feedback**: Ensure shortcuts work as expected and provide feedback

### Component Integration

Keyboard shortcuts are automatically handled by the Button component and don't require additional event listeners. The shortcuts work when the button is focused or when the shortcut is pressed globally (depending on the context).

## Future Enhancements

Potential improvements to consider:

- **Code Snippets**: Show the actual Vue code for each example
- **Accessibility Testing**: Built-in a11y validation
- **Performance Metrics**: Component render times and bundle sizes
- **Theme Switching**: Test components in different color schemes
- **Responsive Testing**: View components at different screen sizes
- **Export Examples**: Generate code snippets for documentation
- **Keyboard Shortcut Testing**: Interactive testing of keyboard shortcuts in the design system
