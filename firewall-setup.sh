#!/bin/bash

# Setup Firewall untuk Dayeuhmanggung Site

echo "🛡️ Setting up firewall..."

# Install ufw jika belum ada
sudo apt install ufw -y

# Reset firewall
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP dan HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow port untuk development (opsional)
sudo ufw allow 3001/tcp

# Enable firewall
sudo ufw --force enable

echo "✅ Firewall setup selesai!"
sudo ufw status 