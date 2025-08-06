#!/bin/bash

# Script Setup Server untuk Dayeuhmanggung Site
# Jalankan di server setelah upload

echo "🔧 Setup server Dayeuhmanggung Site..."

# 1. Update sistem
echo "📦 Updating sistem..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js dan npm
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MySQL
echo "📦 Installing MySQL..."
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# 4. Install PM2 untuk process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# 5. Install nginx
echo "📦 Installing nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Setup database
echo "🗄️ Setting up database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS dayeuhmanggung_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'dayeuhmanggung'@'localhost' IDENTIFIED BY 'your_secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON dayeuhmanggung_db.* TO 'dayeuhmanggung'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 7. Import database schema
echo "📊 Importing database schema..."
sudo mysql dayeuhmanggung_db < dayeuhmanggung_db.sql

# 8. Setup environment variables
echo "⚙️ Setting up environment variables..."
cp api/env.example api/.env
# Edit .env file dengan kredensial yang benar

# 9. Install dependencies
echo "📦 Installing dependencies..."
cd api && npm install
cd ..

# 10. Setup nginx configuration
echo "🌐 Setting up nginx..."
sudo tee /etc/nginx/sites-available/dayeuhmanggung << EOF
server {
    listen 80;
    server_name 116.193.191.5;

    # Frontend
    location / {
        root /home/admin/dayeuhmanggung-site/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files
    location /images {
        alias /home/admin/dayeuhmanggung-site/public/images;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/dayeuhmanggung /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 11. Start application dengan PM2
echo "🚀 Starting application..."
cd api
pm2 start app.js --name "dayeuhmanggung-api"
pm2 startup
pm2 save

echo "✅ Setup selesai!"
echo "🌐 Website akan tersedia di: http://116.193.191.5"
echo "🔧 Admin panel: http://116.193.191.5/admin" 