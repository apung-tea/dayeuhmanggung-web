#!/bin/bash

echo "🚀 Uploading to GitHub..."

# Add all files
git add .

# Commit changes
git commit -m "🚀 Production ready - Dayeuhmanggung Site deployment"

# Push to GitHub
git push origin main

echo "✅ Successfully uploaded to GitHub!"
echo "📋 Next steps:"
echo "1. SSH to your server: ssh admin@116.193.191.5"
echo "2. Clone the repository"
echo "3. Follow DEPLOYMENT.md instructions" 