# 📦 Upload Trivium to GitHub

## Option 1: Using GitHub Web Interface (Easiest - No Git Required)

### Step 1: Create a New Repository
1. Go to https://github.com/new
2. **Repository name:** `trivium`
3. **Description:** "AI-powered multiplayer trivia game built with React, Vite, and Google Gemini API"
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 2: Prepare Your Files
Before uploading, create a `.gitignore` file to exclude sensitive/unnecessary files:

**Create:** `c:\Users\HP\Downloads\gemini-trivia-blitz\.gitignore`
```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env.local
.env.production

# Build output
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase/
firebase-debug.log

# Logs
*.log
```

### Step 3: Create a README
**Create:** `c:\Users\HP\Downloads\gemini-trivia-blitz\README.md`
```markdown
# 🎮 Trivium

An AI-powered multiplayer trivia game built with React, Vite, and Google Gemini API.

## ✨ Features
- 8 different categories (Science, History, Geography, Sports, etc.)
- AI-generated questions powered by Google Gemini
- Multiplayer support with Socket.io
- Beautiful modern UI with animations
- Real-time score tracking

## 🚀 Live Demo
[Play Trivium](https://gemini-trivia-blitz-8fb9f.web.app)

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, Socket.io
- **AI:** Google Gemini API
- **Hosting:** Firebase Hosting

## 📦 Installation

### Prerequisites
- Node.js 18+
- Gemini API key

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_BACKEND_URL=http://localhost:3001
   ```
4. Start backend: `node server/server.js`
5. Start frontend: `npm run dev`

## 🎯 How to Play
1. Choose Single Player or Multiplayer
2. Select a category
3. Answer 10 AI-generated questions
4. See your score and compete!

## 📄 License
MIT
```

### Step 4: Upload to GitHub (Web Interface)

**Method A: Drag & Drop (Easiest)**
1. Go to your new repository page
2. Click **"uploading an existing file"** link
3. **SELECT ALL FILES** except:
   - `node_modules/` folder
   - `.env.local` file
   - `dist/` folder
   - `.env.production` file
4. Drag and drop into the upload area
5. Add commit message: "Initial commit - Trivium multiplayer trivia game"
6. Click **"Commit changes"**

**Method B: GitHub Desktop (Recommended)**
1. Download GitHub Desktop: https://desktop.github.com
2. Install and sign in
3. Click **"Add" → "Add Existing Repository"**
4. Browse to `c:\Users\HP\Downloads\gemini-trivia-blitz`
5. Click **"Publish repository"**

---

## Option 2: Install Git and Use Command Line

### Step 1: Install Git
1. Download: https://git-scm.com/download/win
2. Run installer (use default settings)
3. Restart your terminal

### Step 2: Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize and Push
```bash
cd c:\Users\HP\Downloads\gemini-trivia-blitz

# Initialize git
git init

# Add .gitignore (from Option 1, Step 2)

# Add all files
git add .

# Commit
git commit -m "Initial commit - Trivium multiplayer trivia game"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/trivium.git

# Push
git branch -M main
git push -u origin main
```

---

## 🎉 After Upload

### Update Your README
Add these badges to make it look professional:

```markdown
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-6.x-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
```

### Add a LICENSE
1. In your GitHub repo, click **"Add file" → "Create new file"**
2. Name it `LICENSE`
3. Click **"Choose a license template"**
4. Select **MIT License**
5. Commit

### Set Repository Topics
Add these topics to help people find your project:
- `react`
- `typescript`
- `vite`
- `trivia-game`
- `gemini-api`
- `socketio`
- `multiplayer`
- `firebase`

---

## 📝 Next Steps

1. ✅ Upload to GitHub
2. 🌟 Star your own repo
3. 📢 Share the GitHub link on Discord
4. 🔄 Enable GitHub Pages (optional - for static docs)
5. 📊 Add GitHub Actions for auto-deployment (advanced)

---

## ⚠️ Important: Protect Your API Key

**NEVER** commit your `.env.local` or `.env.production` files!

The `.gitignore` file will prevent this, but double-check before pushing.
