# Complete OAuth Origin Fix Guide

## 🚨 Current Issue
The authentication is working but localStorage is being cleared because the popup fallback creates temporary users instead of real authenticated users. The root cause is that Google One Tap is failing due to origin configuration issues.

## 🔍 Debug Information
Run this in your browser console to see the exact origin:
```javascript
debugOAuth()
```

## ✅ Step-by-Step Fix

### 1. Check Your Current Origin
Open browser console and run:
```javascript
console.log('Current origin:', window.location.origin)
console.log('Current URL:', window.location.href)
```

### 2. Add ALL Required Origins to Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials?project=YOUR_PROJECT_ID

**Add these EXACT origins to "Authorized JavaScript origins":**

```
http://localhost:5173
http://localhost:5173/
http://127.0.0.1:5173
http://127.0.0.1:5173/
http://[::1]:5173
http://[::1]:5173/
```

**Add these EXACT redirect URIs to "Authorized redirect URIs":**

```
http://localhost:5173
http://localhost:5173/
http://127.0.0.1:5173
http://127.0.0.1:5173/
http://[::1]:5173
http://[::1]:5173/
```

### 3. Verify OAuth Consent Screen
- Go to: https://console.cloud.google.com/apis/credentials/consent?project=YOUR_PROJECT_ID
- Ensure it's published or in testing mode
- Add your email as a test user if in testing mode

### 4. Wait for Propagation
- Changes can take 1-2 minutes to propagate
- Clear your browser cache after making changes

### 5. Test the Fix
1. Clear browser cache and localStorage
2. Refresh the page
3. Try logging in with Google
4. Check console for successful One Tap (no origin errors)

## 🔧 Alternative: Force IPv4 (Already Done)
The Vite config is already set to use `127.0.0.1` instead of `localhost` to avoid IPv6 issues.

## 🚀 Expected Result
After fixing the origins:
- ✅ One Tap should work without origin errors
- ✅ Real user data should be persisted in localStorage
- ✅ No more "Google User (Popup)" fake users
- ✅ Authentication should persist across page refreshes

## 🆘 If Still Not Working
1. Check browser console for exact error messages
2. Verify the client ID matches your environment variable
3. Try accessing via `http://127.0.0.1:5173` instead of `localhost`
4. Ensure no browser extensions are blocking Google services

## 📝 Environment Variables
Make sure your `.env` file has:
```
VITE_AUTH_PROVIDER=gis
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```
