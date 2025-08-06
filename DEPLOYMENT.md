# 🚀 Deployment Guide - Dayeuhmanggung Site

## 📋 Prerequisites
- Ubuntu 24.04 LTS server
- Node.js 18+ installed
- MySQL/MariaDB installed
- Git installed

## 🔧 Server Setup

### 1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install MySQL
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 3. Create Database
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE dayeuhmanggung_db;
CREATE USER 'dayeuhmanggung'@'localhost' IDENTIFIED BY 'Ajoh1234';
GRANT ALL PRIVILEGES ON dayeuhmanggung_db.* TO 'dayeuhmanggung'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Import Database Schema
```bash
mysql -u dayeuhmanggung -p dayeuhmanggung_db < dayeuhmanggung_db.sql
```

## 🚀 Deployment Steps

### 1. Clone Repository
```bash
git clone <your-github-repo-url>
cd dayeuhmanggung-site-jsdone
```

### 2. Setup Environment Variables
```bash
cp api/env.example api/.env
# Edit api/.env dengan konfigurasi yang sesuai
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
cd ..
```

### 4. Build Frontend
```bash
npm run build
```

### 5. Install PM2
```bash
npm install -g pm2
```

### 6. Start Applications
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🔍 Monitoring

### Check Status
```bash
pm2 status
```

### Check Logs
```bash
pm2 logs
pm2 logs dayeuhmanggung-api
pm2 logs dayeuhmanggung-frontend
```

### Restart Applications
```bash
pm2 restart all
pm2 restart dayeuhmanggung-api
pm2 restart dayeuhmanggung-frontend
```

## 🌐 Access URLs
- Frontend: http://116.193.191.5:3000
- API: http://116.193.191.5:3001
- API Health Check: http://116.193.191.5:3001/

## 🔧 Troubleshooting

### If API is not accessible:
1. Check if MySQL is running: `sudo systemctl status mysql`
2. Check database connection in `api/.env`
3. Check PM2 logs: `pm2 logs dayeuhmanggung-api`

### If Frontend is not accessible:
1. Check if build was successful
2. Check PM2 logs: `pm2 logs dayeuhmanggung-frontend`
3. Verify port 3000 is open

### Firewall Configuration
```bash
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw allow 22
sudo ufw enable
```

## 📝 Important Notes
- Password database: Ajoh1234
- API runs on port 3001
- Frontend runs on port 3000
- All logs are stored in `./logs/` directory 