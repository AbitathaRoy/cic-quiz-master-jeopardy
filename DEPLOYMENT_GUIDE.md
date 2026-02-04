# Quiz Master - Modularization & Deployment Guide

## Part 1: File Structure

Create this folder structure in your `src/` directory:

```
src/
├── App.js                    (new modular version)
├── App-legacy.js             (backup of all-in-one version)
├── styles.css                (extracted CSS)
├── utils/
│   └── quizData.js          (createEmptyQuiz helper)
├── components/
│   ├── HomeScreen.js
│   ├── QuizGrid.js          (main + admin screens)
│   ├── BlockTile.js
│   ├── BlockModal.js
│   ├── BlockLogoScreen.js
│   └── ResetWarningModal.js
└── icons/
    └── Icons.js             (all SVG icons)
```

## Part 2: Modularization Steps

### Step 1: Backup Current Version
1. Copy your current `src/App.js` to `src/App-legacy.js`

### Step 2: Extract CSS
1. Create `src/styles.css`
2. Copy everything between the backticks in `const CSS = \`...\`` from your current App.js
3. Import it in new App.js: `import './styles.css';`

### Step 3: Extract Icons
Create `src/icons/Icons.js`:
```javascript
export const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const IconFlip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

// ... copy all other Icon components
```

### Step 4: Extract Utils
Create `src/utils/quizData.js`:
```javascript
export const createEmptyQuiz = (rows = 5, cols = 6) => {
  const quiz = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      quiz.push({
        id: \`block-\${col}-\${row}\`,
        col, row,
        question: { content: [] },
        answer: { content: [] },
        isRead: false,
        logoUrl: '',
      });
    }
  }
  return quiz;
};
```

### Step 5: Extract Components
For each component (HomeScreen, BlockTile, BlockModal, etc.):
1. Create the file in `src/components/`
2. Import React and any needed icons
3. Export the component as default
4. Import the component in `src/App.js`

Example - `src/components/HomeScreen.js`:
```javascript
import React from 'react';
import { IconSettings } from '../icons/Icons';

const HomeScreen = ({ onGoMain, onGoAdmin }) => (
  <div id="home-screen">
    <h1 id="home-title">Quiz Master</h1>
    <p id="home-subtitle">Finals · Offline Mode</p>
    <button id="btn-goto-main" className="home-btn" onClick={onGoMain}>
      Start Quiz
    </button>
    <button id="btn-goto-admin" className="home-btn" onClick={onGoAdmin}>
      <span className="btn-icon"><IconSettings /></span>
      Admin Panel
    </button>
  </div>
);

export default HomeScreen;
```

### Step 6: New Main App.js
```javascript
import React, { useState, useCallback } from 'react';
import './styles.css';
import { createEmptyQuiz } from './utils/quizData';
import HomeScreen from './components/HomeScreen';
import QuizGrid from './components/QuizGrid';
import BlockLogoScreen from './components/BlockLogoScreen';
import BlockModal from './components/BlockModal';
import ResetWarningModal from './components/ResetWarningModal';

const QuizApp = () => {
  // All state and handlers stay here
  // Component rendering calls imported components
  
  return (
    <div id="quiz-app">
      {screen === 'home' && <HomeScreen ... />}
      {(screen === 'main' || screen === 'admin') && <QuizGrid ... />}
      {screen === 'logos' && <BlockLogoScreen ... />}
      {openBlock && <BlockModal ... />}
      {showResetWarning && <ResetWarningModal ... />}
    </div>
  );
};

export default QuizApp;
```

---

## Part 3: GitHub Setup & Deployment

### Step 1: Initialize Git & Push to GitHub

In your project folder (where package.json is):

```bash
# Initialize git (if not already done)
git init

# Create .gitignore
echo "node_modules
build
.DS_Store
*.log" > .gitignore

# Stage all files
git add .

# Commit
git commit -m "Initial commit - Quiz Master app"

# Create a new repo on GitHub (go to github.com → New Repository)
# Name it: quiz-master
# Don't initialize with README (you already have code)

# Link your local repo to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quiz-master.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to GitHub Pages (Free Hosting)

#### Option A: Using gh-pages (Recommended)

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/quiz-master",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    ...existing scripts...
  }
}
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages:
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Save

Your app will be live at: `https://YOUR_USERNAME.github.io/quiz-master`

#### Option B: Using Netlify (Alternative - Even Easier)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your quiz-master repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy"

You'll get a URL like: `https://random-name-12345.netlify.app`

#### Option C: Using Vercel (Alternative)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your quiz-master repo
5. Click "Deploy"

You'll get a URL like: `https://quiz-master-abc123.vercel.app`

---

## Part 4: Ongoing Development

### Making Changes
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Redeploy (gh-pages)
npm run deploy

# For Netlify/Vercel: automatic on git push!
```

### Viewing Build Locally
```bash
npm run build
npx serve -s build
```

---

## Quick Start (No Modularization)

If you want to deploy the current all-in-one version immediately:

1. **Rename file**: `App.js` → `App.jsx` (or keep as .js)
2. **Follow "Part 3" above** (GitHub & Deployment)
3. **Skip modularization** - deploy as-is!

You can modularize later when needed.

---

## Recommended: Start with GitHub Pages

It's:
- ✅ Free forever
- ✅ Simple workflow
- ✅ Integrated with GitHub
- ✅ Custom domain support
- ✅ HTTPS by default

Good luck with your deployment! 🚀
