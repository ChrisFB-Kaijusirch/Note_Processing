# Deploying to GitHub Pages

This guide will help you deploy the Notes Processor frontend to GitHub Pages.

## Automatic Deployment with GitHub Actions

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions. When you push changes to the `main` branch, the GitHub Actions workflow will:

1. Build the frontend
2. Copy the build files to the `docs` directory in the `main` branch
3. Commit and push the updated `docs` directory

GitHub Pages is configured to deploy from the `/docs` folder in the `main` branch.

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### Prerequisites

- You have pushed your code to a GitHub repository
- You have Node.js and npm installed locally

### Step 1: Configure vite.config.js for GitHub Pages

The `vite.config.js` file is already configured with the base path for GitHub Pages:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Note_Processing/', // This should match your repository name
  // ... other configuration
});
```

### Step 2: Use the Deployment Script

The `frontend/package.json` file includes a deploy script:

```json
"scripts": {
  "dev": "vite --port 12000",
  "build": "vite build",
  "preview": "vite preview --port 12000",
  "deploy": "vite build && cp -r dist/* ../docs/"
}
```

### Step 3: Build and Deploy

```bash
# Navigate to the frontend directory
cd frontend

# Build and copy to docs directory
npm run deploy

# Commit and push the changes
cd ..
git add docs
git commit -m "Update GitHub Pages deployment"
git push origin main
```

### Step 4: Configure GitHub Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Navigate to "Pages" in the left sidebar
4. Under "Build and deployment", select:
   - Source: "Deploy from a branch"
   - Branch: "main" / "/docs"
5. Click "Save"

Your site will be published at `https://yourusername.github.io/Note_Processing/`

## Connecting to the Backend

For the frontend to communicate with your backend, you'll need to deploy the backend separately and update the API endpoint in the frontend:

1. Deploy your backend to a service like Heroku, AWS, or Render (see [Backend Deployment Guide](./BACKEND_DEPLOYMENT.md))
2. Create a `.env.production` file in your frontend directory with:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=notes-processor-uploads
VITE_IDENTITY_POOL_ID=your-identity-pool-id
```

3. Rebuild and redeploy the frontend

## Routing with GitHub Pages

The frontend is already configured to use HashRouter in production, which works better with GitHub Pages static hosting. This is set up in `frontend/src/main.jsx`:

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

## Troubleshooting

- **Blank Page**: If you see a blank page, check the browser console for errors. Make sure the base path in `vite.config.js` matches your repository name.
- **404 Errors**: Ensure GitHub Pages is properly configured in your repository settings.
- **Missing Assets**: Check that all assets are being properly referenced with the correct base path.
- **API Connection Issues**: Verify that your backend is deployed and accessible, and that CORS is properly configured to allow requests from your GitHub Pages domain.

## Custom Domain (Optional)

If you want to use a custom domain with your GitHub Pages site:

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Custom domain", enter your domain name
4. Click "Save"
5. Update your DNS settings to point to GitHub Pages
6. Update the `base` in `vite.config.js` to `'/'` instead of `'/Note_Processing/'`

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router with GitHub Pages](https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing)