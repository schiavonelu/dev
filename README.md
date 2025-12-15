# Deploying the project

This repository is ready for a split deployment: the frontend on Netlify and the backend on Render. Follow the steps below to build and publish the code.

## Prerequisites
- Node.js 20+
- A GitHub repository with this code pushed (Netlify and Render can connect directly).
- Accounts on [Netlify](https://www.netlify.com/) and [Render](https://render.com/).

## Environment variables

### Frontend (Netlify)
Set these variables in the Netlify project settings:
- `VITE_API_URL` – URL of the deployed backend (for example `https://fantalcio-backend.onrender.com`).
- `VITE_FB_API_KEY`, `VITE_FB_AUTH_DOMAIN`, `VITE_FB_PROJECT_ID`, `VITE_FB_STORAGE_BUCKET`, `VITE_FB_SENDER_ID`, `VITE_FB_APP_ID`, `VITE_FB_MEASUREMENT_ID` – Firebase client config.

### Backend (Render)
Configure the following in Render (Dashboard → Environment):
- `ALLOWED_ORIGINS` – comma-separated list of frontend URLs allowed by CORS (e.g. `https://your-site.netlify.app,https://www.yourdomain.com`).
- `ADMIN_EMAILS`, `ADMIN_TOKEN`, `LEAGUE_SLUG`, `PUBLIC_URL`, and any other existing secrets the API already uses.
- Keep `ALLOW_DEBUG_SEED` at `0` in production.

## Frontend deployment on Netlify
1. Push your branch to GitHub.
2. In Netlify, create a new site from Git and pick this repository.
3. Netlify reads `netlify.toml` and will:
   - Use `frontend` as the working directory.
   - Run `npm run build` and publish `dist`.
   - Apply the SPA redirect so client-side routing works.
4. Add the environment variables above and redeploy if necessary.

## Backend deployment on Render
1. Push your branch to GitHub.
2. In Render, select "New Web Service" → "Build and deploy from a Git repository".
3. Render can read `render.yaml` automatically (Blueprints) or you can set manually:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add the environment variables described above; Render injects `PORT` automatically.
5. Deploy; once live, use the Render URL as `VITE_API_URL` in Netlify.

## Local development quickstart
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

When you are ready, commit your changes and push to GitHub so Netlify and Render can deploy.

## Commit and push to GitHub
If the repository is already connected to your GitHub project, you can push the latest changes with these commands:

```bash
# Check what changed
git status

# Stage everything you edited
git add .

# Create a commit with a clear message
git commit -m "Deploy setup adjustments"

# Push to your default branch (e.g., main)
git push origin main
```

If no remote is configured yet, connect it once before pushing:

```bash
git remote add origin https://github.com/<tu-username>/<tu-repo>.git
```
