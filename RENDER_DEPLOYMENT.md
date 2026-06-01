# 🚀 Deployment Guide - Render

## Quick Start (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push
```

### Step 2: Connect to Render
1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Authorize Render to access your repo
5. Select this repository and branch

### Step 3: Render Auto-Deploys
- Render reads `render.yaml` automatically
- Deploys both backend and frontend
- Takes ~5-10 minutes for first deploy
- You'll get URLs like:
  - Backend: `https://vowly-backend.onrender.com`
  - Frontend: `https://vowly-frontend.onrender.com`

### Step 4: Share with Team
- Copy the frontend URL from Render dashboard
- Share with teammates: `https://vowly-frontend.onrender.com`
- Backend automatically connected via environment variables

---

## What's Been Set Up

### Backend (`render.yaml`)
- ✅ Python 3.11 runtime
- ✅ FastAPI with Gunicorn (production WSGI)
- ✅ JSON file storage (no database needed)
- ✅ CORS configured for frontend
- ✅ Auto-reload disabled for production
- ✅ Free tier: 750 compute hours/month

### Frontend (`render.yaml`)
- ✅ Node.js runtime
- ✅ Next.js optimized build
- ✅ Environment variable: `NEXT_PUBLIC_BACKEND_URL` auto-configured
- ✅ Static optimization enabled
- ✅ Free tier: 100GB bandwidth/month

---

## Environment Variables (Already Configured)

Backend:
- `USE_MONGODB=false` (using JSON files)
- `CORS_ORIGINS=https://vowly-frontend.onrender.com`
- `GROQ_API_KEY=` (optional, AI features work without it)

Frontend:
- `NEXT_PUBLIC_BACKEND_URL=https://vowly-backend.onrender.com`

---

## First Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] `render.yaml` in root directory
- [ ] `backend/requirements.txt` updated with gunicorn
- [ ] `.env.production` files in place
- [ ] Render account created
- [ ] Blueprint connected to repo
- [ ] Both services deploying (check Render dashboard)
- [ ] Frontend URL working
- [ ] Backend health check: `https://vowly-backend.onrender.com/api/health`

---

## Troubleshooting

### Backend won't start?
- Check logs in Render dashboard
- Ensure `gunicorn` is in `requirements.txt`
- Verify `server.py` exists in `backend/` directory

### Frontend shows 404?
- Wait 10-15 minutes for complete build
- Check `NEXT_PUBLIC_BACKEND_URL` in environment variables
- Verify backend is responding: `https://vowly-backend.onrender.com/api/health`

### Services going to sleep?
- Render free tier sleeps after 15 min inactivity
- To prevent: upgrade to paid tier (~$7/month each)
- Or accept the 30-second wake time

---

## Next Steps for Production

1. **Add MongoDB**
   - Set `USE_MONGODB=true`
   - Add MongoDB Atlas connection string
   - Data persists across deploys

2. **Add Email Service**
   - Set `GROQ_API_KEY` for AI features
   - Configure email (already integrated)

3. **Upgrade to Paid** (optional)
   - Remove sleep behavior
   - Better performance (~$7/month per service)
   - Still super affordable

---

## Team Access

Once deployed:
1. Share frontend URL with teammates
2. They can access without any setup
3. Data syncs across all users (JSON files)
4. No login required unless you add it

---

**You're all set! Push to GitHub and let Render do the rest! 🎉**
