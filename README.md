# 🎙️ VoiceTalents.AI - AI Native Voice Talent Platform

VoiceTalents.AI is a modern AI native voice talent platform that connects professional voice talents with clients seeking high-quality talents for their projects. Whether you're a voice talent looking to showcase your skills or a client searching for the perfect voice, our platform provides the tools and marketplace you need.

## 👥 For Voice Talents

Showcase your voice acting skills, find casting opportunities, and grow your career with professional clients.

### Key Features:
- **Browse Casting Calls** - Discover new opportunities that match your skills and interests
- **Manage Your Portfolio** - Showcase your best work with professional portfolio management
- **Track Your Projects** - Monitor project progress and manage your workflow
- **Professional Growth** - Connect with industry professionals and expand your network

## 🏢 For Clients

Find the perfect voice talent for your projects, manage campaigns, and collaborate with professional voice actors.

### Key Features:
- **Post Job Opportunities** - Create detailed casting calls to attract the right talent
- **Browse Talent Profiles** - Discover voice actors with the perfect voice for your project
- **Manage Your Projects** - Track project progress and collaborate with your chosen talent
- **Campaign Management** - Organize and manage multiple voice projects efficiently

## 🚀 Getting Started

### For Voice Talents
1. Sign up and create your professional profile
2. Upload your voice samples and portfolio
3. Browse available casting calls
4. Apply to projects that match your skills
5. Manage your projects and track progress

### For Clients
1. Create your client account
2. Post your first job opportunity
3. Browse and review talent profiles
4. Select the perfect voice for your project
5. Collaborate and manage your projects

## 🛠️ Tech Stack

- **Frontend**: Vue 3, TypeScript, Vite
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Material Design Icons (MDI) via unplugin-icons

## 🏗️ Development Guidelines

- **Icons**: Use Material Design Icons (MDI) via unplugin-icons. See [Icon Usage Guide](docs/ICON_USAGE.md) for conventions.
- **Styling**: Tailwind CSS classes only
- **State Management**: Pinia stores
- **API**: Use composables and services, not direct fetch calls
- **Architecture**: Follow atomic design principles (atoms → molecules → organisms → templates)

## ⚡ Quick Start

```bash
# 1) Copy environment and fill values
cp env.example .env

# 2) Install dependencies
pnpm install

# 3) Start the dev server
pnpm dev

# 4) Build for production
pnpm build

# 5) Preview production build
pnpm preview
```

## 🔧 Environment Variables

Defined in `.env` (see `env.example` for all keys):

### API Configuration
- `VITE_PUBLIC_API_URL`: Base URL for the API gateway.

### Authentication Provider
- `VITE_AUTH_PROVIDER`: Choose authentication provider (`firebase` or `gis`)

### Firebase Authentication (when VITE_AUTH_PROVIDER=firebase)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Google Identity Services (when VITE_AUTH_PROVIDER=gis)
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID from Google Cloud Console

## 📚 Documentation

- [Authentication Guide](docs/authentication.md)
- [Design System](docs/design-system.md)
- [Icon Usage Guide](docs/ICON_USAGE.md)
- [Image Component](docs/image-component.md)
- [Event Bus](docs/event-bus.md)

## 📄 License

© 2025 AI For Humanity Labs Inc. All rights reserved.