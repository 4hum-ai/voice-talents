# Image Component

The `Image` component is a powerful, responsive image component that provides automatic CDN transformation, responsive image generation, and extensive image manipulation options. It's built on top of Cloudflare Images for optimal performance and quality.

## Features

- **Automatic CDN Transformation**: Automatically transforms image URLs to use the configured CDN
- **Responsive Images**: Generates srcset for different pixel densities and breakpoints
- **Image Optimization**: Supports multiple formats (WebP, AVIF, JPEG, PNG) with automatic format selection
- **Extensive Transformations**: Blur, brightness, contrast, saturation, sharpening, rotation, and more
- **Preset Configurations**: Built-in presets for common use cases (thumbnail, card, hero)
- **Accessibility**: Proper alt text support and loading strategies
- **Performance**: Lazy loading and async decoding by default

## Basic Usage

```vue
<template>
  <Image src="/path/to/image.jpg" alt="Description of image" width="400" height="300" />
</template>

<script setup>
import Image from '@/components/molecules/Image.vue'
</script>
```

## Props

### Core Properties

| Prop     | Type     | Default      | Description                |
| -------- | -------- | ------------ | -------------------------- |
| `src`    | `string` | **required** | Source image URL           |
| `alt`    | `string` | -            | Alt text for accessibility |
| `width`  | `number` | -            | Image width in pixels      |
| `height` | `number` | -            | Image height in pixels     |

### Format & Quality

| Prop      | Type                                            | Default  | Description                              |
| --------- | ----------------------------------------------- | -------- | ---------------------------------------- |
| `format`  | `'webp' \| 'avif' \| 'auto' \| 'jpeg' \| 'png'` | `'auto'` | Image format (auto selects best format)  |
| `quality` | `number`                                        | `85`     | Image quality (1-100)                    |
| `dpr`     | `number`                                        | `1`      | Device pixel ratio for high-DPI displays |

### Resizing & Fitting

| Prop      | Type                                                                   | Default        | Description                        |
| --------- | ---------------------------------------------------------------------- | -------------- | ---------------------------------- |
| `fit`     | `'scale-down' \| 'contain' \| 'cover' \| 'crop' \| 'pad' \| 'squeeze'` | `'scale-down'` | Fit mode for resizing              |
| `gravity` | `'auto' \| 'face' \| 'left' \| 'right' \| 'top' \| 'bottom' \| string` | -              | Gravity for cropping               |
| `trim`    | `string \| object`                                                     | -              | Trim settings for removing borders |

### Image Effects

| Prop         | Type     | Default | Description                     |
| ------------ | -------- | ------- | ------------------------------- |
| `blur`       | `number` | -       | Blur radius (1-250)             |
| `brightness` | `number` | -       | Brightness adjustment (0.5-2.0) |
| `contrast`   | `number` | -       | Contrast adjustment (0.5-2.0)   |
| `saturation` | `number` | -       | Saturation adjustment (0-2.0)   |
| `sharpen`    | `number` | -       | Sharpening strength (0-10)      |

### Transformations

| Prop         | Type                 | Default | Description                             |
| ------------ | -------------------- | ------- | --------------------------------------- |
| `rotate`     | `90 \| 180 \| 270`   | -       | Rotation in degrees                     |
| `flip`       | `'h' \| 'v' \| 'hv'` | -       | Flip direction (horizontal/vertical)    |
| `background` | `string`             | -       | Background color for transparent images |
| `anim`       | `boolean`            | `true`  | Whether to preserve animation frames    |

### Responsive & Performance

| Prop          | Type                                          | Default    | Description                           |
| ------------- | --------------------------------------------- | ---------- | ------------------------------------- |
| `loading`     | `'lazy' \| 'eager'`                           | `'lazy'`   | Loading strategy                      |
| `decoding`    | `'async' \| 'sync' \| 'auto'`                 | `'async'`  | Decoding strategy                     |
| `breakpoints` | `ResponsiveBreakpoint[]`                      | -          | Custom responsive breakpoints         |
| `sizes`       | `string`                                      | `'100vw'`  | Sizes attribute for responsive images |
| `preset`      | `'thumbnail' \| 'card' \| 'hero' \| 'custom'` | `'custom'` | Preset for common use cases           |

### Advanced

| Prop     | Type     | Default | Description                           |
| -------- | -------- | ------- | ------------------------------------- |
| `class`  | `string` | -       | Additional CSS classes                |
| `domain` | `string` | -       | Custom CDN domain (overrides default) |

## Presets

The component includes built-in presets for common use cases:

### Thumbnail

- Small, square images
- Optimized for lists and grids
- Responsive breakpoints: 1x, 1.5x, 2x, 3x

### Card

- Medium-sized images
- Optimized for card layouts
- Responsive breakpoints: 1x, 1.5x, 2x, 3x

### Hero

