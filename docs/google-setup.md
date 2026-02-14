# Google Cloud Console Setup Guide for Nozris

To enable "Sign in with Google" and manage Business Profiles, you need to configure a Google Cloud Project.

## 1. Create a Project
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Click "Select a project" > "New Project".
3.  Name it `Nozris-SaaS` (or your company name).

## 2. Enable APIs
1.  Navigate to **APIs & Services > Library**.
2.  Search for and enable the following APIs:
    - **Google Business Profile API** (Required for fetching reviews)
    - **Google People API** (Optional, for user profile info)
    - **Google My Business Account Management API**
    - **Google My Business Lodging API** (If targeting hotels)

## 3. Configure OAuth Consent Screen
1.  Go to **APIs & Services > OAuth consent screen**.
2.  Select **External** (for SaaS) or **Internal** (for internal tools).
3.  Fill in App Name (`Nozris`), User Support Email, and Developer Contact Info.
4.  **Scopes**: Add `.../auth/business.manage` and `openid`, `email`, `profile`.
5.  Add Test Users (your email) if in "Testing" mode.

## 4. Create Credentials
1.  Go to **APIs & Services > Credentials**.
2.  Click **Create Credentials > OAuth client ID**.
3.  Application Type: **Web application**.
4.  **Authorized JavaScript origins**:
    - `http://localhost:3000` (for dev)
    - `https://your-domain.com` (for prod)
5.  **Authorized redirect URIs**:
    - `http://localhost:3000/api/auth/callback/google`
    - `https://your-domain.com/api/auth/callback/google`
6.  **Copy Client ID and Client Secret**:
    - Add these to your `.env` file as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

## 5. Verification (Production Only)
Before launching publicly, you must submit your app for verification if you request sensitive scopes like `business.manage`.
