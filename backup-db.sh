#!/bin/bash

# Script Backup Database Dayeuhmanggung
# Jalankan di server

echo "🗄️ Backup database Dayeuhmanggung..."

# Set variables
DB_NAME="dayeuhmanggung_db"
DB_USER="dayeuhmanggung"
BACKUP_DIR="/home/admin/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="dayeuhmanggung_db_$DATE.sql"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_FILE.gz"

# Keep only last 7 backups
echo "🧹 Cleaning old backups..."
ls -t $BACKUP_DIR/dayeuhmanggung_db_*.sql.gz | tail -n +8 | xargs -r rm

echo "✅ Backup process completed!" 