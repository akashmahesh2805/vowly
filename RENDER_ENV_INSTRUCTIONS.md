Do NOT commit secrets to the repository.

Add these environment variables in Render (Service -> Environment -> Environment Variables).

Backend (vowly-backend) — REQUIRED for production/demo:

- `MONGO_URL` -> mongodb+srv://<user>:<pass>@vowly2/<DB_NAME>?retryWrites=true&w=majority
- `DB_NAME` -> vowly
- `USE_MONGODB` -> true
- `GROQ_API_KEY` -> (your Groq API key)
- `ALERT_EMAIL` -> (optional)
- `ALERT_EMAIL_PASSWORD` -> (optional)
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_BUCKET_NAME` / `AWS_REGION` (if using S3 for uploads)

Frontend (vowly-frontend):

- `NEXT_PUBLIC_BACKEND_URL` -> https://<your-backend-url>

How to add on Render dashboard (UI):

1. Open the service (vowly-backend or vowly-frontend) in Render.
2. Go to the "Environment" tab.
3. Add the variables above. Values are encrypted and not stored in the repo.

How to set env vars via Render CLI (template — DO NOT include secrets in commits):

```bash
# Install/render CLI docs: https://render.com/docs/cli
# Example (run locally; replace placeholders with your secret values):
render services env set <service-id> MONGO_URL "mongodb+srv://<user>:<pass>@vowly2/<DB_NAME>?retryWrites=true&w=majority"
render services env set <service-id> DB_NAME "vowly"
render services env set <service-id> USE_MONGODB "true"
render services env set <service-id> GROQ_API_KEY "<your_groq_key>"
```

Local development:

- Use `backend/.env.local` for local secrets (already created). This file is ignored by git and is safe to store locally only.

Notes:
- The MongoDB cluster name you provided is `vowly2` — use that in your `MONGO_URL` host component.
- Do NOT commit any secret values into the repository. Use Render's dashboard or CLI to set encrypted environment variables.
