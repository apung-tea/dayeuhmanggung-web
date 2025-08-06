# 🚀 Deployment Guide - Dayeuhmanggung Site

## 📋 Prerequisites
- VPS Ubuntu 24.04 LTS (sudah ada di IDCloudHost)
- IP Server: `116.193.191.5`
- Username: `admin`

## 🔧 Langkah-langkah Deployment

### 1. **Persiapan Lokal**
```bash
# Build frontend
npm run build

# Pastikan semua file sudah siap
git add .
git commit -m "Ready for deployment"
```

### 2. **Upload ke Server**
```bash
# Jalankan script deployment
chmod +x deploy.sh
./deploy.sh
```

### 3. **Setup Server**
```bash
# SSH ke server
ssh admin@116.193.191.5

# Jalankan setup script
chmod +x setup.sh
./setup.sh
```

### 4. **Konfigurasi Environment**
```bash
# Edit file .env di server
nano api/.env
```

Isi dengan kredensial yang benar:
```env
DB_HOST=localhost
DB_USER=dayeuhmanggung
DB_PASS=your_secure_password
DB_NAME=dayeuhmanggung_db
PORT=3001
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
```

### 5. **Setup Firewall**
```bash
chmod +x firewall-setup.sh
./firewall-setup.sh
```

### 6. **Restart Services**
```bash
# Restart nginx
sudo systemctl restart nginx

# Restart PM2
pm2 restart all
pm2 save
```

## 🌐 Akses Website
- **Website Utama**: http://116.193.191.5
- **Admin Panel**: http://116.193.191.5/admin
- **API Endpoint**: http://116.193.191.5/api

## 🔍 Troubleshooting

### Jika website tidak bisa diakses:
1. Cek status nginx: `sudo systemctl status nginx`
2. Cek status PM2: `pm2 status`
3. Cek logs: `pm2 logs dayeuhmanggung-api`
4. Cek firewall: `sudo ufw status`

### Jika database error:
1. Cek MySQL status: `sudo systemctl status mysql`
2. Test koneksi: `mysql -u dayeuhmanggung -p dayeuhmanggung_db`
3. Cek environment variables di `api/.env`

### Jika upload gambar error:
1. Cek permission folder: `ls -la public/images/`
2. Set permission: `chmod 755 public/images/`
3. Set ownership: `chown -R admin:admin public/images/`

## 📊 Monitoring
- **PM2 Dashboard**: `pm2 monit`
- **Nginx Logs**: `sudo tail -f /var/log/nginx/access.log`
- **Application Logs**: `pm2 logs dayeuhmanggung-api`

## 🔄 Update Deployment
Untuk update website:
```bash
# Di local machine
npm run build
./deploy.sh

# Di server
pm2 restart dayeuhmanggung-api
sudo systemctl reload nginx
```

## 🔐 Security Checklist
- [ ] Firewall aktif
- [ ] Database password kuat
- [ ] JWT secret unik
- [ ] Nginx konfigurasi aman
- [ ] SSL certificate (opsional)
- [ ] Regular backups

## 📞 Support
Jika ada masalah, cek:
1. Logs aplikasi
2. Status services
3. Network connectivity
4. Database connection 