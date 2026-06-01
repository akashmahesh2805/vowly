#!/usr/bin/env bash
# Template to set Render service environment variables using Render CLI
# Replace <service-id> and placeholders with actual values and run locally.
# DO NOT commit this file with real secrets.

SERVICE_ID_BACKEND=<vowly-backend-service-id>
SERVICE_ID_FRONTEND=<vowly-frontend-service-id>

# Example usage (fill in values):
# render services env set $SERVICE_ID_BACKEND MONGO_URL "mongodb+srv://<user>:<pass>@vowly2/<DB_NAME>?retryWrites=true&w=majority"
# render services env set $SERVICE_ID_BACKEND DB_NAME "vowly"
# render services env set $SERVICE_ID_BACKEND USE_MONGODB "true"
# render services env set $SERVICE_ID_BACKEND GROQ_API_KEY "<your_groq_key>"
# render services env set $SERVICE_ID_FRONTEND NEXT_PUBLIC_BACKEND_URL "https://<your-backend-url>"

# Note: You must install and login to the Render CLI locally for these commands to work.
