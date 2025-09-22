# OAuth Origin Fix Guide

## Current Issue
You're getting the error: `The given origin is not allowed for the given client ID`

## Root Cause
Your development server is running on IPv6 localhost (`[::1]:5173`) but your OAuth client might not have all the necessary origins configured.

## Solution Steps

### Step 1: Check Your Current URL
Open your browser and check the exact URL you're using to access the admin app. It might be one of these:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://[::1]:5173` (IPv6)

### Step 2: Update OAuth Client Configuration

Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials) and add ALL of these origins to your OAuth client:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://127.0.0.1:5173
http://[::1]:5173
http://localhost:3000
http://127.0.0.1:3000
https://admin.4hum.ai
https://4hum.ai
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://127.0.0.1:5173
http://[::1]:5173
http://localhost:3000
http://127.0.0.1:3000
https://admin.4hum.ai
https://4hum.ai
```

### Step 3: Force IPv4 (Alternative Solution)

If you want to avoid IPv6 issues, you can force Vite to use IPv4:

1. **Update `vite.config.ts`:**
```typescript
export default defineConfig({
  // ... existing config
  server: {
    port: 5173,
    host: '127.0.0.1', // Force IPv4
  },
})
```

2. **Restart the dev server:**
```bash
pnpm dev
```

3. **Access via:** `http://127.0.0.1:5173`

### Step 4: Test the Fix

1. **Clear browser cache and cookies**
2. **Access your admin app** using the URL you configured
3. **Try logging in with Google**
4. **Check browser console** for any remaining errors

### Step 5: Debug OAuth Origin

If you're still having issues, you can debug the exact origin being sent:

1. **Open browser Developer Tools**
2. **Go to Network tab**
3. **Try to log in with Google**
4. **Look for requests to `accounts.google.com`**
5. **Check the `Origin` header** in the request

The origin should match exactly what you configured in your OAuth client.

## Common Issues

### Issue: "Origin mismatch"
- **Cause**: The origin in the request doesn't match any configured origins
- **Solution**: Add the exact origin to your OAuth client configuration

### Issue: "Redirect URI mismatch"
- **Cause**: The redirect URI doesn't match any configured URIs
- **Solution**: Add the exact redirect URI to your OAuth client configuration

### Issue: "Invalid client ID"
- **Cause**: Wrong client ID in your `.env` file
- **Solution**: Double-check your `VITE_GOOGLE_CLIENT_ID` value

## Quick Test

To quickly test if your OAuth client is working:

1. **Open browser console**
2. **Run this JavaScript:**
```javascript
console.log('Current origin:', window.location.origin);
console.log('Current URL:', window.location.href);
```

3. **Make sure the origin matches** what you configured in Google Cloud Console

## Still Having Issues?

If you're still getting errors:

1. **Check the exact error message** in browser console
2. **Verify your OAuth client ID** is correct
3. **Ensure your email is added** as a test user in OAuth consent screen
4. **Try in incognito/private mode** to avoid cached issues
5. **Check if your Google account** has access to the OAuth consent screen
