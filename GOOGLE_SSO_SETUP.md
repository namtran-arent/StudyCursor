# Google SSO Setup Guide

This guide will walk you through setting up Google Single Sign-On (SSO) for your application step by step.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your application running locally or deployed

## Step-by-Step Configuration

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Ko0ls AI")
5. Click **"Create"**
6. Wait for the project to be created and select it

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on **"Google+ API"** or **"Google Identity"**
4. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account, then choose "Internal")
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Your application name (e.g., "Ko0ls AI")
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **"Scopes"** page, click **"Save and Continue"** (default scopes are fine)
7. On the **"Test users"** page (if External), you can add test users or click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Fill in the details:
   - **Name**: Your application name (e.g., "Ko0ls AI Web Client")
   - **Authorized JavaScript origins**:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - For local development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
6. Click **"Create"**
7. **IMPORTANT**: Copy both:
   - **Client ID** (starts with something like `123456789-abc...`)
   - **Client Secret** (starts with `GOCSPX-...`)

### Step 5: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```

#### Generate NEXTAUTH_SECRET

You can generate a secure random secret using one of these methods:

**Option 1: Using OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online generator**
Visit: https://generate-secret.vercel.app/32

### Step 6: Update Environment Variables for Production

If deploying to Vercel or another platform:

1. Go to your project settings
2. Navigate to **"Environment Variables"**
3. Add the following variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your production URL, e.g., `https://yourdomain.com`)
   - `NEXTAUTH_SECRET` (same secret as local)

**Important**: Make sure to update the **Authorized redirect URIs** in Google Cloud Console to include your production URL!

### Step 7: Restart Your Development Server

After adding environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart
yarn dev
```

### Step 8: Test the Login Flow

1. Navigate to `http://localhost:3000/dashboards`
2. You should be redirected to `/login`
3. Click **"Sign in with Google"**
4. You'll be redirected to Google's login page
5. Sign in with your Google account
6. Grant permissions if prompted
7. You should be redirected back to `/dashboards` and see your profile

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Solution**: 
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes or typos
- Wait a few minutes after updating - Google caches these settings

### Issue: "Invalid Client" Error

**Solution**:
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your development server after updating `.env.local`

### Issue: "Access Blocked" Error

**Solution**:
- If your app is in "Testing" mode, make sure your Google account is added as a test user
- Go to OAuth consent screen > Test users > Add your email

### Issue: Session Not Persisting

**Solution**:
- Make sure `NEXTAUTH_SECRET` is set and is a valid random string
- Check that `NEXTAUTH_URL` matches your current URL (localhost:3000 for dev)

## Security Best Practices

1. **Never commit `.env.local` to git** - It's already in `.gitignore`
2. **Use different credentials for development and production**
3. **Rotate secrets periodically**
4. **Keep your Google Cloud Console credentials secure**
5. **Use environment variables in production** - Never hardcode secrets

## Next Steps

After successful setup:
- Users can sign in with their Google accounts
- Protected routes (`/dashboards`, `/protected`) require authentication
- User session information is available via `useSession()` hook
- Users can sign out using the button in the header

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
