# Deploying to GitHub Pages

This guide will help you deploy the Notes Processor frontend to GitHub Pages.

## Prerequisites

- You have pushed your code to a GitHub repository
- You have Node.js and npm installed locally

## Step 1: Configure vite.config.js for GitHub Pages

Update your `vite.config.js` file to include the base path for GitHub Pages:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NotesProcessor/', // Add this line - should match your repository name
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL'
    }
  }
});
```

## Step 2: Add a GitHub Pages Deployment Script

Add the following script to your `frontend/package.json` file:

```json
"scripts": {
  "dev": "vite --port 12000",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "gh-pages -d dist"
}
```

## Step 3: Install the gh-pages Package

```bash
cd frontend
npm install --save-dev gh-pages
```

## Step 4: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Step 5: Configure GitHub Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. You should see a message saying "Your site is published at https://yourusername.github.io/NotesProcessor/"

## Step 6: Update API Endpoint

For the frontend to communicate with your backend, you'll need to deploy the backend separately and update the API endpoint in the frontend:

1. Deploy your backend to a service like Heroku, AWS, or Render
2. Create a `.env.production` file in your frontend directory with:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=notes-processor-uploads
VITE_IDENTITY_POOL_ID=your-identity-pool-id
```

3. Rebuild and redeploy the frontend

## Troubleshooting

- If you see a blank page, check the browser console for errors. You might need to update the routes to work with GitHub Pages.
- Add the following to your `frontend/src/main.jsx` to handle GitHub Pages routing:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

// Use HashRouter instead of BrowserRouter for GitHub Pages
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)
```

This will use HashRouter in production (GitHub Pages) which works better with static hosting.