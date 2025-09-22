# OAuth Troubleshooting Guide

## Common Issues and Solutions

### 1. "The given origin is not allowed for the given client ID"

This error occurs when your current development URL is not in the OAuth client's authorized origins list.

#### Solution:

1. **Check your current development URL**:
   - Vite dev server typically runs on `http://localhost:5173`
   - Check the browser address bar for the exact URL

2. **Update OAuth Client Configuration**:
   - Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
   - Find your OAuth 2.0 client ID
   - Click on it to edit
   - Add your current development URL to "Authorized JavaScript origins":
     - `http://localhost:5173` (Vite default)
     - `http://localhost:3000` (Alternative port)
     - `http://127.0.0.1:5173` (Alternative localhost)
     - `https://your-domain.com` (Production domain)

3. **Common Development URLs to Add**:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   http://127.0.0.1:3000
   https://admin.4hum.ai
   ```

### 2. "Failed to exchange code for token"

This error was caused by the complex token exchange logic in the GIS provider. The implementation has been simplified to use Google One Tap only.

#### Solution:

1. **Use Google One Tap**: The current implementation only supports Google One Tap sign-in
2. **Check Browser Settings**: Ensure your browser allows popups and third-party cookies
3. **Clear Browser Cache**: Clear cookies and cache for your development domain

### 3. Google One Tap Not Showing

If Google One Tap doesn't appear:

1. **Check OAuth Consent Screen**: Ensure it's properly configured
2. **Add Test Users**: Add your email as a test user in the OAuth consent screen
3. **Check Browser Console**: Look for any JavaScript errors
4. **Verify Client ID**: Ensure the correct client ID is in your `.env` file

### 4. Environment Configuration

Make sure your `.env` file has the correct configuration:

```env
# For Google Identity Services
VITE_AUTH_PROVIDER=gis
VITE_GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com

# For Firebase (alternative)
VITE_AUTH_PROVIDER=firebase
VITE_FIREBASE_API_KEY=your-api-key
# ... other Firebase config
```

### 5. Testing OAuth Configuration

To test if your OAuth client is working:

1. **Check Authorized Origins**: Visit your OAuth client in Google Cloud Console
2. **Test with curl**: 
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Referer: http://localhost:5173" \
        "https://accounts.google.com/gsi/client"
   ```
3. **Browser Developer Tools**: Check the Network tab for any failed requests

### 6. Production Deployment

For production deployment:

1. **Add Production Domain**: Add your production domain to authorized origins
2. **Update Environment Variables**: Set the correct client ID in production
3. **Test in Production**: Verify OAuth works in the production environment

## Quick Fix Checklist

- [ ] Current development URL is in OAuth client authorized origins
- [ ] OAuth consent screen is configured with test users
- [ ] Correct client ID is in `.env` file
- [ ] Browser allows popups and third-party cookies
- [ ] No JavaScript errors in browser console
- [ ] Google Identity Services script loads successfully

## Getting Help

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your OAuth client configuration in Google Cloud Console
3. Test with a fresh browser session (incognito/private mode)
4. Ensure your Google account has access to the OAuth consent screen
