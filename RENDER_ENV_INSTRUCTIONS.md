Do NOT commit secrets to the repository.

Add these environment variables in Render (Service -> Environment -> Environment Variables):

Backend (vowly-backend):

- MONGO_URL -> mongodb+srv://<user>:<pass>@<cluster>/vowly?retryWrites=true&w=majority
- DB_NAME -> vowly
- USE_MONGODB -> true
- GROQ_API_KEY -> (your Groq API key)
- ALERT_EMAIL -> (optional)
- ALERT_EMAIL_PASSWORD -> (optional)
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_BUCKET_NAME / AWS_REGION (if using S3 for uploads)

Frontend (vowly-frontend):

- NEXT_PUBLIC_BACKEND_URL -> https://<your-backend-url>

How to add on Render dashboard:

1. Open the service (vowly-backend or vowly-frontend).
2. Go to "Environment" tab.
3. Add the variables above. Values are encrypted and not stored in the repo.

Local development:

- Use `backend/.env.local` for local secrets (already created). This file is ignored by git.
