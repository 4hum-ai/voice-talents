# Admin UI Documentation

This directory contains the auto-generated API documentation for the Admin UI composables and utilities.

## 📚 What's Documented

### Composables
- **useResourceService** - CRUD operations with reactive state management
- **useAuth** - Firebase authentication management
- **useToast** - Toast notification system
- **useTheme** - Theme switching (light/dark mode)
- **usePreference** - Local storage preferences
- **useNetwork** - Network connectivity status
- **useMedia** - Media file management

### Utilities
- **useApiGateway** - HTTP client with authentication
- **date** - Date conversion and range utilities
- **countries** - Country code and name utilities

## 🚀 How to Use

1. Open `index.html` in your browser to view the documentation
2. Use the search functionality to find specific functions or interfaces
3. Navigate through the sidebar to explore different modules
4. Click on function names to see detailed documentation with examples

## 🔄 Regenerating Documentation

To regenerate the documentation after making changes:

```bash
pnpm docs
```

Or for watch mode during development:

```bash
pnpm docs:watch
```

## 📝 Documentation Standards

All functions, interfaces, and composables are documented using JSDoc comments with:
- Detailed descriptions
- Parameter and return type documentation
- Usage examples
- Type information

## 🔗 Related Files

- **Source files**: `src/composables/` and `src/utils/`
- **Configuration**: `typedoc.json` and `tsconfig.docs.json`
- **Overview**: `docs/use-resource-service.md`