- Large, high-quality images
- Optimized for hero sections
- Responsive breakpoints: 1x, 1.5x, 2x, 3x

## Examples

### Basic Image with Alt Text

```vue
<Image src="/images/hero.jpg" alt="Hero image for the main page" width="1200" height="600" />
```

### Thumbnail with Preset

```vue
<Image
  src="/images/product.jpg"
  alt="Product thumbnail"
  preset="thumbnail"
  width="200"
  height="200"
/>
```

### High-Quality Image with Effects

```vue
<Image
  src="/images/portrait.jpg"
  alt="Professional portrait"
  width="800"
  height="600"
  format="webp"
  quality="95"
  fit="cover"
  gravity="face"
  sharpen="3"
  saturation="1.1"
/>
```

### Responsive Image with Custom Breakpoints

```vue
<Image
  src="/images/banner.jpg"
  alt="Responsive banner"
  width="1200"
  height="400"
  :breakpoints="[
    { dpr: 1, width: 1200 },
    { dpr: 1.5, width: 1800 },
    { dpr: 2, width: 2400 },
  ]"
  sizes="(max-width: 768px) 100vw, 1200px"
/>
```

### Image with Custom Domain

```vue
<Image
  src="/images/special.jpg"
  alt="Special image"
  width="600"
  height="400"
  domain="cdn.example.com"
/>
```

## Responsive Images

The component automatically generates responsive images using the `srcset` attribute. When you provide a `width` prop, it creates multiple image variants for different pixel densities.

### Automatic Srcset Generation

```vue
<Image src="/images/photo.jpg" alt="Photo" width="800" height="600" />
```

This generates a srcset like:

```html
srcset=" /cdn-cgi/image/width=800,height=600,format=auto,quality=85,fit=scale-down,dpr=1/photo.jpg
1x, /cdn-cgi/image/width=800,height=600,format=auto,quality=85,fit=scale-down,dpr=1.5/photo.jpg
1.5x, /cdn-cgi/image/width=800,height=600,format=auto,quality=85,fit=scale-down,dpr=2/photo.jpg 2x,
/cdn-cgi/image/width=800,height=600,format=auto,quality=85,fit=scale-down,dpr=3/photo.jpg 3x "
```

### Custom Breakpoints

You can override the default breakpoints:

```vue
<Image
  src="/images/photo.jpg"
  alt="Photo"
  width="800"
  height="600"
  :breakpoints="[
    { dpr: 1, width: 800 },
    { dpr: 2, width: 1600 },
  ]"
/>
```

## CDN Integration

The component automatically transforms image URLs to use the configured CDN domain. This provides:

- **Automatic Optimization**: Images are served through Cloudflare Images
- **Format Selection**: Automatic WebP/AVIF conversion for supported browsers
- **Quality Optimization**: Intelligent quality settings based on format
- **Caching**: CDN-level caching for better performance

### Domain Configuration

The component uses the `getCdnDomain()` function to determine the CDN domain. You can override this with the `domain` prop for specific images.

## Performance Considerations

### Lazy Loading

Images are lazy-loaded by default (`loading="lazy"`). This improves initial page load performance.

### Async Decoding

Images use async decoding (`decoding="async"`) to prevent blocking the main thread.

### Responsive Loading

The `srcset` attribute ensures browsers only download the image size they need.

## Accessibility

### Alt Text

Always provide meaningful `alt` text for images that convey information:

```vue
<!-- Good -->
<Image src="/logo.png" alt="Company logo" />

<!-- Avoid -->
<Image src="/logo.png" alt="Image" />
```

### Loading States

For images that are critical to the user experience, consider using `loading="eager"`:

```vue
<Image src="/hero.jpg" alt="Main hero image" loading="eager" />
```

## Error Handling

The component gracefully handles various scenarios:

- **Missing Images**: Shows broken image icon with alt text
- **CDN Failures**: Falls back to original image URL
- **Invalid Props**: Ignores invalid transformation options

## Browser Support

- **Modern Browsers**: Full support for WebP, AVIF, and all transformations
- **Legacy Browsers**: Automatic fallback to JPEG/PNG
- **Responsive Images**: Supported in all modern browsers

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate presets** for common use cases
3. **Set explicit dimensions** when possible for better performance
4. **Choose appropriate quality** - 85 is usually sufficient for most use cases
5. **Use lazy loading** for images below the fold
6. **Consider responsive breakpoints** for high-DPI displays

## Troubleshooting

### Images Not Loading

- Check that the `src` URL is correct
- Verify CDN configuration
- Check browser console for errors

### Transformations Not Working

- Ensure the image format supports the transformation
- Check that transformation values are within valid ranges
- Verify CDN supports the requested transformation

### Performance Issues

- Use appropriate image dimensions
- Consider using presets for common use cases
- Enable lazy loading for non-critical images
