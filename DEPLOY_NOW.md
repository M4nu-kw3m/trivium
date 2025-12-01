# Quick Deployment Steps for Trivium

## Step 1: Deploy Backend to Render

### A. Create Render Account
1. You already have Render.com open
2. Click **"Get Started"** or **"Sign In"** if you have an account
3. Sign up with GitHub (recommended) or email

### B. Create New Web Service
1. After login, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Public Git repository"** OR connect your GitHub

### C. Repository Setup
**Option 1: If you have GitHub:**
- Push your code to GitHub first
- Connect your repository
- Select the repository

**Option 2: Public Git (if no GitHub):**
- You'll need to upload your code to GitHub/GitLab first
- OR use Render's manual deploy

**Option 3: Manual Deploy (Easiest for now):**
1. Skip Git for now
2. We'll use Render's dashboard to deploy manually

### D. Configure Service
Fill in these details:
- **Name**: `trivium-backend`
- **Region**: Choose closest to you
- **Branch**: `main` (if using Git)
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### E. Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your service URL: `https://trivium-backend-xxxx.onrender.com`

---

## Step 2: Update Frontend Configuration

Once you have your Render URL, update `.env.production`:

```bash
VITE_BACKEND_URL=https://your-render-url.onrender.com
VITE_GEMINI_API_KEY=AIzaSyC_54nwj2XMhtevpOjtcNdje53tFUSlZX4
```

---

## Step 3: Deploy Frontend to Firebase

### A. Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
```

### B. Login
```bash
firebase login
```

### C. Initialize (if needed)
```bash
firebase init
```
- Select: **Hosting**
- Public directory: `dist`
- Single-page app: **Yes**
- Overwrite index.html: **No**

### D. Build
```bash
npm run build
```

### E. Deploy
```bash
firebase deploy
```

---

## Current Status

✅ Backend files prepared
✅ Render.com opened
⏳ Waiting for you to create Render account and deploy backend

**Next:** Follow Step 1 above to deploy the backend to Render.
