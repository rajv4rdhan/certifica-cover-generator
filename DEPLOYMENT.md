# Deployment Guide

This app uses **Cloudflare Pages** with built-in Functions for hosting.

## Architecture

- **Frontend**: React app (Vite) → Cloudflare Pages
- **API**: Logo extraction → Cloudflare Pages Function (`/functions/api.ts`)

## Deployment Steps

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to Git** (GitHub/GitLab/Bitbucket)

2. **Go to Cloudflare Dashboard**:
   - Navigate to `Pages` → `Create a project`
   - Connect your Git repository
   - Select your repository

3. **Build Settings**:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `18` or later

4. **Deploy**:
   - Click `Save and Deploy`
   - Your app will be live at `https://your-project.pages.dev`
   - Every Git push will trigger automatic deployment!

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler** (if not already):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```
   
   Or step by step:
   ```bash
   npm run build
   npm run deploy:pages
   ```

## How It Works

- The `/api` endpoint is handled by `functions/api.ts`
- Cloudflare Pages automatically deploys functions from the `/functions` directory
- The React app makes requests to `/api?url=https://example.com`
- Everything is deployed together as one project!

## Local Development

Since we removed the worker proxy, for local development you have two options:

**Option 1: Use Wrangler Pages Dev (Recommended)**
```bash
npm run build && wrangler pages dev dist
```

**Option 2: Just Frontend (API calls will fail locally)**
```bash
npm run dev
```
Then deploy to test the API functionality.

## Production URL Structure

- Frontend: `https://your-project.pages.dev`
- API: `https://your-project.pages.dev/api?url=https://example.com`

## Environment Variables (if needed)

If you need environment variables:
1. Go to Pages project → Settings → Environment variables
2. Add your variables
3. Redeploy

## Custom Domain (Optional)

1. Go to your Pages project → Custom domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatically provisioned

## Notes

- Pages Functions have generous free tier limits
- The logo extraction API works within free tier
- Automatic deployments on every Git push
- Free SSL and global CDN included
