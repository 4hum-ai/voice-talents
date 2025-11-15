# Media Library

Centralized media player system with CDN support for audio and video playback.

## Structure

```
src/lib/media/
├── composable/          # Media composables
│   ├── useCdn.ts        # CDN URL transformation
│   └── index.ts         # Re-exports
├── component/           # Media player components
│   ├── AudioPlayer.vue  # Audio player component
│   ├── VideoPlayer.vue  # Video player component
│   └── index.ts         # Re-exports
├── type/                # TypeScript types
│   └── index.ts         # All media-related types
├── index.ts             # Main entry point
└── README.md            # Documentation
```

## Usage

### Audio Player

```vue
<template>
  <AudioPlayer
    :url="audioUrl"
    title="My Audio Track"
    mode="inline"
    :autoplay="false"
    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { AudioPlayer } from '@/lib/media'
</script>
```

### Video Player

```vue
<template>
  <VideoPlayer
    :url="videoUrl"
    title="My Video"
    :subtitle-url="subtitleUrl"
    :audio-tracks="audioTracks"
    :selected-audio-id="selectedAudioId"
    mode="inline"
    @close="onClose"
    @audio-track-change="onAudioTrackChange"
  />
</template>

<script setup lang="ts">
import { VideoPlayer } from '@/lib/media'
</script>
```

### CDN Composable

```typescript
import { useCdn } from '@/lib/media'

const { getCdnUrl, domain, enabled } = useCdn()

// Transform URL to use CDN
const cdnUrl = getCdnUrl('https://example.com/video.mp4')
```

## Features

### Audio Player

- ✅ Play/pause controls
- ✅ Progress bar with seeking
- ✅ Volume control
- ✅ Time display
- ✅ Format detection (MP3, WAV, AAC, FLAC)
- ✅ Keyboard shortcuts (Space, Arrow keys)
- ✅ CDN support
- ✅ Inline and minimal modes

### Video Player

- ✅ Full video playback controls
- ✅ HLS streaming support
- ✅ Multiple audio track switching
- ✅ Subtitle support
- ✅ Picture-in-picture mode
- ✅ Fullscreen mode
- ✅ Volume and mute controls
- ✅ Progress seeking
- ✅ Keyboard shortcuts
- ✅ CDN support
- ✅ Modal and inline modes

### CDN Support

- ✅ Automatic URL transformation
- ✅ Environment-based configuration
- ✅ Enable/disable toggle
- ✅ Domain configuration

## API

### AudioPlayer Props

```typescript
interface Props {
  url: string // Audio file URL
  title?: string // Display title
  mode?: 'inline' | 'minimal' // Display mode
  autoplay?: boolean // Auto-play on load
  loop?: boolean // Loop playback
  preload?: 'none' | 'metadata' | 'auto'
}
```

### AudioPlayer Events

- `play` - Emitted when playback starts
- `pause` - Emitted when playback pauses
- `ended` - Emitted when playback ends
- `error` - Emitted on playback error (with error message)
- `close` - Emitted when close button is clicked (inline mode)

### VideoPlayer Props

```typescript
interface Props {
  url: string // Video file URL
  title?: string // Display title
  subtitleUrl?: string // Subtitle track URL
  audioTracks?: Array<{
    // Available audio tracks
    id: string
    label: string
    lang?: string
    url?: string
  }>
  selectedAudioId?: string // Initially selected audio track
  mode: 'modal' | 'inline' // Display mode
}
```

### VideoPlayer Events

- `close` - Emitted when close button is clicked (modal mode)
- `audio-track-change` - Emitted when audio track changes (with trackId)

### useCdn()

Returns an object with:

- `domain: string | undefined` - CDN domain from environment
- `enabled: boolean` - Whether CDN is enabled
- `getCdnUrl(sourceUrl: string): string` - Transform URL to use CDN
- `getCdnDomain(): string | undefined` - Get CDN domain

## Keyboard Shortcuts

### Audio Player

- `Space` - Play/pause
- `Arrow Left` - Seek backward 10 seconds
- `Arrow Right` - Seek forward 10 seconds

### Video Player

- `Space` - Play/pause
- `Arrow Left` - Seek backward 10 seconds
- `Arrow Right` - Seek forward 10 seconds
- `M` - Toggle mute
- `F` - Toggle fullscreen
- `P` - Toggle picture-in-picture

## Configuration

### CDN Configuration

Set environment variables:

```env
VITE_CLOUDFLARE_DOMAIN=your-cdn-domain.com
VITE_ENABLE_CDN=true
```

## Examples

### Basic Audio Playback

```vue
<template>
  <AudioPlayer :url="audioFile.url" :title="audioFile.name" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AudioPlayer } from '@/lib/media'

const audioFile = ref({
  url: 'https://example.com/audio.mp3',
  name: 'Sample Audio',
})
</script>
```

### Video with Multiple Audio Tracks

```vue
<template>
  <VideoPlayer
    :url="videoUrl"
    :audio-tracks="audioTracks"
    :selected-audio-id="selectedTrack"
    mode="inline"
    @audio-track-change="selectedTrack = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoPlayer } from '@/lib/media'

const videoUrl = ref('https://example.com/video.m3u8')
const selectedTrack = ref('en')

const audioTracks = ref([
  { id: 'en', label: 'English', lang: 'en' },
  { id: 'es', label: 'Spanish', lang: 'es' },
])
</script>
```

### Using CDN for Custom URLs

```typescript
import { useCdn } from '@/lib/media'

const { getCdnUrl } = useCdn()

// Transform any URL to use CDN
const mediaUrl = 'https://storage.googleapis.com/bucket/file.mp4'
const cdnUrl = getCdnUrl(mediaUrl)
```

## Migration from Old Components

### Before

```vue
<script setup>
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import { useCdn } from '@/composables/useCdn'
</script>
```

### After

```vue
<script setup>
import { AudioPlayer, VideoPlayer, useCdn } from '@/lib/media'
</script>
```
