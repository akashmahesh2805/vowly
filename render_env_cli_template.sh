#!/usr/bin/env bash
# Template: set Render environment variables via Render API
# WARNING: This script contains placeholders and WILL NOT work until you
# replace the placeholders with real values. Do NOT commit secrets to git.

# Usage:
# 1. Install jq and have your Render API key stored in $RENDER_API_KEY
# 2. Set SERVICE_ID to your backend service id (e.g. srv-d8er3sn40ujc73aq969g)
# 3. Run: ./render_env_cli_template.sh

# Replace these placeholders
SERVICE_ID="<RENDER_BACKEND_SERVICE_ID>"    # e.g. srv-xxxxx
RENDER_API_KEY="<YOUR_RENDER_API_KEY>"

# Environment variables to set (do NOT set secrets here in repo)
# The script below shows how to add them programmatically.
# Example variables (replace with your actual values locally):
# MONGO_URL="mongodb+srv://<user>:<pass>@vowly2.mongodb.net/vowly?retryWrites=true&w=majority"
# GROQ_API_KEY="gsk_..."
# DB_NAME="vowly"
# USE_MONGODB="true"

# Helper function to create/update an env var
set_env_var() {
  local key="$1"
  local value="$2"

  echo "Setting $key"

  curl -s -X POST "https://api.render.com/v1/services/${SERVICE_ID}/env-vars" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${RENDER_API_KEY}" \
    -d "{\"key\": \"${key}\", \"value\": \"${value}\", \"secure\": true}" \
    | jq .
}

# Example: uncomment and set the values below locally before running
# set_env_var "MONGO_URL" "$MONGO_URL"
# set_env_var "GROQ_API_KEY" "$GROQ_API_KEY"
# set_env_var "DB_NAME" "vowly"
# set_env_var "USE_MONGODB" "true"

# Note: This script uses the Render REST API and requires an API key with
# permissions to modify the target service. Keep the API key secret.
