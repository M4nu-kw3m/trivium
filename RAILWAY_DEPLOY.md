# Railway Deployment Guide for Trivium Backend

## Why Railway?
- ✅ Simpler than Render
- ✅ $5 free credit monthly
- ✅ Easy GitHub integration
- ✅ Automatic deployments

## Steps to Deploy

### 1. Create Railway Account
1. Go to https://railway.app (already open)
2. Click "Start a New Project" or "Login with GitHub"
3. Sign up with GitHub (recommended)

### 2. Create New Project
1. After login, click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if not connected
4. Select your repository (you'll need to push code to GitHub first)

**OR use Railway CLI (easier):**

### 3. Deploy Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Configure Environment
1. In Railway dashboard, go to your service
2. Click "Variables"
3. Add: `PORT` (Railway sets this automatically, but good to check)

### 5. Get Your URL
1. Go to "Settings" tab
2. Click "Generate Domain"
3. Copy your URL: `https://your-app.railway.app`

---

## Alternative: Push to GitHub First

If Railway CLI doesn't work, we need to push code to GitHub:

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/trivium.git
git push -u origin main
```

Then use Railway's "Deploy from GitHub" option.

---

## Next Steps After Backend Deploy

1. Copy your Railway URL
2. Update `.env.production`:
   ```
   VITE_BACKEND_URL=https://your-app.railway.app
   VITE_GEMINI_API_KEY=AIzaSyC_54nwj2XMhtevpOjtcNdje53tFUSlZX4
   ```
3. Build frontend: `npm run build`
4. Deploy to Firebase: `firebase deploy`
