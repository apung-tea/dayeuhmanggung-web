#!/bin/bash

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Create logs directory
mkdir -p logs

# Install dependencies for backend
echo "📦 Installing backend dependencies..."
cd api
npm install
cd ..

# Install PM2 globally if not installed
echo "🔧 Installing PM2..."
npm install -g pm2

# Start applications with PM2
echo "🚀 Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "✅ Deployment completed!"
echo "📊 Check status with: pm2 status"
echo "📋 Check logs with: pm2 logs" 