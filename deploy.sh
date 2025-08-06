#!/bin/bash

# Script Deployment untuk Dayeuhmanggung Site
# Pastikan server sudah siap dengan Node.js, MySQL, dan PM2

echo "🚀 Memulai deployment Dayeuhmanggung Site..."

# 1. Build frontend
echo "📦 Building frontend..."
npm run build

# 2. Upload ke server menggunakan rsync atau scp
echo "📤 Uploading ke server..."
# Ganti dengan IP server Anda
SERVER_IP="116.193.191.5"
SERVER_USER="admin"
SERVER_PATH="/home/admin/dayeuhmanggung-site"

# Upload seluruh proyek
rsync -avz --exclude 'node_modules' --exclude '.git' ./ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

echo "✅ Upload selesai!"
echo "🔧 Selanjutnya, login ke server dan jalankan setup.sh" 