# OAuth Origin Issue - Final Fix

## Current Status
You're still getting: `The given origin is not allowed for the given client ID`

## Step-by-Step Solution

### Step 1: Get Your Exact Origin

1. **Open your admin app** in the browser
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Run this command**:
   ```javascript
   debugOAuth()
   ```
5. **Copy the origin** from the output (it will show something like `http://127.0.0.1:5173`)

### Step 2: Update OAuth Client Configuration

1. **Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)**
2. **Find your OAuth 2.0 client ID** and click on it
3. **Add the EXACT origin** from Step 1 to "Authorized JavaScript origins"
4. **Also add these common development origins**:
   ```
   http://127.0.0.1:5173
   http://localhost:5173
   http://[::1]:5173
   http://127.0.0.1:3000
   http://localhost:3000
   https://admin.4hum.ai
   https://4hum.ai
   ```
5. **Add the same URLs to "Authorized redirect URIs"**
6. **Save the changes**

### Step 3: Verify Your Environment Configuration

Check your `.env` file has the correct values:

```env
VITE_AUTH_PROVIDER=gis
VITE_GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
```

### Step 4: Clear Browser Cache

1. **Clear browser cache and cookies**
2. **Or use incognito/private mode**
3. **Refresh the page**

### Step 5: Test Again

1. **Access your admin app** using the exact URL from Step 1
2. **Try logging in with Google**
3. **Check console for any remaining errors**

## Alternative: Use Firebase Auth Instead

If you continue having OAuth issues, you can temporarily switch back to Firebase Auth:

1. **Update your `.env` file**:
   ```env
   VITE_AUTH_PROVIDER=firebase
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. **Restart the dev server**:
   ```bash
   pnpm dev
   ```

## Debug Commands

You can use these commands in the browser console to debug:

```javascript
// Get OAuth debug info
debugOAuth()

// Check current origin
console.log('Origin:', window.location.origin)

// Check if Google Identity Services is loaded
console.log('Google GIS loaded:', !!window.google?.accounts?.id)

// Check environment variables
console.log('Auth Provider:', import.meta.env.VITE_AUTH_PROVIDER)
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
```

## Common Issues and Solutions

### Issue: "Origin mismatch"
- **Solution**: Add the exact origin from `debugOAuth()` to your OAuth client

### Issue: "Invalid client ID"
- **Solution**: Verify your `VITE_GOOGLE_CLIENT_ID` is correct

### Issue: "OAuth consent screen not configured"
- **Solution**: Configure the OAuth consent screen in Google Cloud Console

### Issue: "Test user not added"
- **Solution**: Add your email as a test user in the OAuth consent screen

## Still Having Issues?

If you're still getting errors after following these steps:

1. **Check the exact error message** in the console
2. **Verify your OAuth client configuration** matches the debug output
3. **Try switching to Firebase Auth** temporarily
4. **Contact support** with the debug output from `debugOAuth()`
