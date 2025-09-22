# Temporary Switch to Firebase Auth

Since the Google Identity Services OAuth origin issue is persistent, let's temporarily switch to Firebase Auth to get you working.

## Quick Switch Instructions

### Step 1: Update Your .env File

Change your `.env` file to use Firebase:

```env
# Switch to Firebase temporarily
VITE_AUTH_PROVIDER=firebase

# Add your Firebase configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 2: Restart Dev Server

```bash
pnpm dev
```

### Step 3: Test Authentication

Navigate to `http://127.0.0.1:5173/auth` and try logging in with Google through Firebase.

## Why This Works

Firebase Auth handles the OAuth configuration automatically and doesn't have the same origin restrictions as direct Google Identity Services.

## Going Back to GIS Later

Once you resolve the OAuth client configuration issues, you can switch back by changing:

```env
VITE_AUTH_PROVIDER=gis
VITE_GOOGLE_CLIENT_ID=your-client-id
```

## Getting Firebase Config

If you don't have Firebase configured:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click on your web app or create a new one
6. Copy the configuration values
