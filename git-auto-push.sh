#!/bin/bash
# Oak Dragon Covenant: Git Auto-Push Script
# Stages, commits, and pushes all changes to the main branch

set -e

MESSAGE=${1:-"Full multi-cloud deployment and failover automation update"}

# Stage all changes
git add .

# Commit with provided or default message
git commit -m "$MESSAGE"

# Push to main branch
git push origin main

echo "[SUCCESS] All changes pushed to GitHub main branch."
